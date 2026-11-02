"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink, FileText } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { cleanSubject, formatDate, nameFromEmail, timeAgo } from "../../../lib/display";
import { cn } from "../../../lib/utils";

export function PageHeader({ title, description, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, body, action, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card/60 px-6 py-14 text-center",
        className
      )}
    >
      {Icon && (
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
      )}
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {body && <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function SectionCard({ title, action, children, className }) {
  return (
    <section className={cn("rounded-2xl border bg-card shadow-sm", className)}>
      <div className="flex items-center justify-between gap-3 border-b px-5 py-4">
        <h2 className="text-base font-semibold">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function SeeAllLink({ href, children = "See all" }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-md text-sm font-medium text-primary hover:underline"
    >
      {children} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
    </Link>
  );
}

export function CardSkeleton({ className }) {
  return <div className={cn("animate-pulse rounded-2xl bg-secondary", className)} />;
}

export function DocumentCard({ file }) {
  return (
    <Link
      href={"/workspace/" + file.fileId}
      className="group flex flex-col rounded-2xl border bg-card p-4 shadow-sm transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 via-secondary to-cyan-500/10">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-card shadow-sm">
          <FileText className="h-6 w-6 text-primary" aria-hidden="true" />
        </span>
      </div>
      <h3 className="mt-4 line-clamp-2 text-sm font-semibold leading-snug [overflow-wrap:anywhere]">
        {file.fileName || "Untitled document"}
      </h3>
      <div className="mt-auto flex items-center justify-between pt-3 text-xs text-muted-foreground">
        <span>{file._creationTime ? `Added ${timeAgo(file._creationTime)}` : "PDF"}</span>
        <span className="font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          Open
        </span>
      </div>
    </Link>
  );
}

export function PyqRow({ file, compact = false }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40 sm:flex-row sm:items-center">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <FileText className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold" title={file.fileName}>
          {file.fileName}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
          <Badge>{cleanSubject(file.subject)}</Badge>
          <span>{file.semester}</span>
          {!compact && (
            <>
              <span aria-hidden="true">·</span>
              <span>Shared by {nameFromEmail(file.uploadedBy)}</span>
              <span aria-hidden="true">·</span>
              <span>{formatDate(file.uploadedAt)}</span>
            </>
          )}
        </div>
      </div>
      <a
        href={file.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Open ${file.fileName} in a new tab`}
      >
        Open <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
      </a>
    </div>
  );
}
