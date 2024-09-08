'use server'

import { Query, ID } from "node-appwrite";
import { revalidatePath } from "next/cache";
import { createSessionClient } from "../appwrite";
import { Data } from "@measured/puck";
import { sanitizePath } from "../utils/sanitizePath";

const databaseId = 'webapp';
const collectionId = 'page_content';

//Sanitize path. Remove spaces and replace them with dashes. Remove special characters that cannot be used in URLs.


export async function savePage({
  data,
  path,
}: {
  data: Data;
  path: string;
}) {

  const { db } = await createSessionClient();

  // If the path is '/new', use the title as the path. If the path is empty or undefined, set it to '/'
  const correctPath = path === '/new' ? data.root.props.title : (path || '/');

  try {
    // Convert each object in the content array to a string
    const stringifiedContent = data.content.map((item) => JSON.stringify(item));

    // Attempt to get existing document
    let documentId = null;
    try {
      const existingDoc = await db.listDocuments(databaseId, collectionId, [
        Query.equal('path', correctPath),
      ]);
      if (existingDoc.total > 0) {
        documentId = existingDoc.documents[0].$id;
      }
    } catch (error) {
      console.error('Error retrieving document:', error);
    }

    let insertedPath = correctPath;
    if (documentId) {
      // Update existing document
      const response = await db.updateDocument(databaseId, collectionId, documentId, {
        content: stringifiedContent,  // Use the array of stringified objects
        title: data.root.props.title,
        zones: JSON.stringify(data.zones),
        path: path,
      });
      insertedPath = response.path;
    } else {
      // Create a new document
      const response = await db.createDocument(databaseId, collectionId, ID.unique(), {
        title: data.root.props.title,
        zones: JSON.stringify(data.zones),
        path: '/' + sanitizePath(correctPath),
        content: stringifiedContent,  // Use the array of stringified objects
      });
      insertedPath = sanitizePath(response.path);
    }

    // Purge Next.js cache
    revalidatePath(correctPath);
    
    return {
        status: "ok",
        path: insertedPath,
    }
  } catch (error) {
    console.error('Error saving content:', error);
    return {
      status: "error",
      message: error.message,
    }
  }
}

export async function deletePage(pageId: string, path: string) {
  const { db } = await createSessionClient();

  const response = await db.deleteDocument("webapp", "page_content", pageId);

  if (response) {
    revalidatePath(path);
    return {
      status: "ok",
    }
  } else {
    revalidatePath(path);
    return {
      status: "error",
      message: "Failed to delete page",
    }
  }
}