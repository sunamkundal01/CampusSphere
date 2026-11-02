"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "../../../lib/GoogleAuthContext";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import ProfileSetup from "./ProfileSetup";

function ProfileChecker({ children }) {
  const { user } = useUser();
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  // Once the student skips or finishes, don't reopen the prompt for the rest of the session.
  const handled = useRef(false);

  const userProfile = useQuery(api.userProfiles.getUserProfile, {
    email: user?.primaryEmailAddress?.emailAddress || "",
  });

  useEffect(() => {
    if (handled.current || !user || userProfile === undefined) return;
    // No profile yet (null), or a profile that isn't marked complete.
    if (!userProfile || userProfile.isProfileComplete !== true) {
      setShowProfileSetup(true);
    }
  }, [user, userProfile]);

  const close = () => {
    handled.current = true;
    setShowProfileSetup(false);
  };

  return (
    <>
      {children}

      {/* Profile Setup Modal */}
      <ProfileSetup isOpen={showProfileSetup} onClose={close} onComplete={close} />
    </>
  );
}

export default ProfileChecker;
