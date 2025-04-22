"use server";
import { createSessionClient, createAdminClient, } from "@/lib/appwrite";
import { create } from "domain";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { ID, Models, OAuthProvider } from "node-appwrite";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
//
export async function getLoggedInUser() {
    try {
        const { account, db } = await createSessionClient();
       
        const user = await account.get();
        console.log("user authenticated:", user.$id);
        
        if (user.$id) {
            try {
                // Try to get the user profile document
                const profile = await db.getDocument('app', 'user', user.$id);
                console.log("Profile found:", profile?.$id);
                return {user, profile};
            } catch (profileError) {
                // If profile doesn't exist, return user but null profile
                console.log("No profile found for user:", user.$id);
                console.error("Profile error:", profileError);
                return { user, profile: null };
            }
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting logged in user!!", error);
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
        const user = await account.createMagicURLToken(ID.unique(), email, `${BASE_URL}/auth/callback`);
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function signInWithOauth() {
	const { account } = await createAdminClient();

  const origin = (await headers()).get("origin");
  
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
  
    (await cookies()).delete("x-biso-session");
    await account.deleteSession("current");
  
    redirect("/auth/login");
  }