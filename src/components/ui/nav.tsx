"use client";

import React from 'react';
import Link from 'next/link';
import { redirect, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Receipt, 
  Home, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/actions/user';

interface UserLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const handleLogout = async () => {
  await signOut();
}

const UserLayout = ({ children }: UserLayoutProps) => {
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-blue-600">
            <h1 className="text-xl font-bold text-white">BI Student Organisation</h1>
          </div>
          <div className="flex flex-col flex-grow p-4 overflow-y-auto">
            <nav className="flex-1 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-50'}
                    `}
                  >
                    <item.icon className={`
                      h-5 w-5 mr-3
                      ${isActive ? 'text-blue-700' : 'text-gray-400'}
                    `} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:bg-gray-50"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-3 text-gray-400" />
                Logout

              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Company Name</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-white"
          >
            <div className="pt-5 pb-6 px-2">
              <div className="px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        flex items-center px-3 py-4 text-base font-medium rounded-lg
                        ${isActive 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-gray-700 hover:bg-gray-50'}
                      `}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className={`
                        h-6 w-6 mr-4
                        ${isActive ? 'text-blue-700' : 'text-gray-400'}
                      `} />
                      {item.name}
                    </Link>
                  );
                })}
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-4 text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={async () => {
                    setIsMobileMenuOpen(false);
                    await handleLogout();
                  }}
                >

                  <LogOut className="h-6 w-6 mr-4 text-gray-400" />
                  Logout

                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;