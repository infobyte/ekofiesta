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

  const formatDate = (iso: string) => {
    const date = new Date(iso)
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-6xl font-black mb-2">PARTIES &<br />NETWORKING<br />EVENTS</h1>
          <p className="text-gray-400 text-lg">EkoParty Buenos Aires 2026</p>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        {grouped.length > 0 && (
          <aside className="w-48 bg-gray-950 border-r border-gray-800 p-6 sticky top-0 h-screen overflow-y-auto">
            <Link
              href="/submit"
              className="block w-full mb-8 bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 text-white font-bold py-3 px-4 rounded text-center transition"
            >
              📝 SUBMIT
            </Link>

            <nav className="space-y-2">
              {grouped.map(dayGroup => (
                <a
                  key={dayGroup.date}
                  href={`#${dayGroup.date}`}
                  className="block text-sm font-bold text-gray-300 hover:text-white transition py-2 px-3 rounded hover:bg-gray-800"
                >
                  {formatDate(dayGroup.date)}
                  <div className="text-xs text-gray-500 font-normal">{dayGroup.parties.length} events</div>
                </a>
              ))}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {grouped.length === 0 ? (
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <p className="text-gray-400 text-lg mb-6">No parties listed yet.</p>
                <Link
                  href="/submit"
                  className="inline-block bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded transition"
                >
                  Be the first to submit!
                </Link>
              </div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
              {grouped.map(dayGroup => (
                <section key={dayGroup.date} id={dayGroup.date}>
                  <h2 className="text-3xl font-black mb-8 text-white">{dayGroup.day}</h2>

                  <div className="space-y-4">
                    {dayGroup.parties.map(party => (
                      <div
                        key={party.id}
                        className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition group"
                      >
                        <div className="flex flex-col md:flex-row">
                          {/* Content */}
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <p className="text-sm text-pink-400 font-bold mb-2">
                                  {formatTime(party.starts_at)} - {formatTime(party.ends_at)}
                                </p>
                                <h3 className="text-2xl font-bold mb-2">{party.name}</h3>
                                <p className="text-gray-400">{party.host}</p>
                              </div>
                            </div>

                            {party.description && (
                              <p className="text-gray-300 mb-4 text-sm">{party.description}</p>
                            )}

                            <div className="text-sm text-gray-500 mb-4">
                              <p className="font-semibold text-gray-400">{party.venue}</p>
                              <p>{party.address}</p>
                            </div>

                            <a
                              href={party.rsvp_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 text-white font-bold py-2 px-6 rounded transition text-sm"
                            >
                              RSVP →
                            </a>
                          </div>

                          {/* Logo Placeholder */}
                          <div className="w-32 h-32 bg-gray-800 border-l border-gray-800 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-xs text-gray-500 font-bold">{party.host.substring(0, 3).toUpperCase()}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {/* Footer */}
          <footer className="border-t border-gray-800 py-8 mt-16 bg-gray-950">
            <div className="max-w-5xl mx-auto px-6 text-center text-gray-500 text-sm">
              <p>EkoParty Official Party Listing | Not affiliated with individual party hosts</p>
            </div>
          </footer>
        </div>
      </div>
    </main>
  )
}
