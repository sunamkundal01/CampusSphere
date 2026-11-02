'use client'

import { ExternalLink, FileText } from 'lucide-react';
import React, { useState } from 'react';

const PdfViewer = ({ fileurl, fileName }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="relative flex min-h-0 flex-1 flex-col">
            <div className="flex h-12 items-center justify-between gap-3 border-b bg-card px-4">
                <p className="flex min-w-0 items-center gap-2 text-sm font-medium text-muted-foreground">
                    <FileText className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span className="truncate">{fileName || 'Document'}</span>
                </p>
                {fileurl && (
                    <a
                        href={fileurl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                        Open in new tab <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                )}
            </div>

            <div className="relative min-h-0 flex-1">
                {(isLoading || !fileurl) && (
                    <div className="absolute inset-0 flex items-center justify-center p-6" role="status">
                        <div className="w-full max-w-sm animate-pulse rounded-lg bg-card p-6 shadow-sm">
                            <div className="h-3 w-2/3 rounded bg-secondary" />
                            <div className="mt-5 space-y-2">
                                {[100, 92, 96, 80, 100, 70].map((w, i) => (
                                    <div key={i} className="h-2 rounded bg-secondary" style={{ width: `${w}%` }} />
                                ))}
                            </div>
                            <p className="mt-6 text-center text-xs text-muted-foreground">Loading PDF…</p>
                        </div>
                    </div>
                )}
                {fileurl && (
                    <iframe
                        src={fileurl + "#toolbar=0"}
                        className="h-full w-full"
                        onLoad={() => setIsLoading(false)} // Trigger when the PDF is loaded
                        title={fileName ? `PDF: ${fileName}` : "PDF Viewer"}
                    />
                )}
            </div>
        </div>
    );
}

export default PdfViewer;
