import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../dictionaries'
import { agenda } from './mock-agenda'
import type { AgendaItem } from './mock-agenda'

const trackStyles: Record<AgendaItem['track'], { bg: string; text: string; label_es: string; label_en: string; label_pt: string }> = {
  main:     { bg: 'bg-purple-100', text: 'text-purple-700', label_es: 'Main Track', label_en: 'Main Track', label_pt: 'Main Track' },
  workshop: { bg: 'bg-cyan-100',   text: 'text-cyan-700',   label_es: 'Workshop',   label_en: 'Workshop',   label_pt: 'Workshop' },
  village:  { bg: 'bg-green-100',  text: 'text-green-700',  label_es: 'Village',    label_en: 'Village',    label_pt: 'Village' },
  ctf:      { bg: 'bg-orange-100', text: 'text-orange-700', label_es: 'CTF',        label_en: 'CTF',        label_pt: 'CTF' },
  panel:    { bg: 'bg-yellow-100', text: 'text-yellow-700', label_es: 'Panel',      label_en: 'Panel',      label_pt: 'Painel' },
}

type Params = Promise<{ lang: string }>

export async function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }, { lang: 'pt' }]
}

export default async function AgendaPage({ params }: { params: Params }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  const t = dict.agenda

  const dayLabel = (day: typeof agenda[number]) =>
    lang === 'en' ? day.label_en : lang === 'pt' ? day.label_pt : day.label_es

  const trackLabel = (track: AgendaItem['track']) => {
    const s = trackStyles[track]
    return lang === 'en' ? s.label_en : lang === 'pt' ? s.label_pt : s.label_es
  }

  return (
    <main className="min-h-screen bg-surface">
      {/* Hero */}
      <header className="hero-glow border-b border-surface-border">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 sm:pb-12 sm:pt-10">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href={`/${lang}`}
              className="text-sm text-gray-500 transition hover:text-gray-900"
            >
              ← {t.backParties}
            </Link>
          </div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-purple-600 sm:text-sm sm:tracking-[0.25em]">
            {t.badge}
          </p>
          <h1 className="text-[1.6rem] font-bold leading-[1.15] tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">{t.title1}</span>
            <span className="text-gradient block">{t.title2}</span>
          </h1>
          <p className="mt-3 max-w-xl text-base text-gray-500 sm:mt-4 sm:text-lg">{t.subtitle}</p>
          <p className="mt-3 text-xs text-gray-400">{t.sourceNote}</p>
        </div>
      </header>

      {/* Day pill nav */}
      <nav className="sticky top-0 z-10 border-b border-surface-border bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          {agenda.map(day => (
            <a
              key={day.id}
              href={`#${day.id}`}
              className="whitespace-nowrap rounded-full border border-surface-border bg-surface-raised px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-purple-400 hover:text-gray-900 sm:px-4 sm:text-sm"
            >
              {dayLabel(day)}
              <span className="ml-1.5 text-xs text-gray-400">{day.items.length}</span>
            </a>
          ))}
        </div>
      </nav>

      {/* Agenda listing */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="space-y-16">
          {agenda.map(day => (
            <section key={day.id} id={day.id} className="scroll-mt-20">
              {/* Day header */}
              <div className="mb-6 flex items-baseline gap-3">
                <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">{dayLabel(day)}</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-surface-border to-transparent" />
              </div>

              {/* Talk timeline */}
              <div className="space-y-3">
                {day.items.map(item => {
                  const ts = trackStyles[item.track]
                  const isBreak = item.title.toLowerCase().includes('almuerzo') ||
                    item.title.toLowerCase().includes('lunch') ||
                    item.title.toLowerCase().includes('break')

                  if (isBreak) {
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 rounded-xl border border-dashed border-surface-border px-5 py-3 text-sm text-gray-400"
                      >
                        <span className="w-28 shrink-0 font-mono text-xs text-gray-400">
                          {item.time_start}
                        </span>
                        <span>{item.title}</span>
                      </div>
                    )
                  }

                  return (
                    <article
                      key={item.id}
                      className="group rounded-2xl border border-surface-border bg-white p-4 shadow-sm transition duration-200 hover:border-purple-300 hover:shadow-md sm:flex sm:gap-4 sm:p-5"
                    >
                      {/* Time column — inline on mobile, side column on sm+ */}
                      <div className="mb-2 flex items-center gap-2 sm:mb-0 sm:w-20 sm:shrink-0 sm:flex-col sm:items-end sm:gap-0">
                        <span className="font-mono text-sm font-semibold text-purple-600">
                          {item.time_start}
                        </span>
                        <span className="font-mono text-xs text-gray-400 sm:block">
                          – {item.time_end}
                        </span>
                      </div>

                      {/* Dot+line — only on sm+ */}
                      <div className="hidden sm:flex sm:flex-col sm:items-center">
                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-purple-400" />
                        <div className="mt-1 flex-1 w-px bg-surface-border" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-2 flex flex-wrap gap-1.5">
                          <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${ts.bg} ${ts.text}`}>
                            {trackLabel(item.track)}
                          </span>
                          {item.language === 'en' && (
                            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                              EN
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            {item.room}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold leading-snug text-gray-900 sm:text-base">
                          {item.title}
                        </h3>
                        {item.speaker && (
                          <p className="mt-1 text-xs text-gray-500 sm:text-sm">{item.speaker}</p>
                        )}
                        {item.description && (
                          <p className="mt-1.5 text-xs leading-relaxed text-gray-500 sm:mt-2 sm:text-sm">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-surface-border bg-surface-raised py-10">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-gray-400">
          <p>{dict.home.footer}</p>
        </div>
      </footer>
    </main>
  )
}
