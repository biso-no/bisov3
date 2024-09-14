import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getAccount } from "./lib/admin/account";
import { getTeams } from "./lib/server";
import { Query } from "node-appwrite";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Check if the user has a session cookie
  const session = req.cookies.get("x-biso-session");
  let account: any;
  let canEditPages = false;

  if (session) {
    try {
      account = await getAccount();
      if (account.$id) {
        // Fetch teams that the user belongs to
        const teams = await getTeams([Query.equal('name', ['Admin', 'PR'])]);

        // Check if the user is part of the "Admin" or "PR" teams
        const userTeams = teams.teams.map(team => team.name);
        canEditPages = userTeams.includes("Admin") || userTeams.includes("PR");
      }
    } catch (error) {
      console.log("Error fetching account or teams:", error);
    }
  }

  const isEditRoute = req.nextUrl.pathname.endsWith("/edit");
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isPuckRoute = req.nextUrl.pathname.startsWith("/puck");

  // Restrict access to "/edit" routes for non-editors
  if (isEditRoute) {
    if (!canEditPages) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const pathWithoutEdit = req.nextUrl.pathname.slice(0, req.nextUrl.pathname.length - 5);
    const pathWithEditPrefix = `/puck${pathWithoutEdit}`;
    return NextResponse.rewrite(new URL(pathWithEditPrefix, req.url));
  }

  // Prevent unauthorized users from accessing "/puck" routes
  if (isPuckRoute && !canEditPages) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect to login if accessing "/admin" without being logged in
  if (isAdminRoute && !account) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return res;
}
