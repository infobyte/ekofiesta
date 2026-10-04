import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../dictionaries'
import SiteNav from '../site-nav'
import { agenda } from './mock-agenda'
import type { AgendaDay } from './mock-agenda'

type Params = Promise<{ lang: string }>

export async function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }, { lang: 'pt' }]
}

// ── Color palette per room ─────────────────────────────────────────────────

const roomStyle: Record<string, { header: string; dot: string; card: string; border: string; time: string }> = {
  'maintrack':            { header: 'bg-purple-600 text-white',       dot: 'bg-purple-500',  card: 'bg-purple-50 border-l-2 border-purple-400', border: 'border-purple-200', time: 'text-purple-600' },
  'sala-d':               { header: 'bg-red-500 text-white',          dot: 'bg-red-400',     card: 'bg-red-50 border-l-2 border-red-400',       border: 'border-red-200',   time: 'text-red-500' },
  'sala-c1':              { header: 'bg-blue-600 text-white',         dot: 'bg-blue-500',    card: 'bg-blue-50 border-l-2 border-blue-400',     border: 'border-blue-200',  time: 'text-blue-600' },
  'sala-c2':              { header: 'bg-cyan-600 text-white',         dot: 'bg-cyan-500',    card: 'bg-cyan-50 border-l-2 border-cyan-400',     border: 'border-cyan-200',  time: 'text-cyan-600' },
  'sala-c3':              { header: 'bg-green-600 text-white',        dot: 'bg-green-500',   card: 'bg-green-50 border-l-2 border-green-400',   border: 'border-green-200', time: 'text-green-600' },
  'hack-the-talent-zone': { header: 'bg-pink-500 text-white',         dot: 'bg-pink-500',    card: 'bg-pink-50 border-l-2 border-pink-400',     border: 'border-pink-200',  time: 'text-pink-500' },
  'sala-a1':              { header: 'bg-orange-500 text-white',       dot: 'bg-orange-400',  card: 'bg-orange-50 border-l-2 border-orange-400', border: 'border-orange-200',time: 'text-orange-500' },
  'sala-a2':              { header: 'bg-amber-500 text-white',        dot: 'bg-amber-400',   card: 'bg-amber-50 border-l-2 border-amber-400',   border: 'border-amber-200', time: 'text-amber-600' },
  'sala-a3':              { header: 'bg-indigo-600 text-white',       dot: 'bg-indigo-500',  card: 'bg-indigo-50 border-l-2 border-indigo-400', border: 'border-indigo-200',time: 'text-indigo-600' },
  'sala-a4':              { header: 'bg-lime-600 text-white',         dot: 'bg-lime-500',    card: 'bg-lime-50 border-l-2 border-lime-400',     border: 'border-lime-200',  time: 'text-lime-600' },
  'sala-v1':              { header: 'bg-violet-600 text-white',       dot: 'bg-violet-500',  card: 'bg-violet-50 border-l-2 border-violet-400', border: 'border-violet-200',time: 'text-violet-600' },
  'sala-e':               { header: 'bg-rose-500 text-white',         dot: 'bg-rose-400',    card: 'bg-rose-50 border-l-2 border-rose-400',     border: 'border-rose-200',  time: 'text-rose-500' },
}

const fallbackStyle = { header: 'bg-gray-500 text-white', dot: 'bg-gray-400', card: 'bg-gray-50 border-l-2 border-gray-300', border: 'border-gray-200', time: 'text-gray-500' }

function rs(id: string) { return roomStyle[id] ?? fallbackStyle }

// ── Grid math ──────────────────────────────────────────────────────────────

const SLOT = 5       // minutes per CSS grid row
const SLOT_PX = 11   // px per slot → 132px/hour

function parseMin(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function buildDayGrid(day: AgendaDay) {
  const all = day.rooms.flatMap(r => r.items)
  if (!all.length) return null

  const startMin = Math.floor(Math.min(...all.map(i => parseMin(i.time_start))) / 60) * 60
  const endMin   = Math.ceil( Math.max(...all.map(i => parseMin(i.time_end)))   / 60) * 60

  const toRow = (t: string) => Math.round((parseMin(t) - startMin) / SLOT) + 2 // row 1 = header

  const numSlots = (endMin - startMin) / SLOT

  const hourMarks: { label: string; row: number }[] = []
  for (let m = startMin; m <= endMin; m += 60) {
    hourMarks.push({
      label: `${String(Math.floor(m / 60)).padStart(2, '0')}:00`,
      row: (m - startMin) / SLOT + 2,
    })
  }

  return { toRow, numSlots, hourMarks, startMin }
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function AgendaPage({ params }: { params: Params }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  const t = dict.agenda

  const dayLabel = (day: AgendaDay) =>
    lang === 'en' ? day.label_en : lang === 'pt' ? day.label_pt : day.label_es

  const calLabel =
    lang === 'en' ? 'Add to calendar' : lang === 'pt' ? 'Adicionar ao calendário' : 'Agregar al calendario'

  return (
    <main className="min-h-screen bg-surface">
      <SiteNav
        lang={lang}
        active="agenda"
        labels={{ parties: dict.home.navParties, agenda: dict.home.navAgenda, mcp: dict.home.navMcp }}
      />

      {/* Hero */}
      <header className="hero-mesh">
        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 sm:pb-14 sm:pt-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-surface-border bg-white/80 py-1.5 pl-3 pr-4 text-xs font-medium text-gray-600 shadow-sm backdrop-blur">
            <span className="live-dot h-2 w-2 rounded-full bg-green-500" />
            {t.badge}
          </div>
          <h1 className="text-[2rem] font-bold leading-[1.08] tracking-tighter text-gray-900 sm:text-6xl md:text-7xl">
            <span className="block">{t.title1}</span>
            <span className="text-gradient block">{t.title2}</span>
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-base text-gray-500 sm:mt-5 sm:text-xl">{t.subtitle}</p>
        </div>
      </header>

      {/* Day pill nav */}
      <nav className="sticky top-14 z-30 border-b border-surface-border/70 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-1.5 overflow-x-auto px-4 py-2.5 sm:px-6">
          {agenda.map(day => (
            <a
              key={day.id}
              href={`#${day.id}`}
              className="whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold text-gray-500 transition hover:bg-gray-900 hover:text-white"
            >
              {dayLabel(day)}
            </a>
          ))}
        </div>
      </nav>

      {/* Day grids */}
      <div className="space-y-16 py-10 sm:py-14">
        {agenda.map(day => {
          const grid = buildDayGrid(day)
          if (!grid) return null
          const { toRow, numSlots, hourMarks } = grid
          const rooms = day.rooms

          const TIME_COL = 52   // px
          const ROOM_COL = 188  // px min per room

          return (
            <section key={day.id} id={day.id} className="scroll-mt-32">
              {/* Day heading */}
              <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mb-4 flex items-baseline gap-3">
                  <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{dayLabel(day)}</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-surface-border to-transparent" />
                  <span className="text-xs text-gray-400">
                    ← {lang === 'en' ? 'scroll to see all rooms' : lang === 'pt' ? 'deslize para ver todas as salas' : 'deslizá para ver todas las salas'} →
                  </span>
                </div>
              </div>

              {/* Schedule grid */}
              <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="overflow-x-auto rounded-3xl border border-surface-border bg-white shadow-sm">
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `${TIME_COL}px repeat(${rooms.length}, minmax(${ROOM_COL}px, 1fr))`,
                      gridTemplateRows: `40px repeat(${numSlots}, ${SLOT_PX}px)`,
                      minWidth: TIME_COL + rooms.length * ROOM_COL,
                    }}
                  >
                    {/* ── Header row ── */}
                    {/* Time header */}
                    <div
                      style={{ gridColumn: 1, gridRow: 1 }}
                      className="sticky left-0 z-20 flex items-center justify-center bg-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-500"
                    />
                    {/* Room headers */}
                    {rooms.map((room, ri) => (
                      <div
                        key={room.id}
                        style={{ gridColumn: ri + 2, gridRow: 1 }}
                        className={`flex items-center justify-center px-2 text-center text-xs font-bold ${rs(room.id).header}`}
                      >
                        {room.name}
                      </div>
                    ))}

                    {/* ── Hour grid lines + time labels ── */}
                    {hourMarks.map(({ label, row }) => (
                      <div key={label} style={{ gridColumn: `1 / ${rooms.length + 2}`, gridRow: row }} className="contents">
                        {/* Time label */}
                        <div
                          style={{ gridColumn: 1, gridRow: row }}
                          className="sticky left-0 z-10 flex items-start justify-end border-t border-gray-200 bg-gray-50 pr-2 pt-0.5 font-mono text-[10px] font-semibold text-gray-400"
                        >
                          {label}
                        </div>
                        {/* Horizontal rule across all room columns */}
                        {rooms.map((_, ri) => (
                          <div
                            key={ri}
                            style={{ gridColumn: ri + 2, gridRow: row }}
                            className="border-t border-gray-100 bg-white"
                          />
                        ))}
                      </div>
                    ))}

                    {/* ── Background fill for between-hour slots ── */}
                    {/* (rooms get white bg from the hour-line divs; we need filler for non-hour rows) */}
                    {/* Time column sticky background */}
                    <div
                      style={{ gridColumn: 1, gridRow: `2 / ${numSlots + 2}` }}
                      className="sticky left-0 z-10 bg-gray-50"
                    />

                    {/* ── Talk cards ── */}
                    {rooms.map((room, ri) =>
                      room.items.map(item => {
                        const startRow = toRow(item.time_start)
                        const endRow   = toRow(item.time_end)
                        const spanRows = endRow - startRow
                        const c = rs(room.id)
                        return (
                          <div
                            key={item.id}
                            style={{
                              gridColumn: ri + 2,
                              gridRow: `${startRow} / ${endRow}`,
                              height: spanRows * SLOT_PX - 2,
                              margin: '1px',
                              zIndex: 5,
                            }}
                            className={`group/talk overflow-hidden rounded-lg p-1.5 shadow-sm ${c.card}`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <p className={`font-mono text-[9px] font-semibold ${c.time}`}>
                                {item.time_start}
                              </p>
                              <a
                                href={`/api/agenda/${item.id}`}
                                title={calLabel}
                                aria-label={`${calLabel}: ${item.title}`}
                                className="-mr-0.5 -mt-0.5 rounded p-0.5 text-[10px] leading-none opacity-30 transition hover:opacity-100 group-hover/talk:opacity-60"
                              >
                                📅
                              </a>
                            </div>
                            <p className="mt-0.5 text-[11px] font-bold leading-tight text-gray-900"
                               style={{ display: '-webkit-box', WebkitLineClamp: spanRows >= 9 ? 3 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {item.title}
                            </p>
                            {item.speakers.length > 0 && spanRows >= 7 && (
                              <p className="mt-0.5 truncate text-[10px] text-gray-500">
                                {item.speakers[0]}{item.speakers.length > 1 ? ` +${item.speakers.length - 1}` : ''}
                              </p>
                            )}
                            {item.language === 'en' && (
                              <span className="mt-0.5 inline-block rounded bg-blue-100 px-1 text-[8px] font-bold text-blue-700">EN</span>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      {/* Footer */}
      <footer className="border-t border-surface-border bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-base font-bold tracking-tight">
            eko<span className="text-gradient">.party</span>
          </p>
          <p className="mt-2 text-sm text-gray-400">{dict.home.footer}</p>
          <p className="mt-1 text-xs text-gray-300">{t.sourceNote}</p>
        </div>
      </footer>
    </main>
  )
}
