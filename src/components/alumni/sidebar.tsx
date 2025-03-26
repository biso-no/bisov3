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
    },
    {
      href: "/alumni/network",
      label: "Network",
      icon: Users,
      active: pathname === "/alumni/network",
    },
    {
      href: "/alumni/events",
      label: "Events",
      icon: Calendar,
      active: pathname.includes("/alumni/events"),
    },
    {
      href: "/alumni/mentoring",
      label: "Mentoring",
      icon: BookOpen,
      active: pathname.includes("/alumni/mentoring"),
    },
    {
      href: "/alumni/jobs",
      label: "Job Board",
      icon: Briefcase,
      active: pathname.includes("/alumni/jobs"),
    },
    {
      href: "/alumni/resources",
      label: "Resources",
      icon: Library,
      active: pathname.includes("/alumni/resources"),
    }
  ]
  
  const otherRoutes = [
    {
      href: "/alumni/profile",
      label: "My Profile",
      icon: FileText,
      active: pathname === "/alumni/profile",
    },
    {
      href: "/alumni/messages",
      label: "Messages",
      icon: MessageSquare,
      active: pathname === "/alumni/messages",
    },
    {
      href: "/alumni/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/alumni/settings",
    }
  ]
  
  return (
    <aside className="hidden md:flex h-full w-64 flex-col border-r bg-background/95 pt-16">
      <ScrollArea className="flex-1 py-6">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Main
          </h2>
          <div className="space-y-1">
            {mainRoutes.map((route) => (
              <Button
                key={route.href}
                asChild
                variant={route.active ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start",
                  route.active ? "bg-secondary/80 text-secondary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Link href={route.href}>
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
        <Separator className="my-4" />
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Personal
          </h2>
          <div className="space-y-1">
            {otherRoutes.map((route) => (
              <Button
                key={route.href}
                asChild
                variant={route.active ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start",
                  route.active ? "bg-secondary/80 text-secondary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Link href={route.href}>
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
} 