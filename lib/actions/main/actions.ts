'use server'
import { createSessionClient } from "@/lib/appwrite"

export async function getNavItems() {
    const { db } = await createSessionClient();

    const response = await db.listDocuments('webapp', 'nav_menu')
    return response.documents
}