import '@/app/globals.css'
import { FormProvider, useFormContext  } from "./[expenseId]/formContext";
interface LayoutProps {
    children: React.ReactNode
}

export default function Expenselayout({children}: LayoutProps) {

    return (
        <FormProvider>{children}</FormProvider>
    )
}