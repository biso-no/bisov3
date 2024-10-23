import '@/app/globals.css'

interface LayoutProps {
    children: React.ReactNode
}

export const metadata = {
    title: 'Elections',
    description: 'Elections',
}

export default function Electionlayout({children}: LayoutProps) {

    return (
        <>
        {children}
        </>
    )
}