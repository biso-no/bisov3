"use server"
import { createSessionClient } from "@/lib/appwrite";
import { User } from "@/lib/types/user";
import { Post } from "@/lib/types/post";
import { Expense } from "@/lib/types/expense";
import { Department } from "@/lib/types/department";
import { Campus } from "@/lib/types/campus";
import { attachmentImage } from "@/lib/types/attachmentImage";
import { Query } from "node-appwrite";
import { Client, Databases, ID } from "appwrite";
import { Models } from "appwrite";
import { getUser } from "@/lib/admin/db";
import { getLoggedInUser } from "@/lib/actions/user";
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

export async function getExpenses() {
  const { db } = await createSessionClient();
  const response = await db.listDocuments('app', 'expense', [
    Query.limit(100)
  ]);

  return response.documents as Expense[]
}

export async function getExpensesByLoggedInUser() {
       
  
   
  //console.log(user.user.$id)
  //console.log("here")
  const { db, account} = await createSessionClient();
  const user = await account.get();
  //console.log(user.$id)
  const response = await db.listDocuments('app', 'expense', [Query.equal("userId", user.$id),
    Query.limit(100)
  ]);

  return response.documents as Expense[]
}


export async function getExpense(id) {
  const { db } = await createSessionClient();
  const response = await db.getDocument('app', 'expense', id);


  return response as Expense
}




export async function addExpense(formData) {
  const { db, account} = await createSessionClient();
  const user = await account.get();
  const response = await db.createDocument(
    'app', // databaseId
    'expense', // collectionId
    ID.unique(),
    {
      campus: formData.campus,
      department: formData.department,
      bank_account: formData.bank_account,
      description: formData.description,
      expenseAttachments: formData.expense_attachments_ids,
      total: formData.total,
      prepayment_amount: formData.prepayment_amount,
      user: user.$id,
      userId: user.$id
    }, // data
  );

  return response
}

export async function updateExpense(expenseId, formData) {
  console.log(expenseId)
  const { db, account } = await createSessionClient();
  const user = await account.get();
  const response = await db.updateDocument(
    'app', // databaseId
    'expense', // collectionId
    expenseId,
    {
      campus: formData.campus,
      department: formData.department,
      bank_account: formData.bank_account,
      description: formData.description,
      expenseAttachments: formData.expense_attachments_ids,
      total: formData.total,
      prepayment_amount: formData.prepayment_amount,
      user: user.$id,
      userId: user.$id
    }, // data
  );
}


  export async function updateExpenseStatus(expenseId,  status) {
    console.log(expenseId)
    const { db } = await createSessionClient();
    const response = await db.updateDocument(
      'app', // databaseId
      'expense', // collectionId
      expenseId,
      {
        status: status
      }, // data
    );

    return response
  }


  export async function addExpenseAttachment(data) {
    const { db } = await createSessionClient();
    const response = await db.createDocument(
      'app', // databaseId
      'expense_attachments', // collectionId
      ID.unique(),
      {
        amount: data.amount, // Ensure amount is a number
        date: data.date, // Default date value
        description: data.description,
        url: data.url,
        type: "jpeg"
      }, // data
    );

    return response
  }

  export async function addAttachmentImage(formFileData: FormData) {

    const { storage } = await createSessionClient();

    const result = await storage.createFile(
      "expenses", // Bucket ID
      ID.unique(), // File ID
      formFileData.get("file") as File
    );

    return result; // This will be the uploaded file's metadata
  }





  export async function getDepartments() {
    const { db } = await createSessionClient();
    const response = await db.listDocuments('app', 'departments', [
      Query.limit(1000)
    ]);

    return response.documents as Department[]
  }

  export async function getCampuses() {
    const { db } = await createSessionClient();
    const response = await db.listDocuments('app', 'campus', [
      Query.limit(100)
    ]);

    return response.documents as Campus[]
  }

export async function getEvents() {
  const { db } = await createSessionClient();
  const response = await db.listDocuments('app', 'events', [
    Query.limit(100)
  ]);

  return response.documents as any[];
}

export async function getEvent(eventId: string) {
  const { db } = await createSessionClient();
  const response = await db.getDocument('app', 'events', eventId);

  return response as any;
}

export async function createEvent(event) {
  const { db, account } = await createSessionClient();

  
  const result = await db.createDocument(
    'app',
    'events',
    ID.unique(),
    {
      title: event.title,
      description: event.description,
      start_date: event.start_date,
      end_date: event.end_date,
      start_time: event.start_time,
      end_time: event.end_time,
      campus: event.campus,
      units: event.units,
      price: event.price || 0,
      ticket_url: event.ticket_url || "",
      image: event.image || "",
      status: "pending",
    }
  );
  
  revalidatePath('/admin/events');
  return result;
}

export async function updateEvent(eventId: string, event) {
  const { db } = await createSessionClient();

  const now = new Date().toISOString();
  
  const result = await db.updateDocument(
    'app',
    'events',
    eventId,
    {
      title: event.title,
      description: event.description,
      start_date: event.start_date,
      end_date: event.end_date,
      start_time: event.start_time,
      end_time: event.end_time,
      campus: event.campus,
      units: event.units,
      price: event.price || 0,
      ticket_url: event.ticket_url || "",
      image: event.image || "",
    }
  );
  
  revalidatePath('/admin/events');
  return result;
}

export async function updateEventStatus(eventId: string, status: "pending" | "approved" | "rejected") {
  const { db } = await createSessionClient();
  
  
  const result = await db.updateDocument(
    'app',
    'events',
    eventId,
    {
      status: status,
    }
  );
  
  revalidatePath('/admin/events');
  return result;
}

export async function deleteEvent(eventId: string) {
  const { db } = await createSessionClient();
  
  const result = await db.deleteDocument(
    'app',
    'events',
    eventId
  );
  
  revalidatePath('/admin/events');
  return result;
}

