"use server";
import { Client, Account, Databases, Teams, Storage, Users } from "node-appwrite";
import { cookies } from "next/headers";

const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;
const APPWRITE_PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "biso";
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://appwrite.biso.no/v1";

export async function createSessionClient(sessionCookie?: string) {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT);

  // If sessionCookie is provided, use that; otherwise fallback to cookies().get
  const session = sessionCookie ?? cookies().get("x-biso-session")?.value;

  if (session) {
    client.setSession(session); // Set the session from the provided or fallback cookie
  }

  return {
    get account() {
      return new Account(client);
    },
    get db() {
      return new Databases(client);
    },
    get teams() {
      return new Teams(client);
    },
    get storage() {
      return new Storage(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT)
    .setKey(APPWRITE_API_KEY);

  return {
    get account() {
      return new Account(client);
    },
    get db() {
      return new Databases(client);
    },
    get teams() {
      return new Teams(client);
    },
    get storage() {
      return new Storage(client);
    },
    get users() {
      return new Users(client);
    },
  };
}
