import "@/app/globals.css"

import { AssistantModal } from "@/components/ai/public"
import { PublicProviders } from "@/components/layout/public-providers"
import { Footer } from "@/lib/components/Footer"
import { Header } from "@/lib/components/Header"

// Anonymous session is now handled automatically by middleware
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <PublicProviders>
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-10/20 via-background via-35% to-background"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-35%] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-secondary-20/50 blur-[180px] sm:top-[-28%] sm:h-[34rem] sm:w-[34rem]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 bottom-0 h-[22rem] w-[22rem] rounded-full bg-gold-muted/50 blur-[140px]"
        />

        <Header editMode={false} />

        <main className="relative z-10 flex-1 pb-16 pt-8 sm:pt-10 lg:pb-24">
          <div className="container mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-40 w-[80%] max-w-5xl rounded-full bg-gradient-to-t from-primary-10/20 via-transparent to-transparent" />
        </main>

        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 sm:bottom-8 sm:right-8">
          <AssistantModal />
        </div>

        <Footer className="relative z-10 border-t border-primary/10 bg-white/80 backdrop-blur">
          <Footer.List title="Explore">
            <Footer.Link href="/jobs">Jobs</Footer.Link>
            <Footer.Link href="/events">Events</Footer.Link>
            <Footer.Link href="/shop">Shop</Footer.Link>
            <Footer.Link href="/news">News</Footer.Link>
            <Footer.Link href="/units">Units</Footer.Link>
          </Footer.List>
          <Footer.List title="Campuses">
            <Footer.Link href="#">Oslo</Footer.Link>
            <Footer.Link href="#">Bergen</Footer.Link>
            <Footer.Link href="#">Trondheim</Footer.Link>
            <Footer.Link href="#">Stavanger</Footer.Link>
            <Footer.Link href="#">National</Footer.Link>
          </Footer.List>
          <Footer.List title="About BISO">
            <Footer.Link href="/about">About BISO</Footer.Link>
            <Footer.Link href="/partner">Become a Partner</Footer.Link>
            <Footer.Link href="#">Contact</Footer.Link>
            <Footer.Link href="#">Privacy</Footer.Link>
          </Footer.List>
        </Footer>
      </div>
    </PublicProviders>
  )
}

