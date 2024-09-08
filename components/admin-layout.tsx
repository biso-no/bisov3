'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, FileText, Settings, Users, ChevronLeft, ChevronRight, CalendarIcon, Store, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from './ui/input'
import Breadcrumb from './breadcrumb'

interface AdminLayoutProps {
  children: ReactNode
}

interface NavItem {
  href: string
  icon: React.ElementType
  label: string
  subItems?: { href: string; label: string }[]
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const pathname = usePathname()
  const [role, setRole] = useState("admin")

  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded)

  const navItems: NavItem[] = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/pages', icon: FileText, label: 'Pages' },
    { href: '/admin/posts', icon: FileText, label: 'Posts' },
    { 
      href: '/admin/shop',
      icon: Store,
      label: 'Shop',
      subItems: [
        { href: '/admin/shop/orders', label: 'Orders' },
        { href: '/admin/shop/products', label: 'Products' },
        { href: '/admin/shop/customers', label: 'Customers' },
        { href: '/admin/shop/settings', label: 'Settings' },
      ]
    },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { 
      href: '/admin/settings', 
      icon: Settings, 
      label: 'Settings',
      subItems: [
        { href: '/admin/settings', label: 'Overview' },
        { href: '/admin/settings/profile', label: 'Profile' },
        { href: '/admin/settings/security', label: 'Security' },
      ]
    },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      <nav className={`bg-white shadow-sm ${
        isSidebarExpanded ? 'w-64' : 'w-20'
      } flex-shrink-0 flex flex-col justify-between transition-all duration-300 ease-in-out`}>
        <div>
          <div className="p-4 text-xl font-semibold">CMS Admin</div>
          <Accordion type="multiple" className="w-full">
            {navItems.map((item, index) => {
              const isActive = item.href === '/admin'
                ? pathname === '/admin' || pathname === '/admin/'
                : pathname.startsWith(item.href)
              
              if (item.subItems) {
                return (
                  <AccordionItem value={`item-${index}`} key={item.href}>
                    <AccordionTrigger className="px-4 py-2 text-sm">
                      <div className={`flex items-center ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>
                        <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                        {isSidebarExpanded && <span className="ml-3">{item.label}</span>}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="ml-6 mt-2">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.href}>
                            <Link 
                              href={subItem.href}
                              className={`flex items-center px-4 py-2 text-sm ${
                                pathname === subItem.href ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800'
                              }`}
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )
              }

              return (
                <li key={item.href} className="list-none">
                  <Link 
                    href={item.href} 
                    className={`flex items-center px-4 py-2 text-sm ${
                      isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                    {isSidebarExpanded && <span className="ml-3">{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </Accordion>
        </div>
        <button 
          onClick={toggleSidebar}
          className="p-4 mx-auto mb-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {isSidebarExpanded ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
        </button>
      </nav>
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
          <div className="flex items-center">
            <span className="text-2xl font-semibold text-gray-800">Welcome, {role.charAt(0).toUpperCase() + role.slice(1)}</span>
          </div>
          <div className="flex items-center">
            <Button variant="outline" className="mr-2">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <span>Schedule</span>
            </Button>
          </div>
        </header>
        <div className="container mx-auto px-6 py-8">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Breadcrumb />
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
        </header>
          {children}
        </div>
      </main>
    </div>
  )
}