import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  if (pathname.startsWith('/auth')) {
    const sessionCookie = req.cookies.get('x-biso-session');
    if (sessionCookie?.value) {
      const redirectTo = searchParams.get('redirectTo');
      const target = redirectTo ? decodeURIComponent(redirectTo) : '/admin';
      return NextResponse.redirect(new URL(target, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/auth/:path*',
    '/admin/:path*'
  ],
};