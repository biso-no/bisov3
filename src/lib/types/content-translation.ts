import { Models } from 'node-appwrite'

export interface ContentTranslation extends Models.Document {
  content_type: 'job' | 'event' | 'news'
  content_id: string
  locale: 'en' | 'no'
  title: string
  description: string
  additional_fields?: string // JSON string for flexible content
}

export interface TranslatableContent {
  title: string
  description: string
  [key: string]: any // For additional translatable fields
}
