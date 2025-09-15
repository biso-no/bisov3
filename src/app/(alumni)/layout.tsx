export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"
export const revalidate = 0

import { AlumniHeader } from "@/components/alumni/header"
import { AlumniSidebar } from "@/components/alumni/sidebar"
import { getFeatureFlags } from "./alumni/actions"
import "@/app/globals.css"


export default async function AlumniLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Fetch feature flags with cache busting to ensure freshness
  const timestamp = Date.now() // Add a timestamp to bust cache
  const flags = await getFeatureFlags()
  const featureFlags = {
    network: flags['alumni-network'] || false,
    events: flags['alumni-events'] || false,
    mentoring: flags['alumni-mentoring'] || false,
    jobs: flags['alumni-jobs'] || false,
    resources: flags['alumni-resources'] || false,
    messages: flags['alumni-messages'] || false,
    admin: flags['alumni-admin'] || false
  }
  
  return (
    <div className="relative h-full flex flex-col min-h-screen bg-primary-100">
      <AlumniHeader />
      <div className="relative flex-1 flex overflow-hidden">
        <AlumniSidebar featureFlags={featureFlags} />
        <main className="flex-1 pt-16 overflow-y-auto bg-linear-to-b from-primary-100 via-primary-90 to-primary-80">
          {/* Subtle background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-200 h-200 rounded-full bg-blue-accent/3 blur-3xl opacity-60" />
            <div className="absolute bottom-40 -left-20 w-120 h-120 rounded-full bg-gold-default/3 blur-3xl opacity-50" />
            <div className="absolute bottom-0 right-1/4 w-160 h-160 rounded-full bg-secondary-100/3 blur-3xl opacity-60" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(26,119,233,0.03),transparent_80%)]" />
          </div>
          
          <div className="container mx-auto py-6 px-4 md:px-6 relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 