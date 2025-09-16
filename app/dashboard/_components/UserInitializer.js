"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

function UserInitializer({ children }) {
  const { user } = useUser();
  const createUser = useMutation(api.user.createuser);

  useEffect(() => {
    const initializeUser = async () => {
      if (user?.primaryEmailAddress?.emailAddress) {
        try {
          console.log(
            "Initializing user:",
            user.primaryEmailAddress.emailAddress
          );
          const result = await createUser({
            email: user.primaryEmailAddress.emailAddress,
            userName: user.fullName || user.firstName || "User",
            imageURL: user.imageUrl || "",
          });
          console.log("User initialization result:", result);
        } catch (error) {
          console.log("User initialization error:", error);
          // User might already exist, which is fine
        }
      }
    };

    initializeUser();
  }, [user, createUser]);

  return children;
}

export default UserInitializer;
