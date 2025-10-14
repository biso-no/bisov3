import { createAdminClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";


export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");
  const redirectTo = request.nextUrl.searchParams.get("redirectTo");
  const url = request.nextUrl.protocol + request.headers.get('host')
  

  const { account } = await createAdminClient();
  const session = await account.createSession(userId, secret);

  // Session logging for debugging
  console.debug && console.debug("Session:", session);

  (await cookies()).set("a_session_biso", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "none",
    secure: true,
    domain: ".biso.no"
  });

  // Redirect to the original destination if available
  if (redirectTo) {
    return redirect(decodeURIComponent(redirectTo));
  }

  // Default redirect
  return redirect(`/admin`);
}
