import { createAdminClient } from '@/lib/supabase/server'
import type { Job } from '@/types/database'

const phaseColors: Record<string, string> = {
  'rough-in':   'bg-blue-900/40 text-blue-300',
  'service':    'bg-purple-900/40 text-purple-300',
  'trim-out':   'bg-green-900/40 text-green-300',
  'inspection': 'bg-red-900/40 text-red-300',
  'complete':   'bg-green-900/60 text-green-400',
}

function MarginBadge({ margin }: { margin: number }) {
  const cls = margin >= 40
    ? 'bg-green-900/30 text-green-400'
    : margin >= 30
    ? 'bg-orange-900/30 text-orange-400'
    : 'bg-red-900/30 text-red-400'
  return <span className={`text-xs font-bold px-2 py-0.5 rounded ${cls}`}>{margin}%</span>
}

export default async function JobsPage() {
  const supabase = await createAdminClient()
  const { data: jobs } = await supabase.from('jobs').select('*').order('created_at')
  const allJobs: Job[] = jobs ?? []

  const active = allJobs.filter(j => j.status === 'active')
  const pipeline = allJobs.filter(j => j.status === 'pipeline')

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-[#16213E] overflow-hidden">
        <div className="grid grid-cols-6 gap-4 px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-white/10">
          <div className="col-span-2">Job / GC</div>
          <div>Phase</div>
          <div>Progress</div>
          <div>Margin</div>
          <div>Deadline</div>
        </div>
        {active.map(job => (
          <div key={job.id} className="grid grid-cols-6 gap-4 px-4 py-3 border-b border-white/5 hover:bg-white/[0.02] items-center">
            <div className="col-span-2">
              <div className="font-semibold text-white text-sm">{job.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">{job.gc_name} · {job.location}</div>
            </div>
            <div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${phaseColors[job.phase] ?? ''}`}>
                {job.phase}
              </span>
            </div>
            <div>
              <div className="h-1.5 rounded-full bg-white/10 w-24 overflow-hidden">
                <div
                  className={`h-full rounded-full ${job.progress >= 70 ? 'bg-green-500' : 'bg-yellow-400'}`}
                  style={{ width: `${job.progress}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">{job.progress}%</div>
            </div>
            <div><MarginBadge margin={job.margin} /></div>
            <div className="text-sm text-gray-300">{job.deadline ?? '—'}</div>
          </div>
        ))}
      </div>

      {pipeline.length > 0 && (
        <>
          <h2 className="text-base font-bold">Pipeline</h2>
          <div className="rounded-xl border border-white/10 bg-[#16213E] overflow-hidden">
            {pipeline.map(job => (
              <div key={job.id} className="flex items-center gap-4 px-4 py-3 border-b border-white/5 last:border-0">
                <div className="flex-1">
                  <div className="font-semibold text-white text-sm">{job.name}</div>
                  <div className="text-xs text-gray-400">{job.gc_name} · {job.location}</div>
                </div>
                <div className="text-sm text-yellow-400 font-bold">${job.contract_value.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
