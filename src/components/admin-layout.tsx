'use client'

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Breadcrumb from './breadcrumb';
import { RoleSwitcher } from './role-switcher';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  Store,
  Search,
  VoteIcon,
  LogOut,
  Bell,
  Building2,
} from 'lucide-react';
import { signOut } from '@/lib/actions/user';
import { Skeleton } from "@/components/ui/skeleton";

interface AdminLayoutProps {
  children: ReactNode;
  roles: string[];
  firstName: string;
}

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  roles: string[];
  subItems?: { href: string; label: string; roles?: string[] }[];
}

const SidebarItem = ({ 
  item, 
  isActive, 
  isExpanded, 
  pathname 
}: { 
  item: NavItem; 
  isActive: boolean; 
  isExpanded: boolean;
  pathname: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (item.subItems) {
      setIsOpen(item.subItems.some(subItem => pathname.startsWith(subItem.href)));
    }
  }, [pathname, item.subItems]);

  return (
    <motion.li
      initial={false}
      animate={{ backgroundColor: isActive ? 'rgb(37 99 235)' : 'transparent' }}
      className="mb-2 rounded-lg overflow-hidden"
    >
      <div className={cn(
          "flex items-center px-4 py-3 text-sm transition-all duration-200 ease-in-out rounded-lg mx-2",
          isActive 
            ? "bg-blue-600 text-white shadow-md" 
            : "text-gray-300 hover:bg-gray-800/50"
        )}>
        <Link
          href={item.href}
          className="flex-1 flex items-center"
        >
          <motion.div
            initial={false}
            animate={{ 
              color: isActive ? '#ffffff' : '#9ca3af',
              rotate: item.subItems && isOpen ? 90 : 0 
            }}
          >
            <item.icon className="h-5 w-5" />
          </motion.div>
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="ml-3"
            >
              {item.label}
            </motion.span>
          )}
        </Link>
        {item.subItems && isExpanded && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="ml-auto p-1 hover:bg-gray-700/50 rounded-md"
          >
            <ChevronRight className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "transform rotate-90"
            )} />
          </button>
        )}
      </div>
      {item.subItems && isExpanded && (
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="ml-6 mt-2 space-y-1 overflow-hidden"
            >
              {item.subItems.map((subItem) => (
                <motion.li
                  key={subItem.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                >
                  <Link
                    href={subItem.href}
                    className={cn(
                      "flex items-center px-4 py-2 text-sm transition-colors duration-200 ease-in-out rounded-lg",
                      pathname === subItem.href
                        ? "text-blue-400 bg-blue-500/10"
                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/30"
                    )}
                  >
                    {subItem.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </motion.li>
  );
};

export function AdminLayout({ children, roles, firstName }: AdminLayoutProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const [selectedRole, setSelectedRole] = useState(roles.includes('Admin') ? 'Admin' : roles[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);

  const navItems: NavItem[] = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', roles: ['Admin'] },
        /*
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
      ],
    },
    */
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
      ],
    },
    {
      href: '/admin/events',
      icon: CalendarIcon,
      label: 'Events',
      roles: ['Admin', 'pr'],
    },
    {
      href: '/admin/expenses',
      icon: CalendarIcon,
      label: 'Expenses',
      roles: ['Admin', 'finance'],
    },
    {
      href: '/admin/units',
      icon: Building2,
      label: 'Units',
      roles: ['Admin', 'hr', 'finance', 'pr'],
    },
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
      ],
    },
  ];

  const hasAccess = (itemRoles: string[]) => itemRoles.includes(selectedRole);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <motion.nav
        initial={false}
        animate={{ width: isSidebarExpanded ? 256 : 80 }}
        className="bg-gray-900 flex-shrink-0 flex flex-col justify-between shadow-xl"
      >
        <div>
          <motion.div
            className="p-4 flex items-center"
            initial={false}
            animate={{ justifyContent: isSidebarExpanded ? 'flex-start' : 'center' }}
          >
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
              {isSidebarExpanded ? 'BISO Admin' : 'BA'}
            </span>
          </motion.div>
          <ul className="mt-6">
            <AnimatePresence mode="wait">
              {navItems.map((item) => {
                if (!hasAccess(item.roles)) return null;

                const isActive =
                  item.href === '/admin'
                    ? pathname === '/admin' || pathname === '/admin/'
                    : pathname.startsWith(item.href);

                return (
                  <SidebarItem
                    key={item.href}
                    item={item}
                    isActive={isActive}
                    isExpanded={isSidebarExpanded}
                    pathname={pathname}
                  />
                );
              })}
            </AnimatePresence>
          </ul>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-4 mx-auto mb-4 text-gray-400 hover:text-white focus:outline-none 
                   transition-colors duration-200 ease-in-out hover:bg-gray-800 rounded-lg"
        >
          <motion.div
            animate={{ rotate: isSidebarExpanded ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft className="h-6 w-6" />
          </motion.div>
        </button>
      </motion.nav>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              {isLoading ? <Skeleton className="h-8 w-32" /> : `Welcome, ${firstName}`}
            </span>
            {roles.includes('Admin') && (
              <RoleSwitcher
                roles={roles}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
              />
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${firstName}`} />
              <AvatarFallback>{firstName.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleSignOut}
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <LogOut className="h-5 w-5" />
                </motion.div>
              ) : (
                <LogOut className="h-5 w-5" />
              )}
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b p-4
                           bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <Breadcrumb />
              <motion.div 
                className="relative ml-auto flex-1 md:grow-0"
                animate={{ width: isSearchOpen ? '100%' : 'auto' }}
              >
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]
                           focus:w-full transition-all duration-300 ease-in-out"
                  onFocus={() => setIsSearchOpen(true)}
                  onBlur={() => setIsSearchOpen(false)}
                />
              </motion.div>
            </header>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}