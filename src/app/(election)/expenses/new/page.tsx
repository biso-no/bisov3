import { ExpenseWizard } from "./_components/expense-wizard"
import { Toaster } from "@/components/ui/toaster"
import { getLoggedInUser } from "@/lib/actions/user"
import { redirect } from "next/navigation"

export default async function NewExpensePage() {

  const { profile } = await getLoggedInUser()

  if (!profile) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <ExpenseWizard />
      <Toaster />
    </div>
  )
} 