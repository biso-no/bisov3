'use server'
import { createAdminClient, createSessionClient } from '@/lib/appwrite'
import { Query, ID } from 'node-appwrite'
import type { Job } from '@/lib/types/job'

const databaseId = 'app'
const collectionId = 'jobs'

export async function provisionJobsSchema() {
  const { db } = await createAdminClient()

  // Create collection if not exists (best-effort)
  try {
    await db.createCollection(databaseId, collectionId, collectionId)
  } catch {}

  // Attributes
  const tasks = [
    db.createStringAttribute(databaseId, collectionId, 'title', 256, true),
    db.createStringAttribute(databaseId, collectionId, 'slug', 256, true),
    db.createStringAttribute(databaseId, collectionId, 'campus', 64, true),
    db.createStringAttribute(databaseId, collectionId, 'department_id', 64, true),
    db.createStringAttribute(databaseId, collectionId, 'status', 32, true, 'open'),
    db.createStringAttribute(databaseId, collectionId, 'type', 32, true), // e.g., committee, project, board
    db.createIntegerAttribute(databaseId, collectionId, 'duration_months', true),
    db.createDatetimeAttribute(databaseId, collectionId, 'application_deadline', false),
    db.createDatetimeAttribute(databaseId, collectionId, 'start_date', false),
    db.createDatetimeAttribute(databaseId, collectionId, 'end_date', false),
    db.createStringAttribute(databaseId, collectionId, 'contact_name', 128, false),
    db.createEmailAttribute(databaseId, collectionId, 'contact_email', false),
    db.createStringAttribute(databaseId, collectionId, 'contact_phone', 32, false),
    db.createStringAttribute(databaseId, collectionId, 'interests', 128, false, undefined, true), // array of tags
    db.createUrlAttribute(databaseId, collectionId, 'apply_url', false),
    db.createStringAttribute(databaseId, collectionId, 'image', 512, false),
    db.createStringAttribute(databaseId, collectionId, 'description', 32767, true),
  ]

  await Promise.all(tasks.map(t => t.catch(() => {})))

  // Indexes
  const indexTasks = [
    db.createIndex(databaseId, collectionId, 'idx_status', 'key', ['status']),
    db.createIndex(databaseId, collectionId, 'idx_campus', 'key', ['campus']),
    db.createIndex(databaseId, collectionId, 'idx_department', 'key', ['department_id']),
    db.createIndex(databaseId, collectionId, 'idx_type', 'key', ['type']),
    db.createIndex(databaseId, collectionId, 'idx_deadline', 'key', ['application_deadline']),
    db.createIndex(databaseId, collectionId, 'idx_title_search', 'fulltext', ['title']),
    db.createIndex(databaseId, collectionId, 'idx_interests', 'fulltext', ['interests']),
  ]

  await Promise.all(indexTasks.map(t => t.catch(() => {})))

  return { success: true }
}

export async function listJobs(filters?: { campus?: string; status?: string; interests?: string[]; query?: string; limit?: number }) {
  const { db } = await createSessionClient()
  const queries = [Query.limit(filters?.limit || 100)]
  if (filters?.campus) queries.push(Query.equal('campus', filters.campus))
  if (filters?.status && filters.status !== 'all') queries.push(Query.equal('status', filters.status))
  if (filters?.interests && filters.interests.length) queries.push(Query.contains('interests', filters.interests))
  if (filters?.query) queries.push(Query.search('title', filters.query))
  const res = await db.listDocuments(databaseId, collectionId, queries)
  return res.documents as unknown as Job[]
}

export async function getJob(id: string) {
  const { db } = await createSessionClient()
  const res = await db.getDocument(databaseId, collectionId, id)
  return res as unknown as Job
}

export async function createJob(data: Partial<Job>) {
  const { db } = await createSessionClient()
  const payload: any = { ...data }
  const res = await db.createDocument(databaseId, collectionId, ID.unique(), payload)
  return res
}

export async function updateJob(id: string, data: Partial<Job>) {
  const { db } = await createSessionClient()
  const res = await db.updateDocument(databaseId, collectionId, id, data as any)
  return res
}

export async function deleteJob(id: string) {
  const { db } = await createSessionClient()
  await db.deleteDocument(databaseId, collectionId, id)
  return { success: true }
}

// Media
export async function uploadJobImage(formData: FormData) {
  const { storage } = await createSessionClient()
  const file = formData.get('file') as unknown as File
  // Use existing "events" bucket for uploads to avoid new bucket provisioning
  const uploaded = await storage.createFile('events', ID.unique(), file)
  return uploaded
}

// Public queries
export async function getJobBySlug(slug: string) {
  const { db } = await createSessionClient()
  const res = await db.listDocuments(databaseId, collectionId, [Query.equal('slug', slug), Query.limit(1)])
  return (res.documents?.[0] as unknown as Job) || null
}

// Applications
const applicationsCollectionId = 'job_applications'

export async function createJobApplication(data: {
  job_id: string
  applicant_name: string
  applicant_email: string
  applicant_phone?: string
  cover_letter?: string
}) {
  const { db, functions } = await createSessionClient()
  const payload: any = {
    ...data,
    applied_at: new Date().toISOString(),
  }
  const doc = await db.createDocument(databaseId, applicationsCollectionId, ID.unique(), payload)
  // Fire-and-forget email notification via Appwrite Function (user will configure)
  try {
    const fnId = process.env.NEXT_PUBLIC_JOB_APP_FUNCTION_ID || 'job-application-email'
    await functions.createExecution(fnId, JSON.stringify({
      jobId: data.job_id,
      applicationId: (doc as any).$id,
      applicantEmail: data.applicant_email,
      applicantName: data.applicant_name,
    }))
  } catch {}
  return doc
}

export async function listJobApplications(jobId: string) {
  const { db } = await createSessionClient()
  const res = await db.listDocuments(databaseId, applicationsCollectionId, [Query.equal('job_id', jobId), Query.limit(200)])
  return res.documents
}


