import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSessionClient } from "./lib/appwrite";
import { Query } from "node-appwrite";

// Define available roles and their corresponding admin paths
const roleAccessMap = {
  'Admin': ['/admin', '/admin/pages', '/admin/posts', '/admin/shop', '/admin/elections', '/admin/users', '/admin/settings'],
  'pr': ['/admin/pages', '/admin/posts'],
  'finance': ['/admin/shop', '/admin/users'],
  'hr': ['/admin/users'],
  'users': [],
  'Control Committee': ['/admin/elections'],
};

const publicPaths = ['/_next', '/auth'];
const adminPath = '/admin';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  const originalUrl = req.nextUrl.protocol + req.headers.get('host') + req.nextUrl.pathname

  // Check if the path is public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return res;
  }

  const { account, teams } = await createSessionClient();

  // Check if the user is authenticated
  let user;
  try {
    user = await account.get();
  } catch (error) {
    
    // If the user is not authenticated and tries to access admin paths, redirect them to the login page
    if ((pathname.startsWith(adminPath) || pathname === '/' || pathname.startsWith('/elections')) && !user) {
      return NextResponse.redirect(new URL("/auth/login", originalUrl));
    }
    return res;
  }

  // If the user is authenticated and attempts to access auth pages, redirect them to the homepage
  if (user.$id && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL("/elections", originalUrl));
  } else if (!user.$id && pathname.startsWith('/elections')) {
    return NextResponse.redirect(new URL("/auth/login", originalUrl));
  }

  // Retrieve the user's teams and roles
  const userTeams = await teams.list([
    Query.equal('name', Object.keys(roleAccessMap))
  ]);
  const userRoles = userTeams.teams.map((team) => team.name);
  

  // Handle edit routes
  if (pathname.endsWith("/edit")) {
    if (!userRoles.includes("Admin") && !userRoles.includes("PR")) {
      return NextResponse.redirect(new URL("/", originalUrl));
    }
    const pathWithoutEdit = pathname.slice(0, -5);
    const pathWithEditPrefix = `/puck${pathWithoutEdit}`;
    return NextResponse.rewrite(new URL(pathWithEditPrefix, originalUrl));
  }

  // Check if the user has access to the requested admin path
  const hasAccess = userRoles.some(role => 
    roleAccessMap[role]?.some(path => pathname.startsWith(path))
  );

  if (pathname === adminPath) {
    // If the user is trying to access /admin, redirect them to their first allowed path
    for (const role of userRoles) {
      if (roleAccessMap[role] && roleAccessMap[role].length > 0) {
        const firstAllowedPath = roleAccessMap[role][0];
        if (firstAllowedPath !== adminPath) {
          return NextResponse.redirect(new URL(firstAllowedPath, originalUrl));
        }
        break; // If the user has Admin role, don't redirect
      }
    }
  }

  if (!hasAccess && pathname.startsWith(adminPath)) {
    return NextResponse.redirect(new URL("/", originalUrl));
  }

  return res;
}