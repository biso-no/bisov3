import '@/app/globals.css'
import { Header } from '@/lib/components/Header'
import { Footer } from '@/lib/components/Footer'
import { AssistantFAB } from '@/components/assistant-ui/AssistantFAB'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header editMode={false} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {children}
          <div className="fixed bottom-6 right-6 z-50">
            <AssistantFAB api="/api/public-assistant" tooltip="Ask BISO" />
          </div>
        </div>
      </main>
      <Footer>
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
          <Footer.Link href="#">Our mission</Footer.Link>
          <Footer.Link href="#">Contact</Footer.Link>
          <Footer.Link href="#">Privacy</Footer.Link>
        </Footer.List>
      </Footer>
    </div>
  )
}


