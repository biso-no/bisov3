import { listNavMenuAdmin } from "@/app/actions/nav-menu"
import { NavMenuManager } from "./_components/nav-menu-manager"

export default async function AdminSettingsPage() {
  const navigation = await listNavMenuAdmin()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage global configuration for the public experience.</p>
      </div>

      <NavMenuManager items={navigation.tree} />
    </div>
  )
}
