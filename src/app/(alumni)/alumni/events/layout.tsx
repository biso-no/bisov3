import { eventsFeatureFlag } from '@/lib/flags'
import { redirect } from 'next/navigation'

export default async function AlumniEventsLayout({ children }: { children: React.ReactNode }) {
  const enabled = await eventsFeatureFlag()
  if (!enabled) {
    return redirect('/alumni')
  }
  return <>{children}</>
}


