import { Models } from "node-appwrite"

export interface CampusData extends Models.Document {
  name?: string | null
  description?: string | null
  businessBenefits?: string[]
  studentBenefits?: string[]
  careerAdvantages?: string[]
  socialNetwork?: string[]
  safety?: string[]
  location?: string | null
  departmentBoard?: Array<{
    name?: string
    imageUrl?: string
    role?: string
    [key: string]: unknown
  }>
}
