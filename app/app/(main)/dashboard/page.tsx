import { createAdminClient } from '@/lib/supabase/server'
import type { Job, Invoice, Material } from '@/types/database'

const phaseColors: Record<string, string> = {
  'rough-in':   'bg-blue-900/40 text-blue-300',
  'service':    'bg-purple-900/40 text-purple-300',
  'trim-out':   'bg-green-900/40 text-green-300',
  'inspection': 'bg-red-900/40 text-red-300',
  'complete':   'bg-green-900/60 text-green-400',
}

function ProgressBar({ value, color = 'yellow' }: { value: number; color?: string }) {
  const fill = color === 'green' ? 'bg-green-500' : color === 'orange' ? 'bg-orange-400' : 'bg-yellow-400'
  return (
    <div className="h-1 rounded-full bg-white/10 mt-2 overflow-hidden">
      <div className={`h-full rounded-full ${fill}`} style={{ width: `${value}%` }} />
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = await createAdminClient()

  const [jobsRes, invoicesRes, materialsRes] = await Promise.all([
    supabase.from('jobs').select('*').eq('status', 'active').order('created_at'),
    supabase.from('invoices').select('*').order('sent_date'),
    supabase.from('materials').select('*').eq('status', 'needed'),
  ])

  const jobs: Job[] = jobsRes.data ?? []
  const invoices: Invoice[] = invoicesRes.data ?? []
  const neededMaterials: Material[] = materialsRes.data ?? []

  const totalContract = jobs.reduce((s, j) => s + j.contract_value, 0)
  const totalOutstanding = invoices.reduce((s, i) => s + i.amount, 0)
  const avgMargin = jobs.length ? Math.round(jobs.reduce((s, j) => s + j.margin, 0) / jobs.length) : 0
  const pastDue = invoices.filter(i => i.days_outstanding > 30)

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {pastDue.length > 0 && (
        <div className="rounded-lg px-4 py-3 bg-red-900/20 border border-red-500/30 text-red-400 text-sm font-semibold">
          ⚠️ {pastDue.length} invoice{pastDue.length > 1 ? 's' : ''} 30+ days past due — follow up today
        </div>
      )}
      {neededMaterials.length > 0 && (
        <div className="rounded-lg px-4 py-3 bg-orange-900/20 border border-orange-500/30 text-orange-400 text-sm font-semibold">
          ⚡ {neededMaterials.length} material{neededMaterials.length > 1 ? 's' : ''} needed — confirm before crew leaves
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/10 bg-[#16213E] p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">${(totalContract / 1000).toFixed(0)}K</div>
          <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Open Contract Value</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#16213E] p-4 text-center">
          <div className="text-2xl font-bold text-red-400">${(totalOutstanding / 1000).toFixed(0)}K</div>
          <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Outstanding Invoices</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#16213E] p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{avgMargin}%</div>
          <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Avg Gross Margin</div>
        </div>
      </div>

      {/* Active Jobs */}
      <div>
        <h2 className="text-base font-bold mb-3">Active Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {jobs.map(job => (
            <div key={job.id} className="rounded-xl border border-white/10 bg-[#16213E] p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-bold text-white">{job.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{job.gc_name} · {job.location}</div>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${phaseColors[job.phase] ?? ''}`}>
                  {job.phase.toUpperCase()}
                </span>
              </div>
              <div className="flex gap-3 text-xs text-gray-400 mb-1">
                <span>Contract: <span className="text-white">${job.contract_value.toLocaleString()}</span></span>
                {job.deadline && <span>Due: <span className="text-yellow-400">{job.deadline}</span></span>}
              </div>
              <ProgressBar
                value={job.progress}
                color={job.progress >= 70 ? 'green' : job.progress >= 40 ? 'yellow' : 'orange'}
              />
              <div className="text-xs text-gray-500 mt-1">{job.progress}% complete</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
