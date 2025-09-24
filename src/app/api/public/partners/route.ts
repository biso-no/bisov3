import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/appwrite'
import { Query } from 'node-appwrite'

export async function GET() {
  try {
    const { db, storage } = await createAdminClient()

    // Try to load partners from DB; if missing/empty, fallback to static
    let partners: Array<{ name: string; url?: string; imageUrl: string }> = []
    try {
      const docs = await db.listDocuments('app', 'partners', [Query.equal('level', 'national')])
      partners = await Promise.all(
        docs.documents.map(async (doc: any) => {
          const bucket = doc.image_bucket || 'partners'
          const fileId = doc.image_file_id
          const preview = storage.getFilePreview(bucket, fileId)
          return {
            name: doc.name as string,
            url: doc.url as string | undefined,
            imageUrl: preview.toString(),
          }
        })
      )
    } catch (_e) {
      // ignore and fallback
    }


    const orgChartUrl = storage.getFilePreview('content', 'org_chart').toString()

    return NextResponse.json({ partners, orgChartUrl }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load partners' }, { status: 500 })
  }
}


