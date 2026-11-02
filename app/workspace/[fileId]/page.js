"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { WorkspaceHeader } from "../_components/WorkspaceHeader";
import PdfViewer from "../_components/pdfViewer";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { FileQuestion, FileText, NotebookPen } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { cn } from "../../../lib/utils";

// edit text imports
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import EditExtenstion from "../_components/EditExtenstion";

const Workspace = () => {
  const { fileId } = useParams(); // Ensure the correct parameter name is used
  const fileInfo = useQuery(api.fileStorage.getFileRecord, {
    fileId: fileId || "", // Check if fileId is present before making the query
  });

  const [editor, setEditor] = useState(null);
  const [pane, setPane] = useState("notes");

  if (fileInfo === null) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
          <FileQuestion className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        </span>
        <h1 className="text-2xl font-semibold">We couldn&apos;t find that document</h1>
        <p className="max-w-sm text-muted-foreground">It may have been removed, or the link is incorrect.</p>
        <Button asChild>
          <Link href="/dashboard/workspace">Back to my workspace</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-background">
      <WorkspaceHeader fileName={fileInfo?.fileName} editor={editor} />

      {/* Mobile: switch between notes and the PDF */}
      <div className="border-b bg-card px-4 py-2 md:hidden">
        <div role="tablist" aria-label="Workspace view" className="grid grid-cols-2 rounded-lg bg-secondary p-1">
          {[
            { key: "notes", label: "Notes", icon: NotebookPen },
            { key: "pdf", label: "PDF", icon: FileText },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              role="tab"
              aria-selected={pane === key}
              aria-controls={`pane-${key}`}
              onClick={() => setPane(key)}
              className={cn(
                "inline-flex h-9 items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-colors",
                pane === key ? "bg-card shadow-sm" : "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 md:grid-cols-2">
        <section
          id="pane-notes"
          aria-label="Your notes"
          className={cn("min-h-0 flex-col border-r bg-card", pane === "notes" ? "flex" : "hidden", "md:flex")}
        >
          <EditorText fileId={fileId} onEditorReady={setEditor} />
        </section>
        <section
          id="pane-pdf"
          aria-label="PDF document"
          className={cn("min-h-0 flex-col bg-secondary/50", pane === "pdf" ? "flex" : "hidden", "md:flex")}
        >
          <PdfViewer fileurl={fileInfo?.fileUrl} fileName={fileInfo?.fileName} />
        </section>
      </div>
    </div>
  );
};

export default Workspace;

// Text editor component
const EditorText = ({ fileId, onEditorReady }) => {
  const notes = useQuery(api.notes.GetNotes, {
    fileId: fileId,
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: "Start taking notes here. Type a question, select it, then press Ask AI.",
      }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-full px-5 py-6 sm:px-8 text-[15px]",
        "aria-label": "Notes editor",
      },
    },
  });

  useEffect(() => {
    if (editor && notes) {
      editor.commands.setContent(notes);
    }
  }, [notes, editor]);

  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  return (
    <>
      <EditExtenstion editor={editor} />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <EditorContent editor={editor} className="h-full [&>div]:min-h-full" />
      </div>
    </>
  );
};
