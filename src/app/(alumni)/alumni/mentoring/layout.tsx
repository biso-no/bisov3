import { mentoringFeatureFlag } from '@/lib/flags'
import { redirect } from 'next/navigation'

export default async function AlumniMentoringLayout({ children }: { children: React.ReactNode }) {
  const enabled = await mentoringFeatureFlag()
  if (!enabled) {
    return redirect('/alumni')
  }
  return <>{children}</>
}


