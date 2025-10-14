"use client"
import { AuthProvider } from "@/lib/hooks/useAuth"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ToastProvider } from "@/components/ui/use-toast"

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
