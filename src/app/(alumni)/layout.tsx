"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { AlumniHeader } from "@/components/alumni/header"
import { AlumniSidebar } from "@/components/alumni/sidebar"
import { Metadata } from "next"


export default function AlumniLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  
  return (
    <div className="relative h-full flex flex-col min-h-screen bg-primary-100">
      <AlumniHeader />
      <div className="relative flex-1 flex overflow-hidden">
        <AlumniSidebar />
        <main className="flex-1 pt-16 overflow-y-auto bg-gradient-to-b from-primary-100 via-primary-90 to-primary-80">
          {/* Subtle background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[50rem] h-[50rem] rounded-full bg-blue-accent/3 blur-3xl opacity-60" />
            <div className="absolute bottom-40 -left-20 w-[30rem] h-[30rem] rounded-full bg-gold-default/3 blur-3xl opacity-50" />
            <div className="absolute bottom-0 right-1/4 w-[40rem] h-[40rem] rounded-full bg-secondary-100/3 blur-3xl opacity-60" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(26,119,233,0.03),transparent_80%)]" />
          </div>
          
          <div className={cn(
            "container mx-auto py-6 px-4 md:px-6 relative z-10",
            pathname.includes("/profile") && "max-w-4xl",
            pathname.includes("/events/") && "max-w-5xl"
          )}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 