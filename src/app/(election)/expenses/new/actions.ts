"use server"

import { createSessionClient } from "@/lib/appwrite"
import { ID } from "appwrite"

export async function updateProfileDetails(profileId: string, updates: {
    name?: string;
    email?: string;
    phone?: string;
    bank_account?: string;
    swift?: string | undefined;
}) {
    const { db } = await createSessionClient()

    try {
        // Remove undefined values to prevent overwriting with undefined
        const cleanUpdates = Object.fromEntries(
            Object.entries(updates).filter(([_, value]) => value !== undefined)
        );
        
        const updatedProfile = await db.updateDocument('app', 'user', profileId, cleanUpdates)
        return updatedProfile
    } catch (error) {
        console.error('Error updating profile:', error)
        throw new Error('Failed to update profile')
    }
}

interface DocumentData {
  date: string;
  amount: number;
  description: string;
  fileId: string;
  fileName: string;
  confidence?: number;
  needsReview?: boolean;
  processedByAI?: boolean;
  file?: File;
  url?: string;
}

// This is now just a type definition, actual processing happens in the API route
export type { DocumentData }

export async function generateExpenseDescription(descriptions: string[], eventName?: string) {
  try {
    const { functions } = await createSessionClient()

    const execution = await functions.createExecution(
      'generate_expense_description',
      JSON.stringify({
        descriptions,
        event: eventName,
        async: false
      })
    )

    if (execution.status !== 'completed') {
      throw new Error('Function execution failed');
    }

    const response = JSON.parse(execution.responseBody);
    console.log('Function response:', response); // Debug log
    
    // Check if we got an error response
    if (response.error) {
      throw new Error(response.error);
    }

    // Return just the description
    return response.description;

  } catch (error) {
    console.error('Error generating description:', error);
    throw error;
  }
}

interface ExpenseData {
  contact?: {
    name: string
    email: string
    phone: string
    bank_account: string
    swift?: string
    isInternational: boolean
    campus?: string
    department?: string
  }
  documents?: Array<{
    fileId: string
    fileName: string
    date: string
    amount: number
    description: string
    file?: File
    url?: string
  }>
  description?: {
    description: string
    additionalNotes?: string
    hasPrepayment?: boolean
    prepaymentAmount?: number
  }
}

export async function uploadExpenseFile(file: File) {
  try {
    const { storage } = await createSessionClient();
    const uploadedFile = await storage.createFile(
      'expenses', 
      ID.unique(),
      file
    );
    return uploadedFile.$id;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function submitExpense(data: ExpenseData, userId: string) {
  try {
    const { storage, db } = await createSessionClient();
    
    // Upload all files first
    const uploadPromises = data.documents?.map(async (doc) => {
      if (doc.file) {
        const fileId = await uploadExpenseFile(doc.file);
        const url = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT + '/storage/buckets/expenses/files/' + fileId + '/view?project=' + process.env.APPWRITE_PROJECT_ID;
        return { ...doc, fileId, file: undefined, url };
      }
      return doc;


    }) || [];

    const documentsWithFileIds = await Promise.all(uploadPromises);
    
    const totalAmount = documentsWithFileIds.reduce((sum, doc) => sum + doc.amount, 0) || 0
    const prepaymentAmount = data.description?.prepaymentAmount || 0

    const expenseData = {
      campus: data.contact?.campus,
      department: data.contact?.department,
      bank_account: data.contact?.bank_account,
      description: data.description?.description,
      total: totalAmount,
      prepayment_amount: prepaymentAmount,
      remaining_balance: totalAmount - prepaymentAmount,
      status: 'pending',
      userId: userId,
      user: userId,
      expenseAttachments: documentsWithFileIds.map(doc => ({
        date: new Date(doc.date).toISOString(),
        amount: doc.amount,
        description: doc.description,
        type: doc.fileName.split('.').pop()?.toLowerCase() || 'unknown',
        url: doc.url

      }))
    }

    const response = await db.createDocument(
      'app',
      'expense',
      ID.unique(),
      expenseData
    )

    return { success: true, data: response }
  } catch (error) {
    console.error('Error submitting expense:', error)
    return { success: false, error: 'Failed to submit expense' }
  }
}