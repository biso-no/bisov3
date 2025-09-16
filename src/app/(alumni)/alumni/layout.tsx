import '@/app/globals.css'
import { getLoggedInUser } from '@/lib/actions/user'
import { redirect } from 'next/navigation'
import { PublicProviders } from '@/components/layout/public-providers'

export default async function AlumniLayout({ children }: { children: React.ReactNode }) {
  const user = await getLoggedInUser()
  if (!user) {
    return redirect('/auth/login')
  }

  return (
    <PublicProviders>
      {children}
    </PublicProviders>
  )
}


