"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import {
  ArrowRight,
  BookOpenCheck,
  Bold,
  Check,
  Download,
  FileText,
  Filter,
  GraduationCap,
  Heading2,
  Italic,
  Linkedin,
  List,
  Mail,
  Menu,
  Search,
  Sparkles,
  Upload,
  UserCircle2,
  Users,
  X,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { BrandLogo } from "../../components/ui/BrandLogo";
import { api } from "../../convex/_generated/api";
import { useUser } from "../../lib/GoogleAuthContext";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#about", label: "About" },
];

const HomePage = () => {
  const { user } = useUser();
  const createuser = useMutation(api.user.createuser);

  useEffect(() => {
    if (!user) return;
    createuser({
      email: user?.primaryEmailAddress?.emailAddress,
      imageURL: user?.imageUrl,
      userName: user?.fullName,
    }).catch((error) => console.error("User sync failed:", error));
  }, [user, createuser]);

  return (
    <div className="min-h-dvh bg-background">
      <SiteNav signedIn={!!user} />
      <main>
        <Hero signedIn={!!user} />
        <Features />
        <HowItWorks />
        <About />
        <FinalCta signedIn={!!user} />
      </main>
      <SiteFooter />
    </div>
  );
};

export default HomePage;

/* ---------------------------------------------------------------- Nav */

function SiteNav({ signedIn }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <BrandLogo priority />

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          {signedIn ? (
            <Button asChild>
              <Link href="/dashboard">
                Open dashboard <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Get started free</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-secondary md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div id="mobile-nav" className="border-t bg-background px-4 pb-6 pt-2 md:hidden">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 font-medium hover:bg-secondary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-2">
            {signedIn ? (
              <Button asChild size="lg">
                <Link href="/dashboard">Open dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link href="/sign-up">Get started free</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

/* --------------------------------------------------------------- Hero */

function Hero({ signedIn }) {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px]">
        <div className="absolute left-1/2 top-[-180px] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/25 via-cyan-400/20 to-ai/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.6)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.6)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
        <p className="mx-auto inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
          <span className="flex h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
          Free for every student · Sign in with Google
        </p>

        <h1
          id="hero-title"
          className="mx-auto mt-6 max-w-4xl text-4xl font-semibold leading-[1.08] text-foreground [text-wrap:balance] sm:text-5xl lg:text-6xl"
        >
          Your semester, <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">organised</span>.
          PYQs, AI notes and classmates in one place.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground [text-wrap:pretty]">
          Stop hunting for last year&apos;s papers in group chats. CampusSphere gives you a shared PYQ library,
          a workspace where AI answers questions from your own PDFs, and a directory of students to learn with.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href={signedIn ? "/dashboard" : "/sign-up"}>
              {signedIn ? "Go to your dashboard" : "Start studying smarter"}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <a href="#how-it-works">See how it works</a>
          </Button>
        </div>

        <div className="relative mx-auto mt-16 max-w-5xl">
          <WorkspaceMockup />
          <FloatingCard className="-left-8 bottom-8 hidden lg:flex" delay="0.2s">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpenCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="text-left">
              <p className="text-xs text-muted-foreground">New PYQ added</p>
              <p className="text-sm font-semibold">Operating Systems · 2024</p>
            </div>
          </FloatingCard>
          <FloatingCard className="-right-8 top-20 hidden lg:flex" delay="0.35s">
            <div className="flex -space-x-2" aria-hidden="true">
              {["AK", "RS", "MJ"].map((n, i) => (
                <span
                  key={n}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-card text-[11px] font-semibold text-white ${
                    ["bg-primary", "bg-cyan-600", "bg-ai"][i]
                  }`}
                >
                  {n}
                </span>
              ))}
            </div>
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Study partners</p>
              <p className="text-sm font-semibold">3 classmates know DBMS</p>
            </div>
          </FloatingCard>
        </div>
      </div>
    </section>
  );
}

function FloatingCard({ className = "", delay, children }) {
  return (
    <div
      aria-hidden="true"
      style={{ animationDelay: delay }}
      className={`absolute z-10 animate-fade-up items-center gap-3 rounded-xl border bg-card/95 px-4 py-3 shadow-xl shadow-slate-900/10 backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

// A static, illustrative recreation of the real workspace screen.
function WorkspaceMockup() {
  return (
    <figure
      className="overflow-hidden rounded-2xl border bg-card text-left shadow-2xl shadow-primary/10 ring-1 ring-slate-900/5"
      aria-label="Preview of the CampusSphere workspace: notes on the left, the PDF on the right, with an AI answer drawn from the PDF"
    >
      <div className="flex items-center gap-2 border-b bg-secondary/60 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-amber-400" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-emerald-400" aria-hidden="true" />
        <span className="ml-3 flex items-center gap-2 truncate text-xs font-medium text-muted-foreground">
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          DBMS – Unit 3 Normalization.pdf
        </span>
        <span className="ml-auto hidden items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success sm:flex">
          <Check className="h-3 w-3" aria-hidden="true" /> Saved
        </span>
      </div>

      <div className="grid md:grid-cols-2">
        {/* Notes pane */}
        <div className="border-b md:border-b-0 md:border-r">
          <div className="flex items-center gap-1 border-b px-4 py-2 text-muted-foreground" aria-hidden="true">
            {[Heading2, Bold, Italic, List].map((Icon, i) => (
              <span key={i} className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-secondary">
                <Icon className="h-4 w-4" />
              </span>
            ))}
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-ai px-2.5 py-1 text-xs font-semibold text-ai-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Ask AI
            </span>
          </div>
          <div className="space-y-3 p-5 text-sm">
            <p className="font-display text-lg font-semibold">Unit 3: Normal forms</p>
            <p className="text-muted-foreground">Key idea: remove redundancy by splitting relations on dependencies.</p>
            <p>
              <mark className="rounded bg-primary/15 px-1 py-0.5 text-foreground">
                How is BCNF different from 3NF?
              </mark>
            </p>
            <div className="rounded-xl border border-ai/25 bg-ai/5 p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-ai">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Answer from your PDF
              </p>
              <p className="mt-2 leading-relaxed text-foreground/90">
                BCNF is stricter: every determinant must be a candidate key. 3NF still allows a dependency
                X → A when A is part of some candidate key.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">Based on pages 14–15</p>
            </div>
          </div>
        </div>

        {/* PDF pane */}
        <div className="hidden bg-secondary/40 p-6 md:block" aria-hidden="true">
          <div className="mx-auto h-full max-w-sm rounded-lg bg-card p-6 shadow-sm ring-1 ring-border">
            <div className="h-3 w-2/3 rounded bg-foreground/80" />
            <div className="mt-5 space-y-2">
              {[100, 92, 96, 70].map((w, i) => (
                <div key={i} className="h-2 rounded bg-muted-foreground/20" style={{ width: `${w}%` }} />
              ))}
            </div>
            <div className="mt-5 space-y-2 rounded-md bg-primary/10 p-2 ring-1 ring-primary/30">
              {[96, 100, 64].map((w, i) => (
                <div key={i} className="h-2 rounded bg-primary/40" style={{ width: `${w}%` }} />
              ))}
            </div>
            <div className="mt-5 space-y-2">
              {[88, 100, 94, 80, 60].map((w, i) => (
                <div key={i} className="h-2 rounded bg-muted-foreground/20" style={{ width: `${w}%` }} />
              ))}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-10 rounded border border-dashed border-muted-foreground/30" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ----------------------------------------------------------- Features */

function SectionHeading({ eyebrow, title, body, id }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-3xl font-semibold [text-wrap:balance] sm:text-4xl">
        {title}
      </h2>
      {body && <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{body}</p>}
    </div>
  );
}

function FeatureCard({ icon: Icon, tone = "primary", title, body, className = "", children }) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    ai: "bg-ai/10 text-ai",
    cyan: "bg-cyan-500/10 text-cyan-700",
    success: "bg-success/10 text-success",
  };
  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-shadow duration-200 hover:shadow-lg hover:shadow-slate-900/5 ${className}`}
    >
      <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-xl font-semibold">{title}</h3>
      <p className="mt-2 leading-relaxed text-muted-foreground">{body}</p>
      {children && (
        <div className="mt-6 flex-1" aria-hidden="true">
          {children}
        </div>
      )}
    </article>
  );
}

function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-t bg-card/50 py-20 sm:py-28" aria-labelledby="features-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="features-title"
          eyebrow="What's inside"
          title="Four tools that replace the WhatsApp-group scramble"
          body="Each one does one job well, and they work better together."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          <FeatureCard
            icon={Sparkles}
            tone="ai"
            title="AI study workspace"
            body="Upload lecture notes or a textbook chapter. Write notes next to the PDF, highlight a question, and get an answer pulled from that document, not the open internet."
            className="lg:col-span-2"
          >
            <div className="grid gap-3 rounded-xl border bg-background p-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="text-sm">
                  <mark className="rounded bg-primary/15 px-1">Explain the producer–consumer problem</mark>
                </p>
                <p className="mt-2 text-xs text-muted-foreground">Select text, then click Ask AI</p>
              </div>
              <span className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-ai px-3 py-2 text-xs font-semibold text-ai-foreground">
                <Sparkles className="h-3.5 w-3.5" /> Ask AI
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1">
                <Download className="h-3 w-3" /> Export to DOCX or PDF
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1">
                <FileText className="h-3 w-3" /> Private to you
              </span>
            </div>
          </FeatureCard>

          <FeatureCard
            icon={BookOpenCheck}
            title="PYQ library"
            body="Previous year papers shared by your seniors, filterable by semester and subject."
          >
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
                  <Filter className="h-3 w-3" /> 5th Sem
                </span>
                <span className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">Computer Networks</span>
              </div>
              {["CN Mid-Sem 2024", "CN End-Sem 2023"].map((t) => (
                <div key={t} className="flex items-center gap-3 rounded-lg border bg-background px-3 py-2.5">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{t}</span>
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </FeatureCard>

          <FeatureCard
            icon={Users}
            tone="cyan"
            title="Skill-based community"
            body="Find classmates by what they know, not just who you already follow. Recommendations match your skills."
          >
            <div className="rounded-xl border bg-background p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-sm font-semibold text-white">
                  PS
                </span>
                <div>
                  <p className="text-sm font-semibold">Priya S.</p>
                  <p className="text-xs text-muted-foreground">CSE · Batch 2026</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["React", "DBMS", "Python"].map((s, i) => (
                  <span
                    key={s}
                    className={`rounded-full px-2 py-0.5 text-xs ${i === 1 ? "bg-success/10 text-success" : "bg-secondary"}`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            icon={UserCircle2}
            tone="success"
            title="A profile that gets you found"
            body="Department, batch, skills and LinkedIn in one card, so the right people can reach you."
          >
            <div className="rounded-xl border bg-background p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Profile strength</span>
                <span className="font-semibold text-success">85%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[85%] rounded-full bg-success" />
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            icon={Search}
            title="Everything searchable"
            body="Search your documents, papers and people from the dashboard. Nothing gets lost in a scroll-back again."
          >
            <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2.5 text-sm text-muted-foreground">
              <Search className="h-4 w-4" /> Search &ldquo;compiler design&rdquo;
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- How it works */

const STEPS = [
  {
    icon: GraduationCap,
    title: "Sign in and set up your profile",
    body: "One click with Google. Add your department, batch and a few skills so classmates can find you.",
  },
  {
    icon: Upload,
    title: "Bring your material",
    body: "Upload a PDF to your private workspace, or share a past paper with everyone in the PYQ library.",
  },
  {
    icon: Sparkles,
    title: "Study with help",
    body: "Ask AI about your PDF, export your notes before the exam, and reach out to peers who know the topic.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-20 sm:py-28" aria-labelledby="how-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="how-title" eyebrow="How it works" title="From sign-in to studying in under a minute" />
        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="relative rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- About */

function About() {
  return (
    <section id="about" className="scroll-mt-20 border-t bg-card/50 py-20 sm:py-28" aria-labelledby="about-title">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid items-center gap-10 rounded-3xl border bg-card p-8 shadow-sm md:grid-cols-[auto_1fr] md:p-12">
          <div className="relative mx-auto">
            <div aria-hidden="true" className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-primary to-cyan-400 opacity-70 blur-md" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/sunam.jpg"
              alt="Sunam Kundal"
              width={176}
              height={176}
              loading="lazy"
              className="relative h-36 w-36 rounded-full border-4 border-card object-cover md:h-44 md:w-44"
            />
          </div>

          <div className="text-center md:text-left">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Why I built this</p>
            <h2 id="about-title" className="mt-3 text-3xl font-semibold">
              Sunam Kundal
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
              I built CampusSphere with one belief:{" "}
              <strong className="font-semibold text-foreground">
                learning shouldn&apos;t be limited by communication gaps.
              </strong>{" "}
              PYQs and study materials often get lost in chats or locked within batches. Access can literally change
              outcomes.
            </p>
            <blockquote className="mt-4 border-l-2 border-primary pl-4 text-left font-medium italic text-foreground/80">
              Let&apos;s collaborate, share resources, and ensure knowledge flows forward.
            </blockquote>

            <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
              <Button asChild variant="outline">
                <a href="mailto:kundalsunam@gmail.com">
                  <Mail aria-hidden="true" /> Email
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="https://github.com/sunamkundal01" target="_blank" rel="noopener noreferrer">
                  <GithubMark /> GitHub
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="https://www.linkedin.com/in/sunamkundal/" target="_blank" rel="noopener noreferrer">
                  <Linkedin aria-hidden="true" /> LinkedIn
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GithubMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

/* ------------------------------------------------------- CTA + footer */

function FinalCta({ signedIn }) {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-slate-950 px-6 py-16 text-center text-white sm:px-12">
        <div aria-hidden="true" className="absolute -top-24 left-1/2 h-72 w-[600px] -translate-x-1/2 rounded-full bg-primary/40 blur-3xl" />
        <h2 className="relative text-3xl font-semibold [text-wrap:balance] sm:text-4xl">
          Your next exam prep starts here
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-slate-300">
          Join your classmates, grab the papers you need, and let AI handle the &ldquo;wait, what does this mean?&rdquo;
          moments.
        </p>
        <Button asChild size="lg" className="relative mt-8 bg-white text-slate-950 shadow-none hover:bg-white/90">
          <Link href={signedIn ? "/dashboard" : "/sign-up"}>
            {signedIn ? "Open dashboard" : "Create your free account"} <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <BrandLogo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            The academic collaboration platform for sharing PYQs, studying with AI, and finding classmates who can help.
          </p>
        </div>
        <FooterColumn
          title="Product"
          links={[
            { href: "#features", label: "Features" },
            { href: "#how-it-works", label: "How it works" },
            { href: "/dashboard/pyqs", label: "PYQ library" },
          ]}
        />
        <FooterColumn
          title="Account"
          links={[
            { href: "/sign-in", label: "Sign in" },
            { href: "/sign-up", label: "Create account" },
            { href: "/dashboard/profile", label: "Your profile" },
          ]}
        />
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} CampusSphere. Made for students, by a student.
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
