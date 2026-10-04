import { NextResponse } from 'next/server'
import { agenda } from '@/app/[lang]/agenda/mock-agenda'
import type { AgendaDay, AgendaItem, AgendaRoom } from '@/app/[lang]/agenda/mock-agenda'

// Argentina is UTC-3 year-round (no DST), so we can emit plain UTC times
const ART_OFFSET_HOURS = 3

function findItem(id: string): { item: AgendaItem; room: AgendaRoom; day: AgendaDay } | null {
  for (const day of agenda) {
    for (const room of day.rooms) {
      const item = room.items.find(i => i.id === id)
      if (item) return { item, room, day }
    }
  }
  return null
}

function toUtcStamp(date: string, time: string): string {
  const [h, m] = time.split(':').map(Number)
  const d = new Date(Date.UTC(
    Number(date.slice(0, 4)),
    Number(date.slice(5, 7)) - 1,
    Number(date.slice(8, 10)),
    h + ART_OFFSET_HOURS,
    m
  ))
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
}

// RFC 5545: escape backslash, comma, semicolon and newlines in text values
function esc(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

// RFC 5545: fold lines longer than 75 octets (continuation lines start with a space)
function fold(line: string): string {
  const out: string[] = []
  let rest = line
  while (rest.length > 73) {
    out.push(rest.slice(0, 73))
    rest = ' ' + rest.slice(73)
  }
  out.push(rest)
  return out.join('\r\n')
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const found = findItem(id)
  if (!found) {
    return NextResponse.json({ error: 'Talk not found' }, { status: 404 })
  }

  const { item, room, day } = found

  const descriptionParts = [
    item.speakers.length > 0 ? `Speakers: ${item.speakers.join(', ')}` : null,
    item.village ? `Village: ${item.village}` : null,
    `Idioma / Language: ${item.language.toUpperCase()}`,
    'ekoparty 2026 — https://ekofiesta.com',
  ].filter(Boolean) as string[]

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//eko.party//agenda 2026//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    fold(`UID:${item.id}@ekofiesta.com`),
    `DTSTAMP:${toUtcStamp(day.date, item.time_start)}`,
    `DTSTART:${toUtcStamp(day.date, item.time_start)}`,
    `DTEND:${toUtcStamp(day.date, item.time_end)}`,
    fold(`SUMMARY:${esc(item.title)}`),
    fold(`LOCATION:${esc(`${room.name} — ekoparty 2026, Buenos Aires`)}`),
    fold(`DESCRIPTION:${esc(descriptionParts.join('\n'))}`),
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  return new NextResponse(lines.join('\r\n') + '\r\n', {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="ekoparty-${item.id}.ics"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
