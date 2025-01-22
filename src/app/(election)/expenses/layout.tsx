import '@/app/globals.css'
import { FormContextProvider, useFormContext  } from "./[expenseId]/formContext";
import { AuthProvider } from '@/lib/hooks/useAuth';
interface LayoutProps {
    children: React.ReactNode
}

export default function Expenselayout({children}: LayoutProps) {

    return (
        <AuthProvider>
        <FormContextProvider>{children}</FormContextProvider>
      </AuthProvider>




    )
}