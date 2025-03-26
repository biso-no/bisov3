import { createSessionClient } from "@/lib/appwrite";
import { ID } from 'node-appwrite'

export async function uploadUnitLogo(file: File) {
  try {
    const { storage } = await createSessionClient();
    const uploadedFile = await storage.createFile(
      'expenses', 
      ID.unique(),
      file
    );
    return uploadedFile.$id;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}