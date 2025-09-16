import { messagesFeatureFlag } from '@/lib/flags'
import { redirect } from 'next/navigation'

export default async function AlumniMessagesLayout({ children }: { children: React.ReactNode }) {
  const enabled = await messagesFeatureFlag()
  if (!enabled) {
    return redirect('/alumni')
  }
  return <>{children}</>
}


