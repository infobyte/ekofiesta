import { NextRequest, NextResponse } from 'next/server'

// Shared per-IP rate limiter for the public submission endpoints.
//
// Uses Upstash Redis (REST API) as a shared store when UPSTASH_REDIS_REST_URL
// and UPSTASH_REDIS_REST_TOKEN are set, so limits hold across serverless
// instances. If they are absent (or the store is unreachable) it degrades to a
// best-effort in-memory counter instead of failing.

const WINDOW_SECONDS = 10 * 60
const MAX_REQUESTS = 5

const memory = new Map<string, { count: number; resetAt: number }>()
let warnedNoStore = false

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const first = forwarded?.split(',')[0]?.trim()
  return first || request.headers.get('x-real-ip') || 'unknown'
}

function incrementMemory(key: string): number {
  const now = Date.now()
  if (memory.size > 5000) {
    for (const [k, v] of memory) {
      if (v.resetAt <= now) memory.delete(k)
    }
  }
  const entry = memory.get(key)
  if (!entry || entry.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + WINDOW_SECONDS * 1000 })
    return 1
  }
  entry.count += 1
  return entry.count
}

async function incrementShared(key: string): Promise<number | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    if (!warnedNoStore) {
      warnedNoStore = true
      console.warn(
        'UPSTASH_REDIS_REST_URL/TOKEN not set — submission rate limiting uses a per-instance in-memory store.'
      )
    }
    return null
  }

  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, String(WINDOW_SECONDS), 'NX'],
      ]),
    })
    if (!res.ok) throw new Error(`Rate limit store returned ${res.status}`)
    const data = await res.json()
    const count = Number(data?.[0]?.result)
    if (!Number.isFinite(count)) throw new Error('Unexpected rate limit store response')
    return count
  } catch (error) {
    console.error('Rate limit store error, falling back to memory:', error)
    return null
  }
}

// Returns a 429 response if the caller is over the limit, otherwise null.
// The budget is shared between /api/submit and /api/ekogroups/submit.
export async function rateLimitSubmission(request: NextRequest): Promise<NextResponse | null> {
  const key = `rl:submit:${getClientIp(request)}`
  const count = (await incrementShared(key)) ?? incrementMemory(key)

  if (count > MAX_REQUESTS) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(WINDOW_SECONDS) },
      }
    )
  }

  return null
}
