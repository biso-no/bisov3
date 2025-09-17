import { listEvents } from '@/app/actions/events'
import { getNews } from '@/app/(alumni)/alumni/actions'
import { listJobs } from '@/app/actions/jobs'
import { getProducts } from '@/app/actions/products'
import { HomePageClient } from './_components/home-page-client'
import type { Event } from '@/lib/types/event'
import type { Job } from '@/lib/types/job'
import type { NewsItem } from '@/lib/types/alumni'
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
  const [events, news, jobs, products] = await Promise.all([
    listEvents({ status: 'publish', limit: 24 }),
    getNews(8),
    listJobs({ status: 'open', limit: 24 }),
    getProducts('in-stock'),
  ])

  const safeEvents = Array.isArray(events) ? (events as Event[]) : []
  const safeNews = Array.isArray(news) ? (news as NewsItem[]) : []
  const safeJobs = Array.isArray(jobs) ? (jobs as Job[]) : []
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
