'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { label: '📋 Monday Brief', href: '/dashboard' },
  { label: '🏗️ Job Board',    href: '/jobs' },
  { label: '📦 Materials',    href: '/materials' },
  { label: '💰 Invoices',     href: '/invoices' },
]

export function Nav() {
  const path = usePathname()
  return (
    <nav style={{ background: '#16213E', borderBottom: '1px solid #2A2A4E' }}
         className="flex gap-0 overflow-x-auto px-5">
      {tabs.map(tab => (
        <Link
          key={tab.href}
          href={tab.href}
          className="px-5 py-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors"
          style={{
            borderColor: path.startsWith(tab.href) ? '#F5C518' : 'transparent',
            color: path.startsWith(tab.href) ? '#F5C518' : '#8B8B9E',
          }}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}
