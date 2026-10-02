#!/usr/bin/env node
/**
 * EkoParty MCP Server
 *
 * Tools exposed:
 *   fetch_eko_agenda     — Fetches https://ekoparty.org/agenda-2026/
 *   list_parties         — Lists parties from Supabase
 *   get_pending_parties  — Lists parties awaiting moderation
 *   submit_party         — Submits a new party (status: pending)
 *   approve_party        — Approves a pending party
 *   reject_party         — Rejects a party
 *   get_party            — Gets a single party by ID
 *
 * Config via environment variables:
 *   SUPABASE_URL         — Supabase project URL (default: production)
 *   SUPABASE_KEY         — Supabase anon or service-role key
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'

const SUPABASE_URL = process.env.SUPABASE_URL ?? 'https://xoyklzqycjgwlmspmjdi.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

// ── Supabase helpers ─────────────────────────────────────────────────────────

async function sb(path, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      ...(options.headers ?? {}),
    },
  })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { data = text }
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${JSON.stringify(data)}`)
  return data
}

// ── Tool definitions ─────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'fetch_eko_agenda',
    description: 'Fetches the EkoParty conference agenda from ekoparty.org/agenda-2026/. The page is JavaScript-rendered so the result may be incomplete — use it as a starting point to check if new data is available.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'list_parties',
    description: 'Lists parties from the EkoParty database. Filter by edition and/or status.',
    inputSchema: {
      type: 'object',
      properties: {
        edition: {
          type: 'string',
          description: 'e.g. "ekoparty-ba-2026" or "ekoparty-miami-2026". Omit for all editions.',
        },
        status: {
          type: 'string',
          enum: ['pending', 'approved', 'rejected'],
          description: 'Filter by status. Omit for all.',
        },
        limit: {
          type: 'number',
          description: 'Max results (default 50).',
        },
      },
    },
  },
  {
    name: 'get_party',
    description: 'Gets a single party by its UUID.',
    inputSchema: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string', description: 'Party UUID' },
      },
    },
  },
  {
    name: 'get_pending_parties',
    description: 'Gets all parties awaiting moderation (status = pending), sorted by submission date.',
    inputSchema: {
      type: 'object',
      properties: {
        edition: {
          type: 'string',
          description: 'Filter by edition. Omit for all.',
        },
      },
    },
  },
  {
    name: 'submit_party',
    description: 'Submits a new party to the listing. The party will be in "pending" status until a moderator approves it via Slack.',
    inputSchema: {
      type: 'object',
      required: ['edition', 'name', 'host', 'venue', 'address', 'starts_at', 'ends_at', 'rsvp_url', 'submitter_name', 'submitter_email'],
      properties: {
        edition: { type: 'string', enum: ['ekoparty-ba-2026', 'ekoparty-miami-2026'] },
        name: { type: 'string', description: 'Event name' },
        host: { type: 'string', description: 'Organizing company or person' },
        venue: { type: 'string' },
        address: { type: 'string' },
        description: { type: 'string', maxLength: 200 },
        starts_at: { type: 'string', description: 'ISO 8601 timestamp with timezone, e.g. 2026-10-08T19:00:00-03:00' },
        ends_at: { type: 'string', description: 'ISO 8601 timestamp with timezone' },
        rsvp_url: { type: 'string', format: 'uri' },
        tags: { type: 'array', items: { type: 'string' }, description: 'e.g. ["open-invite", "approval-required"]' },
        submitter_name: { type: 'string' },
        submitter_email: { type: 'string', format: 'email' },
      },
    },
  },
  {
    name: 'approve_party',
    description: 'Approves a pending party so it appears publicly on the listing.',
    inputSchema: {
      type: 'object',
      required: ['id', 'moderated_by'],
      properties: {
        id: { type: 'string', description: 'Party UUID' },
        moderated_by: { type: 'string', description: 'Moderator name or Slack user ID' },
      },
    },
  },
  {
    name: 'reject_party',
    description: 'Rejects a pending party.',
    inputSchema: {
      type: 'object',
      required: ['id', 'moderated_by'],
      properties: {
        id: { type: 'string', description: 'Party UUID' },
        moderated_by: { type: 'string', description: 'Moderator name or Slack user ID' },
        reason: { type: 'string', description: 'Optional rejection reason' },
      },
    },
  },
]

// ── Tool handlers ────────────────────────────────────────────────────────────

async function handleFetchEkoAgenda() {
  const res = await fetch('https://ekoparty.org/agenda-2026/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; EkoPartyMCP/1.0)',
      Accept: 'text/html,application/xhtml+xml',
    },
  })
  const html = await res.text()
  // Strip scripts/styles for readability
  const clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 8000)

  return {
    status: res.status,
    note: 'The EkoParty agenda page is JavaScript-rendered. This is the static HTML fallback — data may be incomplete.',
    content: clean,
  }
}

async function handleListParties({ edition, status, limit = 50 }) {
  let path = `/parties?order=starts_at.asc&limit=${limit}`
  if (edition) path += `&edition=eq.${edition}`
  if (status) path += `&status=eq.${status}`
  const data = await sb(path)
  return { count: data.length, parties: data }
}

async function handleGetParty({ id }) {
  const data = await sb(`/parties?id=eq.${id}&limit=1`)
  if (!data.length) throw new Error(`Party ${id} not found`)
  return data[0]
}

async function handleGetPendingParties({ edition }) {
  let path = '/parties?status=eq.pending&order=created_at.desc'
  if (edition) path += `&edition=eq.${edition}`
  const data = await sb(path)
  return { count: data.length, parties: data }
}

async function handleSubmitParty(args) {
  const payload = {
    edition: args.edition,
    name: args.name,
    host: args.host,
    venue: args.venue,
    address: args.address,
    description: args.description ?? '',
    starts_at: args.starts_at,
    ends_at: args.ends_at,
    rsvp_url: args.rsvp_url,
    tags: args.tags ?? [],
    submitter_name: args.submitter_name,
    submitter_email: args.submitter_email,
    status: 'pending',
  }
  const data = await sb('/parties', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(payload),
  })
  return { success: true, party: Array.isArray(data) ? data[0] : data }
}

async function handleApproveParty({ id, moderated_by }) {
  const data = await sb(`/parties?id=eq.${id}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      status: 'approved',
      moderated_by,
      moderated_at: new Date().toISOString(),
    }),
  })
  return { success: true, party: Array.isArray(data) ? data[0] : data }
}

async function handleRejectParty({ id, moderated_by, reason }) {
  const data = await sb(`/parties?id=eq.${id}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      status: 'rejected',
      moderated_by,
      moderated_at: new Date().toISOString(),
      ...(reason ? { description: `[REJECTED: ${reason}]` } : {}),
    }),
  })
  return { success: true, party: Array.isArray(data) ? data[0] : data }
}

// ── MCP server wiring ────────────────────────────────────────────────────────

const server = new Server(
  { name: 'eko-party', version: '1.0.0' },
  { capabilities: { tools: {} } }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params

  try {
    let result
    switch (name) {
      case 'fetch_eko_agenda':     result = await handleFetchEkoAgenda(); break
      case 'list_parties':         result = await handleListParties(args); break
      case 'get_party':            result = await handleGetParty(args); break
      case 'get_pending_parties':  result = await handleGetPendingParties(args); break
      case 'submit_party':         result = await handleSubmitParty(args); break
      case 'approve_party':        result = await handleApproveParty(args); break
      case 'reject_party':         result = await handleRejectParty(args); break
      default:
        return {
          content: [{ type: 'text', text: `Unknown tool: ${name}` }],
          isError: true,
        }
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    }
  } catch (err) {
    return {
      content: [{ type: 'text', text: `Error: ${err.message}` }],
      isError: true,
    }
  }
})

const transport = new StdioServerTransport()
await server.connect(transport)
