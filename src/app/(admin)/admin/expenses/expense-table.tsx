"use client";
import { Expense } from "@/lib/types/expense";
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation"
import { Edit } from "lucide-react";


export function AdminExpenseTable({ expenses }: { expenses: Expense[] }) {
    const router = useRouter();
    const actionClick = (selected_expense_id) =>{
        router.push(`/admin/expenses/${selected_expense_id}`)
    }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead >Department</TableHead>
          <TableHead>Campus</TableHead>
          <TableHead>Bank_Account</TableHead>
          <TableHead >Total</TableHead>
          <TableHead >Status</TableHead>
          <TableHead >Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense) => (
          <TableRow >
            <TableCell >{expense.department}</TableCell>
            <TableCell>{expense.campus}</TableCell>
            <TableCell>{expense.bank_account}</TableCell>
            <TableCell >{expense.total}</TableCell>
            <TableCell >{expense.status == "pending"? ("pending") :("submitted") }</TableCell>
            <TableCell ><Button onClick={()=>actionClick(expense.$id)}><Edit></Edit></Button></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
