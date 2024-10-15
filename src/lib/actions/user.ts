"use server";
import { createSessionClient, createAdminClient, } from "@/lib/appwrite";
import { create } from "domain";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { ID, Models, OAuthProvider } from "node-appwrite";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export async function getLoggedInUser() {
    try {
        const { account, db } = await createSessionClient();
        const user = await account.get();
        if (user.$id) {
            const profile = await db.getDocument('app', 'user', user.$id);

            return {user, profile};
        }
    } catch (error) {
        console.error("Error getting logged in user", error);
        return null;
    }
}

export async function getCurrentSession() {
    const { account } = await createSessionClient();
    const session = await account.getSession('current');
    return session;
}

export async function getUserById(userId: string) {
    try {
        const { account } = await createSessionClient();
        const user = await account.get();
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function signIn(email: string) {
    try {
        const { account } = await createAdminClient();
        const user = await account.createMagicURLToken(ID.unique(), email, 'https://localhost:3000/auth/callback');
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function signInWithOauth() {
	const { account } = await createAdminClient();

  const origin = headers().get("origin");
  
	const redirectUrl = await account.createOAuth2Token(
		OAuthProvider.Microsoft,
		`${origin}/auth/oauth`,
		`${origin}/auth/login`,
        ["openid", "email", "profile"],
	);

	return redirect(redirectUrl);
};

export async function listIdentities() {
    try {
        const { account } = await createSessionClient();
        const identities = await account.listIdentities();
        return identities;
    } catch (error) {
        console.error(error);
        return null;
    }
}

interface ProfileDetails {
    department: string;
}

export type Profile = ProfileDetails & Models.Document;

export async function updateProfile(profile: Partial<Profile>) { 
    try {
        const { account, db } = await createSessionClient();
        const user = await account.get();
        

        // Update the user's profile in the database
        return await db.updateDocument('app', 'user', user.$id, profile);
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function createJWT() {
    try {
        const { account } = await createSessionClient();
        const jwt = await account.createJWT();
        return jwt.jwt;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function signOut() {
  
    const { account } = await createSessionClient();
  
    cookies().delete("x-biso-session");
    await account.deleteSession("current");
  
    redirect("/signup");
  }