"use client";

import { useUser } from "../../lib/GoogleAuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export function FullScreenLoader({ label = "Loading your campus…" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-background"
    >
      <Image src="/logo.svg" alt="" width={855} height={133} className="h-8 w-auto" priority />
      <div className="h-1 w-40 overflow-hidden rounded-full bg-secondary">
        <div className="h-full w-1/3 animate-[loader_1.1s_ease-in-out_infinite] rounded-full bg-primary" />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <style>{`@keyframes loader{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}`}</style>
    </div>
  );
}

export function AuthGuard({ children }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/sign-in");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <FullScreenLoader label={loading ? "Loading your campus…" : "Redirecting to sign in…"} />;
  }

  return children;
}
