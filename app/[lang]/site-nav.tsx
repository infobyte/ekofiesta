import Link from 'next/link'
import LanguageSwitcher from './language-switcher'

export type NavLabels = { parties: string; agenda: string; mcp: string }

export default function SiteNav({
  lang,
  active,
  labels,
}: {
  lang: string
  active: 'parties' | 'agenda' | 'mcp' | 'submit'
  labels: NavLabels
}) {
  const tabs = [
    { key: 'parties', href: `/${lang}`, label: labels.parties },
    { key: 'agenda', href: `/${lang}/agenda`, label: labels.agenda },
    { key: 'mcp', href: `/${lang}/mcp`, label: labels.mcp },
  ] as const

  return (
    <div className="sticky top-0 z-40 border-b border-surface-border/70 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href={`/${lang}`} className="shrink-0 text-base font-bold tracking-tight">
          eko<span className="text-gradient">.party</span>
        </Link>

        <nav className="flex items-center gap-0.5 overflow-x-auto">
          {tabs.map(tab =>
            tab.key === active ? (
              <span
                key={tab.key}
                className="whitespace-nowrap rounded-full bg-gray-900 px-3.5 py-1.5 text-xs font-semibold text-white"
              >
                {tab.label}
              </span>
            ) : (
              <Link
                key={tab.key}
                href={tab.href}
                className="whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                {tab.label}
              </Link>
            )
          )}
        </nav>

        <div className="shrink-0">
          <LanguageSwitcher current={lang} />
        </div>
      </div>
    </div>
  )
}
