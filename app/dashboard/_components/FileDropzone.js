"use client";

import { useId, useRef, useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import { cn } from "../../../lib/utils";

const MAX_MB = 20;

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// PDF picker that accepts click, keyboard and drag-and-drop.
export function FileDropzone({ file, onFile, disabled, error, onError }) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const accept = (picked) => {
    if (!picked) return;
    if (picked.type !== "application/pdf") {
      onError?.("Only PDF files are supported.");
      return;
    }
    if (picked.size > MAX_MB * 1024 * 1024) {
      onError?.(`That file is over ${MAX_MB} MB. Try a smaller PDF.`);
      return;
    }
    onError?.(null);
    onFile(picked);
  };

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-xl border bg-secondary/50 p-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-card text-primary shadow-sm">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{file.name}</p>
          <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            onFile(null);
            if (inputRef.current) inputRef.current.value = "";
          }}
          disabled={disabled}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground disabled:opacity-50"
          aria-label="Remove selected file"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          accept(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/30",
          dragging ? "border-primary bg-primary/5" : "border-input hover:border-primary/50 hover:bg-secondary/40",
          error && "border-destructive/60"
        )}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <UploadCloud className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="mt-3 text-sm font-semibold">
          Drop a PDF here or <span className="text-primary">browse</span>
        </span>
        <span className="mt-1 text-xs text-muted-foreground">PDF with selectable text, up to {MAX_MB} MB</span>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="application/pdf"
          disabled={disabled}
          className="sr-only"
          aria-describedby={error ? `${inputId}-error` : undefined}
          onChange={(e) => accept(e.target.files?.[0])}
        />
      </label>
      {error && (
        <p id={`${inputId}-error`} role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function stripPdfExtension(name = "") {
  return name.replace(/\.pdf$/i, "").replace(/[_-]+/g, " ").trim();
}
