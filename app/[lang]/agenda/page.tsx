import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../dictionaries'
import { agenda } from './mock-agenda'
import type { AgendaDay, AgendaRoom, AgendaItem } from './mock-agenda'

type Params = Promise<{ lang: string }>

export async function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }, { lang: 'pt' }]
}

const roomColorMap: Record<string, { dot: string; badge: string; time: string }> = {
  'maintrack':           { dot: 'bg-purple-500', badge: 'bg-purple-100 text-purple-700', time: 'text-purple-600' },
  'sala-d':              { dot: 'bg-red-400',    badge: 'bg-red-100 text-red-700',       time: 'text-red-500' },
  'sala-c1':             { dot: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-700',     time: 'text-blue-600' },
  'sala-c2':             { dot: 'bg-cyan-500',   badge: 'bg-cyan-100 text-cyan-700',     time: 'text-cyan-600' },
  'sala-c3':             { dot: 'bg-green-500',  badge: 'bg-green-100 text-green-700',   time: 'text-green-600' },
  'hack-the-talent-zone':{ dot: 'bg-pink-500',   badge: 'bg-pink-100 text-pink-700',     time: 'text-pink-500' },
  'sala-a1':             { dot: 'bg-orange-400', badge: 'bg-orange-100 text-orange-700', time: 'text-orange-500' },
  'sala-a2':             { dot: 'bg-amber-400',  badge: 'bg-amber-100 text-amber-700',   time: 'text-amber-600' },
  'sala-a3':             { dot: 'bg-indigo-500', badge: 'bg-indigo-100 text-indigo-700', time: 'text-indigo-600' },
  'sala-a4':             { dot: 'bg-lime-500',   badge: 'bg-lime-100 text-lime-700',     time: 'text-lime-600' },
  'sala-v1':             { dot: 'bg-violet-500', badge: 'bg-violet-100 text-violet-700', time: 'text-violet-600' },
  'sala-e':              { dot: 'bg-rose-400',   badge: 'bg-rose-100 text-rose-700',     time: 'text-rose-500' },
}

const typeLabels: Record<string, { es: string; en: string; pt: string; cls: string }> = {
  lightning: { es: '⚡ Lightning', en: '⚡ Lightning', pt: '⚡ Lightning', cls: 'bg-yellow-100 text-yellow-700' },
  workshop:  { es: '🛠 Workshop',  en: '🛠 Workshop',  pt: '🛠 Workshop',  cls: 'bg-cyan-100 text-cyan-700' },
  panel:     { es: '💬 Panel',     en: '💬 Panel',     pt: '💬 Painel',   cls: 'bg-green-100 text-green-700' },
}

function rc(id: string) {
  return roomColorMap[id] ?? { dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-600', time: 'text-gray-500' }
}

export default async function AgendaPage({ params }: { params: Params }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  const t = dict.agenda

  const dayLabel = (day: AgendaDay) =>
    lang === 'en' ? day.label_en : lang === 'pt' ? day.label_pt : day.label_es

  return (
    <main className="min-h-screen bg-surface">
      {/* Hero */}
      <header className="hero-glow border-b border-surface-border">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 sm:pb-12 sm:pt-10">
          <div className="mb-6 flex items-center justify-between">
            <Link href={`/${lang}`} className="text-sm text-gray-500 transition hover:text-gray-900">
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
              <span className="ml-1.5 text-xs text-gray-400">
                {day.rooms.reduce((n, r) => n + r.items.length, 0)}
              </span>
            </a>
          ))}
        </div>
      </nav>

      {/* Agenda listing */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="space-y-20">
          {agenda.map(day => (
            <section key={day.id} id={day.id} className="scroll-mt-20">
              {/* Day header */}
              <div className="mb-5 flex items-baseline gap-3">
                <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">{dayLabel(day)}</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-surface-border to-transparent" />
              </div>

              {/* Room quick-nav pills */}
              <div className="mb-8 flex flex-wrap gap-2">
                {day.rooms.map(room => {
                  const c = rc(room.id)
                  return (
                    <a
                      key={room.id}
                      href={`#${day.id}-${room.id}`}
                      className="flex items-center gap-1.5 rounded-full border border-surface-border bg-white px-3 py-1 text-xs font-medium text-gray-600 transition hover:border-purple-300 hover:text-gray-900"
                    >
                      <span className={`h-2 w-2 shrink-0 rounded-full ${c.dot}`} />
                      {room.name}
                      <span className="text-gray-400">{room.items.length}</span>
                    </a>
                  )
                })}
              </div>

              {/* Room sections */}
              <div className="space-y-10">
                {day.rooms.map(room => (
                  <RoomSection
                    key={room.id}
                    dayId={day.id}
                    room={room}
                    lang={lang}
                  />
                ))}
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

function RoomSection({ dayId, room, lang }: { dayId: string; room: AgendaRoom; lang: string }) {
  const c = rc(room.id)
  return (
    <section id={`${dayId}-${room.id}`} className="scroll-mt-20">
      {/* Room header */}
      <div className="mb-3 flex items-center gap-2.5">
        <span className={`h-3 w-3 shrink-0 rounded-full ${c.dot}`} />
        <h3 className="text-base font-bold text-gray-800 sm:text-lg">{room.name}</h3>
        <div className="h-px flex-1 bg-surface-border" />
      </div>

      {/* Talk list */}
      <div className="space-y-2 pl-5">
        {room.items.map(item => <TalkCard key={item.id} item={item} roomId={room.id} lang={lang} />)}
      </div>
    </section>
  )
}

function TalkCard({ item, roomId, lang }: { item: AgendaItem; roomId: string; lang: string }) {
  const c = rc(roomId)
  const tl = typeLabels[item.type]
  const typeBadgeLabel = tl
    ? (lang === 'en' ? tl.en : lang === 'pt' ? tl.pt : tl.es)
    : null

  return (
    <article className="group rounded-xl border border-surface-border bg-white p-3.5 transition duration-200 hover:border-purple-200 hover:shadow-sm sm:flex sm:gap-4 sm:p-4">
      {/* Time */}
      <div className="mb-2 flex items-center gap-2 sm:mb-0 sm:w-24 sm:shrink-0 sm:flex-col sm:items-end sm:gap-0.5">
        <span className={`font-mono text-sm font-semibold ${c.time}`}>{item.time_start}</span>
        <span className="font-mono text-xs text-gray-400">– {item.time_end}</span>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
          {typeBadgeLabel && tl && (
            <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${tl.cls}`}>
              {typeBadgeLabel}
            </span>
          )}
          {item.village && (
            <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${c.badge}`}>
              {item.village}
            </span>
          )}
          {item.language === 'en' && (
            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-bold text-blue-700">EN</span>
          )}
        </div>
        <h4 className="text-sm font-semibold leading-snug text-gray-900 sm:text-base">{item.title}</h4>
        {item.speakers.length > 0 && (
          <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">{item.speakers.join(', ')}</p>
        )}
      </div>
    </article>
  )
}
