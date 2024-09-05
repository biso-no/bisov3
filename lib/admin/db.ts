"use server"
import { Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";

export async function getPages() {
  const { db } = await createAdminClient();

  return db.listDocuments("webapp", "page_content", [
    Query.limit(100),
    Query.select(["title", "path", "$id", "$createdAt"]),
  ]);
}

export async function deletePage(pageId: string) {
  const { db } = await createAdminClient();

  return db.deleteDocument("webapp", "page_content", pageId);
}