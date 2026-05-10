import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TradeOS — Electrical Operations',
  description: 'Job management for electrical SMBs',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ background: '#1A1A2E' }}>
        {children}
      </body>
    </html>
  )
}
