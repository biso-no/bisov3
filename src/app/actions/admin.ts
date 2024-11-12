"use server"
import { createSessionClient } from "@/lib/appwrite";
import { User } from "@/lib/types/user";
import { Post } from "@/lib/types/post";
import { Query } from "node-appwrite";
import { Client, Databases} from "appwrite";
import { revalidatePath } from "next/cache";


export async function getUserRoles() {

    const availableRoles = ['Admin', 'pr', 'finance', 'hr', 'users', 'Control Committee'];

  const { teams } = await createSessionClient();

  const response = await teams.list([
    Query.equal('name', availableRoles),
  ]);
  return response.teams.map(team => team.name);
}

export async function getUsers() {
  const { db } = await createSessionClient();
  const response = await db.listDocuments('app', 'user', [
    Query.limit(100)
  ]);

  return response.documents as User[]
}

export async function getPosts(){
  const { db } = await createSessionClient();
  const response = await db.listDocuments('app', 'news', [
    Query.limit(100)
  ]);

  return response.documents as Post[]

}

export async function getPost(postId: string){
  const { db } = await createSessionClient();
  const response = await db.getDocument('app', 'news', postId
  );

  return response as Post

}

export async function updatePost(postId: string, post){
  const { db } = await createSessionClient();
  const response = await db.getDocument('app', 'news', postId
  );
  revalidatePath('/admin/posts')
  return db.updateDocument(
    'app', // databaseId
    'news', // collectionId
    postId, // documentId
    {
      "title": post.title,
      "url": post.url,
      "content": post.content,
      "status": post.status,
      "image":post.image,
      "department_id":post.department,
      "campus_id":post.campus,
      "created_at":post.created_at,
      "updated_at":post.updated_at,
      "department":post.department,
      "campus":post.campus
    }, // data (optional)
  )

}

export async function createPost(post){
  const { db } = await createSessionClient();

  const result = await db.createDocument(
    'app', // databaseId
    'news', // collectionId
    "unique()",
    {
      "title": post.title,
      "url": post.url,
      "content": post.content,
      "status": post.status,
      "image":post.image,
      "department_id":post.department,
      "campus_id":post.campus,
      "created_at":post.created_at,
      "updated_at":post.updated_at,
      "department":post.department,
      "campus":post.campus
    }, // data (optional)
);
  revalidatePath('/admin/posts')
  return result

}


export async function deletePost(postId: string){
  const { db } = await createSessionClient();

const result = await db.deleteDocument(
  'app', // databaseId
  'news', // collectionId
  postId // documentId
);
revalidatePath('/admin/posts')
return result

}