"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import ProfileSetup from "./ProfileSetup";

function ProfileChecker({ children }) {
  const { user } = useUser();
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  const userProfile = useQuery(api.userProfiles.getUserProfile, {
    email: user?.primaryEmailAddress?.emailAddress || "",
  });

  useEffect(() => {
    console.log(
      "ProfileChecker - user:",
      user?.primaryEmailAddress?.emailAddress
    );
    console.log("ProfileChecker - userProfile:", userProfile);

    if (user && userProfile !== undefined) {
      // If user exists but doesn't have a complete profile, show setup
      // This includes: no profile exists (null), or profile exists but isProfileComplete is false or undefined
      const shouldShowSetup =
        !userProfile || userProfile.isProfileComplete !== true;
      console.log("ProfileChecker - shouldShowSetup:", shouldShowSetup);

      if (shouldShowSetup) {
        setShowProfileSetup(true);
      }
    }
  }, [user, userProfile]);

  const handleProfileComplete = () => {
    setShowProfileSetup(false);
  };

  const handleSkipForNow = () => {
    setShowProfileSetup(false);
  };

  return (
    <>
      {children}

      {/* Profile Setup Modal */}
      <ProfileSetup
        isOpen={showProfileSetup}
        onClose={handleSkipForNow}
        onComplete={handleProfileComplete}
      />
    </>
  );
}

export default ProfileChecker;
