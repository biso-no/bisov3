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
  'users': ['/elections'],
  'Control Committee': ['/admin/elections'],
};

const publicPaths = ['/_next', '/auth'];
const adminPath = '/admin';
const protectedPaths = ['/elections', ...Object.values(roleAccessMap).flat()];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

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
    // Redirect to login for any protected path, including /elections
    if (pathname === '/' || protectedPaths.some(path => pathname === path || pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return res;
  }

  // At this point, user is authenticated
  if (pathname === '/') {
    return NextResponse.redirect(new URL("/elections", req.url));
  }

  // If the user is authenticated and attempts to access auth pages, redirect them to the homepage
  if (pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL("/elections", req.url));
  }

  // Retrieve the user's teams and roles
  const userTeams = await teams.list([
    Query.equal('name', Object.keys(roleAccessMap))
  ]);
  const userRoles = userTeams.teams.map((team) => team.name);
  
  // Add 'users' role for any authenticated user
  if (user.$id) {
    userRoles.push('users');
  }

  // Handle edit routes
  if (pathname.endsWith("/edit")) {
    if (!userRoles.includes("Admin") && !userRoles.includes("PR")) {
      return NextResponse.redirect(new URL("/elections", req.url));
    }
    const pathWithoutEdit = pathname.slice(0, -5);
    const pathWithEditPrefix = `/puck${pathWithoutEdit}`;
    return NextResponse.rewrite(new URL(pathWithEditPrefix, req.url));
  }

  // Check if the user has access to the requested path (including /elections)
  const hasAccess = userRoles.some(role =>
    roleAccessMap[role]?.some(path => pathname.startsWith(path))
  );

  // Handle /admin path
  if (pathname === adminPath) {
    for (const role of userRoles) {
      if (roleAccessMap[role] && roleAccessMap[role].length > 0) {
        const firstAllowedPath = roleAccessMap[role][0];
        if (firstAllowedPath !== adminPath) {
          return NextResponse.redirect(new URL(firstAllowedPath, req.url));
        }
        break;
      }
    }
  }

  // Redirect unauthorized users trying to access admin paths
  if (!hasAccess && pathname.startsWith(adminPath)) {
    return NextResponse.redirect(new URL("/elections", req.url));
  }

  // Additional check for /elections access
  if (pathname === '/elections' && !userRoles.includes('users')) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return res;
}