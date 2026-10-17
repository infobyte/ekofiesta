import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getApprovedEkogroupActivities } from '@/lib/db'
import { EKOGROUPS, EKOGROUPS_OFFICIAL_URL, getEkogroup } from '@/lib/ekogroups'
import type { EkogroupActivity } from '@/lib/types'
import { getDictionary, hasLocale, intlLocale } from '../dictionaries'
import SiteNav from '../site-nav'

export const dynamic = 'force-dynamic'

const TYPE_STYLES: Record<string, string> = {
  meetup: 'bg-purple-50 text-purple-700 ring-purple-200',
  workshop: 'bg-cyan-50 text-cyan-700 ring-cyan-200',
  ctf: 'bg-red-50 text-red-700 ring-red-200',
  talk: 'bg-amber-50 text-amber-700 ring-amber-200',
  social: 'bg-pink-50 text-pink-700 ring-pink-200',
  other: 'bg-gray-100 text-gray-600 ring-gray-200',
}

function parseMonth(m: string | undefined): { year: number; month: number } {
  const match = typeof m === 'string' ? m.match(/^(\d{4})-(\d{2})$/) : null
  if (match) {
    const year = Number(match[1])
    const month = Number(match[2]) - 1
    if (year >= 2024 && year <= 2030 && month >= 0 && month <= 11) return { year, month }
  }
  const now = new Date()
  return { year: now.getUTCFullYear(), month: now.getUTCMonth() }
}

const monthParam = (year: number, month: number) =>
  `${year}-${String(month + 1).padStart(2, '0')}`

export default async function EkogroupsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ m?: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  const t = dict.ekogroups
  const locale = intlLocale[lang]

  const { m } = await searchParams
  const { year, month } = parseMonth(m)

  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const firstWeekday = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7 // Monday = 0

  const activities = await getApprovedEkogroupActivities()

  // Place each activity on its day(s) of the displayed month
  const byDay = new Map<number, EkogroupActivity[]>()
  const add = (day: number, a: EkogroupActivity) => {
    if (!byDay.has(day)) byDay.set(day, [])
    byDay.get(day)!.push(a)
  }
  for (const a of activities) {
    if (a.kind === 'monthly' && a.day_of_month && a.day_of_month <= daysInMonth) {
      add(a.day_of_month, a)
    } else if (a.kind === 'one_shot' && a.starts_at) {
      const d = new Date(a.starts_at)
      if (d.getUTCFullYear() === year && d.getUTCMonth() === month) add(d.getUTCDate(), a)
    }
  }

  // Calendar cells: leading blanks + days, padded to full weeks
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const monthDate = new Date(Date.UTC(year, month, 1))
  const monthLabel = monthDate.toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
  const prev = month === 0 ? monthParam(year - 1, 11) : monthParam(year, month - 1)
  const next = month === 11 ? monthParam(year + 1, 0) : monthParam(year, month + 1)

  // Monday-first weekday headers in the page language
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Date(Date.UTC(2026, 5, 1 + i)).toLocaleDateString(locale, {
      weekday: 'short',
      timeZone: 'UTC',
    })
  )

  const now = new Date()
  const isToday = (day: number) =>
    now.getUTCFullYear() === year && now.getUTCMonth() === month && now.getUTCDate() === day

  const formatOneShotTime = (iso: string) =>
    new Date(iso).toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'UTC',
    })

  const scheduleLabel = (a: EkogroupActivity) =>
    a.kind === 'monthly'
      ? a.time_start
        ? `${a.time_start}${a.time_end ? ` – ${a.time_end}` : ''}`
        : t.allDay
      : `${formatOneShotTime(a.starts_at!)}${a.ends_at ? ` – ${formatOneShotTime(a.ends_at)}` : ''}`

  const typeLabel = (type: string) => (t.types as Record<string, string>)[type] || type

  const monthActivities = Array.from(byDay.entries()).sort(([a], [b]) => a - b)

  // Directory grouped by country
  const byCountry = new Map<string, typeof EKOGROUPS>()
  for (const g of EKOGROUPS) {
    if (!byCountry.has(g.country)) byCountry.set(g.country, [])
    byCountry.get(g.country)!.push(g)
  }

  return (
    <main className="min-h-screen bg-surface">
      <SiteNav
        lang={lang}
        active="ekogroups"
        labels={{
          parties: dict.home.navParties,
          agenda: dict.home.navAgenda,
          mcp: dict.home.navMcp,
          past: dict.home.navPast,
          ekogroups: dict.home.navEkogroups,
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
          <div className="mt-7">
            <Link
              href={`/${lang}/ekogroups/submit`}
              className="btn-gradient inline-block rounded-full px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-purple-500/25"
            >
              {t.submitCta}
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Month switcher */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold capitalize tracking-tight text-gray-900 sm:text-3xl">
            {monthLabel}
          </h2>
          <div className="flex gap-2">
            <Link
              href={`/${lang}/ekogroups?m=${prev}`}
              aria-label={t.prevMonth}
              className="rounded-full border border-surface-border bg-white px-4 py-2 text-sm font-bold text-gray-600 transition hover:bg-gray-900 hover:text-white"
            >
              ←
            </Link>
            <Link
              href={`/${lang}/ekogroups?m=${next}`}
              aria-label={t.nextMonth}
              className="rounded-full border border-surface-border bg-white px-4 py-2 text-sm font-bold text-gray-600 transition hover:bg-gray-900 hover:text-white"
            >
              →
            </Link>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="overflow-x-auto rounded-3xl border border-surface-border bg-white p-3 shadow-sm sm:p-5">
          <div className="grid min-w-[640px] grid-cols-7 gap-1.5">
            {weekdays.map(w => (
              <div
                key={w}
                className="pb-2 text-center text-xs font-bold uppercase tracking-wide text-gray-400"
              >
                {w}
              </div>
            ))}
            {cells.map((day, i) =>
              day === null ? (
                <div key={`x${i}`} className="min-h-20 rounded-xl bg-gray-50/50" />
              ) : (
                <div
                  key={day}
                  className={`min-h-20 rounded-xl border p-1.5 ${
                    isToday(day)
                      ? 'border-purple-400 bg-purple-50/50'
                      : 'border-surface-border/60 bg-white'
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${isToday(day) ? 'text-purple-700' : 'text-gray-400'}`}
                  >
                    {day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {(byDay.get(day) || []).map(a => {
                      const g = getEkogroup(a.group_slug)
                      return (
                        <a
                          key={`${day}-${a.id}`}
                          href={`#act-${a.id}`}
                          className={`block truncate rounded-md px-1.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${TYPE_STYLES[a.activity_type] || TYPE_STYLES.other}`}
                          title={`${a.title} — ${g?.name || a.group_slug}`}
                        >
                          {a.kind === 'monthly' && <span title={t.recurring}>↻ </span>}
                          {g?.flag} {a.title}
                        </a>
                      )
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Month detail list */}
        <section className="mt-12">
          <h3 className="mb-6 text-xl font-bold tracking-tight text-gray-900">
            {t.monthDetailTitle}
          </h3>
          {monthActivities.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-surface-border bg-white py-16 text-center">
              <p className="text-4xl">📅</p>
              <p className="mt-4 text-gray-500">{t.emptyMonth}</p>
              <Link
                href={`/${lang}/ekogroups/submit`}
                className="mt-2 inline-block font-semibold text-purple-600 transition hover:text-purple-500"
              >
                {t.emptyCta}
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {monthActivities.flatMap(([day, dayActivities]) =>
                dayActivities.map(a => {
                  const g = getEkogroup(a.group_slug)
                  return (
                    <article
                      key={`list-${day}-${a.id}`}
                      id={`act-${a.id}`}
                      className="card-modern flex scroll-mt-24 flex-col rounded-3xl border border-surface-border bg-white p-6"
                    >
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-gray-900 px-2.5 py-1 font-mono text-xs font-bold text-white">
                          {String(day).padStart(2, '0')} · {scheduleLabel(a)}
                        </span>
                        <span
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${TYPE_STYLES[a.activity_type] || TYPE_STYLES.other}`}
                        >
                          {typeLabel(a.activity_type)}
                        </span>
                        {a.kind === 'monthly' && (
                          <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600">
                            ↻ {t.recurring}
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-bold leading-snug tracking-tight text-gray-900">
                        {a.title}
                      </h4>
                      <p className="mt-1 text-sm font-medium text-gray-400">
                        {g?.flag} <span className="text-gray-600">{g?.name || a.group_slug}</span>
                      </p>
                      {a.description && (
                        <p className="mt-3 text-sm leading-relaxed text-gray-500">{a.description}</p>
                      )}
                      {(a.venue || a.address) && (
                        <div className="mt-4 flex items-start gap-2 text-sm">
                          <span aria-hidden className="mt-0.5">📍</span>
                          <span className="text-gray-500">
                            {a.venue && <span className="font-semibold text-gray-700">{a.venue}</span>}
                            {a.venue && a.address && <br />}
                            {a.address}
                          </span>
                        </div>
                      )}
                      {a.signup_url && (
                        <div className="mt-auto pt-5">
                          <a
                            href={a.signup_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-600 transition hover:text-purple-500"
                          >
                            {t.signup} →
                          </a>
                        </div>
                      )}
                    </article>
                  )
                })
              )}
            </div>
          )}
        </section>

        {/* Groups directory */}
        <section className="mt-16">
          <h3 className="text-xl font-bold tracking-tight text-gray-900">{t.directoryTitle}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {t.directorySubtitle}{' '}
            <a
              href={EKOGROUPS_OFFICIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-purple-600 transition hover:text-purple-500"
            >
              ekoparty.org/ekogroups →
            </a>
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from(byCountry.entries()).map(([country, groups]) => (
              <div
                key={country}
                className="rounded-3xl border border-surface-border bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-bold text-gray-900">
                  {groups[0].flag} {country}
                </p>
                <ul className="mt-2 space-y-1">
                  {groups.map(g => (
                    <li key={g.slug} className="text-sm text-gray-500">
                      {g.city}
                      {g.contact && (
                        <>
                          {' · '}
                          <a
                            href={g.contact.url}
                            className="font-medium text-purple-600 transition hover:text-purple-500"
                          >
                            {g.contact.label}
                          </a>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
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
