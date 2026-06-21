// components/modals/add-job-modal.tsx
"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { JobType } from "@prisma/client";
import { X, Upload, Check, FileText } from "lucide-react";

interface AddJobModalProps {
    open: boolean;
    onClose: () => void;
    onCreated?: () => void;
}

export function AddJobModal({
    open,
    onClose,
    onCreated,
}: AddJobModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [companyName, setCompanyName] = useState("");
    const [jobPosition, setJobPosition] = useState("");
    const [jobType, setJobType] = useState<JobType | "">("");
    const [location, setLocation] = useState("");
    const [salary, setSalary] = useState("");
    const [description, setDescription] = useState("");
    const [notes, setNotes] = useState("");
    const [jobPostingUrl, setJobPostingUrl] = useState("");
    const [referrerName, setReferrerName] = useState("");
    const [referrerProfileLink, setReferrerProfileLink] = useState("");
    const [nextInterviewDate, setNextInterviewDate] = useState("");

    const [fileData, setFileData] = useState<{
        fileName?: string;
        fileUrl?: string;
        fileType?: string;
        fileSize?: number;
    }>({});

    useEffect(() => {
        function handleEscape(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        if (open) {
            window.addEventListener("keydown", handleEscape);
        }
        return () => window.removeEventListener("keydown", handleEscape);
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    async function handleUpload(file: File) {
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "File upload failed");
            }

            setFileData(data);
            toast.success("File uploaded to safe storage");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error uploading document");
        } finally {
            setUploading(false);
        }
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!companyName.trim() || !jobPosition.trim()) {
            toast.error("Company Name and Job Position are required fields.");
            return;
        }

        try {
            setLoading(true);

            let formattedUrl = jobPostingUrl.trim();
            if (formattedUrl && !/^https?:\/\//i.test(formattedUrl)) {
                formattedUrl = `https://${formattedUrl}`;
            }

            let formattedRef = referrerProfileLink.trim();
            if (formattedRef && !/^https?:\/\//i.test(formattedRef)) {
                formattedRef = `https://${formattedRef}`;
            }

            const response = await fetch("/api/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    companyName: companyName.trim(),
                    jobPosition: jobPosition.trim(),
                    jobType: jobType || undefined,
                    location: location.trim() || undefined,
                    salary: salary.trim() || undefined,
                    description: description.trim() || undefined,
                    personalNotes: notes.trim() || undefined,
                    jobPostingUrl: formattedUrl || undefined,
                    referrerName: referrerName.trim() || undefined,
                    referrerProfileLink: formattedRef || undefined,
                    nextInterviewDate: nextInterviewDate || undefined,
                    interviewCount: 0,
                    ...fileData,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error ? JSON.stringify(data.error) : "Creation aborted");
            }

            toast.success("Application added");
            onCreated?.();
            onClose();
            window.location.reload();
        } catch (error) {
            console.error("Create application error details: ", error);
            toast.error("Review and verify your form inputs");
        } finally {
            setLoading(false);
        }
    }

    const isUploadedImage = fileData.fileUrl && fileData.fileType?.startsWith("image/");

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto"
            onClick={onClose}
        >
            <div
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
            >
                <div className="flex items-center justify-between border-b border-slate-100 px-6.5 py-4.5 shrink-0">
                    <div>
                        <h2 className="text-lg font-heading font-extrabold text-slate-900 tracking-tight">
                            Add Job Opportunity
                        </h2>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">
                            Fill in all interview parameters or documentation
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-xl p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-all cursor-pointer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6.5 space-y-5">
                    <div className="grid gap-4.5 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Company Name <span className="text-rose-500">*</span></label>
                            <input
                                required
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="Google, Microsoft, etc."
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none hover:border-slate-300 focus:border-slate-950 transition-all text-slate-800"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Job Position / Title <span className="text-rose-500">*</span></label>
                            <input
                                required
                                type="text"
                                value={jobPosition}
                                onChange={(e) => setJobPosition(e.target.value)}
                                placeholder="Software Engineer"
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none hover:border-slate-300 focus:border-slate-950 transition-all text-slate-800"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Job Type</label>
                            <select
                                value={jobType}
                                onChange={(e) => setJobType(e.target.value as JobType)}
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none hover:border-slate-300 focus:border-slate-950 transition-all text-slate-700 cursor-pointer"
                            >
                                <option value="">Select Category</option>
                                <option value="FULL_TIME">Full Time</option>
                                <option value="PART_TIME">Part Time</option>
                                <option value="CONTRACT">Contract</option>
                                <option value="INTERNSHIP">Internship</option>
                                <option value="REMOTE">Remote</option>
                                <option value="HYBRID">Hybrid</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Location</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="New York, NY / Remote"
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none hover:border-slate-300 focus:border-slate-950 transition-all text-slate-800"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Salary Package</label>
                            <input
                                type="text"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                                placeholder="$120k/yr - $140k/yr"
                                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium outline-none hover:border-slate-300 focus:border-slate-950 transition-all text-slate-800"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Next Scheduled Interview</label>
                            <input
                                type="datetime-local"
                                value={nextInterviewDate}
                                onChange={(e) => setNextInterviewDate(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium outline-none hover:border-slate-300 focus:border-slate-950 transition-all text-slate-700 cursor-pointer"
                            />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold text-slate-700">Job Vacancy Link URL</label>
                            <input
                                type="text"
                                value={jobPostingUrl}
                                onChange={(e) => setJobPostingUrl(e.target.value)}
                                placeholder="https://careers.company.com/job"
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none hover:border-slate-300 focus:border-slate-950 transition-all text-slate-800"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Job Description Preview</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Copy paste important aspects, stack requirements, or role details..."
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium outline-none hover:border-slate-300 focus:border-slate-950 transition-all text-slate-800"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Personal Notes & Strategies</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            placeholder="Interview preparations, thoughts, timeline details..."
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium outline-none hover:border-slate-300 focus:border-slate-950 transition-all text-slate-800"
                        />
                    </div>

                    <div className="border-t border-slate-100 pt-4.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">Referrer Information (Optional)</h4>
                        <div className="grid gap-4.5 md:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">Referrer Name</label>
                                <input
                                    type="text"
                                    value={referrerName}
                                    onChange={(e) => setReferrerName(e.target.value)}
                                    placeholder="Alex Smith"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none hover:border-slate-300 focus:border-slate-950 transition-all text-slate-800"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">Referrer Profile URL</label>
                                <input
                                    type="text"
                                    value={referrerProfileLink}
                                    onChange={(e) => setReferrerProfileLink(e.target.value)}
                                    placeholder="linkedin.com/in/profile"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none hover:border-slate-300 focus:border-slate-950 transition-all text-slate-800"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">Application Documents</h4>
                        
                        <div className="flex flex-col gap-3 p-4.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                            <div className="flex items-center gap-4.5">
                                <div className="relative shrink-0">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        accept=".pdf,image/*"
                                        disabled={uploading}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleUpload(file);
                                        }}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 transition-all shadow-2xs cursor-pointer"
                                    >
                                        <Upload className="h-4 w-4" />
                                        Choose Document (PDF/Img)
                                    </label>
                                </div>

                                <div className="flex-1 text-xs">
                                    {uploading ? (
                                        <p className="font-semibold text-slate-500 animate-pulse">Uploading securely to Cloud Bucket...</p>
                                    ) : fileData.fileName ? (
                                        <div className="flex items-center gap-1.5 font-bold text-emerald-600">
                                            <Check className="h-4 w-4" />
                                            <span className="truncate max-w-xs">{fileData.fileName}</span>
                                        </div>
                                    ) : (
                                        <p className="text-slate-400 font-semibold">No vacancy document or PDF receipt attached</p>
                                    )}
                                </div>
                            </div>

                            {/* Thumbnail Preview Area */}
                            {isUploadedImage && (
                                <div className="mt-1 relative h-28 w-28 rounded-xl border border-slate-200/80 bg-white overflow-hidden p-1 flex items-center justify-center self-start">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img 
                                        src={fileData.fileUrl} 
                                        alt="Uploaded document thumbnail" 
                                        className="object-contain max-h-26 max-w-26 rounded-lg"
                                    />
                                </div>
                            )}

                            {fileData.fileUrl && !isUploadedImage && (
                                <div className="mt-1 flex items-center gap-2 text-xs text-slate-600 font-bold bg-white border border-slate-150 p-2.5 rounded-xl self-start">
                                    <FileText className="h-4 w-4 text-blue-500" />
                                    <span>PDF document prepared</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 mt-3 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-2xl border border-slate-200 hover:bg-slate-50 px-5.5 py-3 text-sm font-bold text-slate-600 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            disabled={loading || uploading}
                            type="submit"
                            className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6.5 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 shadow-sm shadow-slate-950/15 cursor-pointer disabled:opacity-40"
                        >
                            {loading ? "Saving Application..." : "Save Opportunity"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}