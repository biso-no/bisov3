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
    department?: string;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    zip?: string;
    bank_account?: string;
    swift?: string;
}

export type Profile = ProfileDetails & Models.Document;

export async function updateProfile(profile: Partial<Profile>) { 
    try {
        const { account, db } = await createSessionClient();
        const user = await account.get();
        
        console.log("Updating profile for user:", user.$id);
        console.log("Profile data being sent:", JSON.stringify(profile));
        
        try {
            const existingProfile = await db.getDocument('app', 'user', user.$id);
            console.log("Profile found, updating...", existingProfile.$id);
            return await db.updateDocument('app', 'user', user.$id, profile);
        } catch (profileError) {
            console.log("Profile not found, creating new profile for user:", user.$id);
            console.error("Profile lookup error details:", profileError);
            return await db.createDocument('app', 'user', user.$id, profile);
        }   
    } catch (error) {
        console.error("Error in updateProfile:", error);
        // Check if it's a specific Appwrite error we can handle
        if (typeof error === 'object' && error !== null && 'code' in error) {
            console.error(`Appwrite error code: ${error.code}`);
        }
        return null;
    }
}

export async function createProfile(profile: Partial<Profile>, userId: string) {
    try {
        const { account, db } = await createSessionClient();
        
        const existingProfile = await db.getDocument('app', 'user', userId);

        if (existingProfile) {
            return await db.updateDocument('app', 'user', userId, profile);
        } else {
            return await db.createDocument('app', 'user', userId, profile);
        }        
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getUserPreferences(userId: string) {
    
    const { account, db } = await createSessionClient();
    const user = await account.get();

    if (!user) {
        return null;
    }

    const prefs = user.prefs;
    return prefs;
}

export async function updateUserPreferences(userId: string, prefs: Record<string, any>) {
    const { account, db } = await createSessionClient();
    const user = await account.get();

    if (!user) {
        return null;
    }

    // Merge existing preferences with new ones
    const existingPrefs = user.prefs || {};
    const mergedPrefs = { ...existingPrefs, ...prefs };
    
    const updatedPrefs = await account.updatePrefs(mergedPrefs);
    return updatedPrefs;
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