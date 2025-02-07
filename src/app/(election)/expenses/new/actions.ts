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
  confidence?: number;
  needsReview?: boolean;
}

// This is now just a type definition, actual processing happens in the API route
export type { DocumentData }