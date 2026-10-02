import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getApprovedPartiesByEdition } from '@/lib/db'
import type { Edition, Party, PartyByDay } from '@/lib/types'
import { getDictionary, hasLocale, intlLocale } from './dictionaries'
import LanguageSwitcher from './language-switcher'

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
      {/* Hero */}
      <header className="hero-glow border-b border-surface-border">
        <div className="mx-auto max-w-5xl px-6 pb-14 pt-10">
          <div className="mb-10 flex justify-end">
            <LanguageSwitcher current={lang} />
          </div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-purple-400">
            {t.badge}
          </p>
          <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            {t.title1}
            <br />
            <span className="text-gradient">{t.title2}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-gray-400">{t.subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={`/${lang}/submit`}
              className="rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 px-7 py-3 font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:shadow-purple-500/50 hover:brightness-110"
            >
              {t.submitCta}
            </Link>
            <span className="text-sm text-gray-500">{eventsListed}</span>
          </div>
        </div>
      </header>

      {/* Day pills nav */}
      {grouped.length > 0 && (
        <nav className="sticky top-0 z-10 border-b border-surface-border bg-surface/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-6 py-3">
            {grouped.map(dayGroup => (
              <a
                key={dayGroup.date}
                href={`#${dayGroup.date}`}
                className="whitespace-nowrap rounded-full border border-surface-border bg-surface-raised px-4 py-1.5 text-sm font-medium text-gray-300 transition hover:border-purple-500/50 hover:text-white"
              >
                {formatDayShort(dayGroup.date)}
                <span className="ml-2 text-xs text-gray-500">{dayGroup.parties.length}</span>
              </a>
            ))}
          </div>
        </nav>
      )}

      {/* Listing */}
      <div className="mx-auto max-w-5xl px-6 py-14">
        {grouped.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-surface-border py-24 text-center">
            <p className="text-4xl">🎉</p>
            <p className="mt-4 text-lg text-gray-400">{t.emptyTitle}</p>
            <Link
              href={`/${lang}/submit`}
              className="mt-2 inline-block font-semibold text-purple-400 transition hover:text-purple-300"
            >
              {t.emptyCta}
            </Link>
          </div>
        ) : (
          <div className="space-y-16">
            {grouped.map(dayGroup => (
              <section key={dayGroup.date} id={dayGroup.date} className="scroll-mt-20">
                <div className="mb-6 flex items-baseline gap-3">
                  <h2 className="text-2xl font-bold capitalize md:text-3xl">{dayGroup.day}</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-surface-border to-transparent" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {dayGroup.parties.map(party => (
                    <article
                      key={party.id}
                      className="group flex flex-col rounded-2xl border border-surface-border bg-surface-raised p-6 transition duration-200 hover:-translate-y-0.5 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <span className="rounded-md bg-purple-500/15 px-2.5 py-1 text-xs font-bold text-purple-300">
                          {formatTime(party.starts_at)} – {formatTime(party.ends_at)}
                        </span>
                        {party.tags?.includes('open-invite') && (
                          <span className="rounded-md bg-cyan-500/15 px-2.5 py-1 text-xs font-bold text-cyan-300">
                            {t.openInvite}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold leading-snug">{party.name}</h3>
                      <p className="mt-1 text-sm font-medium text-gray-400">
                        {t.hostedBy} {party.host}
                      </p>

                      {party.description && (
                        <p className="mt-3 text-sm leading-relaxed text-gray-300">
                          {party.description}
                        </p>
                      )}

                      <div className="mt-4 flex items-start gap-2 text-sm text-gray-500">
                        <span aria-hidden>📍</span>
                        <span>
                          <span className="font-medium text-gray-400">{party.venue}</span>
                          <br />
                          {party.address}
                        </span>
                      </div>

                      <div className="mt-auto pt-5">
                        <a
                          href={party.rsvp_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 group-hover:shadow-lg group-hover:shadow-pink-500/20"
                        >
                          {t.rsvp}
                          <span aria-hidden>→</span>
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
      <footer className="border-t border-surface-border py-10">
        <div className="mx-auto max-w-5xl px-6 text-center text-sm text-gray-500">
          <p>{t.footer}</p>
        </div>
      </footer>
    </main>
  )
}
