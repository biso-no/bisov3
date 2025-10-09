"use server"

import { createAdminClient, createSessionClient } from "@/lib/appwrite"
import { Campus } from "@/lib/types/campus"
import { CampusData } from "@/lib/types/campus-data"
import { Query, Models } from "node-appwrite"

export type CampusMetadata = Models.Document & {
  campus_id: string
  campus_name: string
  tagline_nb?: string
  tagline_en?: string
  description_nb?: string
  description_en?: string
  highlights_nb?: string[]
  highlights_en?: string[]
  focusAreas_nb?: string[]
  focusAreas_en?: string[]
  services_nb?: string
  services_en?: string
}

export async function getCampusMetadata(): Promise<Record<string, CampusMetadata>> {
  try {
    const { db } = await createAdminClient()
    
    const result = await db.listDocuments('app', 'campus_metadata')
    
    const metadata: Record<string, CampusMetadata> = {}
    
    for (const doc of result.documents) {
      const campusMetadata = doc as CampusMetadata
      // Index by both campus_id and campus_name for easy lookup
      metadata[campusMetadata.campus_id] = campusMetadata
      metadata[campusMetadata.campus_name] = campusMetadata
    }
    
    return metadata
  } catch (error) {
    console.error('Failed to fetch campus metadata:', error)
    return {}
  }
}

export async function getCampusMetadataById(campusId: string): Promise<CampusMetadata | null> {
  try {
    const { db } = await createAdminClient()
    
    const result = await db.listDocuments('app', 'campus_metadata', [
      Query.equal('campus_id', campusId)
    ])
    
    if (result.documents.length > 0) {
      return result.documents[0] as CampusMetadata
    }
    
    return null
  } catch (error) {
    console.error('Failed to fetch campus metadata by ID:', error)
    return null
  }
}

export async function getCampusMetadataByName(campusName: string): Promise<CampusMetadata | null> {
  try {
    const { db } = await createAdminClient()
    
    const result = await db.listDocuments('app', 'campus_metadata', [
      Query.equal('campus_name', campusName.toLowerCase())
    ])
    
    if (result.documents.length > 0) {
      return result.documents[0] as CampusMetadata
    }
    
    return null
  } catch (error) {
    console.error('Failed to fetch campus metadata by name:', error)
    return null
  }
}

export async function getCampuses() {
  const { db } = await createSessionClient();
  const campuses = await db.listDocuments(
    'app',
    'campus',
    [Query.select(['name', '$id'])]
  );

  return campuses.documents as Campus[];
}

export async function getCampusData() {
  const { db } = await createSessionClient();
  const campuses = await db.listDocuments(
    'app',
    'campus_data'
  );

  return campuses.documents as CampusData[];
}
