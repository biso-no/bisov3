"use server";

import { createAdminClient, createSessionClient } from "./appwrite";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ID, OAuthProvider, Query } from "node-appwrite";

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
        `https://localhost:3000/auth/login`
        );

    return redirect(redirectUrl);
}

export async function saveDashboardConfig({
    userId,
    newLayout,
    newGroups,
    layoutId,
  }: {
    userId: string;
    newLayout: DashboardCard[];
    newGroups: Group[];
    layoutId?: string;
  }) {
    const { db } = await createSessionClient();
    try {
      const config = {
        layout: newLayout || [],
        groups: newGroups || []
      };
      if (layoutId) {
        await db.updateDocument('webapp', 'dashboard_customization', layoutId, {
          layout: JSON.stringify(config.layout),
          groups: JSON.stringify(config.groups)
        });
      } else {
      await db.createDocument('webapp', 'dashboard_customization', ID.unique(), {
        userId: userId,
        layout: JSON.stringify(config.layout),
        groups: JSON.stringify(config.groups)
      })}
    } catch (error) {
      console.error('Error saving dashboard config:', error);
    }
  }
  
  export async function loadDashboardConfig(userId: string) {
    const { db } = await createSessionClient();
    try {
      const response = await db.listDocuments('webapp', 'dashboard_customization', [
        Query.equal('userId', userId),
      ]);
      const userConfig = response.documents.find(doc => doc.userId === userId);
      if (userConfig) {
        return {
          layout: JSON.parse(userConfig.layout || '[]'),
          groups: JSON.parse(userConfig.groups || '[]')
        };
      }
      return null;
    }
    catch (error) {
      console.error('Error loading dashboard config:', error);
      return null;
    }
  }

  export async function getTeams(query: string[]) {
    const { account, teams } = await createSessionClient();
  
    return teams.list(query);
  }
  
  export async function getTeam(teamId: string) {
    const { account, teams } = await createSessionClient();
  
    return teams.get(teamId);
  }