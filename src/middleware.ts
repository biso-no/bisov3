import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createSessionClient } from './lib/appwrite';
import { Query } from 'node-appwrite';

// Define the role access map
const roleAccessMap = {
  'Admin': ['/admin', '/admin/pages', '/admin/posts', '/admin/shop', '/admin/elections', '/admin/users', '/admin/settings'],
  'pr': ['/admin/pages', '/admin/posts'],
  'finance': ['/admin/shop', '/admin/users'],
  'hr': ['/admin/users'],
  'Control Committee': ['/admin/elections'],
};

// Define a type for user roles
type UserRole = keyof typeof roleAccessMap | 'users';

// Function to get user roles
async function getUserRoles(request: NextRequest) {
  const sessionCookie = request.cookies.get('x-biso-session');
  
  if (!sessionCookie) {
    return [];
  }

  try {
    const { teams } = await createSessionClient()

    const userTeams = await teams.list([
      Query.equal('name', Object.keys(roleAccessMap))
    ]);
    const userRoles = userTeams.teams.map((team) => team.name);

    return userRoles;
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return [];
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  console.log("Path:", path);

  // Allow access to the auth routes for all users
  if (path.startsWith('/auth/')) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('x-biso-session');
  console.log("Session cookie:", sessionCookie);

  const roles = await getUserRoles(request);

  // If no roles (including 'users'), redirect to login
  if (roles.length === 0) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Add 'users' role for all authenticated users
  roles.push('users');

  // Allow access to the dashboard for all authenticated users
  if (path === '/apps') {
    return NextResponse.next();
  }

  // Check if the user has permission to access the requested path
  const hasPermission = roles.some(role => {
    if (role === 'users') {
      // 'users' role can access /elections and its nested routes
      return path.startsWith('/elections');
    }
    const allowedPaths = roleAccessMap[role as keyof typeof roleAccessMap];
    return allowedPaths && allowedPaths.some(allowedPath => path.startsWith(allowedPath));
  });

  if (!hasPermission) {
    // Redirect to the dashboard if the user doesn't have permission
    return NextResponse.redirect(new URL('/apps', request.url));
  }

  // User has permission, allow the request to proceed
  return NextResponse.next();
}

// Specify which routes this middleware should run for
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}