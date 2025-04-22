"use client"
import { AuthProvider } from "@/lib/hooks/useAuth"
import { OnboardingProvider } from "@/components/onboarding/onboarding-provider"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <OnboardingProvider>
        {children}
      </OnboardingProvider>
    </AuthProvider>
  )
}
