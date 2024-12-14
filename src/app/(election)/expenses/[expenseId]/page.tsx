"use client"

import { ExpenseDetails } from "./expense-details";
import { FormContextProvider } from "./formContext";
import { addAttachmentImage } from "@/app/actions/admin";
import { getLoggedInUser} from "@/lib/actions/user";
export default async function Expense() {
  //const {profile}=await getLoggedInUser()
  
  return (
    <FormContextProvider><ExpenseDetails /></FormContextProvider>
    
  )
}