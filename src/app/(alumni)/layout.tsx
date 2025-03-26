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
    <div className="relative h-full flex flex-col min-h-screen">
      <AlumniHeader />
      <div className="relative flex-1 flex overflow-hidden">
        <AlumniSidebar />
        <main className="flex-1 pt-16 overflow-y-auto bg-gradient-to-b from-background via-background/95 to-background/90">
          <div className={cn(
            "container mx-auto py-6 px-4 md:px-6",
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