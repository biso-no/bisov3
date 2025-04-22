import { Metadata } from "next";
import { ProfileForm } from "./profile-form";
import { getLoggedInUser } from "@/lib/actions/user";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Profile | BISO",
  description: "Manage your profile information",
};

export default async function ProfilePage() {
  const userData = await getLoggedInUser();
  
  // Add debug logging to understand the userData structure
  console.log("User Data in profile page:", userData);
  
  // Only redirect if userData is completely null/undefined
  if (!userData) {
    redirect('/auth/login');
  }
  
  // Get the profile data regardless of structure
  const profileData = userData.profile || userData;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Your Profile
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your personal information and account settings
          </p>
        </div>
        
        <ProfileForm initialData={profileData} />
      </div>
    </div>
  );
} 