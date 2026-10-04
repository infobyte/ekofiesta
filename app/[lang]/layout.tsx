import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, locales } from './dictionaries'
import ChatWidget from './chat-widget'
import '../globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'EkoParty | Fiestas y Eventos',
  description: 'Encontrá y enviá fiestas de los eventos EkoParty',
}

export async function generateStaticParams() {
  return locales.map(lang => ({ lang }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)

  return (
    <html lang={lang} className={spaceGrotesk.variable}>
      <body className="font-sans antialiased">
        {children}
        <ChatWidget lang={lang} t={dict.chat} />
      </body>
    </html>
  )
}
