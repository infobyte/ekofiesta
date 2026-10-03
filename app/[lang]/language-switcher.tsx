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
    <div className="flex items-center font-mono text-xs">
      {languages.map(({ code, label }, i) => (
        <span key={code} className="flex items-center">
          {i > 0 && <span className="px-1 text-gray-300">/</span>}
          <Link
            href={pathFor(code)}
            className={
              code === current
                ? 'font-bold text-gray-900'
                : 'text-gray-400 transition hover:text-gray-900'
            }
          >
            {label}
          </Link>
        </span>
      ))}
    </div>
  )
}
