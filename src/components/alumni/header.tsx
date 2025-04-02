"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Menu, Bell, Search, UserCircle, Command, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MobileNav } from "./mobile-nav"
import { useState, useEffect } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export function AlumniHeader() {
  const pathname = usePathname()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Sample search results (would be replaced with actual search logic)
  const searchResults = [
    { type: "Alumni", name: "Sarah Johnson", department: "Computer Science", year: "2019", href: "/alumni/network/sarah-johnson" },
    { type: "Alumni", name: "Michael Chen", department: "Business Admin", year: "2020", href: "/alumni/network/michael-chen" },
    { type: "Event", name: "Annual Spring Gala", date: "May 15, 2023", href: "/alumni/events/spring-gala" },
    { type: "Job", name: "Frontend Developer", company: "TechCorp", href: "/alumni/jobs/frontend-developer" },
    { type: "Resource", name: "Career Development Guide", href: "/alumni/resources/career-guide" },
  ]
  
  // Handle keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setCommandOpen(true)
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-secondary-100/10 bg-primary-90/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="glass-dark"
            size="icon"
            className="md:hidden"
            onClick={() => setShowMobileMenu(true)}
          >
            <Menu className="h-5 w-5 text-secondary-100" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/alumni" className="hidden md:flex items-center gap-2 group">
            <Image 
              src="/images/biso-dare-to-be-more-dark.png" 
              alt="BISO Alumni" 
              width={160} 
              height={50} 
              className="group-hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="glass-dark" 
                className="relative w-64 justify-between px-3 text-gray-400 border-secondary-100/20 hover:border-secondary-100/30"
              >
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-secondary-100" />
                  <span>Search anything...</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-secondary-100/30 bg-primary-80/50 px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-dark border-secondary-100/20 backdrop-blur-xl p-0 max-w-2xl w-full overflow-hidden">
              <div className="flex items-center border-b border-secondary-100/20 px-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-accent/10">
                  <Search className="h-3.5 w-3.5 text-secondary-100" />
                </div>
                <Input
                  className="flex-1 border-0 rounded-none h-14 bg-transparent shadow-none focus-visible:ring-0 text-base text-white placeholder:text-gray-400 pl-3"
                  placeholder="Search for people, events, jobs, resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border border-secondary-100/30 bg-primary-80/50 px-1.5 font-mono text-xs font-medium opacity-100 flex text-gray-400">
                  ESC
                </kbd>
              </div>
              
              <div className="py-2 max-h-[60vh] overflow-y-auto">
                {searchQuery.length === 0 ? (
                  <div className="py-8 text-center text-gray-400">
                    <Command className="h-12 w-12 mx-auto mb-2 text-secondary-100/40" />
                    <p className="text-sm">Search the alumni network, events, jobs and resources</p>
                    <p className="text-xs mt-1">Try searching for a name, event, job, or resource</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {searchResults
                      .filter(item => 
                        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (item.type?.toLowerCase().includes(searchQuery.toLowerCase()))
                      )
                      .map((result, i) => (
                        <Button
                          key={i}
                          variant="ghost"
                          asChild
                          className="w-full justify-start px-4 py-2 h-auto text-left"
                          onClick={() => setCommandOpen(false)}
                        >
                          <Link href={result.href} className="flex items-start gap-4">
                            <div className={cn(
                              "rounded-full h-8 w-8 flex items-center justify-center",
                              result.type === "Alumni" && "bg-blue-accent/20",
                              result.type === "Event" && "bg-gold-default/20",
                              result.type === "Job" && "bg-secondary-100/20",
                              result.type === "Resource" && "bg-blue-strong/20"
                            )}>
                              <span className={cn(
                                "text-xs",
                                result.type === "Alumni" && "text-blue-accent",
                                result.type === "Event" && "text-gold-default",
                                result.type === "Job" && "text-secondary-100",
                                result.type === "Resource" && "text-blue-strong"
                              )}>
                                {result.type?.[0]}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-white">{result.name}</p>
                                <span className="text-xs text-gray-400">
                                  {result.type}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400">
                                {result.department || result.company || result.date || ''}
                                {result.year ? ` • Class of ${result.year}` : ''}
                              </p>
                            </div>
                          </Link>
                        </Button>
                      ))
                    }
                    {searchResults.filter(item => 
                      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      (item.type?.toLowerCase().includes(searchQuery.toLowerCase()))
                    ).length === 0 && (
                      <div className="py-8 text-center text-gray-400">
                        <p className="text-sm">No results found for &quot;{searchQuery}&quot;</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="border-t border-secondary-100/20 p-2">
                <div className="flex justify-between text-xs text-gray-400 px-2">
                  <div className="flex gap-3">
                    <div className="flex items-center gap-1">
                      <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border border-secondary-100/30 bg-primary-80/50 px-1.5 font-mono text-[10px] font-medium text-gray-400">↑↓</kbd>
                      <span>Navigate</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border border-secondary-100/30 bg-primary-80/50 px-1.5 font-mono text-[10px] font-medium text-gray-400">↵</kbd>
                      <span>Select</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">by</span>
                    <span className="font-semibold gradient-text text-xs">BISO</span>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="glass-dark"
            size="icon"
            className="md:hidden relative"
            onClick={() => setCommandOpen(true)}
          >
            <Search className="h-5 w-5 text-secondary-100" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="glass-dark"
                size="icon"
                className="relative group"
              >
                <Bell className="h-5 w-5 text-gray-300 group-hover:text-secondary-100 transition-colors" />
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-blue-accent animate-pulse"></span>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px] glass-dark border-secondary-100/20">
              <DropdownMenuLabel className="text-secondary-100">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-secondary-100/20" />
              <div className="flex flex-col gap-2 p-2">
                <p className="text-sm text-gray-300 text-center py-4">You have no new notifications</p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="glass-dark" size="icon" className="group">
                <UserCircle className="h-5 w-5 text-gray-300 group-hover:text-secondary-100 transition-colors" />
                <span className="sr-only">User account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-dark border-secondary-100/20">
              <DropdownMenuLabel className="text-secondary-100">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-secondary-100/20" />
              <DropdownMenuItem asChild>
                <Link href="/alumni/profile" className="text-gray-300 hover:text-white focus:text-white focus:bg-blue-accent/20">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/alumni/settings" className="text-gray-300 hover:text-white focus:text-white focus:bg-blue-accent/20">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-secondary-100/20" />
              <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white focus:bg-blue-accent/20">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <MobileNav open={showMobileMenu} onOpenChange={setShowMobileMenu} />
    </header>
  )
} 