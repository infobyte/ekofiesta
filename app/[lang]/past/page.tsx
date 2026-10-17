import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getApprovedPartiesByEdition } from '@/lib/db'
import { groupPartiesByDay } from '@/lib/parties'
import { PAST_EDITIONS, type Edition } from '@/lib/types'
import { getDictionary, hasLocale, intlLocale } from '../dictionaries'
import SiteNav from '../site-nav'

export const dynamic = 'force-dynamic'

const EDITION_NAMES: Record<Edition, string> = {
  'ekoparty-ba-2026': 'EkoParty Buenos Aires 2026',
  'ekoparty-miami-2027': 'EkoParty Miami 2027',
}

export default async function PastEditionsPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  const t = dict.past
  const locale = intlLocale[lang]

  const editions = await Promise.all(
    PAST_EDITIONS.map(async edition => ({
      edition,
      name: EDITION_NAMES[edition],
      grouped: groupPartiesByDay(await getApprovedPartiesByEdition(edition), locale),
    }))
  )

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' })

  return (
    <main className="min-h-screen bg-surface">
      <SiteNav
        lang={lang}
        active="past"
        labels={{
          parties: dict.home.navParties,
          agenda: dict.home.navAgenda,
          mcp: dict.home.navMcp,
          past: dict.home.navPast,
        }}
      />

      {/* Hero */}
      <header className="hero-mesh">
        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 sm:pb-14 sm:pt-16">
          <h1 className="text-[2rem] font-bold leading-[1.08] tracking-tighter text-gray-900 sm:text-6xl md:text-7xl">
            <span className="block">{t.title1}</span>
            <span className="text-gradient block">{t.title2}</span>
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-base text-gray-500 sm:mt-5 sm:text-xl">
            {t.subtitle}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-20 px-4 py-12 sm:px-6 sm:py-16">
        {editions.map(({ edition, name, grouped }) => (
          <section key={edition}>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {name}
              </h2>
              {edition === 'ekoparty-ba-2026' && (
                <Link
                  href={`/${lang}/agenda`}
                  className="mb-1 text-sm font-semibold text-purple-600 transition hover:text-purple-500"
                >
                  {t.agendaLink} →
                </Link>
              )}
            </div>

            {grouped.length === 0 ? (
              <p className="rounded-3xl border border-dashed border-surface-border bg-white py-16 text-center text-gray-500">
                {t.empty}
              </p>
            ) : (
              <div className="space-y-12">
                {grouped.map(dayGroup => (
                  <div key={dayGroup.date}>
                    <h3 className="mb-5 text-lg font-bold capitalize tracking-tight text-gray-700">
                      {dayGroup.day}
                    </h3>
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {dayGroup.parties.map(party => (
                        <article
                          key={party.id}
                          className="flex flex-col rounded-3xl border border-surface-border bg-white p-6 opacity-90"
                        >
                          <div className="mb-3">
                            <span className="rounded-lg bg-gray-100 px-2.5 py-1 font-mono text-xs font-bold text-gray-500">
                              {formatTime(party.starts_at)} – {formatTime(party.ends_at)}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold leading-snug tracking-tight text-gray-900">
                            {party.name}
                          </h4>
                          <p className="mt-1 text-sm font-medium text-gray-400">
                            {dict.home.hostedBy}{' '}
                            <span className="text-gray-600">{party.host}</span>
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
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Footer */}
      <footer className="border-t border-surface-border bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-base font-bold tracking-tight">
            eko<span className="text-gradient">.party</span>
          </p>
          <p className="mt-2 text-sm text-gray-400">{dict.home.footer}</p>
        </div>
      </footer>
    </main>
  )
}
