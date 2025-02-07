import '@/app/globals.css'
import { FormProvider, useFormContext  } from "./[expenseId]/formContext";
import { AuthProvider } from '@/lib/hooks/useAuth';
import UserLayout from '@/components/ui/nav';
interface LayoutProps {
    children: React.ReactNode
}

export default function Expenselayout({children}: LayoutProps) {

    return (
        <AuthProvider>
        <FormProvider>
        <UserLayout>
            {children}
            </UserLayout>
            </FormProvider>
      </AuthProvider>




    )
}