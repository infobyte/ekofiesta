import 'server-only'

const dictionaries = {
  es: () => import('./dictionaries/es.json').then(m => m.default),
  en: () => import('./dictionaries/en.json').then(m => m.default),
  pt: () => import('./dictionaries/pt.json').then(m => m.default),
}

export type Locale = keyof typeof dictionaries

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)['es']>>

export const locales = Object.keys(dictionaries) as Locale[]

export const defaultLocale: Locale = 'es'

export const hasLocale = (locale: string): locale is Locale => locale in dictionaries

export const getDictionary = async (locale: Locale) => dictionaries[locale]()

// Intl locales for date/time formatting per language
export const intlLocale: Record<Locale, string> = {
  es: 'es-AR',
  en: 'en-US',
  pt: 'pt-BR',
}
