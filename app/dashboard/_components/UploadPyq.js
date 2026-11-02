"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Select } from "../../../components/ui/select";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Globe2, Loader2Icon, Upload } from "lucide-react";
import { useState } from "react";
import uuid4 from "uuid4";
import { useUser } from "../../../lib/GoogleAuthContext";
import { toast } from "sonner";
import { SEMESTERS, SUBJECTS } from "./pyqConstants";
import { FileDropzone, stripPdfExtension } from "./FileDropzone";

const OTHER = "__other__";

function UploadPyq({ children }) {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const addPyqFileEntry = useMutation(api.pyqStorage.AddPyqFileEntryToDb);
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const { user } = useUser();

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [semester, setSemester] = useState("");
  const [subjectChoice, setSubjectChoice] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const subject = subjectChoice === OTHER ? customSubject.trim() : subjectChoice;
  const errors = {
    name: !fileName.trim() && "Give the paper a name.",
    semester: !semester && "Pick the semester.",
    subject: !subject && (subjectChoice === OTHER ? "Type the subject name." : "Pick a subject."),
  };

  const reset = () => {
    setFile(null);
    setFileError(null);
    setFileName("");
    setSemester("");
    setSubjectChoice("");
    setCustomSubject("");
    setSubmitted(false);
  };

  const handleOpenChange = (newOpen) => {
    if (loading) return;
    setOpen(newOpen);
    if (!newOpen) reset();
  };

  const onFile = (picked) => {
    setFile(picked);
    if (picked && !fileName.trim()) setFileName(stripPdfExtension(picked.name));
  };

  const onUpload = async () => {
    setSubmitted(true);
    if (!file) setFileError("Choose the PDF of the paper.");
    if (!file || errors.name || errors.semester || errors.subject) return;

    setLoading(true);

    try {
      // Step 1: Get a short-lived upload URL
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

      // Step 3: Save the PYQ file entry to the database
      await addPyqFileEntry({
        fileId: fileId,
        storageId: storageId,
        fileName: fileName.trim(),
        fileUrl: fileUrl,
        semester: semester,
        subject: subject,
        uploadedBy: user?.primaryEmailAddress?.emailAddress || "Anonymous",
      });

      setLoading(false);
      setOpen(false);
      reset();

      toast.success("Thanks for sharing!", {
        description: "Your paper is now in the PYQ library for everyone.",
      });
    } catch (error) {
      console.error("Upload error:", error);
      setLoading(false);
      toast.error("Upload failed", { description: "Check your connection and try again." });
    }
  };

  const fieldError = (key) =>
    submitted && errors[key] ? (
      <p id={`pyq-${key}-error`} className="mt-1.5 text-sm text-destructive">
        {errors[key]}
      </p>
    ) : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90dvh] w-[calc(100vw-2rem)] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share a previous year paper</DialogTitle>
          <DialogDescription>
            Help your juniors. Tag it with the semester and subject so it&apos;s easy to find.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <FileDropzone file={file} onFile={onFile} disabled={loading} error={fileError} onError={setFileError} />

          <div>
            <label htmlFor="pyq-name" className="mb-1.5 block text-sm font-medium">
              Paper name
            </label>
            <Input
              id="pyq-name"
              placeholder="e.g. Data Structures End-Sem 2023"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              aria-invalid={submitted && !!errors.name}
              aria-describedby={submitted && errors.name ? "pyq-name-error" : undefined}
            />
            {fieldError("name")}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="pyq-semester" className="mb-1.5 block text-sm font-medium">
                Semester
              </label>
              <Select
                id="pyq-semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                aria-invalid={submitted && !!errors.semester}
                aria-describedby={submitted && errors.semester ? "pyq-semester-error" : undefined}
              >
                <option value="">Select semester</option>
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </Select>
              {fieldError("semester")}
            </div>
            <div>
              <label htmlFor="pyq-subject" className="mb-1.5 block text-sm font-medium">
                Subject
              </label>
              <Select
                id="pyq-subject"
                value={subjectChoice}
                onChange={(e) => setSubjectChoice(e.target.value)}
                aria-invalid={submitted && !!errors.subject && subjectChoice !== OTHER}
                aria-describedby={submitted && errors.subject ? "pyq-subject-error" : undefined}
              >
                <option value="">Select subject</option>
                {SUBJECTS.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
                <option value={OTHER}>Other (type it)</option>
              </Select>
              {subjectChoice !== OTHER && fieldError("subject")}
            </div>
          </div>

          {subjectChoice === OTHER && (
            <div>
              <label htmlFor="pyq-custom-subject" className="mb-1.5 block text-sm font-medium">
                Subject name
              </label>
              <Input
                id="pyq-custom-subject"
                autoFocus
                placeholder="e.g. Engineering Drawing"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                aria-invalid={submitted && !!errors.subject}
                aria-describedby={submitted && errors.subject ? "pyq-subject-error" : undefined}
              />
              {fieldError("subject")}
            </div>
          )}

          <p className="flex items-start gap-2 rounded-lg bg-primary/5 p-3 text-xs leading-relaxed text-foreground/80">
            <Globe2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            Everyone on CampusSphere will be able to see and download this paper. Only share material you&apos;re
            allowed to share.
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onUpload} disabled={loading}>
            {loading ? (
              <>
                <Loader2Icon className="animate-spin" aria-hidden="true" /> Uploading…
              </>
            ) : (
              <>
                <Upload aria-hidden="true" /> Share paper
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UploadPyq;
