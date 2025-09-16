import { networksFeatureFlag } from '@/lib/flags'
import { redirect } from 'next/navigation'

export default async function AlumniNetworkLayout({ children }: { children: React.ReactNode }) {
  const enabled = await networksFeatureFlag()
  if (!enabled) {
    return redirect('/alumni')
  }
  return <>{children}</>
}


