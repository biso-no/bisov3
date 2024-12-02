"use client"

import { ExpenseDetails } from "./expense-details";
import { FormContextProvider } from "./formContext";

export default async function Expense() {
  return (
    <FormContextProvider><ExpenseDetails/></FormContextProvider>
    
  )
}