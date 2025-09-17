import { listEvents } from '@/app/actions/events'
import { listJobs } from '@/app/actions/jobs'
import { getNews } from '@/app/(alumni)/alumni/actions'
import { getDepartments, type Department as DepartmentRecord } from '@/lib/admin/departments'
import { getCampusData } from '@/app/actions/campus'
import type { CampusData } from '@/lib/types/campus-data'
import type { Event } from '@/lib/types/event'
import type { Job } from '@/lib/types/job'
import type { NewsItem } from '@/lib/types/alumni'
import { CampusPageClient } from './campus-page-client'

export const revalidate = 0

export default async function CampusPage() {
  const [events, jobs, news, departments, campusData] = await Promise.all([
    listEvents({ status: 'publish', limit: 100 }),
    listJobs({ status: 'open', limit: 100 }),
    getNews(12),
    getDepartments({ active: true, limit: 300 }),
    getCampusData()
  ])

  return (
    <CampusPageClient
      events={Array.isArray(events) ? (events as Event[]) : []}
      jobs={Array.isArray(jobs) ? (jobs as Job[]) : []}
      news={Array.isArray(news) ? (news as NewsItem[]) : []}
      departments={Array.isArray(departments) ? (departments as DepartmentRecord[]) : []}
      campusData={Array.isArray(campusData) ? (campusData as CampusData[]) : []}
    />
  )
}
