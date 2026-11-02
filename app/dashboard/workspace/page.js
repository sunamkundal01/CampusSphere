"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { Search, Sparkles, Upload } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "../../../lib/GoogleAuthContext";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import UploadPrivatePdf from "../_components/UploadPrivatePdf";
import { CardSkeleton, DocumentCard, EmptyState, PageHeader } from "../_components/PageParts";

export default function WorkspacePage() {
  const { user } = useUser();
  const [query, setQuery] = useState("");

  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  const files = useMemo(() => {
    if (!fileList) return fileList;
    const q = query.trim().toLowerCase();
    return [...fileList]
      .sort((a, b) => b._creationTime - a._creationTime)
      .filter((f) => !q || f.fileName?.toLowerCase().includes(q));
  }, [fileList, query]);

  return (
    <div>
      <PageHeader
        title="My workspace"
        description="Your private PDFs. Open one to take notes beside it and ask AI questions about its content."
        actions={
          <UploadPrivatePdf>
            <Button>
              <Upload aria-hidden="true" /> Upload PDF
            </Button>
          </UploadPrivatePdf>
        }
      />

      {fileList?.length > 0 && (
        <div className="relative mb-6 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            aria-label="Search your documents"
            placeholder="Search your documents"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {files === undefined ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} className="h-52" />
          ))}
        </div>
      ) : fileList.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Start with a PDF you're studying"
          body="Lecture slides, notes or a textbook chapter. We'll prepare it so you can ask questions about it while you write notes."
          action={
            <UploadPrivatePdf>
              <Button>
                <Upload aria-hidden="true" /> Upload your first PDF
              </Button>
            </UploadPrivatePdf>
          }
        />
      ) : files.length === 0 ? (
        <EmptyState
          icon={Search}
          title={`No documents match "${query}"`}
          body="Try a different word, or clear the search."
          action={
            <Button variant="outline" onClick={() => setQuery("")}>
              Clear search
            </Button>
          }
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
            {files.length} document{files.length === 1 ? "" : "s"}
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {files.map((file) => (
              <DocumentCard key={file._id} file={file} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
