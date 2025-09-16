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
import { useAction, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Loader2Icon, Upload } from "lucide-react";
import { useState } from "react";
import uuid4 from "uuid4";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { SEMESTERS, SUBJECTS } from "./pyqConstants";

function UploadPyq({ children }) {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const addPyqFileEntry = useMutation(api.pyqStorage.AddPyqFileEntryToDb);
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const { user } = useUser();

  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const OnFileSelect = (event) => {
    setFile(event.target.files[0]);
  };

  const onUpload = async () => {
    if (!file) {
      toast.error("Please select a PDF file");
      return;
    }

    if (!fileName.trim()) {
      toast.error("Please enter a file name");
      return;
    }

    if (!semester.trim()) {
      toast.error("Please enter semester");
      return;
    }

    if (!subject.trim()) {
      toast.error("Please enter subject");
      return;
    }

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
      console.log("StorageId", storageId);

      const fileId = uuid4();
      const fileUrl = await getFileUrl({ storageId: storageId });

      // Step 3: Save the PYQ file entry to the database
      const resp = await addPyqFileEntry({
        fileId: fileId,
        storageId: storageId,
        fileName: fileName,
        fileUrl: fileUrl,
        semester: semester,
        subject: subject,
        uploadedBy: user?.primaryEmailAddress?.emailAddress || "Anonymous",
      });

      console.log(resp);

      // Reset form
      setFile(null);
      setFileName("");
      setSemester("");
      setSubject("");

      setLoading(false);
      setOpen(false);

      toast.success(
        "PYQ uploaded successfully! It's now available for everyone."
      );
    } catch (error) {
      console.error("Upload error:", error);
      setLoading(false);
      toast.error("Failed to upload PYQ. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div onClick={() => setOpen(true)}>{children}</div>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Upload className="h-5 w-5" />
            Upload PYQ
          </DialogTitle>
          <DialogDescription className="text-sm">
            Share a Previous Year Question paper with the community
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select PDF File *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4">
              <input
                type="file"
                accept="application/pdf"
                onChange={(event) => OnFileSelect(event)}
                className="w-full text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              File Name *
            </label>
            <Input
              placeholder="e.g., Data Structures PYQ 2023"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Semester *
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
              >
                <option value="">Select Semester</option>
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Subject *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
              >
                <option value="">Select Subject</option>
                {SUBJECTS.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
              <Input
                placeholder="Or enter custom subject"
                value={
                  subject.includes("Custom:")
                    ? subject.replace("Custom:", "")
                    : ""
                }
                onChange={(e) =>
                  setSubject(e.target.value ? `Custom:${e.target.value}` : "")
                }
                className="mt-2 text-sm"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs sm:text-sm text-blue-800">
              📝 <strong>Note:</strong> Your uploaded PYQ will be publicly
              visible to all users. Please ensure you have the right to share
              this content.
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={onUpload}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2Icon className="animate-spin mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Upload PYQ
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UploadPyq;
