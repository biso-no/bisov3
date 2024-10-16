import '@/app/globals.css'

interface LayoutProps {
    children: React.ReactNode
}

export default function Electionlayout({children}: LayoutProps) {

    return (
        <>
        {children}
        </>
    )
}