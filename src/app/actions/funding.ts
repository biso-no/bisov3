"use server"

import { Query } from "node-appwrite"
import { createAdminClient } from "@/lib/appwrite"
import type { FundingProgram, ParsedFundingProgram, FundingProgramMetadata } from "@/lib/types/funding-program"

const parseFundingMetadata = (value?: string | null): FundingProgramMetadata => {
  if (!value) return {}
  try {
    return JSON.parse(value) as FundingProgramMetadata
  } catch (error) {
    console.error("Failed to parse funding metadata", error)
    return {}
  }
}

const toParsedProgram = (program: FundingProgram): ParsedFundingProgram => ({
  ...program,
  parsedMetadata: parseFundingMetadata(program.metadata)
})

export async function listFundingPrograms(status: string = "active"): Promise<ParsedFundingProgram[]> {
  try {
    const { db } = await createAdminClient()
    const queries = [Query.orderAsc("slug"), Query.limit(50)]
    if (status) {
      queries.push(Query.equal("status", status))
    }
    const response = await db.listDocuments("app", "funding_programs", queries)
    return response.documents.map((doc) => toParsedProgram(doc as FundingProgram))
  } catch (error) {
    console.error("Failed to fetch funding programs", error)
    return []
  }
}

export async function getFundingProgramBySlug(slug: string): Promise<ParsedFundingProgram | null> {
  if (!slug) return null
  try {
    const { db } = await createAdminClient()
    const response = await db.listDocuments("app", "funding_programs", [
      Query.equal("slug", slug),
      Query.limit(1)
    ])

    if (response.total === 0) {
      return null
    }

    return toParsedProgram(response.documents[0] as FundingProgram)
  } catch (error) {
    console.error("Failed to fetch funding program", error)
    return null
  }
}
