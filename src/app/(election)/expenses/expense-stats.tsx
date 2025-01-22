"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Expense } from "@/lib/types/expense"

export function ExpenseStats({ expenses }: { expenses: Expense[] }) {
  const submittedExpenses = expenses.filter((expense) => expense.status === "submitted")
  const pendingExpenses = expenses.filter((expense) => expense.status === "pending")

  const totalSubmitted = submittedExpenses.reduce((sum, expense) => sum + Number.parseFloat(expense.total), 0)
  const totalPending = pendingExpenses.reduce((sum, expense) => sum + Number.parseFloat(expense.total), 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatCard
        title="Submitted Reimbursements"
        value={submittedExpenses.length}
        total={totalSubmitted}
        color="from-blue-500 to-indigo-500"
      />
      <StatCard
        title="Pending Reimbursements"
        value={pendingExpenses.length}
        total={totalPending}
        color="from-orange-500 to-red-500"
      />
    </div>
  )
}

function StatCard({ title, value, total, color }: { title: string; value: number; total: number; color: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className={`bg-gradient-to-br ${color} text-white overflow-hidden`}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold mb-2">{value}</div>
          <div className="text-lg">Total: ${total.toFixed(2)}</div>
          <motion.div
            className="absolute bottom-0 left-0 w-full h-1 bg-white opacity-25"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}

