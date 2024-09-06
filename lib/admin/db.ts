"use server"
import { Query } from "node-appwrite";
import { createSessionClient } from "../appwrite";

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