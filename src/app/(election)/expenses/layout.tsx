import '@/app/globals.css'

interface LayoutProps {
    children: React.ReactNode
}

export default function Expenselayout({children}: LayoutProps) {

    return (
        <>
        {children}
        </>
    )
}