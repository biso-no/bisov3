"use client"

import { format } from "date-fns"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Expense } from "@/lib/types/expense"
import { Eye, Plus, Send } from 'lucide-react'
import { useRouter } from "next/navigation"
import { updateExpenseStatus } from "@/app/actions/admin"


export function ExpenseTable({ expenses }: { expenses: Expense[] }) {
  const submittedExpenses = expenses.filter(expense => expense.status === "submitted")
  const pendingExpenses = expenses.filter(expense => expense.status === "pending")
  const router = useRouter()

  const handleViewExpense = (id: string) => {
    router.push(`../expenses/${id}`)
  }
  const onSubmitExpense = (id: string) => {
    updateExpenseStatus(id, "submitted")
  }

  const handleAddExpense = () => {
    router.push("../expenses/new")
  }

  const renderExpenseTable = (expenseList: Expense[], title: string) => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenseList.map((expense: Expense) => (
              <TableRow key={expense.id}>
                <TableCell>{format(new Date(expense.$createdAt), "dd MMM yyyy")}</TableCell>
                <TableCell>{expense.total}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${expense.status === "submitted" ? "bg-gray-200 text-gray-800" : "bg-gray-100 text-gray-700"
                    }`}>
                    {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">

                  {expense.status === "pending" && (
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewExpense(expense.$id)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSubmitExpense(expense.$id)}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Submit
                      </Button>
                    </div>

                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Expenses Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Submitted Reimbursements</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{submittedExpenses.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Reimbursements</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{pendingExpenses.length}</CardContent>
        </Card>
      </div>

      <div className="flex">
        <Button className="w-full" onClick={handleAddExpense}>
          <Plus className="h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {renderExpenseTable(submittedExpenses, "Submitted Expenses")}
        {renderExpenseTable(pendingExpenses, "Pending Expenses")}
      </div>
    </div>
  )
}

