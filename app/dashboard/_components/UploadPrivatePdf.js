"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Check, Loader2Icon, Lock, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import uuid4 from "uuid4";
import { useUser } from "../../../lib/GoogleAuthContext";
import axios from "axios";
import { toast } from "sonner";
import { cn } from "../../../lib/utils";
import { FileDropzone, stripPdfExtension } from "./FileDropzone";

const STAGES = [
  { key: "upload", label: "Uploading file" },
  { key: "read", label: "Reading the PDF text" },
  { key: "index", label: "Preparing it for AI questions" },
];

function UploadPrivatePdf({ children }) {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const addFileEntry = useMutation(api.fileStorage.AddFileEntryToDb);
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const embeddedDocument = useAction(api.myActions.ingest);
  const { user } = useUser();
  const router = useRouter();
  const [file, setfile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [stage, setStage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [open, setOpen] = useState(false);

  const loading = stage !== null;

  const reset = () => {
    setfile(null);
    setFileName("");
    setFileError(null);
    setStage(null);
  };

  const handleOpenChange = (newOpen) => {
    // Don't let an in-flight upload be dismissed half way.
    if (loading) return;
    setOpen(newOpen);
    if (!newOpen) reset();
  };

  const onFile = (picked) => {
    setfile(picked);
    if (picked && !fileName.trim()) setFileName(stripPdfExtension(picked.name));
  };

  const onUpload = async () => {
    if (!file) {
      setFileError("Choose a PDF to upload.");
      return;
    }
    if (!fileName.trim()) return;

    try {
      setStage("upload");
      //Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();

      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file?.type },
        body: file,
      });
      const { storageId } = await result.json();
      const fileId = uuid4();
      const fileUrl = await getFileUrl({ storageId: storageId });

      // Step 3: Save the newly allocated storage id to the database (private upload - no semester/subject)
      await addFileEntry({
        fileId: fileId,
        storageId: storageId,
        fileName: fileName.trim(),
        createdBy: user?.primaryEmailAddress.emailAddress,
        fileUrl: fileUrl,
        semester: "", // Empty for private uploads
        subject: "", // Empty for private uploads
      });

      //API Call to fetch PDF process data
      setStage("read");
      const apiresp = await axios.get("/api/pdf-loader?pdfUrl=" + encodeURIComponent(fileUrl));
      setStage("index");
      await embeddedDocument({
        sliptText: apiresp.data.result,
        fileId: fileId,
      });

      setOpen(false);
      reset();

      toast.success("Your PDF is ready", {
        description: "Open it to take notes and ask AI questions.",
        action: { label: "Open", onClick: () => router.push("/workspace/" + fileId) },
      });
    } catch (error) {
      console.error("Upload error:", error);
      setStage(null);
      toast.error("Upload failed", { description: "Check your connection and try again." });
    }
  };

  const stageIndex = STAGES.findIndex((s) => s.key === stage);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a PDF to your workspace</DialogTitle>
          <DialogDescription>
            Lecture notes, a textbook chapter or a lab manual. You&apos;ll be able to take notes beside it and ask AI
            questions about it.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <ol className="space-y-3 py-2" aria-live="polite">
            {STAGES.map((s, i) => {
              const done = i < stageIndex;
              const current = i === stageIndex;
              return (
                <li key={s.key} className="flex items-center gap-3 text-sm">
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full border",
                      done && "border-success bg-success text-success-foreground",
                      current && "border-primary text-primary"
                    )}
                  >
                    {done ? (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    ) : current ? (
                      <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <span className="text-xs text-muted-foreground">{i + 1}</span>
                    )}
                  </span>
                  <span className={cn(current ? "font-medium" : "text-muted-foreground")}>{s.label}</span>
                </li>
              );
            })}
            <p className="pt-2 text-xs text-muted-foreground">Large PDFs can take up to a minute.</p>
          </ol>
        ) : (
          <div className="space-y-4">
            <FileDropzone file={file} onFile={onFile} error={fileError} onError={setFileError} />
            <div>
              <label htmlFor="private-pdf-name" className="mb-1.5 block text-sm font-medium">
                Document name
              </label>
              <Input
                id="private-pdf-name"
                placeholder="e.g. DBMS Unit 3 – Normalization"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>
            <p className="flex items-start gap-2 rounded-lg bg-secondary/70 p-3 text-xs leading-relaxed text-muted-foreground">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Private to you. To share a past paper with everyone, use the PYQ library instead.
            </p>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={onUpload} disabled={loading || !file || !fileName.trim()}>
            {loading ? (
              <>
                <Loader2Icon className="animate-spin" aria-hidden="true" /> Processing…
              </>
            ) : (
              <>
                <Sparkles aria-hidden="true" /> Upload and prepare
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UploadPrivatePdf;
