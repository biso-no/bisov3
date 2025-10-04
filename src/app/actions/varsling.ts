"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { ID, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";

export interface VarslingSettings {
  $id?: string;
  campus_id: string;
  role_name: string;
  email: string;
  is_active: boolean;
  sort_order: number;
}

export interface VarslingSubmission {
  campus_id: string;
  role_name: string;
  recipient_email: string;
  submitter_email?: string;
  case_description: string;
  submission_type: 'harassment' | 'witness' | 'other';
}

// Get varsling settings for a specific campus
export async function getVarslingSettings(campusId?: string): Promise<VarslingSettings[]> {
  try {
    const { db } = await createAdminClient();
    
    const queries = [
      Query.equal("is_active", true),
      Query.orderAsc("sort_order"),
      Query.orderAsc("role_name")
    ];
    
    if (campusId) {
      queries.unshift(Query.equal("campus_id", campusId));
    }
    
    const response = await db.listDocuments("app", "varsling_settings", queries);
    return response.documents as VarslingSettings[];
  } catch (error) {
    console.error("Failed to fetch varsling settings:", error);
    return [];
  }
}

// Get all varsling settings (admin only)
export async function getAllVarslingSettings(): Promise<VarslingSettings[]> {
  try {
    const { db } = await createAdminClient();
    
    const response = await db.listDocuments("app", "varsling_settings", [
      Query.orderAsc("campus_id"),
      Query.orderAsc("sort_order"),
      Query.orderAsc("role_name")
    ]);
    
    return response.documents as VarslingSettings[];
  } catch (error) {
    console.error("Failed to fetch all varsling settings:", error);
    return [];
  }
}

// Create new varsling settings (admin only)
export async function createVarslingSettings(data: Omit<VarslingSettings, '$id'>): Promise<{ success: boolean; error?: string }> {
  try {
    const { db } = await createAdminClient();
    
    await db.createDocument("app", "varsling_settings", ID.unique(), data);
    
    revalidatePath("/admin/varsling");
    return { success: true };
  } catch (error) {
    console.error("Failed to create varsling settings:", error);
    return { success: false, error: "Failed to create varsling settings" };
  }
}

// Update varsling settings (admin only)
export async function updateVarslingSettings(id: string, data: Partial<VarslingSettings>): Promise<{ success: boolean; error?: string }> {
  try {
    const { db } = await createAdminClient();
    
    await db.updateDocument("app", "varsling_settings", id, data);
    
    revalidatePath("/admin/varsling");
    return { success: true };
  } catch (error) {
    console.error("Failed to update varsling settings:", error);
    return { success: false, error: "Failed to update varsling settings" };
  }
}

// Delete varsling settings (admin only)
export async function deleteVarslingSettings(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { db } = await createAdminClient();
    
    await db.deleteDocument("app", "varsling_settings", id);
    
    revalidatePath("/admin/varsling");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete varsling settings:", error);
    return { success: false, error: "Failed to delete varsling settings" };
  }
}

// Submit varsling case (public)
export async function submitVarslingCase(data: VarslingSubmission): Promise<{ success: boolean; error?: string }> {
  try {
    const { messaging } = await createAdminClient();
    
    // Create email content
    const subject = `BISO Varsling: ${data.submission_type === 'harassment' ? 'Trakassering' : data.submission_type === 'witness' ? 'Vitne' : 'Annet'}`;
    
    const emailContent = `
      <h2>BISO Varsling - Ny sak</h2>
      
      <h3>Saksdetaljer:</h3>
      <p><strong>Campus:</strong> ${data.campus_id}</p>
      <p><strong>Rolle:</strong> ${data.role_name}</p>
      <p><strong>Type:</strong> ${data.submission_type === 'harassment' ? 'Trakassering' : data.submission_type === 'witness' ? 'Vitne' : 'Annet'}</p>
      
      ${data.submitter_email ? `<p><strong>Kontakt e-post:</strong> ${data.submitter_email}</p>` : '<p><strong>Kontakt:</strong> Anonym</p>'}
      
      <h3>Beskrivelse:</h3>
      <p>${data.case_description.replace(/\n/g, '<br>')}</p>
      
      <hr>
      <p><small>Dette er en automatisk generert e-post fra BISO varslingssystem.</small></p>
    `;
    
    // Send email using Appwrite messaging
    await messaging.createEmail(
      ID.unique(),
      subject,
      emailContent,
      [], // topics (empty for direct email)
      [data.recipient_email], // users (empty, we use targets)
      [], // targets (we'll use users instead)
      [], // cc
      [], // bcc
      [], // attachments
      false, // draft
      emailContent, // html content
      new Date(Date.now() + 5 * 60 * 1000).toISOString() // schedule 5 minutes from now
    );
    
    return { success: true };
  } catch (error) {
    console.error("Failed to submit varsling case:", error);
    return { success: false, error: "Failed to submit varsling case. Please try again." };
  }
}
