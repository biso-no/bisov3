"use server"
import { createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";

export async function getUserRoles(sessionCookie?: string) {
  const availableRoles = ['Admin', 'pr', 'finance', 'hr', 'users', 'kk'];
  const { teams } = await createSessionClient(sessionCookie);

  const response = await teams.list([
    Query.equal('name', availableRoles),
  ]);
  return response.teams.map(team => team.name);
}

export async function getLoggedInUser(sessionCookie?: string) {
  try {
    const { account, db } = await createSessionClient(sessionCookie);
    const user = await account.get();
    console.log("User: ", user);
    if (user.$id) {
      const profile = await db.getDocument('app', 'user', user.$id);
      return { user, profile };
    }
  } catch (error) {
    console.error("Error getting logged in user for middleware", error);
    return null;
  }
}
