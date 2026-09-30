import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EkoParty | Official Party Listing',
  description: 'Find and submit parties for EkoParty events',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-eko-50 via-white to-eko-100">
          {children}
        </div>
      </body>
    </html>
  )
}
