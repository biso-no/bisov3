'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, FileText, Settings, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const pathname = usePathname()

  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded)

  const navItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/pages', icon: FileText, label: 'Pages' },
    { href: '/admin/posts', icon: FileText, label: 'Posts' },
    { href: '/admin/templates', icon: FileText, label: 'Templates' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      <nav className={`bg-white shadow-sm ${
        isSidebarExpanded ? 'w-64' : 'w-20'
      } flex-shrink-0 flex flex-col justify-between transition-all duration-300 ease-in-out`}>
        <div>
          <div className="p-4 text-xl font-semibold">CMS Admin</div>
          <ul className="mt-6">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <li key={item.href}>
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
          </ul>
        </div>
        <button 
          onClick={toggleSidebar}
          className="p-4 mx-auto mb-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {isSidebarExpanded ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
        </button>
      </nav>

      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}