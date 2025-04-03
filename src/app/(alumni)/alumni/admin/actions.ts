"use server";

import { createSessionClient, createAdminClient } from "@/lib/appwrite";
import { adminFeatureFlag } from "@/lib/flags";
import { revalidatePath } from "next/cache";

/**
 * Get all feature flags from the database
 * @returns A list of feature flags
 */
export async function getFeatureFlags() {
  try {
    // First check if the user is an admin
    if (!await adminFeatureFlag()) {
      throw new Error("Unauthorized: User is not an admin");
    }
    
    const client = await createSessionClient();
    
    // Fetch all feature flags from the database
    const response = await client.db.listDocuments(
      'app',  // Database ID
      'feature_flags'  // Collection ID
    );
    
    return response.documents;
  } catch (error) {
    console.error("Error fetching feature flags:", error);
    throw error;
  }
}

/**
 * Update a feature flag in the database
 * @param flagId The ID of the flag to update
 * @param enabled Whether the flag should be enabled or disabled
 * @returns The updated flag
 */
export async function updateFeatureFlag(flagId: string, enabled: boolean) {
  try {
    // First check if the user is an admin
    if (!await adminFeatureFlag()) {
      throw new Error("Unauthorized: User is not an admin");
    }
    
    const client = await createSessionClient();
    
    // Update the flag in the database
    const updatedFlag = await client.db.updateDocument(
      'app',  // Database ID
      'feature_flags',  // Collection ID
      flagId,  // Document ID
      { enabled }  // Data to update
    );
    
    // Revalidate paths that might be affected by this change
    revalidatePath('/alumni');
    revalidatePath('/alumni/admin');
    
    return updatedFlag;
  } catch (error) {
    console.error(`Error updating feature flag ${flagId}:`, error);
    throw error;
  }
}

/**
 * Update multiple feature flags at once
 * @param flags An array of objects with flag IDs and enabled status
 * @returns True if successful
 */
export async function updateFeatureFlags(flags: { id: string, enabled: boolean }[]) {
  try {
    // First check if the user is an admin
    if (!await adminFeatureFlag()) {
      throw new Error("Unauthorized: User is not an admin");
    }
    
    const client = await createSessionClient();
    
    // Update each flag in the database
    await Promise.all(
      flags.map(flag => 
        client.db.updateDocument(
          'app',  // Database ID
          'feature_flags',  // Collection ID
          flag.id,  // Document ID
          { enabled: flag.enabled }  // Data to update
        )
      )
    );
    
    // Revalidate paths that might be affected by this change
    revalidatePath('/alumni');
    revalidatePath('/alumni/admin');
    
    return true;
  } catch (error) {
    console.error("Error updating feature flags:", error);
    throw error;
  }
} 