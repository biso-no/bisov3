import '@/app/globals.css'
import { FormProvider, useFormContext  } from "./[expenseId]/formContext";
import { AuthProvider } from '@/lib/hooks/useAuth';
import UserLayout from '@/components/ui/nav';
import { OnboardingProvider } from '@/components/onboarding/onboarding-provider';
import { ExpenseGuidelines } from './expense-guidelines';
interface LayoutProps {
    children: React.ReactNode
}

export default function Expenselayout({children}: LayoutProps) {

    return (
        <AuthProvider>
        <FormProvider>
        <UserLayout>
            <OnboardingProvider>
            <ExpenseGuidelines />
            {children}
            </OnboardingProvider>
            </UserLayout>
            </FormProvider>
      </AuthProvider>




    )
}