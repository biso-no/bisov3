import { jobsFeatureFlag } from '@/lib/flags'
import { redirect } from 'next/navigation'

export default async function AlumniJobsLayout({ children }: { children: React.ReactNode }) {
  const enabled = await jobsFeatureFlag()
  if (!enabled) {
    return redirect('/alumni')
  }
  return <>{children}</>
}


