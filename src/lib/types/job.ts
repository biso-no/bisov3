import { Models } from 'node-appwrite'

export interface Job extends Models.Document {
  title: string
  slug: string
  campus: string
  department_id: string
  status: 'open' | 'draft' | 'closed' | string
  type: string
  duration_months: number
  application_deadline?: string
  start_date?: string
  end_date?: string
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  interests?: string[]
  apply_url?: string
  image?: string
  description: string
}


