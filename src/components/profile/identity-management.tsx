"use client";

import { useMemo, useState, useTransition } from "react";
import { clientAccount, clientFunctions } from "@/lib/appwrite-client";
import { removeIdentity } from "@/lib/actions/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Link2, Trash2, CheckCircle2, CircleAlert } from "lucide-react";
import { OAuthProvider } from "appwrite";

type Identity = {
  $id: string;
  provider: string;
  providerUid?: string;
};

type MembershipState =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "active"; membership: any }
  | { state: "inactive" }
  | { state: "error"; message?: string };

export function IdentityManagement({ initialIdentities, initialMembership }: { initialIdentities: Identity[] | undefined; initialMembership?: any }) {
  const [identities, setIdentities] = useState<Identity[] | undefined>(initialIdentities);
  const [isLinking, startLinkTransition] = useTransition();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [membership, setMembership] = useState<MembershipState>(() => {
    if (initialMembership && initialMembership.ok) {
      return initialMembership.active
        ? { state: "active", membership: initialMembership.membership }
        : { state: "inactive" };
    }
    if (initialMembership && initialMembership.error) {
      return { state: "error", message: String(initialMembership.error) };
    }
    return { state: "idle" };
  });

  const canRemove = (id: Identity) => {
    const provider = (id.provider || "").toLowerCase();
    // Keep core email/magic-url intact to avoid locking user out
    if (provider === "email" || provider === "magic-url" || provider === "magicurl") return false;
    // Avoid removing the last remaining identity
    if ((identities?.length || 0) <= 1) return false;
    return true;
  };

  const providerLabel = (p: string) => {
    const key = (p || "").toLowerCase();
    if (key === "microsoft") return "BISO (Microsoft)";
    if (key === "oidc") return "BI Student (OIDC)";
    if (key === "email") return "Email";
    if (key === "magic-url" || key === "magicurl") return "Magic URL";
    return p;
  };

  const successUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/profile?linked=1`;
  }, []);

  const failureUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/profile?error=oauth_failed`;
  }, []);

  const linkProvider = (provider: OAuthProvider) => {
    startLinkTransition(async () => {
      try {
        await clientAccount.createOAuth2Session(provider, successUrl, failureUrl, ["openid", "email", "profile"]);
        // Browser will redirect; no-op here
      } catch (err: any) {
        toast({ title: "Linking failed", description: String(err?.message || err), variant: "destructive" });
      }
    });
  };

  const checkMembership = async () => {
    setMembership({ state: "checking" });
    try {
      const exec: any = await clientFunctions.createExecution("verify_biso_membership", undefined, false);
      const payload = (() => {
        try { return JSON.parse(exec?.responseBody || exec?.response || "{}"); } catch { return {}; }
      })();
      const isActive = !!payload?.membership?.status || payload?.active === true;
      if (isActive) {
        setMembership({ state: "active", membership: payload?.membership || payload });
        toast({ title: "Membership verified", description: "Your BI Student membership is active." });
      } else if (payload?.error) {
        setMembership({ state: "error", message: String(payload.error) });
        toast({ title: "Verification failed", description: String(payload.error), variant: "destructive" });
      } else {
        setMembership({ state: "inactive" });
        toast({ title: "No active membership found" });
      }
    } catch (err: any) {
      setMembership({ state: "error", message: String(err?.message || err) });
      toast({ title: "Verification error", description: String(err?.message || err), variant: "destructive" });
    }
  };

  const onRemove = async (identity: Identity) => {
    if (!canRemove(identity)) return;
    setRemovingId(identity.$id);
    try {
      const res = await removeIdentity(identity.$id);
      if (res?.success) {
        setIdentities((prev) => (prev || []).filter((i) => i.$id !== identity.$id));
        toast({ title: "Identity removed" });
      } else {
        toast({ title: "Failed to remove", description: String(res?.error || "Unknown error"), variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Failed to remove", description: String(err?.message || err), variant: "destructive" });
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border border-primary/10 bg-white">
        <CardHeader>
          <CardTitle>Linked Accounts</CardTitle>
          <CardDescription>
            Link your BISO account (Microsoft) and your BI Student account (OIDC). Linking your BI Student account
            lets us verify your paid semester membership for benefits and discounts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => linkProvider(OAuthProvider.Microsoft)} disabled={isLinking} className="rounded-lg">
              <Link2 className="mr-2 h-4 w-4" /> Link BISO (Microsoft)
            </Button>
            <Button variant="outline" onClick={() => linkProvider(OAuthProvider.Oidc)} disabled={isLinking} className="rounded-lg">
              <Link2 className="mr-2 h-4 w-4" /> Link BI Student (OIDC)
            </Button>
          </div>
          <p className="text-xs text-primary-60">When linking, you will be redirected to complete the OAuth flow.</p>
        </CardContent>
      </Card>

      <Card className="border border-primary/10 bg-white">
        <CardHeader>
          <CardTitle>Connected Identities</CardTitle>
          <CardDescription>Accounts currently connected to your profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(identities?.length || 0) === 0 ? (
            <div className="text-sm text-primary-60">No identities linked yet.</div>
          ) : (
            identities!.map((id) => (
              <div key={id.$id} className="flex items-center justify-between rounded-lg border border-primary/10 bg-white px-3 py-2">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{providerLabel(id.provider)}</Badge>
                  <div className="text-sm text-primary-80 truncate max-w-[28ch]" title={id.providerUid || id.$id}>
                    {id.providerUid || id.$id}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => onRemove(id)}
                  disabled={!canRemove(id) || removingId === id.$id}
                >
                  <Trash2 className="mr-1 h-4 w-4" /> Remove
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border border-primary/10 bg-white">
        <CardHeader>
          <CardTitle>BI Student Membership</CardTitle>
          <CardDescription>Verify your semester fee status using your BI Student (OIDC) identity</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm">
            {membership.state === "active" ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-green-700">Active membership</span>
              </>
            ) : membership.state === "inactive" ? (
              <>
                <CircleAlert className="h-4 w-4 text-amber-600" />
                <span className="text-amber-700">No active membership found</span>
              </>
            ) : membership.state === "error" ? (
              <>
                <CircleAlert className="h-4 w-4 text-red-600" />
                <span className="text-red-700">{membership.message || "Verification error"}</span>
              </>
            ) : (
              <span className="text-primary-70">Status unknown</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={checkMembership} disabled={membership.state === "checking"} className="rounded-lg">
              {membership.state === "checking" ? "Checking..." : "Check membership"}
            </Button>
            <p className="text-xs text-primary-60">Make sure your BI Student (OIDC) account is linked first.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
