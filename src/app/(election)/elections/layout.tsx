import '@/app/globals.css'
import { SignOutButton } from '@/components/sign-out-button'

interface LayoutProps {
    children: React.ReactNode
}

export const metadata = {
    title: 'Elections',
    description: 'Elections',
}

export default function Electionlayout({children}: LayoutProps) {

    return (
        <div className="flex flex-col">
        <div className="flex justify-end p-4">
          <SignOutButton />
        </div>
        {children}
        </div>
    )
}