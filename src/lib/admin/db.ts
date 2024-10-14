"use server"
import { Query } from "node-appwrite";
import { createSessionClient } from "../appwrite";
import { Models } from 'appwrite'

export type User = {
  id: string
  email: string
  name: string
  campus: string
  isActive: boolean
  roles: string[]
}

export async function  convertDocumentToUser(doc: Models.Document){
  return {
    id: doc.$id,
    name: doc.name,
    email: doc.email,
    roles: doc.roles || [],
    isActive: doc.isActive,
    campus: doc.campus_id
  }
}

export async function convertDocumentsToUsers(docs:Models.DocumentList<Models.Document>){
  return docs.documents.map((doc: Models.Document) => ({
    id: doc.$id,
    name: doc.name,
    email: doc.email,
    roles: doc.roles || [],
    isActive: doc.isActive,
    campus: doc.campus_id
  }))
}

export async function getPages() {
  const { db } = await createSessionClient();

  return db.listDocuments("webapp", "page_content", [
    Query.limit(100),
    Query.select(["title", "path", "$id", "$createdAt"]),
  ]);
}

export async function deletePage(pageId: string) {
  const { db } = await createSessionClient();

  return db.deleteDocument("webapp", "page_content", pageId);
}

export async function getProfile(userId: string) {
  const { db } = await createSessionClient();

  return db.getDocument("webapp", "profile", userId);
}

//users
export async function getUsers() {
  const { db } = await createSessionClient();
  return db.listDocuments("app", "user", [
    Query.limit(1000),
    Query.select(["$id", "name", "email","roles","campus_id", "isActive"]),
  ]);
}
 //get one user
export async function getUser(userId: string) {
  const { db } = await createSessionClient();
  return db.getDocument("app", "user", userId);
}

export async function updateUser(userId: string, userInformation: User) {
  const { db } = await createSessionClient();
  return db.updateDocument(
    'app', // databaseId
    'user', // collectionId
    userId, // documentId
    {
      "email": userInformation.email,
      "name": userInformation.name,
      "campus_id": userInformation.campus,
      "isActive": userInformation.isActive,
      "roles": userInformation.roles
    }, // data (optional)
  )
}