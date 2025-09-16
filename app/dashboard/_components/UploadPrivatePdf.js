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
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import uuid4 from "uuid4";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "sonner";

function UploadPrivatePdf({ children }) {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const addFileEntry = useMutation(api.fileStorage.AddFileEntryToDb);
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const embeddedDocument = useAction(api.myActions.ingest);
  const { user } = useUser();
  const [file, setfile] = useState();
  const [loading, setloading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when dialog closes
      setfile(null);
      setFileName("");
    }
  };

  const OnFileSelect = (event) => {
    setfile(event.target.files[0]);
  };

  const onUpload = async () => {
    if (!file) {
      toast("Please select a file to upload");
      return;
    }

    if (!fileName.trim()) {
      toast("Please enter a file name");
      return;
    }

    setloading(true);

    try {
      //Step 1: Get a short-lived upload URL
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

      // Step 3: Save the newly allocated storage id to the database (private upload - no semester/subject)
      const resp = await addFileEntry({
        fileId: fileId,
        storageId: storageId,
        fileName: fileName.trim(),
        createdBy: user?.primaryEmailAddress.emailAddress,
        fileUrl: fileUrl,
        semester: "", // Empty for private uploads
        subject: "", // Empty for private uploads
      });

      console.log(resp);

      //API Call to fetch PDF process data
      const apiresp = await axios.get("/api/pdf-loader?pdfUrl=" + fileUrl);
      console.log(apiresp.data.result);
      await embeddedDocument({
        sliptText: apiresp.data.result,
        fileId: fileId,
      });

      setloading(false);
      setOpen(false);

      // Reset form after successful upload
      setfile(null);
      setFileName("");

      toast("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      setloading(false);
      toast("Error uploading file. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[95vw] max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload PDF File</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-5 space-y-4">
              <h2 className="text-sm text-gray-600 mb-4">
                Upload a PDF file to your private workspace
              </h2>
              <div className="gap-2 p-3 rounded-md border">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => OnFileSelect(event)}
                  className="w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  File Name *
                </label>
                <Input
                  placeholder="Enter file name"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={onUpload}
            disabled={loading || !file || !fileName.trim()}
            className="w-full sm:w-auto"
          >
            {loading ? <Loader2Icon className="animate-spin" /> : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UploadPrivatePdf;
