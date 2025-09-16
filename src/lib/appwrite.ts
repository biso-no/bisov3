"use server";
import { Client, Account, Databases, Teams, Storage, Users, Functions, Messaging } from "node-appwrite";
import { cookies } from "next/headers";

const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;
const APPWRITE_PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "biso"
const NEXT_PUBLIC_APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://appwrite.biso.no/v1";

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT)

  const session = (await cookies()).get("x-biso-session");

  client.setSession(session?.value);

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
    get functions() {
      return new Functions(client);
    },
    get messaging() {
      return new Messaging(client);
    }
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(NEXT_PUBLIC_APPWRITE_ENDPOINT)
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
    get functions() {
      return new Functions(client);
    },
    get messaging() {
      return new Messaging(client);
    }
  };
}
