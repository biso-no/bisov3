"use server"

import { createAdminClient } from "@/lib/appwrite"
import type { CampusData } from "@/lib/types/campus-data"

const NATIONAL_CAMPUS_ID = "5"
const NATIONAL_CAMPUS_NAME = "national"

function normaliseName(value?: string | null) {
  return (value ?? "").trim().toLowerCase()
}

export async function getGlobalMembershipBenefits(): Promise<CampusData | null> {
  try {
    const { db } = await createAdminClient()

    try {
      const document = await db.getDocument("app", "campus_data", NATIONAL_CAMPUS_ID)
      return document as CampusData
    } catch (error) {
      const response = await db.listDocuments("app", "campus_data")
      const document = response.documents.find((item: any) => {
        return (
          item &&
          (item.$id === NATIONAL_CAMPUS_ID ||
            normaliseName(item.name) === NATIONAL_CAMPUS_NAME ||
            normaliseName(item?.name_nb) === NATIONAL_CAMPUS_NAME)
        )
      })

      return document ? (document as CampusData) : null
    }
  } catch (error) {
    console.error("Failed to fetch global membership benefits:", error)
    return null
  }
}
