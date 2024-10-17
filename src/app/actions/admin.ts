"use server"
import { createSessionClient } from "@/lib/appwrite";
import { User } from "@/lib/types/user";
import { Query } from "node-appwrite";

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