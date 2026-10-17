import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createHash } from 'crypto'
import {
  getApprovedPartiesByEdition,
  getApprovedEkogroupActivities,
  logChatExchange,
} from '@/lib/db'
import { CURRENT_EDITION, type Edition } from '@/lib/types'
import { EKOGROUPS, getEkogroup } from '@/lib/ekogroups'
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
      'Get the list of approved parties for an ekoparty edition. Defaults to the current edition (ekoparty Miami, May 2027). Call this when the user asks about parties, events, afterparties, where to go out, or RSVP links. Pass edition "ekoparty-ba-2026" for the Buenos Aires 2026 archive.',
    input_schema: {
      type: 'object',
      properties: {
        edition: {
          type: 'string',
          enum: ['ekoparty-miami-2027', 'ekoparty-ba-2026'],
          description: 'Which edition to list. Omit for the current edition (Miami 2027).',
        },
      },
      additionalProperties: false,
    },
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
  {
    name: 'get_ekogroups',
    description:
      'Get the directory of ekogroups (local, self-managed ekoparty communities across Latin America) and their upcoming/recurring activities. Call this when the user asks about ekogroups, local communities, meetups, workshops or CTFs in a specific city/country, how to join a community, or what activities are coming up. Optionally filter by city or country name.',
    input_schema: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description:
            'Optional city or country to filter by (case-insensitive, e.g. "Córdoba", "Perú"). Omit to get all groups and activities.',
        },
      },
      additionalProperties: false,
    },
  },
]

async function runTool(name: string, input: any): Promise<string> {
  if (name === 'get_parties') {
    const edition: Edition =
      input?.edition === 'ekoparty-ba-2026' ? 'ekoparty-ba-2026' : CURRENT_EDITION
    const parties = await getApprovedPartiesByEdition(edition)
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

  if (name === 'get_ekogroups') {
    const loc: string = (input?.location || '').toLowerCase()
    const groups = EKOGROUPS.filter(
      g =>
        !loc ||
        g.city.toLowerCase().includes(loc) ||
        g.country.toLowerCase().includes(loc) ||
        g.name.toLowerCase().includes(loc)
    )

    const activities = await getApprovedEkogroupActivities()
    const relevant = activities.filter(a => {
      if (!loc) return true
      const g = getEkogroup(a.group_slug)
      return (
        g &&
        (g.city.toLowerCase().includes(loc) ||
          g.country.toLowerCase().includes(loc) ||
          g.name.toLowerCase().includes(loc))
      )
    })

    return JSON.stringify({
      groups: groups.map(g => ({
        name: g.name,
        city: g.city,
        country: g.country,
        contact: g.contact ? `${g.contact.type}: ${g.contact.label}` : undefined,
      })),
      activities: relevant.map(a => {
        const g = getEkogroup(a.group_slug)
        return {
          title: a.title,
          group: g?.name || a.group_slug,
          city: g?.city,
          type: a.activity_type,
          schedule:
            a.kind === 'monthly'
              ? `Every month on day ${a.day_of_month}${a.time_start ? ` at ${a.time_start}` : ''}`
              : `${a.starts_at}`,
          venue: a.venue || undefined,
          signup_url: a.signup_url || undefined,
        }
      }),
      note: 'To start or join an ekogroup, contact ekogroups@ekoparty.org or see ekoparty.org/ekogroups. Activities can be submitted at /ekogroups/submit.',
    })
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
  return `You are the assistant for eko.party, the community site for ekoparty — the hacker conference. ekoparty Buenos Aires 2026 (October 7-9, Centro de Convenciones) already took place; its talk agenda remains browsable. The site now lists community parties for the next edition: ekoparty Miami, May 2027 (exact dates not announced yet — only the month is confirmed). The site also offers an MCP server for programmatic access.

Site pages you can point users to: /${lang} (Miami 2027 parties), /${lang}/agenda (BA 2026 talk schedule), /${lang}/ekogroups (shared monthly calendar of ekogroup activities + directory of local communities), /${lang}/ekogroups/submit (submit an ekogroup activity), /${lang}/past (archive of past editions, including the BA 2026 parties), /${lang}/submit (submit a party), /${lang}/mcp (MCP server setup — clone github.com/infobyte/ekofiesta and configure Claude Desktop).

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

  const question = String(history[history.length - 1].content)
  const ipHash = ip === 'unknown' ? null : createHash('sha256').update(ip).digest('hex').slice(0, 16)

  const stream = new ReadableStream({
    async start(controller) {
      let responseText = ''
      let inputTokens = 0
      let outputTokens = 0
      let rounds = 0

      try {
        const messages: Anthropic.MessageParam[] = [...history]

        for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
          rounds = round + 1
          const msgStream = client.messages.stream({
            model: 'claude-haiku-4-5',
            max_tokens: 1024,
            system: systemPrompt(lang),
            tools,
            messages,
          })

          msgStream.on('text', delta => {
            responseText += delta
            controller.enqueue(encoder.encode(delta))
          })

          const message = await msgStream.finalMessage()
          inputTokens += message.usage.input_tokens
          outputTokens += message.usage.output_tokens

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
      } finally {
        // Log the exchange (never blocks or breaks the response)
        try {
          await logChatExchange({
            lang,
            ip_hash: ipHash,
            question,
            response: responseText || null,
            input_tokens: inputTokens || null,
            output_tokens: outputTokens || null,
            model: 'claude-haiku-4-5',
            tool_rounds: rounds,
          })
        } catch (err) {
          console.error('Failed to log chat:', err)
        }
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
