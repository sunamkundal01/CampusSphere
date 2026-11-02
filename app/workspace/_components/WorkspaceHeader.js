"use client";

import { UserButton } from "../../../components/ui/UserButton";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "../../../lib/GoogleAuthContext";
import { toast } from "sonner";
import { ArrowLeft, Check, ChevronDown, CircleDot, Download, FileText, FileImage, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

export const WorkspaceHeader = ({ fileName, editor }) => {
  const { fileId } = useParams();
  const { user } = useUser();
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const saveNotes = useMutation(api.notes.AddNotes);
  const notes = useQuery(api.notes.GetNotes, {
    fileId: fileId,
  });

  // Compare the live editor with the last saved notes to show an honest save state.
  useEffect(() => {
    if (!editor) return;
    const check = () => setDirty(editor.getHTML() !== (notes || "<p></p>"));
    const id = setTimeout(check, 0);
    editor.on("update", check);
    return () => {
      clearTimeout(id);
      editor.off("update", check);
    };
  }, [editor, notes]);

  const onSave = useCallback(async () => {
    if (!editor) {
      toast("No content to save");
      return;
    }

    setSaving(true);
    try {
      await saveNotes({
        notes: editor.getHTML(),
        fileId: fileId,
        createdBy: user?.primaryEmailAddress.emailAddress,
      });
      toast.success("Notes saved");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Couldn't save your notes", { description: "Check your connection and try again." });
    } finally {
      setSaving(false);
    }
  }, [editor, fileId, saveNotes, user]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        onSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSave]);

  const downloadAsPDF = () => {
    if (!notes) {
      toast("No notes to download");
      return;
    }

    // Create a new window with the content for PDF printing
    const printWindow = window.open("", "_blank");
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${fileName || "Notes"} - PDF</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              line-height: 1.6; 
              color: #333;
            }
            h1, h2, h3 { 
              color: #333; 
              margin: 15px 0 10px 0;
              page-break-after: avoid;
            }
            h1 { font-size: 24px; border-bottom: 2px solid #333; padding-bottom: 5px; }
            h2 { font-size: 20px; }
            h3 { font-size: 16px; }
            p { margin-bottom: 10px; }
            strong { font-weight: bold; }
            em { font-style: italic; }
            ul, ol { margin: 10px 0; padding-left: 25px; }
            li { margin: 5px 0; }
            @media print {
              body { margin: 0; }
              * { 
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
            }
            @page {
              margin: 1in;
              size: A4;
            }
          </style>
        </head>
        <body>
          <h1>${fileName || "My Notes"}</h1>
          <div class="content">
            ${notes}
          </div>
        </body>
      </html>
    `;

    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();

      // Wait for content to load, then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      };

      toast("PDF print dialog opened!");
    } else {
      toast("Please allow popups for PDF download");
    }
  };

  const downloadAsDOCX = async () => {
    if (!notes) {
      toast("No notes to download");
      return;
    }

    try {
      // Import the library dynamically
      const { asBlob } = await import("html-docx-js/dist/html-docx");

      // Convert HTML to a format suitable for DOCX
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${fileName || "Notes"}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
              h1, h2, h3 { color: #333; margin: 10px 0; }
              p { margin-bottom: 10px; }
              strong { font-weight: bold; }
              em { font-style: italic; }
              ul, ol { margin: 10px 0; padding-left: 20px; }
            </style>
          </head>
          <body>
            <h1>${fileName || "Notes"}</h1>
            ${notes}
          </body>
        </html>
      `;

      // Convert HTML to DOCX blob
      const blob = await asBlob(htmlContent);

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName || "notes"}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast("DOCX file downloaded!");
    } catch (error) {
      console.error("DOCX download error:", error);

      // Fallback method
      const htmlContent = `
        <html>
          <head>
            <meta charset="utf-8">
            <title>${fileName || "Notes"}</title>
          </head>
          <body>
            <h1>${fileName || "Notes"}</h1>
            ${notes}
          </body>
        </html>
      `;

      const blob = new Blob([htmlContent], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName || "notes"}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast("DOCX file downloaded (basic format)!");
    }
  };

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-card px-2 sm:h-16 sm:gap-3 sm:px-4">
      <Button asChild variant="ghost" size="icon" aria-label="Back to my workspace">
        <Link href="/dashboard/workspace">
          <ArrowLeft />
        </Link>
      </Button>

      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:flex">
          <FileText className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h1 className="truncate font-display text-base font-semibold sm:text-lg" title={fileName}>
            {fileName || <span className="inline-block h-5 w-40 animate-pulse rounded bg-secondary align-middle" />}
          </h1>
          <p className="flex items-center gap-1 text-xs text-muted-foreground" aria-live="polite">
            {saving ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" /> Saving…
              </>
            ) : dirty ? (
              <>
                <CircleDot className="h-3 w-3 text-warning" aria-hidden="true" /> Unsaved changes
              </>
            ) : (
              <>
                <Check className="h-3 w-3 text-success" aria-hidden="true" /> All changes saved
              </>
            )}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {notes && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9" aria-label="Export notes">
                <Download aria-hidden="true" />
                <span className="hidden sm:inline">Export</span>
                <ChevronDown className="hidden sm:block" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl p-1.5">
              <DropdownMenuItem onClick={downloadAsPDF} className="cursor-pointer gap-2 py-2">
                <FileImage size={16} aria-hidden="true" />
                Download as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={downloadAsDOCX} className="cursor-pointer gap-2 py-2">
                <FileText size={16} aria-hidden="true" />
                Download as DOCX
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button onClick={onSave} disabled={saving || !dirty} size="sm" className="h-9" title="Save (Ctrl/⌘ + S)">
          {saving ? "Saving…" : "Save"}
        </Button>

        <span className="hidden sm:block">
          <UserButton />
        </span>
      </div>
    </header>
  );
};
