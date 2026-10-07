import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getApprovedPartiesByEdition } from '@/lib/db'
import { agenda } from '@/app/[lang]/agenda/mock-agenda'
import { EKO_FAQ, EKO_GENERAL, EKO_VILLAGES } from '@/lib/eko-info'

// ── Rate limiting (per IP, in-memory — best effort on serverless) ────────────

const RATE_LIMIT_PER_MIN = 10
const RATE_LIMIT_PER_DAY = 100
const hits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowDay = now - 24 * 60 * 60 * 1000
  const windowMin = now - 60 * 1000

  const prev = (hits.get(ip) || []).filter(t => t > windowDay)
  const lastMinute = prev.filter(t => t > windowMin)

  if (lastMinute.length >= RATE_LIMIT_PER_MIN || prev.length >= RATE_LIMIT_PER_DAY) {
    hits.set(ip, prev)
    return true
  }

  prev.push(now)
  hits.set(ip, prev)
  return false
}

// ── Tools ────────────────────────────────────────────────────────────────────

const tools: Anthropic.Tool[] = [
  {
    name: 'get_parties',
    description:
      'Get the list of approved parties for ekoparty Buenos Aires 2026. Call this when the user asks about parties, events, afterparties, where to go out, or RSVP links.',
    input_schema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'search_agenda',
    description:
      'Search the ekoparty 2026 conference agenda (talks, workshops, villages — Oct 7-9, Buenos Aires). Call this when the user asks about talks, speakers, schedules, rooms, or what is happening on a given day. Returns matching talks with day, room, time and speakers.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'Text to match against talk titles and speaker names (case-insensitive). Omit to list everything for the day.',
        },
        day: {
          type: 'string',
          enum: ['oct7', 'oct8', 'oct9'],
          description: 'Filter by conference day. Omit to search all days.',
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'get_event_info',
    description:
      'Get official ekoparty 2026 information from ekoparty.org. Sections: "faq" (tickets and tiers, invoices, accreditation, hours, minors/students, badges, streaming, certificates, lodging, how to get to the CEC, transport, safety recommendations), "villages" (the 41 community villages with topics and contacts), "general" (CTF, SECTF, Live Hacking Event, wardriving, EkoKids, Women Hacks, Startup Zone, speed interviews, official stream). Call this for any logistics or event question not covered by the parties/agenda tools.',
    input_schema: {
      type: 'object',
      properties: {
        section: {
          type: 'string',
          enum: ['faq', 'villages', 'general'],
          description: 'Which information section to retrieve.',
        },
      },
      required: ['section'],
      additionalProperties: false,
    },
  },
]

async function runTool(name: string, input: any): Promise<string> {
  if (name === 'get_parties') {
    const parties = await getApprovedPartiesByEdition('ekoparty-ba-2026')
    if (parties.length === 0) return 'No approved parties listed yet.'
    return JSON.stringify(
      parties.map(p => ({
        name: p.name,
        host: p.host,
        venue: p.venue,
        address: p.address,
        description: p.description,
        starts_at: p.starts_at,
        ends_at: p.ends_at,
        rsvp_url: p.rsvp_url,
        tags: p.tags,
      }))
    )
  }

  if (name === 'search_agenda') {
    const q: string = (input?.query || '').toLowerCase()
    const dayFilter: string | undefined = input?.day

    const results = agenda
      .filter(day => !dayFilter || day.id === dayFilter)
      .flatMap(day =>
        day.rooms.flatMap(room =>
          room.items
            .filter(
              item =>
                !q ||
                item.title.toLowerCase().includes(q) ||
                item.speakers.some(s => s.toLowerCase().includes(q)) ||
                (item.village || '').toLowerCase().includes(q) ||
                room.name.toLowerCase().includes(q)
            )
            .map(item => ({
              day: day.label_es,
              date: day.date,
              room: room.name,
              time: `${item.time_start}-${item.time_end}`,
              title: item.title,
              speakers: item.speakers,
              type: item.type,
              language: item.language,
              ...(item.village ? { village: item.village } : {}),
            }))
        )
      )

    if (results.length === 0) return 'No talks matched.'
    // Cap payload so a broad query doesn't blow up input tokens
    return JSON.stringify(results.slice(0, 60))
  }

  if (name === 'get_event_info') {
    const sections: Record<string, string> = {
      faq: EKO_FAQ,
      villages: EKO_VILLAGES,
      general: EKO_GENERAL,
    }
    return sections[input?.section] || EKO_GENERAL
  }

  return `Unknown tool: ${name}`
}

// ── System prompt ────────────────────────────────────────────────────────────

const LANG_NAME: Record<string, string> = { es: 'Spanish (Argentina)', en: 'English', pt: 'Portuguese (Brazil)' }

function systemPrompt(lang: string): string {
  return `You are the assistant for eko.party, the community site for ekoparty 2026 — the hacker conference in Buenos Aires, October 7-9, 2026 (Centro de Convenciones). The site lists community parties around the conference, the talk agenda, and an MCP server for programmatic access.

Site pages you can point users to: /${lang} (parties), /${lang}/agenda (talk schedule), /${lang}/submit (submit a party), /${lang}/mcp (MCP server setup — clone github.com/infobyte/ekofiesta and configure Claude Desktop).

Rules:
- ONLY answer questions about ekoparty, its agenda, parties, villages, logistics (tickets, venue, transport, hours), and this site. For anything else, briefly decline and redirect to ekoparty topics.
- Use the tools to answer — never invent events, times, speakers, prices, or policies. get_event_info covers tickets, accreditation, villages, CTFs and logistics (sourced from ekoparty.org). If a tool returns nothing, say so.
- Answer in ${LANG_NAME[lang] || 'Spanish (Argentina)'}.
- Be concise: a short paragraph or a small list. No markdown headers.
- Party submissions are moderated; new parties appear after approval.`
}

// ── Route ────────────────────────────────────────────────────────────────────

const MAX_MESSAGES = 12
const MAX_MESSAGE_CHARS = 1000
const MAX_TOOL_ROUNDS = 4

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const lang = ['es', 'en', 'pt'].includes(body?.lang) ? body.lang : 'es'
  const incoming = Array.isArray(body?.messages) ? body.messages : []

  const history: Anthropic.MessageParam[] = incoming
    .filter(
      (m: any) =>
        (m?.role === 'user' || m?.role === 'assistant') &&
        typeof m?.content === 'string' &&
        m.content.trim().length > 0
    )
    .slice(-MAX_MESSAGES)
    .map((m: any) => ({
      role: m.role,
      content: String(m.content).slice(0, MAX_MESSAGE_CHARS),
    }))

  if (history.length === 0 || history[history.length - 1].role !== 'user') {
    return NextResponse.json({ error: 'Last message must be from user' }, { status: 400 })
  }

  const client = new Anthropic()
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const messages: Anthropic.MessageParam[] = [...history]

        for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
          const msgStream = client.messages.stream({
            model: 'claude-haiku-4-5',
            max_tokens: 1024,
            system: systemPrompt(lang),
            tools,
            messages,
          })

          msgStream.on('text', delta => {
            controller.enqueue(encoder.encode(delta))
          })

          const message = await msgStream.finalMessage()

          if (message.stop_reason !== 'tool_use') break

          const toolUseBlocks = message.content.filter(
            (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
          )

          messages.push({ role: 'assistant', content: message.content })

          const toolResults: Anthropic.ToolResultBlockParam[] = []
          for (const block of toolUseBlocks) {
            let result: string
            try {
              result = await runTool(block.name, block.input)
            } catch (err) {
              console.error(`Tool ${block.name} failed:`, err)
              result = 'Tool execution failed.'
            }
            toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: result })
          }

          messages.push({ role: 'user', content: toolResults })
        }

        controller.close()
      } catch (err) {
        console.error('Chat stream error:', err)
        controller.error(err)
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  })
}
