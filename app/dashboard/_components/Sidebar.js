"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { ArrowRight, X } from "lucide-react";
import { BrandLogo } from "../../../components/ui/BrandLogo";
import { useUser } from "../../../lib/GoogleAuthContext";
import { api } from "../../../convex/_generated/api";
import { profileCompletion } from "../../../lib/display";
import { cn } from "../../../lib/utils";
import { NAV_GROUPS, isActive } from "./navigation";

const Sidebar = ({ onClose }) => {
  const pathname = usePathname();
  const { user } = useUser();
  const userProfile = useQuery(api.userProfiles.getUserProfile, {
    email: user?.primaryEmailAddress?.emailAddress || "",
  });
  const { percent } = profileCompletion(userProfile);

  return (
    <div className="flex h-full flex-col border-r bg-card">
      <div className="flex h-16 items-center justify-between px-5">
        <BrandLogo href="/dashboard" />
        <button
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Dashboard">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-6">
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active = isActive(pathname, item);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4">
        {userProfile !== undefined && percent < 100 ? (
          <Link
            href="/dashboard/profile"
            onClick={onClose}
            className="block rounded-xl border bg-gradient-to-br from-primary/5 to-cyan-500/5 p-4 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">Profile strength</span>
              <span className="font-semibold text-primary">{percent}%</span>
            </div>
            <div
              className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Profile completion"
            >
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
            </div>
            <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
              Complete it to get study-partner matches
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </p>
          </Link>
        ) : (
          <p className="rounded-xl bg-secondary/60 p-4 text-xs leading-relaxed text-muted-foreground">
            CampusSphere is free for every student. Share a PYQ to help your juniors.
          </p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
