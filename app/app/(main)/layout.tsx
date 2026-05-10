import { Nav } from '@/components/nav'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header style={{ background: '#16213E', borderBottom: '2px solid #F5C518' }}
              className="sticky top-0 z-50 flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md flex items-center justify-center text-lg"
               style={{ background: '#F5C518', color: '#000' }}>⚡</div>
          <span className="text-xl font-bold tracking-widest" style={{ color: '#F5C518' }}>
            TRADE<span className="font-light text-white">OS</span>
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            4 crew active
          </span>
          <span className="px-3 py-1 rounded" style={{ background: '#0F3460', border: '1px solid #2A2A4E' }}>
            Week of <span className="text-yellow-400 font-semibold">May 11, 2026</span>
          </span>
        </div>
      </header>
      <Nav />
      <main className="max-w-5xl mx-auto px-5 py-5">{children}</main>
    </>
  )
}
