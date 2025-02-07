"use server"

import { createSessionClient } from "@/lib/appwrite"
import { Models } from "node-appwrite"

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
}

export async function processDocument(fileId: string, fileName: string): Promise<DocumentData> {
    // This is a placeholder function that would normally do OCR/ML processing
    // In a real implementation, this would analyze the document and extract data
    
    // Simulating processing delay for UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
        date: new Date().toISOString().split('T')[0], // Today's date as placeholder
        amount: Math.floor(Math.random() * 1000), // Random amount for demo
        description: `Expense from ${fileName}`, // Placeholder description
        fileId,
        fileName
    };
}