import { createAdminClient } from '@/lib/supabase/server'
import type { Job, Material } from '@/types/database'

const statusTag: Record<string, string> = {
  'on-site': 'bg-green-900/30 text-green-400',
  'ordered': 'bg-orange-900/30 text-orange-400',
  'needed':  'bg-red-900/30 text-red-400',
}

export default async function MaterialsPage() {
  const supabase = await createAdminClient()
  const [jobsRes, matsRes] = await Promise.all([
    supabase.from('jobs').select('id, name, phase').eq('status', 'active'),
    supabase.from('materials').select('*').order('created_at'),
  ])

  const jobs: Pick<Job, 'id' | 'name' | 'phase'>[] = jobsRes.data ?? []
  const mats: Material[] = matsRes.data ?? []

  const neededCount = mats.filter(m => m.status === 'needed').length

  return (
    <div className="space-y-4">
      {neededCount > 0 && (
        <div className="rounded-lg px-4 py-3 bg-red-900/20 border border-red-500/30 text-red-400 text-sm font-semibold">
          🚨 {neededCount} item{neededCount > 1 ? 's' : ''} NEEDED — confirm before crew leaves
        </div>
      )}

      {jobs.map(job => {
        const jobMats = mats.filter(m => m.job_id === job.id)
        if (jobMats.length === 0) return null
        return (
          <div key={job.id} className="rounded-xl border border-white/10 bg-[#16213E] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="font-bold text-white">{job.name}</div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/10 text-gray-300 uppercase">
                {job.phase}
              </span>
            </div>
            {jobMats.map(mat => (
              <div key={mat.id} className="flex items-start gap-3 px-4 py-3 border-b border-white/5 last:border-0">
                <div className="flex-1">
                  <div className="text-sm text-white">{mat.item}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {mat.quantity} {mat.unit}
                    {mat.source ? ` · ${mat.source}` : ''}
                    {mat.notes ? ` · ${mat.notes}` : ''}
                  </div>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 ${statusTag[mat.status]}`}>
                  {mat.status === 'on-site' ? 'ON-SITE' : mat.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
