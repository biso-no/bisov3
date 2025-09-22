import { listEvents } from '@/app/actions/events'
import { listNews } from '@/app/actions/news'
import { listJobs } from '@/app/actions/jobs'
import { getProducts } from '@/app/actions/products'
import { getLocale } from '@/app/actions/locale'
import { HomePageClient } from './_components/home-page-client'
import type { EventWithTranslations } from '@/lib/types/event'
import type { JobWithTranslations } from '@/lib/types/job'
import type { NewsItemWithTranslations } from '@/lib/types/news'
import { Models } from 'node-appwrite'

type Product = Models.Document & {
  name: string
  images?: string[]
  price?: number
  description?: string
  slug?: string
  url?: string
}

export default async function HomePage() {
  // Get user's preferred locale from their account preferences
  const locale = await getLocale()
  
  const [events, news, jobs, products] = await Promise.all([
    listEvents({ status: 'published', limit: 24, locale }),
    listNews({ status: 'published', limit: 8, locale }),
    listJobs({ status: 'published', limit: 24, locale }),
    getProducts('in-stock'),
  ])

  const safeEvents = Array.isArray(events) ? (events as EventWithTranslations[]) : []
  const safeNews = Array.isArray(news) ? (news as NewsItemWithTranslations[]) : []
  const safeJobs = Array.isArray(jobs) ? (jobs as JobWithTranslations[]) : []
  const safeProducts = Array.isArray(products) ? (products as Product[]) : []

  return (
    <HomePageClient
      events={safeEvents}
      news={safeNews}
      jobs={safeJobs}
      products={safeProducts}
    />
  )
}
