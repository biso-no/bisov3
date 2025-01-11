"use client"

import { ExpenseDetails } from "./expense-details";
import { FormContextProvider, useFormContext  } from "./formContext";
import { addAttachmentImage, getExpense } from "@/app/actions/admin";
import ExpenseView from "./expenseView";

export default async function Expense({ params }: { params: { expenseId: string } }) {

  return (
    <FormContextProvider><ExpenseView expenseId={params.expenseId}/></FormContextProvider>
    //<FormContextProvider><ExpenseDetails/></FormContextProvider>
    
  )
    
}