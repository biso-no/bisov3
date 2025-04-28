"use client"
import { AuthProvider } from "@/lib/hooks/useAuth"
import { ToastProvider } from "@/components/ui/use-toast"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  )
}
