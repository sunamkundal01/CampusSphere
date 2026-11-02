"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, BookOpenCheck, Loader2, Sparkles, Users } from "lucide-react";
import { useAuth, useUser } from "../lib/GoogleAuthContext";
import { BrandLogo } from "./ui/BrandLogo";
import { FullScreenLoader } from "./ui/AuthGuard";

const COPY = {
  "sign-in": {
    title: "Welcome back",
    subtitle: "Sign in to pick up your notes, PYQs and study group where you left them.",
    button: "Continue with Google",
    switchText: "New to CampusSphere?",
    switchLabel: "Create an account",
    switchHref: "/sign-up",
  },
  "sign-up": {
    title: "Join your campus",
    subtitle: "One Google sign-in gets you the PYQ library, an AI study workspace and your classmates.",
    button: "Sign up with Google",
    switchText: "Already have an account?",
    switchLabel: "Sign in",
    switchHref: "/sign-in",
  },
};

const PERKS = [
  {
    icon: BookOpenCheck,
    title: "Previous year papers, sorted",
    body: "Filter PYQs by semester and subject instead of digging through group chats.",
  },
  {
    icon: Sparkles,
    title: "Ask your PDFs anything",
    body: "Highlight a question in your notes and get an answer drawn from the document.",
  },
  {
    icon: Users,
    title: "Find people who know the topic",
    body: "Discover classmates by skill, department and batch, then connect on LinkedIn.",
  },
];

// Map Firebase popup errors to something a student can act on.
function describeError(code) {
  switch (code) {
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return null;
    case "auth/popup-blocked":
      return "Your browser blocked the Google popup. Allow popups for this site and try again.";
    case "auth/network-request-failed":
      return "We couldn't reach Google. Check your connection and try again.";
    default:
      return "Sign-in didn't complete. Please try again.";
  }
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export default function AuthScreen({ mode = "sign-in" }) {
  const copy = COPY[mode];
  const { signIn } = useAuth();
  const { user, loading } = useUser();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  const handleSignIn = async () => {
    setError(null);
    setPending(true);
    try {
      await signIn();
      router.replace("/dashboard");
    } catch (err) {
      console.error("Sign in error:", err);
      setError(describeError(err?.code));
      setPending(false);
    }
  };

  if (loading || user) {
    return <FullScreenLoader label={user ? "Opening your dashboard…" : "Checking your session…"} />;
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel: explains what signing in unlocks */}
      <aside className="relative hidden overflow-hidden bg-slate-950 px-12 py-12 text-white lg:flex lg:flex-col">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-cyan-500/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:44px_44px]"
        />

        <div className="relative">
          <span className="inline-flex rounded-lg bg-white px-3 py-2">
            <BrandLogo className="h-7" />
          </span>
        </div>

        <div className="relative mt-auto max-w-md">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Built by students, for students
          </p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight">
            Everything you need to clear the semester, in one tab.
          </h2>
          <ul className="mt-10 space-y-6">
            {PERKS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                  <Icon className="h-5 w-5 text-cyan-300" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-300">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative mt-12 text-xs text-slate-400">Free for every student. No credit card, no setup.</p>
      </aside>

      {/* Sign-in panel */}
      <main className="flex flex-col px-4 py-8 sm:px-8">
        <div className="lg:hidden">
          <BrandLogo priority />
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="text-3xl font-semibold">{copy.title}</h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">{copy.subtitle}</p>

          <button
            type="button"
            onClick={handleSignIn}
            disabled={pending}
            aria-busy={pending}
            className="mt-10 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-input bg-card px-5 text-sm font-semibold shadow-sm transition-[background-color,box-shadow,transform] hover:bg-secondary hover:shadow active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
          >
            {pending ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-hidden="true" />
            ) : (
              <GoogleIcon />
            )}
            {pending ? "Waiting for Google…" : copy.button}
          </button>

          <div aria-live="polite">
            {error && (
              <p
                role="alert"
                className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {error}
              </p>
            )}
          </div>

          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            We only use your Google name, email and photo to set up your profile. Your workspace PDFs and
            notes stay private to you.
          </p>

          <div className="mt-10 border-t pt-6 text-sm text-muted-foreground">
            {copy.switchText}{" "}
            <Link href={copy.switchHref} className="font-semibold text-primary hover:underline">
              {copy.switchLabel}
            </Link>
          </div>
        </div>

        <Link
          href="/"
          className="mx-auto text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to home
        </Link>
      </main>
    </div>
  );
}
