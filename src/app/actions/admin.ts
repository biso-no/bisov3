"use server"
import { createSessionClient } from "@/lib/appwrite";
import { User } from "@/lib/types/user";
import { Expense } from "@/lib/types/expense";
import { Department } from "@/lib/types/department";
import { Campus } from "@/lib/types/campus";
import { attachmentImage } from "@/lib/types/attachmentImage";
import { Query } from "node-appwrite";
import { Client, Databases, ID } from "appwrite";
import { Models } from "appwrite";
import { getUser } from "@/lib/admin/db";
import { getLoggedInUser } from "@/lib/actions/user";

export async function getUserRoles() {

  const availableRoles = ['Admin', 'pr', 'finance', 'hr', 'users', 'Control Committee'];

  const { teams } = await createSessionClient();

  const response = await teams.list([
    Query.equal('name', availableRoles),
  ]);
  return response.teams.map(team => team.name);
}

export async function getUsers() {
  const { db } = await createSessionClient();
  const response = await db.listDocuments('app', 'user', [
    Query.limit(100)
  ]);

  return response.documents as User[]
}

export async function getExpenses() {
  const { db } = await createSessionClient();
  const response = await db.listDocuments('app', 'expense', [
    Query.limit(100)
  ]);

  return response.documents as Expense[]
}
export async function getExpense(id) {
  const { db } = await createSessionClient();
  const response = await db.getDocument('app', 'expense', id);


  return response as Expense
}




export async function addExpense(formData) {
  const { db } = await createSessionClient();
  const response = await db.createDocument(
    'app', // databaseId
    'expense', // collectionId
    ID.unique(),
    {
      campus: formData.campus,
      department: formData.department,
      bank_account: formData.bank_account,
      description: formData.description,
      expenseAttachments: formData.expense_attachments_ids,
      total: formData.total,
      prepayment_amount: formData.prepayment_amount,
      user: formData.user,
      userId: formData.userId
    }, // data
  );

  return response
}

export async function updateExpense(expenseId, formData) {
  console.log(expenseId)
  const { db } = await createSessionClient();
  const response = await db.updateDocument(
    'app', // databaseId
    'expense', // collectionId
    expenseId,
    {
      campus: formData.campus,
      department: formData.department,
      bank_account: formData.bank_account,
      description: formData.description,
      expenseAttachments: formData.expense_attachments_ids,
      total: formData.total,
      prepayment_amount: formData.prepayment_amount,
      user: formData.user,
      userId: formData.userId
    }, // data
  );
}


  export async function updateExpenseStatus(expenseId,  status) {
    console.log(expenseId)
    const { db } = await createSessionClient();
    const response = await db.updateDocument(
      'app', // databaseId
      'expense', // collectionId
      expenseId,
      {
        status: status
      }, // data
    );

    return response
  }


  export async function addExpenseAttachment(data) {
    const { db } = await createSessionClient();
    const response = await db.createDocument(
      'app', // databaseId
      'expense_attachments', // collectionId
      ID.unique(),
      {
        amount: data.amount, // Ensure amount is a number
        date: data.date, // Default date value
        description: data.description,
        url: data.url,
        type: "jpeg"
      }, // data
    );

    return response
  }

  export async function addAttachmentImage(formFileData: FormData) {

    const { storage } = await createSessionClient();

    const result = await storage.createFile(
      "expenses", // Bucket ID
      ID.unique(), // File ID
      formFileData.get("file") as File
    );

    return result; // This will be the uploaded file's metadata
  }





  export async function getDepartments() {
    const { db } = await createSessionClient();
    const response = await db.listDocuments('app', 'departments', [
      Query.limit(100)
    ]);

    return response.documents as Department[]
  }

  export async function getCampuses() {
    const { db } = await createSessionClient();
    const response = await db.listDocuments('app', 'campus', [
      Query.limit(100)
    ]);

    return response.documents as Campus[]
  }

