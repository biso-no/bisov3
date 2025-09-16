"use client"
import { AuthProvider } from "@/lib/hooks/useAuth"
import { ToastProvider } from "@/components/ui/use-toast"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <TooltipProvider>
        {children}
        </TooltipProvider>
      </ToastProvider>
    </AuthProvider>
  )
}
