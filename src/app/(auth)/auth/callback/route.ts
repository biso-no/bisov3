import { createAdminClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");
  

  const { account } = await createAdminClient();
  const session = await account.createSession(userId, secret);

  cookies().set("x-biso-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  return redirect(`${BASE_URL}/elections`);
}
