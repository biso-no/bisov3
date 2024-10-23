import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

//Callback url: http://localhost:3000/auth/callback?membershipId=67176e718fb8ea6a586c&userId=670fb777283897fd3b9a&secret=fbe9f208dc4a55d71f894e4e0bec2d9718788b35bcb6d36b73d143e01f9cc2d8ad052bcc47d72fb991806e0eab41b69178be968338fa193106bd6f4ea6022e8a44b147fd6f0b5a58e31b80973a6b9be369a41711812b8c3384fc9c771aa4528cbe673fb6dea7f57c63be59d5996decc79732d17de163bc09f336980cbed67251&teamId=67176e640024dd5c2c89

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");
  const membershipId = request.nextUrl.searchParams.get("membershipId");
  const teamId = request.nextUrl.searchParams.get("teamId");

  const { account, teams } = await createSessionClient();

  const acceptedInvitation = await teams.updateMembershipStatus(
    teamId,
    membershipId,
    userId,
    secret
  );

  if (acceptedInvitation.joined) {
    return redirect(`/auth/login?joined=true`);
  }

  return redirect(`/auth/login?joined=false`);
}