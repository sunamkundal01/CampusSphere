"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

const AuthContext = createContext(null);

export function GoogleAuthProvider({ children }) {
  const [googleUser, setGoogleUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          primaryEmailAddress: { emailAddress: firebaseUser.email },
          fullName: firebaseUser.displayName || "",
          firstName: firebaseUser.displayName?.split(" ")[0] || "",
          lastName: firebaseUser.displayName?.split(" ").slice(1).join(" ") || "",
          imageUrl: firebaseUser.photoURL || "",
        };
        setGoogleUser(userData);
      } else {
        setGoogleUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async () => {
    await signInWithPopup(auth, googleProvider);
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setGoogleUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user: googleUser, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useUser must be used within a GoogleAuthProvider");
  }
  return ctx;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth must be used within a GoogleAuthProvider");
  }
  return { signIn: ctx.signIn, signOut: ctx.signOut };
}
