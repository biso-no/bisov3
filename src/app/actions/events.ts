'use server'
import { createSessionClient } from '@/lib/appwrite'
import { ID, Query } from 'node-appwrite'
import { revalidatePath } from 'next/cache'
import type { Event } from '@/lib/types/event'
import type { Campus } from '@/lib/types/campus'
import type { Department } from '@/lib/types/department'

const databaseId = 'app'
const collectionId = 'events'

export async function listEvents(filters?: {
  campus?: string
  status?: string
  search?: string
  limit?: number
}) {
  const { db } = await createSessionClient()
  const queries = [Query.limit(filters?.limit || 200)]
  if (filters?.campus) queries.push(Query.equal('campus', filters.campus))
  if (filters?.status && filters.status !== 'all') queries.push(Query.equal('status', filters.status))
  if (filters?.search) queries.push(Query.search('title', filters.search))

  const res = await db.listDocuments(databaseId, collectionId, queries)
  return res.documents as unknown as Event[]
}

export async function getEvent(eventId: string) {
  const { db } = await createSessionClient()
  const res = await db.getDocument(databaseId, collectionId, eventId)
  return res as unknown as Event
}

export async function createEvent(data: Partial<Event>) {
  const { db } = await createSessionClient()
  const payload: any = {
    title: data.title,
    description: data.description,
    units: data.units || [],
    price: data.price ?? null,
    ticket_url: data.ticket_url ?? null,
    image: data.image ?? null,
    status: data.status || 'draft',
    start_time: data.start_time ?? null,
    end_time: data.end_time ?? null,
    start_date: data.start_date,
    end_date: data.end_date,
    campus: data.campus,
    totalAttemdees: data.totalAttemdees ?? 0,
    departmentId: data.departmentId ?? null,
  }
  const res = await db.createDocument(databaseId, collectionId, ID.unique(), payload)
  revalidatePath('/admin/events')
  return res
}

export async function updateEvent(eventId: string, data: Partial<Event>) {
  const { db } = await createSessionClient()
  const payload: any = {
    title: data.title,
    description: data.description,
    units: data.units,
    price: data.price,
    ticket_url: data.ticket_url,
    image: data.image,
    status: data.status,
    start_time: data.start_time,
    end_time: data.end_time,
    start_date: data.start_date,
    end_date: data.end_date,
    campus: data.campus,
    totalAttemdees: data.totalAttemdees,
    departmentId: data.departmentId,
  }
  const res = await db.updateDocument(databaseId, collectionId, eventId, payload)
  revalidatePath('/admin/events')
  return res
}

export async function deleteEvent(eventId: string) {
  const { db } = await createSessionClient()
  await db.deleteDocument(databaseId, collectionId, eventId)
  revalidatePath('/admin/events')
  return { success: true }
}

export async function uploadEventImage(formData: FormData) {
  const { storage } = await createSessionClient()
  const file = formData.get('file') as unknown as File
  const uploaded = await storage.createFile('events', ID.unique(), file)
  return uploaded
}

export async function getEventImageViewUrl(fileId: string) {
  const { storage } = await createSessionClient()
  // Returns a URL to view the file directly
  // Consumers can use this as the src for next/image (if domain allowed) or <img>
  // Note: getFileView returns a URL string in Appwrite Web SDK; in Node it returns a URL object
  const url = (storage as any).getFileView('events', fileId)
  return typeof url === 'string' ? url : url.href
}

export async function listCampuses() {
  const { db } = await createSessionClient()
  const res = await db.listDocuments('app', 'campus', [Query.limit(200), Query.select(['$id', 'name'])])
  return res.documents as unknown as Campus[]
}

export async function listDepartments(campusId?: string) {
  const { db } = await createSessionClient()
  const queries = [Query.limit(500), Query.select(['$id', 'Name', 'campus_id'])]
  if (campusId) queries.push(Query.equal('campus_id', campusId))
  const res = await db.listDocuments('app', 'departments', queries)
  return res.documents as unknown as Department[]
}


