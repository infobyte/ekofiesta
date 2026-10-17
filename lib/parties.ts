import type { Party, PartyByDay } from './types'

export function groupPartiesByDay(parties: Party[], locale: string): PartyByDay[] {
  const grouped = new Map<string, Party[]>()

  parties.forEach(party => {
    const dateKey = new Date(party.starts_at).toISOString().split('T')[0]
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, [])
    }
    grouped.get(dateKey)!.push(party)
  })

  return Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, dayParties]) => ({
      date,
      day: new Date(dayParties[0].starts_at).toLocaleDateString(locale, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
      parties: dayParties.sort(
        (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
      ),
    }))
}
