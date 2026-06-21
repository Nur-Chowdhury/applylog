// components/jobs/file-preview.tsx
"use client";

import { FileText, Download, ExternalLink } from "lucide-react";

interface FilePreviewProps {
    fileUrl: string;
    fileName: string;
    fileSize?: number | null;
}

export function FilePreview({
    fileUrl,
    fileName,
    fileSize,
}: FilePreviewProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FileText className="h-5 w-5" />
                </div>
                <div className="text-xs truncate">
                    <p className="font-extrabold text-slate-800 truncate">{fileName}</p>
                    {fileSize && (
                        <p className="text-[10px] text-slate-400 mt-0.5">{(fileSize / 1024).toFixed(1)} KB</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
                <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all"
                    title="View original link"
                >
                    <ExternalLink className="h-4 w-4" />
                </a>
                <a
                    href={fileUrl}
                    download={fileName}
                    className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-slate-950 hover:bg-slate-800 text-white shadow-2xs transition-all"
                    title="Download document"
                >
                    <Download className="h-4 w-4" />
                </a>
            </div>
        </div>
    );
}