"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { OnboardingModal } from "./onboarding-modal";
import { useAuth } from "@/lib/hooks/useAuth";

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const { user, profile, isLoading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();
  
  // Paths where we don't want to show the onboarding modal
  const excludedPaths = [
    "/login", 
    "/register", 
    "/auth",
    "/admin",
  ];
  
  // Check if the current path is in the excluded list
  const isExcludedPath = excludedPaths.some(path => pathname.startsWith(path));

  useEffect(() => {
    // Only show the modal if:
    // 1. Auth is loaded
    // 2. User is logged in
    // 3. Profile doesn't exist
    // 4. Not on an excluded path
    if (!isLoading && user && !profile && !isExcludedPath) {
      setShowModal(true);
    }
  }, [isLoading, user, profile, isExcludedPath]);

  const handleCloseModal = () => {
    setShowModal(false);
    // We could set a cookie or local storage flag here to not show the modal again immediately
    localStorage.setItem("onboarding_dismissed", "true");
  };

  return (
    <>
      {children}
      {user && (
        <OnboardingModal
          isOpen={showModal}
          onClose={handleCloseModal}
          userId={user.$id}
        />
      )}
    </>
  );
} 