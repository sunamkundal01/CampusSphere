"use client";

import Link from "next/link";
import React from "react";
import { useQuery } from "convex/react";
import { ArrowRight, BookOpenCheck, FileText, FolderOpen, Sparkles, Upload, Users } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { useUser } from "../../lib/GoogleAuthContext";
import { greeting } from "../../lib/display";
import { Button } from "../../components/ui/button";
import UploadPrivatePdf from "./_components/UploadPrivatePdf";
import UploadPyq from "./_components/UploadPyq";
import { MemberCard } from "./_components/MemberCard";
import {
  CardSkeleton,
  DocumentCard,
  EmptyState,
  PyqRow,
  SectionCard,
  SeeAllLink,
} from "./_components/PageParts";

const Dashboard = () => {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const fileList = useQuery(api.fileStorage.GetUserFiles, { userEmail: email });
  const pyqs = useQuery(api.pyqStorage.GetAllPyqFiles);
  const members = useQuery(api.userProfiles.getAllUsers);
  const recommended = useQuery(api.userProfiles.getRecommendedUsers, { userEmail: email || "" });
  const profile = useQuery(api.userProfiles.getUserProfile, { email: email || "" });

  const recentFiles = fileList ? [...fileList].sort((a, b) => b._creationTime - a._creationTime).slice(0, 4) : undefined;
  const myPyqCount = pyqs?.filter((p) => p.uploadedBy === email).length;
  const classmates = members?.filter((m) => m.email !== email).length;
  const firstName = profile?.name?.split(" ")[0] || user?.firstName || "there";

  const stats = [
    { label: "Documents in your workspace", value: fileList?.length, icon: FolderOpen, href: "/dashboard/workspace" },
    { label: "Papers in the PYQ library", value: pyqs?.length, icon: BookOpenCheck, href: "/dashboard/pyqs" },
    { label: "Classmates on CampusSphere", value: classmates, icon: Users, href: "/dashboard/community" },
    { label: "Papers you've shared", value: myPyqCount, icon: Upload, href: "/dashboard/pyqs" },
  ];

  return (
    <div className="space-y-8">
      {/* Greeting + primary actions */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white sm:px-10 sm:py-10">
        <div aria-hidden="true" className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-primary/50 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-32 right-40 h-64 w-64 rounded-full bg-cyan-500/30 blur-3xl" />
        <div className="relative">
          <p className="text-sm text-slate-300">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
            {greeting()}, {firstName}
          </h1>
          <p className="mt-3 max-w-xl text-slate-300">
            What are you working on today? Upload a PDF to study with AI, or grab a past paper to practise.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <UploadPrivatePdf>
              <Button size="lg" className="bg-white text-slate-950 shadow-none hover:bg-white/90">
                <Sparkles aria-hidden="true" /> Study a PDF with AI
              </Button>
            </UploadPrivatePdf>
            <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
              <Link href="/dashboard/pyqs">
                <BookOpenCheck aria-hidden="true" /> Browse PYQs
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Your numbers" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-2xl border bg-card p-4 shadow-sm transition-colors hover:border-primary/40 sm:p-5"
          >
            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="mt-4 font-display text-3xl font-semibold tabular-nums">
              {value === undefined ? <span className="inline-block h-8 w-10 animate-pulse rounded bg-secondary" /> : value}
            </p>
            <p className="mt-1 text-sm leading-snug text-muted-foreground">{label}</p>
          </Link>
        ))}
      </section>

      {/* Recent documents */}
      <section aria-labelledby="recent-docs">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="recent-docs" className="text-xl font-semibold">
            Continue studying
          </h2>
          {fileList?.length > 0 && <SeeAllLink href="/dashboard/workspace" />}
        </div>
        {recentFiles === undefined ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <CardSkeleton key={i} className="h-52" />
            ))}
          </div>
        ) : recentFiles.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {recentFiles.map((file) => (
              <DocumentCard key={file._id} file={file} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Sparkles}
            title="Your workspace is empty"
            body="Upload a PDF, write notes next to it, and highlight any question to get an answer drawn from the document."
            action={
              <UploadPrivatePdf>
                <Button>
                  <Upload aria-hidden="true" /> Upload your first PDF
                </Button>
              </UploadPrivatePdf>
            }
          />
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Latest PYQs */}
        <SectionCard
          title="Latest in the PYQ library"
          className="lg:col-span-3"
          action={pyqs?.length > 0 ? <SeeAllLink href="/dashboard/pyqs" /> : null}
        >
          {pyqs === undefined ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <CardSkeleton key={i} className="h-[74px] rounded-xl" />
              ))}
            </div>
          ) : pyqs.length > 0 ? (
            <div className="space-y-3">
              {pyqs.slice(0, 4).map((file) => (
                <PyqRow key={file._id} file={file} compact />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="No papers yet"
              body="Be the first to share a previous year paper with your campus."
              className="border-0 bg-transparent py-8"
              action={
                <UploadPyq>
                  <Button variant="outline">Share a PYQ</Button>
                </UploadPyq>
              }
            />
          )}
        </SectionCard>

        {/* Study partners */}
        <SectionCard
          title="Suggested study partners"
          className="lg:col-span-2"
          action={<SeeAllLink href="/dashboard/community">Community</SeeAllLink>}
        >
          {recommended === undefined || profile === undefined ? (
            <div className="space-y-3">
              {[0, 1].map((i) => (
                <CardSkeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : recommended.length > 0 ? (
            <div className="space-y-3">
              {recommended.slice(0, 2).map((m) => (
                <MemberCard key={m._id} member={m} mySkills={profile?.expertise} compact />
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-secondary/60 p-5">
              <p className="font-semibold">
                {profile?.expertise?.length ? "No matches yet" : "Add your skills to get matches"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {profile?.expertise?.length
                  ? "We'll suggest classmates here as more students with similar skills join."
                  : "We match you with classmates who share your skills and interests."}
              </p>
              <Button asChild variant="link" className="mt-2 h-auto px-0">
                <Link href={profile?.expertise?.length ? "/dashboard/community" : "/dashboard/profile"}>
                  {profile?.expertise?.length ? "Browse the community" : "Update your profile"}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default Dashboard;
