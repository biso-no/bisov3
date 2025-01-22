"use server"
import { createSessionClient } from "@/lib/appwrite";
import { ID, Models, Permission, Query, Role } from "node-appwrite";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


const databaseId = 'app';
const collectionId = 'campus';


export async function getCampuses(withUnits?: boolean) {
    const { db } = await createSessionClient();

    if (withUnits) {
        const campuses = await db.listDocuments(
            databaseId,
            collectionId
        );
        return campuses.documents;
    }

    const campuses = await db.listDocuments(
        databaseId,
        collectionId,
        [Query.select(['name', '$id'])]
    );
    return campuses.documents;
}

export async function getCampus(id: string, withUnits?: boolean) {
    const { db } = await createSessionClient();

    if (withUnits) {
        const campus = await db.getDocument(
            databaseId,
            collectionId,
            id
        );
        return campus;
    }

    const campus = await db.getDocument(
        databaseId,
        collectionId,
        id,
        [Query.select(['name', '$id'])]
    );
    return campus;
}