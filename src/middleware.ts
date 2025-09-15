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

// Define route types and their access requirements
type RouteAccess = {
  path: string;
  roles?: string[];
  requiresAuth?: boolean;
  featureFlag?: () => Promise<boolean>;
};

// Define all routes and their access requirements
const ROUTES: RouteAccess[] = [
  // Public routes
  { path: '/_next', requiresAuth: false },
  { path: '/auth', requiresAuth: false },
  { path: '/', requiresAuth: false },
  
  // Admin routes
  { path: '/admin', roles: ['Admin'] },
  { path: '/admin/pages', roles: ['Admin', 'pr'] },
  { path: '/admin/posts', roles: ['Admin', 'pr'] },
  { path: '/admin/shop', roles: ['Admin', 'finance'] },
  { path: '/admin/users', roles: ['Admin', 'hr', 'finance'] },
  { path: '/admin/settings', roles: ['Admin'] },
  { path: '/admin/expenses', roles: ['Admin', 'finance'] },
  { path: '/admin/alumni', roles: ['Admin'] },
  { path: '/admin/units', roles: ['Admin', 'hr', 'finance', 'pr'] },
  { path: '/admin/jobs', roles: ['Admin', 'hr', 'pr'] },
  { path: '/admin/events', roles: ['Admin', 'pr'] },
  
  // Authenticated routes (any logged-in user)
  { path: '/expenses', requiresAuth: true },
  
  // Alumni routes with feature flags
  { path: '/alumni/network', requiresAuth: true, featureFlag: networksFeatureFlag },
  { path: '/alumni/events', requiresAuth: true, featureFlag: eventsFeatureFlag },
  { path: '/alumni/mentoring', requiresAuth: true, featureFlag: mentoringFeatureFlag },
  { path: '/alumni/jobs', requiresAuth: true, featureFlag: jobsFeatureFlag },
  { path: '/alumni/resources', requiresAuth: true, featureFlag: resourcesFeatureFlag },
  { path: '/alumni/messages', requiresAuth: true, featureFlag: messagesFeatureFlag },
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Find the matching route configuration
  const routeConfig = ROUTES.find(route => pathname.startsWith(route.path));
  
  // If no route config is found, deny access
  if (!routeConfig) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  
  // Handle public routes
  if (!routeConfig.requiresAuth && !routeConfig.roles) {
    return NextResponse.next();
  }
  
  // Check authentication
  const { account, teams } = await createSessionClient();
  let user;
  try {
    user = await account.get();
  } catch (error) {
    // If not authenticated and route requires auth, redirect to login
    if (routeConfig.requiresAuth || routeConfig.roles) {
      const currentUrl = encodeURIComponent(pathname);
      return NextResponse.redirect(new URL(`/auth/login?redirectTo=${currentUrl}`, req.url));
    }
    return NextResponse.next();
  }
  
  // If authenticated and trying to access auth pages, redirect to intended destination
  if (pathname.startsWith('/auth')) {
    const redirectTo = req.nextUrl.searchParams.get('redirectTo');
    if (redirectTo) {
      return NextResponse.redirect(new URL(decodeURIComponent(redirectTo), req.url));
    }
    return NextResponse.redirect(new URL('/admin', req.url));
  }
  
  // Check role-based access
  if (routeConfig.roles) {
    const userTeams = await teams.list([
      Query.equal('name', routeConfig.roles)
    ]);
    const userRoles = userTeams.teams.map(team => team.name);
    
    // If user is Admin, they can access everything
    if (userRoles.includes('Admin')) {
      return NextResponse.next();
    }
    
    // Check if user has required role
    const hasAccess = userRoles.some(role => routeConfig.roles?.includes(role));
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }
  
  // Check feature flags for alumni routes
  if (routeConfig.featureFlag) {
    const isEnabled = await routeConfig.featureFlag();
    if (!isEnabled) {
      return NextResponse.redirect(new URL('/alumni', req.url));
    }
  }
  
  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    '/alumni/:path*',
    '/auth/:path*',
    '/admin/:path*',
    '/expenses/:path*',
    '/',
  ],
};