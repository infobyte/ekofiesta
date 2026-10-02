import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../dictionaries'
import { agenda } from './mock-agenda'
import type { AgendaItem } from './mock-agenda'

const trackStyles: Record<AgendaItem['track'], { bg: string; text: string; label_es: string; label_en: string; label_pt: string }> = {
  main:     { bg: 'bg-purple-500/15', text: 'text-purple-300', label_es: 'Main Track', label_en: 'Main Track', label_pt: 'Main Track' },
  workshop: { bg: 'bg-cyan-500/15',   text: 'text-cyan-300',   label_es: 'Workshop',   label_en: 'Workshop',   label_pt: 'Workshop' },
  village:  { bg: 'bg-green-500/15',  text: 'text-green-300',  label_es: 'Village',    label_en: 'Village',    label_pt: 'Village' },
  ctf:      { bg: 'bg-orange-500/15', text: 'text-orange-300', label_es: 'CTF',        label_en: 'CTF',        label_pt: 'CTF' },
  panel:    { bg: 'bg-yellow-500/15', text: 'text-yellow-300', label_es: 'Panel',      label_en: 'Panel',      label_pt: 'Painel' },
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
        <div className="mx-auto max-w-7xl px-6 pb-12 pt-10">
          <div className="mb-8 flex items-center justify-between">
            <Link
              href={`/${lang}`}
              className="text-sm text-gray-400 transition hover:text-white"
            >
              ← {t.backParties}
            </Link>
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-purple-400">
            {t.badge}
          </p>
          <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            {t.title1} <span className="text-gradient">{t.title2}</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-gray-400">{t.subtitle}</p>
          <p className="mt-3 text-xs text-gray-600">{t.sourceNote}</p>
        </div>
      </header>

      {/* Day pill nav */}
      <nav className="sticky top-0 z-10 border-b border-surface-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-3">
          {agenda.map(day => (
            <a
              key={day.id}
              href={`#${day.id}`}
              className="whitespace-nowrap rounded-full border border-surface-border bg-surface-raised px-4 py-1.5 text-sm font-medium text-gray-300 transition hover:border-purple-500/50 hover:text-white"
            >
              {dayLabel(day)}
              <span className="ml-2 text-xs text-gray-500">{day.items.length}</span>
            </a>
          ))}
        </div>
      </nav>

      {/* Agenda listing */}
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="space-y-16">
          {agenda.map(day => (
            <section key={day.id} id={day.id} className="scroll-mt-20">
              {/* Day header */}
              <div className="mb-6 flex items-baseline gap-3">
                <h2 className="text-2xl font-bold md:text-3xl">{dayLabel(day)}</h2>
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
                        className="flex items-center gap-4 rounded-xl border border-surface-border/50 px-5 py-3 text-sm text-gray-600"
                      >
                        <span className="w-28 shrink-0 font-mono text-xs text-gray-700">
                          {item.time_start}
                        </span>
                        <span>{item.title}</span>
                      </div>
                    )
                  }

                  return (
                    <article
                      key={item.id}
                      className="group flex gap-4 rounded-2xl border border-surface-border bg-surface-raised p-5 transition duration-200 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5"
                    >
                      {/* Time column */}
                      <div className="w-24 shrink-0 text-right">
                        <span className="font-mono text-sm font-semibold text-purple-400">
                          {item.time_start}
                        </span>
                        <span className="block font-mono text-xs text-gray-600">
                          {item.time_end}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="flex flex-col items-center">
                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-purple-500/50" />
                        <div className="mt-1 flex-1 w-px bg-surface-border" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-2 flex flex-wrap gap-2">
                          <span className={`rounded-md px-2.5 py-0.5 text-xs font-bold ${ts.bg} ${ts.text}`}>
                            {trackLabel(item.track)}
                          </span>
                          {item.language === 'en' && (
                            <span className="rounded-md bg-blue-500/15 px-2.5 py-0.5 text-xs font-bold text-blue-300">
                              EN
                            </span>
                          )}
                          <span className="text-xs text-gray-600">
                            {item.room}
                          </span>
                        </div>
                        <h3 className="text-base font-bold leading-snug text-white">
                          {item.title}
                        </h3>
                        {item.speaker && (
                          <p className="mt-1 text-sm text-gray-400">{item.speaker}</p>
                        )}
                        {item.description && (
                          <p className="mt-2 text-sm leading-relaxed text-gray-500">
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
      <footer className="border-t border-surface-border py-10">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-gray-500">
          <p>{dict.home.footer}</p>
        </div>
      </footer>
    </main>
  )
}
