"use server";

import { createAdminClient, createSessionClient } from "./appwrite";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ID, OAuthProvider, Query } from "node-appwrite";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

interface DashboardCard {
    id: string;
    title: string;
    groupId: string | null;
  }
  
  interface Group {
    id: string;
    name: string;
  }
  
  interface DashboardConfig {
    layout: DashboardCard[];
    groups: Group[];
  }

export async function signInWithAzure() {
    const { account } = await createAdminClient();

    const origin = headers().get("origin");

    const redirectUrl = await account.createOAuth2Token(
        OAuthProvider.Microsoft,
        `${origin}/auth/oauth/`,
        `${origin}/auth/login`
        );

    return redirect(redirectUrl);
}

export async function signInWithMagicLink(email: string) {
    const { account } = await createAdminClient();

    const origin = headers().get("origin");

    const redirectUrl = await account.createMagicURLToken(
        ID.unique(),
        email,
        `${origin}/auth/callback`
        );

    return redirectUrl ? true : false;
}

export async function createMagicLinkSession(userId: string, secret: string) {
    const { account } = await createSessionClient();

    const session = await account.updateMagicURLSession(userId, secret);

    return session;
}

  export async function getTeams(query: string[]) {
    const { account, teams } = await createSessionClient();
  
    return teams.list(query);
  }
  
  export async function getTeam(teamId: string) {
    const { account, teams } = await createSessionClient();
  
    return teams.get(teamId);
  }
