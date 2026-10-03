import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '../dictionaries'
import SiteNav from '../site-nav'

type Params = Promise<{ lang: string }>

export async function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }, { lang: 'pt' }]
}

const TOOLS = [
  {
    name: 'list_parties',
    desc_es: 'Lista las fiestas filtrando por edición y estado (pending / approved / rejected).',
    desc_en: 'List parties filtered by edition and status (pending / approved / rejected).',
    desc_pt: 'Lista as festas filtrando por edição e status (pending / approved / rejected).',
  },
  {
    name: 'get_party',
    desc_es: 'Obtiene los detalles completos de una fiesta por su UUID.',
    desc_en: 'Get full details of a party by UUID.',
    desc_pt: 'Obtém os detalhes completos de uma festa pelo UUID.',
  },
  {
    name: 'get_pending_parties',
    desc_es: 'Devuelve la cola de moderación: fiestas pendientes de aprobación.',
    desc_en: 'Returns the moderation queue: parties awaiting approval.',
    desc_pt: 'Retorna a fila de moderação: festas aguardando aprovação.',
  },
  {
    name: 'submit_party',
    desc_es: 'Envía una nueva fiesta al listado (queda en estado "pending" hasta ser aprobada).',
    desc_en: 'Submit a new party to the listing (stays "pending" until approved).',
    desc_pt: 'Envia uma nova festa para o listado (fica "pending" até ser aprovada).',
  },
  {
    name: 'approve_party',
    desc_es: 'Aprueba una fiesta pendiente para que aparezca en el listado público.',
    desc_en: 'Approve a pending party so it appears on the public listing.',
    desc_pt: 'Aprova uma festa pendente para que apareça no listado público.',
  },
  {
    name: 'reject_party',
    desc_es: 'Rechaza una fiesta pendiente con razón opcional.',
    desc_en: 'Reject a pending party with an optional reason.',
    desc_pt: 'Rejeita uma festa pendente com razão opcional.',
  },
  {
    name: 'fetch_eko_agenda',
    desc_es: 'Intenta obtener la agenda de ekoparty.org/agenda-2026/ (mejor esfuerzo — la página es JS-rendered).',
    desc_en: 'Attempts to fetch the agenda from ekoparty.org/agenda-2026/ (best-effort — page is JS-rendered).',
    desc_pt: 'Tenta obter a agenda de ekoparty.org/agenda-2026/ (melhor esforço — página renderizada por JS).',
  },
]

const CONFIG_JSON = `{
  "mcpServers": {
    "eko-party": {
      "command": "node",
      "args": ["/RUTA/A/eko-party/mcp/server.mjs"],
      "env": {
        "SUPABASE_URL": "https://xoyklzqycjgwlmspmjdi.supabase.co",
        "SUPABASE_KEY": "sb_publishable_5kLgKgcVfJqsxleOU0eICw_oivAxDYk"
      }
    }
  }
}`

export default async function McpPage({ params }: { params: Params }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  const t = dict.mcp
  const th = dict.home

  const toolDesc = (tool: typeof TOOLS[number]) =>
    lang === 'en' ? tool.desc_en : lang === 'pt' ? tool.desc_pt : tool.desc_es

  return (
    <main className="min-h-screen bg-surface">
      <SiteNav
        lang={lang}
        active="mcp"
        labels={{ parties: th.navParties, agenda: th.navAgenda, mcp: th.navMcp }}
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
          <p className="mt-4 max-w-2xl text-pretty text-base text-gray-500 sm:mt-5 sm:text-xl">{t.subtitle}</p>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="space-y-12">

          {/* Requirements */}
          <section className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
            <h2 className="mb-1.5 font-bold text-yellow-800">{t.prereqTitle}</h2>
            <p className="text-sm text-yellow-700">{t.prereqBody}</p>
          </section>

          {/* Step 1 */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-gray-900">{t.step1Title}</h2>
            <div className="overflow-x-auto rounded-xl bg-gray-950 p-5">
              <pre className="text-sm text-green-400">
                <code>{`git clone https://gitlab.com/faradaysec/eko-party.git
cd eko-party`}</code>
              </pre>
            </div>
          </section>

          {/* Step 2 */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-gray-900">{t.step2Title}</h2>
            <div className="overflow-x-auto rounded-xl bg-gray-950 p-5">
              <pre className="text-sm text-green-400">
                <code>{`cd mcp
npm install`}</code>
              </pre>
            </div>
          </section>

          {/* Step 3 */}
          <section>
            <h2 className="mb-2 text-xl font-bold text-gray-900">{t.step3Title}</h2>
            <p className="mb-2 text-sm text-gray-500">{t.step3Body}</p>
            <ul className="mb-4 space-y-1 text-xs text-gray-400">
              <li><code className="rounded bg-surface-raised px-1.5 py-0.5">{t.step3FileMac}</code></li>
              <li><code className="rounded bg-surface-raised px-1.5 py-0.5">{t.step3FileWin}</code></li>
            </ul>
            <div className="overflow-x-auto rounded-xl bg-gray-950 p-5">
              <pre className="text-sm text-cyan-300">
                <code>{CONFIG_JSON}</code>
              </pre>
            </div>
            <p className="mt-3 text-xs text-gray-400">{t.step3PathNote}</p>
          </section>

          {/* Step 4 */}
          <section>
            <h2 className="mb-2 text-xl font-bold text-gray-900">{t.step4Title}</h2>
            <p className="text-sm text-gray-500">{t.step4Body}</p>
          </section>

          {/* Tools */}
          <section>
            <h2 className="mb-2 text-xl font-bold text-gray-900">{t.toolsTitle}</h2>
            <p className="mb-5 text-sm text-gray-500">{t.toolsSubtitle}</p>
            <div className="space-y-3">
              {TOOLS.map(tool => (
                <div
                  key={tool.name}
                  className="flex flex-col gap-1 rounded-xl border border-surface-border bg-white p-4 sm:flex-row sm:items-start sm:gap-4"
                >
                  <code className="shrink-0 rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700 sm:mt-0.5">
                    {tool.name}
                  </code>
                  <p className="text-sm text-gray-600">{toolDesc(tool)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Source code */}
          <section className="rounded-2xl border border-surface-border bg-surface-raised p-6">
            <h2 className="mb-1 font-bold text-gray-900">{t.sourceTitle}</h2>
            <p className="mb-3 text-sm text-gray-500">{t.sourceBody}</p>
            <a
              href="https://gitlab.com/faradaysec/eko-party"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              {t.sourceLinkLabel}
            </a>
          </section>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-surface-border bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-base font-bold tracking-tight">
            eko<span className="text-gradient">.party</span>
          </p>
          <p className="mt-2 text-sm text-gray-400">{th.footer}</p>
        </div>
      </footer>
    </main>
  )
}
