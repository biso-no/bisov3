"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Link2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PrivacyControls } from "@/components/privacy-controls";
import { ProfileForm } from "@/app/expenses/profile/profile-form";
import { IdentityManagement } from "@/components/profile/identity-management";

export function ProfileTabs({ userData, identities }: { userData: any; identities?: any[] }) {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <Tabs
      defaultValue="account"
      value={activeTab}
      onValueChange={setActiveTab}
      className="space-y-6"
    >
      <TabsList className="grid w-full grid-cols-3 bg-gray-100">
        <TabsTrigger value="account" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>Account</span>
        </TabsTrigger>
        <TabsTrigger value="privacy" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span>Privacy</span>
        </TabsTrigger>
        <TabsTrigger value="identities" className="flex items-center gap-2">
          <Link2 className="h-4 w-4" />
          <span>Linked Accounts</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="account" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              View and manage your account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm email={userData.user.email} initialData={userData.profile}/>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="privacy" className="space-y-6">
        <PrivacyControls userId={userData.user.$id} />
      </TabsContent>

      <TabsContent value="identities" className="space-y-6">
        <IdentityManagement initialIdentities={identities} />
      </TabsContent>
    </Tabs>
  );
} 
