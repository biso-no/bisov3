"use server"

import { createSessionClient } from "@/lib/appwrite";

export async function reSubmitExpense(expenseId: string) {
    const { db, functions } = await createSessionClient();
    const expense = await db.getDocument(
        "app",
        "expense",
        expenseId
    )

    console.log(expense)

    if (expense.status !== "pending") {
        return { error: "Only pending expenses can be re-submitted" }
    }

    const response = await functions.createExecution(
        "generate_expense_invoice",
        JSON.stringify(expense),
        true
    )

    return response
    
}