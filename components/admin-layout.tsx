'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { Input } from './ui/input'
import Breadcrumb from './breadcrumb'
import { LayoutDashboard, FileText, Settings, Users, ChevronLeft, ChevronRight, CalendarIcon, Store, Search, VoteIcon } from 'lucide-react'

interface AdminLayoutProps {
  children: ReactNode
  roles: string[]  // Pass roles from parent component
}

interface NavItem {
  href: string
  icon: React.ElementType
  label: string
  roles: string[]  // Specify roles that can access this item
  subItems?: { href: string; label: string; roles?: string[] }[]
}

export function AdminLayout({ children, roles }: AdminLayoutProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const pathname = usePathname()

  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded)

  // Define navigation items with role restrictions
  const navItems: NavItem[] = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', roles: ['Admin'] },
    { href: '/admin/pages', icon: FileText, label: 'Pages', roles: ['Admin', 'pr'] },
    { href: '/admin/posts', icon: FileText, label: 'Posts', roles: ['Admin', 'pr'] },
    { 
      href: '/admin/shop',
      icon: Store,
      label: 'Shop',
      roles: ['Admin', 'finance'],
      subItems: [
        { href: '/admin/shop/orders', label: 'Orders', roles: ['Admin', 'finance'] },
        { href: '/admin/shop/products', label: 'Products', roles: ['Admin', 'finance'] },
        { href: '/admin/shop/customers', label: 'Customers', roles: ['Admin', 'finance'] },
        { href: '/admin/shop/settings', label: 'Settings', roles: ['Admin'] },
      ]
    },
    { href: '/admin/elections', icon: VoteIcon, label: 'Elections', roles: ['Admin', 'kk'] },
    { href: '/admin/users', icon: Users, label: 'Users', roles: ['Admin', 'hr', 'finance'] },
    { 
      href: '/admin/settings', 
      icon: Settings, 
      label: 'Settings',
      roles: ['Admin'],
      subItems: [
        { href: '/admin/settings', label: 'Overview', roles: ['Admin'] },
        { href: '/admin/settings/profile', label: 'Profile', roles: ['Admin'] },
        { href: '/admin/settings/security', label: 'Security', roles: ['Admin'] },
      ]
    },
  ]

  // Helper function to check if the user has access based on their roles
  const hasAccess = (itemRoles: string[]) => {
    return roles.some(role => itemRoles.includes(role))
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <nav className={`bg-gray-900 ${
        isSidebarExpanded ? 'w-64' : 'w-20'
      } flex-shrink-0 flex flex-col justify-between transition-all duration-300 ease-in-out`}>
        <div>
          <div className="p-4 text-xl font-semibold text-white">CMS Admin</div>
          <ul className="mt-6">
            {navItems.map((item) => {
              if (!hasAccess(item.roles)) return null // Hide items if the user doesn't have access

              const isActive = item.href === '/admin'
                ? pathname === '/admin' || pathname === '/admin/'
                : pathname.startsWith(item.href)

              return (
                <li key={item.href} className="mb-2">
                  <Link 
                    href={item.href} 
                    className={`flex items-center px-4 py-3 text-sm ${
                      isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                    } transition-colors duration-200 ease-in-out rounded-lg mx-2`}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    {isSidebarExpanded && <span className="ml-3">{item.label}</span>}
                  </Link>
                  {item.subItems && isSidebarExpanded && (
                    <ul className="ml-6 mt-2 space-y-1">
                      {item.subItems
                        .filter(subItem => hasAccess(subItem.roles || item.roles))  // Check access for subItems
                        .map((subItem) => (
                          <li key={subItem.href}>
                            <Link 
                              href={subItem.href}
                              className={`flex items-center px-4 py-2 text-sm ${
                                pathname === subItem.href ? 'text-blue-400' : 'text-gray-400 hover:text-gray-200'
                              } transition-colors duration-200 ease-in-out`}
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
        <button 
          onClick={toggleSidebar}
          className="p-4 mx-auto mb-4 text-gray-400 hover:text-white focus:outline-none transition-colors duration-200 ease-in-out"
        >
          {isSidebarExpanded ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
        </button>
      </nav>
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
          <div className="flex items-center">
            <span className="text-2xl font-semibold text-gray-800">Welcome, {roles.join(', ')}</span>
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
