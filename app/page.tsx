import Link from 'next/link'
import { getApprovedPartiesByEdition } from '@/lib/db'
import type { Edition, PartyByDay } from '@/lib/types'

export const dynamic = 'force-dynamic'

function groupPartiesByDay(parties: any[]): PartyByDay[] {
  const grouped = new Map<string, any[]>()

  parties.forEach(party => {
    const date = new Date(party.starts_at)
    const dateKey = date.toISOString().split('T')[0]
    const dayName = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })

    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, [])
    }
    grouped.get(dateKey)!.push(party)
  })

  const result: PartyByDay[] = []
  Array.from(grouped.entries())
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .forEach(([date, parties]) => {
      result.push({
        date,
        day: parties[0] ? new Date(parties[0].starts_at).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }) : '',
        parties: parties.sort((a, b) =>
          new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
        ),
      })
    })

  return result
}

export default async function Home() {
  const edition: Edition = 'ekoparty-ba-2026'
  const parties = await getApprovedPartiesByEdition(edition)
  const grouped = groupPartiesByDay(parties)

  const formatTime = (iso: string) => {
    const date = new Date(iso)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-eko-900 text-white py-12 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-2">EkoParty Parties</h1>
          <p className="text-eko-100 text-lg">Buenos Aires 2026 | Find all the parties happening at EkoParty</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Submit Button */}
        <div className="mb-12">
          <Link
            href="/submit"
            className="inline-block bg-eko-600 hover:bg-eko-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            📝 Submit a Party
          </Link>
        </div>

        {/* Parties Listing */}
        {grouped.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">No parties listed yet. Be the first to submit!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map(dayGroup => (
              <section key={dayGroup.date} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Day Header */}
                <div className="bg-eko-700 text-white px-6 py-4">
                  <h2 className="text-2xl font-bold">{dayGroup.day}</h2>
                </div>

                {/* Parties Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-eko-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-6 py-3 font-semibold text-gray-700">Time</th>
                        <th className="text-left px-6 py-3 font-semibold text-gray-700">Event</th>
                        <th className="text-left px-6 py-3 font-semibold text-gray-700">Host</th>
                        <th className="text-left px-6 py-3 font-semibold text-gray-700">Venue</th>
                        <th className="text-left px-6 py-3 font-semibold text-gray-700">RSVP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dayGroup.parties.map((party, idx) => (
                        <tr
                          key={party.id}
                          className={idx % 2 === 0 ? 'bg-white' : 'bg-eko-50'}
                        >
                          <td className="px-6 py-4 font-semibold text-eko-700 whitespace-nowrap">
                            {formatTime(party.starts_at)} - {formatTime(party.ends_at)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">{party.name}</div>
                            {party.description && (
                              <p className="text-sm text-gray-600 mt-1">{party.description}</p>
                            )}
                          </td>
                          <td className="px-6 py-4 text-gray-700">{party.host}</td>
                          <td className="px-6 py-4 text-gray-700 text-sm">
                            <div>{party.venue}</div>
                            <div className="text-gray-500">{party.address}</div>
                          </td>
                          <td className="px-6 py-4">
                            <a
                              href={party.rsvp_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block bg-eko-600 hover:bg-eko-700 text-white font-semibold py-2 px-4 rounded transition text-sm"
                            >
                              RSVP
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-eko-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-eko-100">
          <p>EkoParty Official Party Listing | Not affiliated with individual party hosts</p>
        </div>
      </footer>
    </main>
  )
}
