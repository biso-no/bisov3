import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSessionClient } from "./lib/appwrite";
import { Query } from "node-appwrite";
import {
  networksFeatureFlag,
  eventsFeatureFlag,
  mentoringFeatureFlag,
  jobsFeatureFlag,
  resourcesFeatureFlag,
  messagesFeatureFlag
} from '@/lib/flags';

// Define available roles and their corresponding admin paths
const roleAccessMap = {
  'Admin': ['/admin', '/admin/pages', '/admin/posts', '/admin/shop', '/admin/users', '/admin/settings'],
  'pr': ['/admin/pages', '/admin/posts'],
  'finance': ['/admin/shop', '/admin/users'],
  'hr': ['/admin/users'],
};

const publicPaths = ['/_next', '/auth'];
const adminPath = '/admin';
// During development, most paths are protected
const protectedPaths = ['/', ...Object.values(roleAccessMap).flat()];
// Paths that any authenticated user can access
const authenticatedPaths = ['/expenses'];

// Define route-to-flag mapping for protected pages
const PROTECTED_ROUTES: Record<string, () => Promise<boolean>> = {
  '/alumni/network': networksFeatureFlag,
  '/alumni/events': eventsFeatureFlag,
  '/alumni/mentoring': mentoringFeatureFlag,
  '/alumni/jobs': jobsFeatureFlag,
  '/alumni/resources': resourcesFeatureFlag, 
  '/alumni/messages': messagesFeatureFlag
};

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
    // Redirect to login for any protected or authenticated path
    if (pathname === '/' || 
        protectedPaths.some(path => pathname.startsWith(path)) ||
        authenticatedPaths.some(path => pathname.startsWith(path)) ||
        pathname.startsWith('/edit')) {
      // Encode the current URL to redirect back after authentication
      const currentUrl = encodeURIComponent(pathname);
      return NextResponse.redirect(new URL(`/auth/login?redirectTo=${currentUrl}`, req.url));
    }
    return res;
  }

  // At this point, user is authenticated

  // If the user is authenticated and attempts to access auth pages, redirect them to the homepage
  if (pathname.startsWith('/auth')) {
    // Check if there's a redirectTo parameter
    const redirectTo = req.nextUrl.searchParams.get('redirectTo');
    if (redirectTo) {
      return NextResponse.redirect(new URL(decodeURIComponent(redirectTo), req.url));
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Retrieve the user's teams and roles
  const userTeams = await teams.list([
    Query.equal('name', Object.keys(roleAccessMap))
  ]);
  const userRoles = userTeams.teams.map((team) => team.name);

  // If user is Admin, they can access everything
  if (userRoles.includes('Admin')) {
    return res;
  }

  // If path is in authenticatedPaths, any authenticated user can access it
  if (authenticatedPaths.some(path => pathname.startsWith(path))) {
    return res;
  }

  // Handle Puck edit routes
  if (pathname.startsWith('/edit')) {
    if (!userRoles.includes("PR")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    // Remove /edit prefix and add /puck prefix
    const pathWithoutEdit = pathname.replace('/edit', '');
    const pathWithPuckPrefix = `/puck${pathWithoutEdit}`;
    return NextResponse.rewrite(new URL(pathWithPuckPrefix, req.url));
  }

  // Check if the user has access to the requested admin path
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
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Only check routes in the alumni section
  if (pathname.startsWith('/alumni')) {
    // Check if the route is protected by a feature flag
    for (const [route, flagFn] of Object.entries(PROTECTED_ROUTES)) {
      if (pathname === route || pathname.startsWith(`${route}/`)) {
        // Evaluate the feature flag
        const isEnabled = await flagFn();
        
        // If the feature is disabled, redirect to the dashboard
        if (!isEnabled) {
          return NextResponse.redirect(new URL('/alumni', req.url));
        }
      }
    }
  }

  return res;
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    '/alumni/:path*',
    '/auth/:path*',
    '/admin/:path*',
    '/expenses/:path*',
    '/edit/:path*',
    '/',
  ],
};