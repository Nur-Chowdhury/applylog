// components/jobs/file-upload.tsx
"use client";

import { useState, DragEvent } from "react";
import { Upload, Check } from "lucide-react";

interface FileUploadProps {
    onFileUploaded: (data: { fileName: string; fileUrl: string; fileType: string; fileSize: number }) => void;
    acceptTypes?: string;
    maxSizeMB?: number;
}

export function FileUpload({
    onFileUploaded,
    acceptTypes = ".pdf,image/*",
    maxSizeMB = 10,
}: FileUploadProps) {
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState("");

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const processUpload = async (file: File) => {
        if (file.size > maxSizeMB * 1024 * 1024) {
            alert(`File exceeds the maximum ${maxSizeMB}MB size restriction.`);
            return;
        }

        try {
            setUploading(true);
            setProgress(25);
            setFileName(file.name);

            const formData = new FormData();
            formData.append("file", file);

            setProgress(50);
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            setProgress(75);
            const data = await response.json();

            if (!response.ok) throw new Error(data.error);

            setProgress(100);
            onFileUploaded(data);
        } catch {
            alert("File upload failed. Ensure server connection is active.");
            setFileName("");
        } finally {
            setUploading(false);
            setDragging(false);
        }
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            processUpload(file);
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6.5 text-center transition-all ${
                dragging
                    ? "border-slate-900 bg-slate-50/80"
                    : "border-slate-200 bg-white hover:border-slate-350"
            }`}
        >
            <div className="flex flex-col items-center justify-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <Upload className="h-5 w-5" />
                </div>

                <div className="text-xs">
                    <p className="font-bold text-slate-800">
                        Drag and drop your document here, or{" "}
                        <label className="text-blue-600 hover:underline cursor-pointer">
                            browse files
                            <input
                                type="file"
                                accept={acceptTypes}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) processUpload(file);
                                }}
                                className="hidden"
                            />
                        </label>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">PDF or image files up to {maxSizeMB}MB</p>
                </div>

                {uploading && (
                    <div className="w-full max-w-xs mt-2.5">
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-slate-950 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 mt-1 truncate">Uploading {fileName}...</p>
                    </div>
                )}

                {progress === 100 && !uploading && (
                    <div className="flex items-center gap-1.5 mt-2.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                        <Check className="h-4 w-4" />
                        <span>Ready to save</span>
                    </div>
                )}
            </div>
        </div>
    );
}