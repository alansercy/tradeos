import { createAdminClient } from '@/lib/supabase/server'
import type { Invoice } from '@/types/database'

function DaysBadge({ days }: { days: number }) {
  if (days > 30) return <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-900/30 text-red-400">{days}d late</span>
  if (days > 14) return <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-900/30 text-orange-400">{days}d</span>
  return <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-900/30 text-green-400">{days}d</span>
}

export default async function InvoicesPage() {
  const supabase = await createAdminClient()
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .order('days_outstanding', { ascending: false })

  const all: Invoice[] = invoices ?? []
  const total = all.reduce((s, i) => s + i.amount, 0)
  const pastDueAmt = all.filter(i => i.days_outstanding > 30).reduce((s, i) => s + i.amount, 0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/10 bg-[#16213E] p-4 text-center">
          <div className="text-2xl font-bold text-white">${total.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Total Outstanding</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#16213E] p-4 text-center">
          <div className="text-2xl font-bold text-red-400">${pastDueAmt.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Past Due 30+ Days</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#16213E] p-4 text-center">
          <div className="text-2xl font-bold text-white">{all.length}</div>
          <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Open Invoices</div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#16213E] overflow-hidden">
        <div className="grid grid-cols-5 gap-4 px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-white/10">
          <div>Invoice</div>
          <div>Client</div>
          <div>Amount</div>
          <div>Outstanding</div>
          <div>Status</div>
        </div>
        {all.map(inv => (
          <div key={inv.id} className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-white/5 last:border-0 items-center hover:bg-white/[0.02]">
            <div>
              <div className="text-sm font-bold text-yellow-400">{inv.invoice_number}</div>
              <div className="text-xs text-gray-500">Sent {inv.sent_date}</div>
            </div>
            <div className="text-sm text-white">{inv.client}</div>
            <div className="text-base font-bold text-white">${inv.amount.toLocaleString()}</div>
            <div><DaysBadge days={inv.days_outstanding} /></div>
            <div className="text-xs text-gray-400">{inv.follow_up_note ?? '—'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
