import { resourcesFeatureFlag } from '@/lib/flags'
import { redirect } from 'next/navigation'

export default async function AlumniResourcesLayout({ children }: { children: React.ReactNode }) {
  const enabled = await resourcesFeatureFlag()
  if (!enabled) {
    return redirect('/alumni')
  }
  return <>{children}</>
}


