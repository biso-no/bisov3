import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getAccount } from "./lib/admin/account";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const session = req.cookies.get("x-biso-session");
  let isUser: boolean;
  let account: any; // Define account here to make it accessible

  if (session) {
    account = await getAccount();
    if (account.$id) {
      isUser = true; // Use assignment
    }
  }

  if (req.method === "GET") {
    // Rewrite routes that match "/[...puckPath]/edit" to "/puck/[...puckPath]"
    if (req.nextUrl.pathname.endsWith("/edit")) {
      const pathWithoutEdit = req.nextUrl.pathname.slice(
        0,
        req.nextUrl.pathname.length - 5
      );
      const pathWithEditPrefix = `/puck${pathWithoutEdit}`;

      return NextResponse.rewrite(new URL(pathWithEditPrefix, req.url));
    }

    // Disable "/puck/[...puckPath]"
    if (req.nextUrl.pathname.startsWith("/puck")) {
      return NextResponse.redirect(new URL("/", req.url));
    } else if (req.nextUrl.pathname.startsWith("/admin") && !account) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return res;
}