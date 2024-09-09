import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getAccount } from "./lib/admin/account";
import { getTeams } from "./lib/server";
import { Query } from "node-appwrite";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const session = req.cookies.get("x-biso-session");
  let account: any;
  let canEditPages = false;

  if (session) {
    account = await getAccount();
    if (account.$id) {
      // Fetch teams that the user belongs to
      const teams = await getTeams([Query.equal('name', ['admin', 'PR'])]);

      // Check if the user is part of the "Admin" or "HR" teams
      const userTeams = teams.teams.map(team => team.name);
      canEditPages = userTeams.includes("admin") || userTeams.includes("PR");
    }
  }

  // If trying to access an "/edit" route, check if the user can edit
  if (req.nextUrl.pathname.endsWith("/edit")) {
    if (!canEditPages) {
      return NextResponse.redirect(new URL("/", req.url)); // Redirect if not authorized
    }

    const pathWithoutEdit = req.nextUrl.pathname.slice(
      0,
      req.nextUrl.pathname.length - 5
    );
    const pathWithEditPrefix = `/puck${pathWithoutEdit}`;

    return NextResponse.rewrite(new URL(pathWithEditPrefix, req.url));
  }

  // Disable "/puck/[...puckPath]" for unauthorized users
  if (req.nextUrl.pathname.startsWith("/puck")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect to login if trying to access "/admin" without being logged in
  if (req.nextUrl.pathname.startsWith("/admin") && !account) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return res;
}
