import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { BarChart, Users, FileText, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { createSessionClient } from "@/lib/appwrite"
import { Query } from "node-appwrite"
import '@/app/globals.css'

const allApps = [
  {
    name: "Elections",
    description: "Manage and participate in elections",
    icon: <BarChart className="h-6 w-6" />,
    href: "/elections",
    roles: ['users', 'Control Committee', 'Admin'],
  },
  {
    name: "Admin",
    description: "Access administrative functions",
    icon: <Users className="h-6 w-6" />,
    href: "/admin",
    roles: ['Admin'],
  }
]

export default async function Dashboard() {
  const { teams } = await createSessionClient()
  const userTeams = await teams.list([
    Query.equal('name', ['Admin', 'pr', 'finance', 'hr', 'Control Committee'])
  ]);
  const userRoles = userTeams.teams.map((team) => team.name);

  const availableApps = allApps.filter(app => 
    app.roles.some(role => userRoles.includes(role))
  )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Welcome to Your Dashboard</h1>
        {availableApps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableApps.map((app) => (
              <Card key={app.name} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-primary">
                    {app.icon}
                    {app.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">{app.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={app.href} className="text-primary hover:text-primary-dark font-medium transition-colors duration-300">
                    Go to {app.name} →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-700">No applications available. Please contact your administrator.</p>
        )}
      </div>
    </div>
  )
}