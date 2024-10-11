import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSessionClient } from "./lib/appwrite";
import { Query } from "node-appwrite";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // List of available roles that grant access to the admin dashboard
  const availableRoles = ['Admin', 'pr', 'finance', 'hr', 'users', 'kk'];
  
  // These routes are public for anyone. Required for the application to work properly
  if (req.nextUrl.pathname.startsWith("/_next")) {
    return res;
  }

  const isEditRoute = req.nextUrl.pathname.endsWith("/edit");
  const isPuckRoute = req.nextUrl.pathname.startsWith("/puck");
  const authPath = "/auth";
  const adminPath = "/admin";

  const { account, teams } = await createSessionClient();

  // Check if the user is authenticated
  let user;
  try {
    user = await account.get();
  } catch (error) {
    // If the user is not authenticated and tries to access admin paths, redirect them to the login page
    if (req.nextUrl.pathname.startsWith(adminPath)) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return res;
  }

  // If the user is authenticated and attempts to access auth pages (e.g., login), redirect them to the homepage
  if (user.$id && req.nextUrl.pathname.startsWith(authPath)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Retrieve the user's teams and check if any of their team roles match the available roles
  const userTeams = await teams.list([
    Query.equal('name', availableRoles)
  ]);

  const userRoles = userTeams.teams.map((team) => team.name);

  const canEditPages = userRoles.includes("Admin") || userRoles.includes("PR");

  if (isEditRoute) {
    if (!canEditPages) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    const pathWithoutEdit = req.nextUrl.pathname.slice(0, -5);
    const pathWithEditPrefix = `/puck${pathWithoutEdit}`;
    return NextResponse.rewrite(new URL(pathWithEditPrefix, req.url));
  }
  // If the user does not have a matching role and tries to access the admin path, redirect them
  const hasAccess = userRoles.some((role) => availableRoles.includes(role));
  if (!hasAccess && req.nextUrl.pathname.startsWith(adminPath)) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return res;
}
