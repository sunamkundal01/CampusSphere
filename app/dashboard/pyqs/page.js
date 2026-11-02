"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { BookOpenCheck, Search, Upload, X } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { cleanSubject } from "../../../lib/display";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import UploadPyq from "../_components/UploadPyq";
import { CardSkeleton, EmptyState, PageHeader, PyqRow } from "../_components/PageParts";

// Sort "1st Semester" … "8th Semester" numerically rather than alphabetically.
const semesterOrder = (s) => parseInt(s, 10) || 99;

export default function PyqLibraryPage() {
  const [query, setQuery] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");

  const allPyqFiles = useQuery(api.pyqStorage.GetAllPyqFiles);

  const semesters = useMemo(
    () => [...new Set((allPyqFiles || []).map((f) => f.semester).filter(Boolean))].sort((a, b) => semesterOrder(a) - semesterOrder(b)),
    [allPyqFiles]
  );
  const subjects = useMemo(
    () =>
      [
        ...new Set(
          (allPyqFiles || [])
            .filter((f) => !semester || f.semester === semester)
            .map((f) => cleanSubject(f.subject))
            .filter(Boolean)
        ),
      ].sort(),
    [allPyqFiles, semester]
  );

  const filtered = useMemo(() => {
    if (!allPyqFiles) return undefined;
    const q = query.trim().toLowerCase();
    return allPyqFiles.filter(
      (f) =>
        (!semester || f.semester === semester) &&
        (!subject || cleanSubject(f.subject) === subject) &&
        (!q || f.fileName?.toLowerCase().includes(q) || cleanSubject(f.subject).toLowerCase().includes(q))
    );
  }, [allPyqFiles, query, semester, subject]);

  const hasFilters = query || semester || subject;
  const clearFilters = () => {
    setQuery("");
    setSemester("");
    setSubject("");
  };

  const shareButton = (
    <UploadPyq>
      <Button>
        <Upload aria-hidden="true" /> Share a PYQ
      </Button>
    </UploadPyq>
  );

  return (
    <div>
      <PageHeader
        title="PYQ library"
        description="Previous year question papers shared by students on campus. Filter by semester and subject, then open any paper."
        actions={shareButton}
      />

      <div className="mb-6 grid gap-3 rounded-2xl border bg-card p-4 shadow-sm md:grid-cols-[1fr_200px_240px_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            aria-label="Search papers"
            placeholder="Search by paper or subject"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          aria-label="Filter by semester"
          value={semester}
          onChange={(e) => {
            setSemester(e.target.value);
            setSubject("");
          }}
        >
          <option value="">All semesters</option>
          {semesters.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Select aria-label="Filter by subject" value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">All subjects</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Button variant="ghost" onClick={clearFilters} disabled={!hasFilters}>
          <X aria-hidden="true" /> Clear
        </Button>
      </div>

      {filtered === undefined ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <CardSkeleton key={i} className="h-[84px] rounded-xl" />
          ))}
        </div>
      ) : allPyqFiles.length === 0 ? (
        <EmptyState
          icon={BookOpenCheck}
          title="The library is waiting for its first paper"
          body="Have an old question paper on your phone or laptop? Share it and help everyone preparing for the same exam."
          action={shareButton}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No papers match these filters"
          body="Try another subject or semester. If you have this paper, consider sharing it."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
              {shareButton}
            </div>
          }
        />
      ) : (
        <>
          <p className="mb-3 text-sm text-muted-foreground" aria-live="polite">
            Showing {filtered.length} of {allPyqFiles.length} paper{allPyqFiles.length === 1 ? "" : "s"}
          </p>
          <div className="space-y-3">
            {filtered.map((file) => (
              <PyqRow key={file._id} file={file} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
