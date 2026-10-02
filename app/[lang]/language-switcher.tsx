'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const languages = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
  { code: 'pt', label: 'PT' },
]

export default function LanguageSwitcher({ current }: { current: string }) {
  const pathname = usePathname()

  const pathFor = (code: string) => {
    const rest = pathname.replace(/^\/(es|en|pt)(?=\/|$)/, '')
    return `/${code}${rest}`
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-surface-border bg-surface-raised p-1">
      {languages.map(({ code, label }) => (
        <Link
          key={code}
          href={pathFor(code)}
          className={
            code === current
              ? 'rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-xs font-bold text-white'
              : 'rounded-full px-3 py-1 text-xs font-semibold text-gray-400 transition hover:text-white'
          }
        >
          {label}
        </Link>
      ))}
    </div>
  )
}
