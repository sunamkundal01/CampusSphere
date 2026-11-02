"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { Search, Sparkles, Users, X } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "../../../lib/GoogleAuthContext";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { cn } from "../../../lib/utils";
import { MemberCard } from "../_components/MemberCard";
import { CardSkeleton, EmptyState, PageHeader } from "../_components/PageParts";

export default function CommunityPage() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const [tab, setTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState("");
  const [batch, setBatch] = useState("");

  const allUsers = useQuery(api.userProfiles.getAllUsers);
  const recommendedUsers = useQuery(api.userProfiles.getRecommendedUsers, { userEmail: email });
  const me = useQuery(api.userProfiles.getUserProfile, { email });

  const departments = useMemo(
    () => [...new Set((allUsers || []).map((u) => u.department).filter(Boolean))].sort(),
    [allUsers]
  );
  const batches = useMemo(
    () => [...new Set((allUsers || []).map((u) => u.batch).filter(Boolean))].sort().reverse(),
    [allUsers]
  );

  const source = tab === "recommended" ? recommendedUsers : allUsers;
  const members = useMemo(() => {
    if (!source) return undefined;
    const q = searchTerm.trim().toLowerCase();
    return source
      .filter(
        (u) =>
          (!q ||
            u.name?.toLowerCase().includes(q) ||
            u.department?.toLowerCase().includes(q) ||
            u.expertise?.some((skill) => skill.toLowerCase().includes(q))) &&
          (!department || u.department === department) &&
          (!batch || u.batch === batch)
      )
      // Keep yourself at the end of the directory.
      .sort((a, b) => Number(a.email === email) - Number(b.email === email));
  }, [source, searchTerm, department, batch, email]);

  const hasFilters = searchTerm || department || batch;
  const clearFilters = () => {
    setSearchTerm("");
    setDepartment("");
    setBatch("");
  };

  const tabs = [
    { key: "all", label: "All members", count: allUsers?.length },
    { key: "recommended", label: "Recommended for you", count: recommendedUsers?.length, icon: Sparkles },
  ];

  return (
    <div>
      <PageHeader
        title="Community"
        description="Find classmates by skill, department or batch. Recommendations are based on the skills in your profile."
      />

      <div role="tablist" aria-label="Member list" className="mb-4 inline-flex rounded-xl bg-secondary p-1">
        {tabs.map(({ key, label, count, icon: Icon }) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors",
              tab === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
            {label}
            {count !== undefined && <span className="text-xs tabular-nums text-muted-foreground">{count}</span>}
          </button>
        ))}
      </div>

      <div className="mb-6 grid gap-3 rounded-2xl border bg-card p-4 shadow-sm md:grid-cols-[1fr_240px_160px_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            aria-label="Search members"
            placeholder="Search by name, department or skill, e.g. React"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select aria-label="Filter by department" value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="">All departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </Select>
        <Select aria-label="Filter by batch" value={batch} onChange={(e) => setBatch(e.target.value)}>
          <option value="">All batches</option>
          {batches.map((b) => (
            <option key={b} value={b}>
              Batch {b}
            </option>
          ))}
        </Select>
        <Button variant="ghost" onClick={clearFilters} disabled={!hasFilters}>
          <X aria-hidden="true" /> Clear
        </Button>
      </div>

      {members === undefined ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} className="h-64" />
          ))}
        </div>
      ) : members.length === 0 ? (
        tab === "recommended" && !hasFilters ? (
          <EmptyState
            icon={Sparkles}
            title={me?.expertise?.length ? "No matches yet" : "Add skills to get recommendations"}
            body={
              me?.expertise?.length
                ? "Nobody shares your skills yet. As more classmates join, matches will appear here."
                : "We recommend classmates who share at least one skill with you."
            }
            action={
              <Button asChild variant="outline">
                <Link href="/dashboard/profile">Update your skills</Link>
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={Users}
            title="No members match"
            body="Try a broader search or remove a filter."
            action={
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        )
      ) : (
        <>
          <p className="mb-3 text-sm text-muted-foreground" aria-live="polite">
            {members.length} member{members.length === 1 ? "" : "s"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {members.map((m) => (
              <MemberCard key={m._id} member={m} mySkills={me?.expertise} isMe={m.email === email} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
