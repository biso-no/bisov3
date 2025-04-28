"use client"
import { AuthProvider } from "@/lib/hooks/useAuth"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
        {children}
    </AuthProvider>
  )
}
