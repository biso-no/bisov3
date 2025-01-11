import '@/app/globals.css'
import { FormContextProvider, useFormContext  } from "./[expenseId]/formContext";
interface LayoutProps {
    children: React.ReactNode
}

export default function Expenselayout({children}: LayoutProps) {

    return (
        <>
        <FormContextProvider>{children}</FormContextProvider>
        </>
    )
}