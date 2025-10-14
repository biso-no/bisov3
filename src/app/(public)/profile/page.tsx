import { Metadata } from "next";
import Link from "next/link";
import { getLoggedInUser, listIdentities } from "@/lib/actions/user";
import { checkMembership } from "@/lib/profile";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileHead } from "@/components/profile/profile-head";
import { ProfileTabs } from "@/components/profile/profile-tabs";

export const metadata: Metadata = {
  title: "Your Profile | BISO",
  description: "View and manage your profile and privacy settings.",
};

export default async function PublicProfilePage() {
  const userData = await getLoggedInUser();
  const [identitiesResp, membership] = userData
    ? await Promise.all([listIdentities(), checkMembership()])
    : [null, null];

  if (!userData) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-5xl">
        <ProfileHead />
        <Card className="border border-primary/10 bg-white">
          <CardHeader>
            <CardTitle>Sign in to view your profile</CardTitle>
            <CardDescription>
              You need to be signed in to view and edit your profile details.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Button asChild className="rounded-lg">
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <span className="text-sm text-primary-60">You can continue browsing other pages without signing in.</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      <ProfileHead />
      {/* Summary header */}
      {(() => {
        const displayName = userData.profile?.name || userData.user.name || "User";
        const initials = displayName
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((s) => s[0]?.toUpperCase())
          .join("");
        return (
          <Card className="mb-6 overflow-hidden border border-primary/10 bg-white">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="bg-primary/10 text-primary-80">
                  {initials || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <CardTitle className="truncate text-xl font-semibold text-primary-100">
                  {displayName}
                </CardTitle>
                <CardDescription className="truncate text-primary-60">
                  {userData.user.email || "No email on file"}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        );
      })()}
      <ProfileTabs userData={userData} identities={identitiesResp?.identities} membership={membership} />
    </div>
  );
}
