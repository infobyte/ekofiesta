import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['es', 'en', 'pt']
const defaultLocale = 'es'

function getLocale(request: NextRequest): string {
  // Spanish is the default; only switch if the browser clearly prefers en/pt
  const accept = request.headers.get('accept-language') ?? ''
  for (const part of accept.split(',')) {
    const code = part.split(';')[0].trim().toLowerCase().split('-')[0]
    if (locales.includes(code)) return code
  }
  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  if (pathnameHasLocale) return

  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  // Skip Next internals, API routes, and static files (anything with a dot)
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}
