import { ExpenseTable } from "./expense-table";
import { getExpenses } from "@/app/actions/admin";

export default async function Expenses() {
  const expenses = await getExpenses()
  return (
    <ExpenseTable expenses={expenses} />
  )
}