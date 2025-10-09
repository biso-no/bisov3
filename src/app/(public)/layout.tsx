import "@/app/globals.css";

import { AssistantModal } from "@/components/ai/public";
import { PublicProviders } from "@/components/layout/public-providers";
import { Footer } from "@/lib/components/Footer";
import { Header } from "@/lib/components/Header";
import { Sparkles } from "lucide-react";

// Anonymous session is now handled automatically by middleware
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <PublicProviders>
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-surface opacity-[0.35]" />
        <div
          aria-hidden
          className="pointer-events-none absolute left-[-20%] top-[-35%] h-[32rem] w-[32rem] rounded-full bg-brand-hero opacity-60 blur-[180px] sm:left-[5%] sm:h-[36rem] sm:w-[36rem]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-25%] right-[-10%] h-[28rem] w-[28rem] rounded-full bg-gold-muted/60 blur-[180px]"
        />

        <Header editMode={false} />

        <main className="relative z-10 flex-1 pb-20 pt-8 sm:pt-10 lg:pb-28">
          <div className="container mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
          <div className="pointer-events-none absolute inset-x-[10%] bottom-0 mx-auto h-48 max-w-5xl rounded-full bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
        </main>

        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 sm:bottom-8 sm:right-8">
          <div className="glass-elevated flex items-center gap-3 rounded-full px-4 py-2 shadow-card-soft">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100/90 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="text-sm font-semibold text-primary-90">
              Trenger du hjelp? Vår assistent er klar.
            </div>
          </div>
          <AssistantModal />
        </div>

        <Footer className="relative z-10 border-t border-primary/10 bg-white/85 backdrop-blur">
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
  );
}
