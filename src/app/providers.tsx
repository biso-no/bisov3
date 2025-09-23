"use client"
import { AuthProvider } from "@/lib/hooks/useAuth"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
        <TooltipProvider>
        {children}
        </TooltipProvider>
    </AuthProvider>
  )
}
