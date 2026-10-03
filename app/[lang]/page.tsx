import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getApprovedPartiesByEdition } from '@/lib/db'
import type { Edition, Party, PartyByDay } from '@/lib/types'
import { getDictionary, hasLocale, intlLocale } from './dictionaries'
import SiteNav from './site-nav'

export const dynamic = 'force-dynamic'

function groupPartiesByDay(parties: Party[], locale: string): PartyByDay[] {
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

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  const t = dict.home
  const locale = intlLocale[lang]

  const edition: Edition = 'ekoparty-ba-2026'
  const parties = await getApprovedPartiesByEdition(edition)
  const grouped = groupPartiesByDay(parties, locale)

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' })

  const formatDayShort = (date: string) =>
    new Date(`${date}T12:00:00`).toLocaleDateString(locale, {
      weekday: 'short',
      day: 'numeric',
    })

  const eventsListed = (parties.length === 1 ? t.eventsListed : t.eventsListedPlural).replace(
    '{count}',
    String(parties.length)
  )

  return (
    <main className="min-h-screen bg-surface">
      <SiteNav
        lang={lang}
        active="parties"
        labels={{ parties: t.navParties, agenda: t.navAgenda, mcp: t.navMcp }}
      />

      {/* Hero */}
      <header className="hero-mesh">
        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            {/* Live badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-surface-border bg-white/80 py-1.5 pl-3 pr-4 text-xs font-medium text-gray-600 shadow-sm backdrop-blur">
              <span className="live-dot h-2 w-2 rounded-full bg-green-500" />
              {t.badge}
            </div>

            <h1 className="text-[2rem] font-bold leading-[1.08] tracking-tighter sm:text-6xl md:text-7xl">
              <span className="block">{t.title1}</span>
              <span className="text-gradient block">{t.title2}</span>
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-pretty text-base text-gray-500 sm:mt-7 sm:text-xl">
              {t.subtitle}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row">
              <Link
                href={`/${lang}/submit`}
                className="btn-gradient w-full rounded-full px-8 py-3.5 text-center text-sm font-bold text-white shadow-xl shadow-purple-500/25 sm:w-auto"
              >
                {t.submitCta}
              </Link>
              <span className="font-mono text-xs text-gray-400">{eventsListed}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Day pills nav */}
      {grouped.length > 0 && (
        <nav className="sticky top-14 z-30 border-b border-surface-border/70 bg-white/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl gap-1.5 overflow-x-auto px-4 py-2.5 sm:px-6">
            {grouped.map(dayGroup => (
              <a
                key={dayGroup.date}
                href={`#${dayGroup.date}`}
                className="group whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize text-gray-500 transition hover:bg-gray-900 hover:text-white"
              >
                {formatDayShort(dayGroup.date)}
                <span className="ml-1.5 font-mono text-[10px] text-gray-400 group-hover:text-gray-300">
                  {dayGroup.parties.length}
                </span>
              </a>
            ))}
          </div>
        </nav>
      )}

      {/* Listing */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {grouped.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-surface-border bg-white py-24 text-center">
            <p className="text-4xl">🎉</p>
            <p className="mt-4 text-lg text-gray-500">{t.emptyTitle}</p>
            <Link
              href={`/${lang}/submit`}
              className="mt-2 inline-block font-semibold text-purple-600 transition hover:text-purple-500"
            >
              {t.emptyCta}
            </Link>
          </div>
        ) : (
          <div className="space-y-20">
            {grouped.map(dayGroup => (
              <section key={dayGroup.date} id={dayGroup.date} className="scroll-mt-32">
                {/* Day header */}
                <div className="mb-8 flex items-end justify-between gap-4">
                  <h2 className="text-2xl font-bold capitalize tracking-tight text-gray-900 sm:text-3xl">
                    {dayGroup.day}
                  </h2>
                  <span className="mb-1 font-mono text-xs text-gray-400">
                    {(dayGroup.parties.length === 1 ? t.eventsListed : t.eventsListedPlural).replace('{count}', String(dayGroup.parties.length))}
                  </span>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {dayGroup.parties.map(party => (
                    <article
                      key={party.id}
                      className="card-modern group relative flex flex-col overflow-hidden rounded-3xl border border-surface-border bg-white p-6"
                    >
                      {/* Top accent line on hover */}
                      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-gray-900 px-2.5 py-1 font-mono text-xs font-bold text-white">
                          {formatTime(party.starts_at)} – {formatTime(party.ends_at)}
                        </span>
                        {party.tags?.includes('open-invite') && (
                          <span className="rounded-lg bg-cyan-50 px-2.5 py-1 text-xs font-bold text-cyan-700 ring-1 ring-inset ring-cyan-200">
                            {t.openInvite}
                          </span>
                        )}
                        {party.tags?.includes('approval-required') && (
                          <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-inset ring-amber-200">
                            {t.approvalRequired}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold leading-snug tracking-tight text-gray-900">
                        {party.name}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-gray-400">
                        {t.hostedBy} <span className="text-gray-600">{party.host}</span>
                      </p>

                      {party.description && (
                        <p className="mt-3 text-sm leading-relaxed text-gray-500">
                          {party.description}
                        </p>
                      )}

                      <div className="mt-4 flex items-start gap-2 text-sm">
                        <span aria-hidden className="mt-0.5">📍</span>
                        <span className="text-gray-500">
                          <span className="font-semibold text-gray-700">{party.venue}</span>
                          <br />
                          {party.address}
                        </span>
                      </div>

                      <div className="mt-auto pt-6">
                        <a
                          href={party.rsvp_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-gray-900 bg-white px-5 py-2.5 text-sm font-bold text-gray-900 transition-colors duration-200 hover:bg-gray-900 hover:text-white"
                        >
                          {t.rsvp}
                          <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-surface-border bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-base font-bold tracking-tight">
            eko<span className="text-gradient">.party</span>
          </p>
          <p className="mt-2 text-sm text-gray-400">{t.footer}</p>
        </div>
      </footer>
    </main>
  )
}
