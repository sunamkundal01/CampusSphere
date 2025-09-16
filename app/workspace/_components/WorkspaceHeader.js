"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  ChevronDown,
  Download,
  FileText,
  FileImage,
  ArrowLeft,
} from "lucide-react";
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

  const saveNotes = useMutation(api.notes.AddNotes);
  const notes = useQuery(api.notes.GetNotes, {
    fileId: fileId,
  });

  const onSave = async () => {
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
      toast("Notes saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      toast("Error saving notes");
    } finally {
      setSaving(false);
    }
  };

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
    <div className="p-4 flex justify-between shadow-md">
      <div className="flex items-center gap-4">
        <Link href={"/dashboard"}>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
        </Link>
        <Link href={"/"}>
          <Image
            src={"/logo.svg"}
            alt="CampusSphere"
            width={120}
            height={90}
            className="logo-primary logo-sidebar cursor-pointer"
          />
        </Link>
      </div>
      <h2 className="font-bold">{fileName}</h2>
      <div className="flex gap-2">
        <Button onClick={onSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>

        {notes && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download size={16} />
                Download
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={downloadAsPDF}
                className="flex items-center gap-2"
              >
                <FileImage size={16} />
                Download as PDF
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={downloadAsDOCX}
                className="flex items-center gap-2"
              >
                <FileText size={16} />
                Download as DOCX
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <UserButton />
      </div>
    </div>
  );
};
