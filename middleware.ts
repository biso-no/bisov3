import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getAccount } from "./lib/admin/account";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const session = cookies().get("x-biso-session");

  const account = await getAccount();
  console.log("Account: ", account);

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
    } else if (req.nextUrl.pathname.startsWith("/admin") && !session) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return res;
}
}