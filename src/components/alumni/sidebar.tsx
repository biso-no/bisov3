"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BookOpen, 
  Briefcase, 
  Library,
  FileText,
  MessageSquare,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function AlumniSidebar() {
  const pathname = usePathname()
  
  const mainRoutes = [
    {
      href: "/alumni",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/alumni",
      color: "text-blue-accent"
    },
    {
      href: "/alumni/network",
      label: "Network",
      icon: Users,
      active: pathname === "/alumni/network",
      color: "text-secondary-100"
    },
    {
      href: "/alumni/events",
      label: "Events",
      icon: Calendar,
      active: pathname.includes("/alumni/events"),
      color: "text-gold-default"
    },
    {
      href: "/alumni/mentoring",
      label: "Mentoring",
      icon: BookOpen,
      active: pathname.includes("/alumni/mentoring"),
      color: "text-gold-strong"
    },
    {
      href: "/alumni/jobs",
      label: "Job Board",
      icon: Briefcase,
      active: pathname.includes("/alumni/jobs"),
      color: "text-blue-accent"
    },
    {
      href: "/alumni/resources",
      label: "Resources",
      icon: Library,
      active: pathname.includes("/alumni/resources"),
      color: "text-secondary-100"
    }
  ]
  
  const otherRoutes = [
    {
      href: "/alumni/profile",
      label: "My Profile",
      icon: FileText,
      active: pathname === "/alumni/profile",
      color: "text-blue-accent"
    },
    {
      href: "/alumni/messages",
      label: "Messages",
      icon: MessageSquare,
      active: pathname === "/alumni/messages",
      color: "text-secondary-100"
    },
    {
      href: "/alumni/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/alumni/settings",
      color: "text-gold-default"
    }
  ]
  
  return (
    <aside className="hidden md:flex h-full w-64 flex-col border-r border-secondary-100/10 bg-primary-90/60 backdrop-blur-md pt-16">
      <ScrollArea className="flex-1 py-6">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-white">
            Main
          </h2>
          <div className="space-y-1">
            {mainRoutes.map((route) => (
              <Button
                key={route.href}
                asChild
                variant={route.active ? "glass-dark" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start",
                  route.active ? 
                    "bg-primary-80/80 text-white border border-secondary-100/20" : 
                    "text-gray-300 hover:text-white hover:bg-primary-80/40"
                )}
              >
                <Link href={route.href} className="flex items-center">
                  <route.icon className={cn("mr-2 h-4 w-4", route.active ? route.color : "text-gray-300")} />
                  <span>{route.label}</span>
                  {route.active && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-accent to-secondary-100" />
                  )}
                </Link>
              </Button>
            ))}
          </div>
        </div>
        <Separator className="my-4 bg-secondary-100/10" />
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-white">
            Personal
          </h2>
          <div className="space-y-1">
            {otherRoutes.map((route) => (
              <Button
                key={route.href}
                asChild
                variant={route.active ? "glass-dark" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start",
                  route.active ? 
                    "bg-primary-80/80 text-white border border-secondary-100/20" : 
                    "text-gray-300 hover:text-white hover:bg-primary-80/40"
                )}
              >
                <Link href={route.href} className="flex items-center">
                  <route.icon className={cn("mr-2 h-4 w-4", route.active ? route.color : "text-gray-300")} />
                  <span>{route.label}</span>
                  {route.active && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-accent to-secondary-100" />
                  )}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
} 