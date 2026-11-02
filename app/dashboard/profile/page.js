"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { Building2, CalendarDays, Check, Circle, GraduationCap, Linkedin, Mail, Pencil } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "../../../lib/GoogleAuthContext";
import { profileCompletion } from "../../../lib/display";
import { Avatar } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import ProfileSetup from "../_components/ProfileSetup";
import { CardSkeleton, PageHeader, SectionCard } from "../_components/PageParts";

const formatJoinDate = (timestamp) =>
  timestamp
    ? new Date(timestamp).toLocaleDateString("en-IN", { year: "numeric", month: "long" })
    : "Recently joined";

export default function ProfilePage() {
  const { user } = useUser();
  const [editing, setEditing] = useState(false);

  const profile = useQuery(api.userProfiles.getUserProfile, {
    email: user?.primaryEmailAddress?.emailAddress || "",
  });
  const { percent, items } = profileCompletion(profile);
  const name = profile?.name || user?.fullName || "Student";

  if (profile === undefined) {
    return (
      <div className="space-y-6">
        <CardSkeleton className="h-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <CardSkeleton className="h-64 lg:col-span-2" />
          <CardSkeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My profile"
        description="This is how classmates see you in the community directory."
        actions={
          <Button onClick={() => setEditing(true)}>
            <Pencil aria-hidden="true" /> Edit profile
          </Button>
        }
      />

      <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
        <div aria-hidden="true" className="h-28 bg-gradient-to-r from-primary via-sky-500 to-cyan-400 sm:h-32" />
        <div className="px-6 pb-6 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <Avatar
              src={profile?.imageURL || user?.imageUrl}
              name={name}
              size="xl"
              className="-mt-10 ring-4 ring-card"
            />
            <div className="min-w-0 flex-1 sm:pt-4">
              <h2 className="text-2xl font-semibold [overflow-wrap:anywhere]">{name}</h2>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 [overflow-wrap:anywhere]">
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {user?.primaryEmailAddress?.emailAddress}
                </span>
                {profile?.department && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {profile.department}
                  </span>
                )}
                {profile?.batch && (
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Batch {profile.batch}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />
                  Member since {formatJoinDate(profile?.joinedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard title="About">
            {profile?.bio ? (
              <p className="leading-relaxed text-foreground/85">{profile.bio}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Add a short bio, like what you&apos;re studying or building, so classmates know what to reach out about.
              </p>
            )}
          </SectionCard>

          <SectionCard title="Skills and expertise">
            {profile?.expertise?.length ? (
              <ul className="flex flex-wrap gap-2">
                {profile.expertise.map((skill) => (
                  <li key={skill} className="rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
                    {skill}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Skills power your study-partner recommendations. Add a few you&apos;re confident in.
              </p>
            )}
          </SectionCard>

          {profile?.linkedinProfile && (
            <SectionCard title="Links">
              <Button asChild variant="outline">
                <a href={profile.linkedinProfile} target="_blank" rel="noopener noreferrer">
                  <Linkedin aria-hidden="true" /> View LinkedIn profile
                </a>
              </Button>
            </SectionCard>
          )}
        </div>

        <SectionCard title="Profile strength" className="h-fit">
          <div className="flex items-baseline justify-between">
            <span className="font-display text-4xl font-semibold tabular-nums">{percent}%</span>
            <span className="text-sm text-muted-foreground">{percent === 100 ? "All done" : "Keep going"}</span>
          </div>
          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-secondary"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Profile completion"
          >
            <div
              className={`h-full rounded-full transition-all ${percent === 100 ? "bg-success" : "bg-primary"}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <ul className="mt-5 space-y-3">
            {items.map((item) => (
              <li key={item.key} className="flex items-center gap-3 text-sm">
                {item.done ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-success-foreground">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground/50" aria-hidden="true" />
                )}
                <span className={item.done ? "text-muted-foreground line-through" : "font-medium"}>
                  {item.label}
                </span>
                <span className="sr-only">{item.done ? "(done)" : "(to do)"}</span>
              </li>
            ))}
          </ul>
          {percent < 100 && (
            <Button className="mt-6 w-full" variant="outline" onClick={() => setEditing(true)}>
              Complete profile
            </Button>
          )}
        </SectionCard>
      </div>

      <ProfileSetup isOpen={editing} onClose={() => setEditing(false)} onComplete={() => setEditing(false)} />
    </div>
  );
}
