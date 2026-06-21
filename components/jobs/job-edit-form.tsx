// components/jobs/job-edit-form.tsx
"use client";

import { useState } from "react";
import { JobStatus, JobType } from "@prisma/client";
import { Minus, Plus, Upload, Check } from "lucide-react";
import toast from "react-hot-toast";
import { SerializedJob } from "@/types/job";

interface JobEditFormProps {
    job: SerializedJob;
    onCancel: () => void;
    onSuccess: () => void;
}

export function JobEditForm({
    job,
    onCancel,
    onSuccess,
}: JobEditFormProps) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [companyName, setCompanyName] = useState(job.companyName);
    const [jobPosition, setJobPosition] = useState(job.jobPosition);
    const [status, setStatus] = useState<JobStatus>(job.status);
    const [jobType, setJobType] = useState<JobType | "">(job.jobType ?? "");
    const [location, setLocation] = useState(job.location ?? "");
    const [salary, setSalary] = useState(job.salary ?? "");
    const [interviewCount, setInterviewCount] = useState(job.interviewCount);
    const [nextInterviewDate, setNextInterviewDate] = useState(job.nextInterviewDate ? job.nextInterviewDate.slice(0, 16) : "");
    const [description, setDescription] = useState(job.description ?? "");
    const [notes, setNotes] = useState(job.personalNotes ?? "");
    const [jobPostingUrl, setJobPostingUrl] = useState(job.jobPostingUrl ?? "");
    
    // Explicitly utilizing state hooks
    const [referrerName, setReferrerName] = useState(job.referrerName ?? "");
    const [referrerProfileLink, setReferrerProfileLink] = useState(job.referrerProfileLink ?? "");

    const [fileData, setFileData] = useState<{
        fileName?: string | null;
        fileUrl?: string | null;
        fileType?: string | null;
        fileSize?: number | null;
    }>({
        fileName: job.fileName,
        fileUrl: job.fileUrl,
        fileType: job.fileType,
        fileSize: job.fileSize,
    });

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
            if (!response.ok) throw new Error(data.error);

            setFileData(data);
            toast.success("File replaced successfully");
        } catch {
            toast.error("File upload failed");
        } finally {
            setUploading(false);
        }
    }

    async function handleSave() {
        if (!companyName.trim() || !jobPosition.trim()) {
            toast.error("Company Name and Job Position are required fields.");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`/api/jobs/${job.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyName: companyName.trim(),
                    jobPosition: jobPosition.trim(),
                    status,
                    jobType: jobType || null,
                    location: location.trim() || null,
                    salary: salary.trim() || null,
                    interviewCount,
                    nextInterviewDate: nextInterviewDate || null,
                    description: description.trim() || null,
                    personalNotes: notes.trim() || null,
                    jobPostingUrl: jobPostingUrl.trim() || null,
                    referrerName: referrerName.trim() || null,
                    referrerProfileLink: referrerProfileLink.trim() || null,
                    ...fileData,
                }),
            });

            if (!response.ok) throw new Error();

            toast.success("Changes saved successfully");
            onSuccess();
        } catch {
            toast.error("Failed to update application");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-5">
            <div className="grid gap-4.5 md:grid-cols-2">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Company Name</label>
                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Job Position</label>
                    <input type="text" value={jobPosition} onChange={(e) => setJobPosition(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
                </div>
            </div>

            <div className="grid gap-4.5 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Tracking Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value as JobStatus)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
                        <option value="PROCESSING">Processing</option>
                        <option value="OFFERED">Offered</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="WITHDRAWN">Withdrawn</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Job Category</label>
                    <select value={jobType} onChange={(e) => setJobType(e.target.value as JobType)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
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
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Salary</label>
                    <input type="text" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
                </div>
            </div>

            <div className="grid gap-4.5 md:grid-cols-2">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Next Scheduled Interview</label>
                    <input type="datetime-local" value={nextInterviewDate} onChange={(e) => setNextInterviewDate(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Completed Interview Count</label>
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-1.5 rounded-xl max-w-50">
                        <button type="button" onClick={() => setInterviewCount(Math.max(0, interviewCount - 1))} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200"><Minus className="h-4 w-4" /></button>
                        <span className="flex-1 text-center font-heading font-extrabold text-sm text-slate-900">{interviewCount}</span>
                        <button type="button" onClick={() => setInterviewCount(interviewCount + 1)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200"><Plus className="h-4 w-4" /></button>
                    </div>
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Job Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Personal Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Posting URL</label>
                <input type="text" value={jobPostingUrl} onChange={(e) => setJobPostingUrl(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
            </div>

            <div className="grid gap-4.5 md:grid-cols-2 pt-3 border-t border-slate-100">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Referrer Name</label>
                    <input type="text" value={referrerName} onChange={(e) => setReferrerName(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4.5 py-3 text-sm" />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Referrer Profile Link</label>
                    <input type="text" value={referrerProfileLink} onChange={(e) => setReferrerProfileLink(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4.5 py-3 text-sm" />
                </div>
            </div>

            <div className="border-t border-slate-100 pt-4.5">
                <label className="text-xs font-bold text-slate-700 block mb-2">Attached Documents / Confirmation Image</label>
                <div className="flex items-center gap-4.5 p-4.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                    <div className="relative shrink-0">
                        <input type="file" id="edit-file-upload" accept=".pdf,image/*" disabled={uploading} onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUpload(file);
                        }} className="hidden" />
                        <label htmlFor="edit-file-upload" className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 cursor-pointer"><Upload className="h-4 w-4" />Replace File</label>
                    </div>
                    <div className="flex-1 text-xs">
                        {uploading ? (
                            <p className="font-semibold text-slate-500 animate-pulse">Uploading file...</p>
                        ) : fileData.fileName ? (
                            <div className="flex items-center gap-1.5 font-bold text-emerald-600">
                                <Check className="h-4 w-4" />
                                <span className="truncate max-w-62.5">{fileData.fileName}</span>
                            </div>
                        ) : (
                            <p className="text-slate-400 font-semibold">No vacancy documentation attached</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-6 shrink-0">
                <button type="button" onClick={onCancel} className="rounded-2xl border border-slate-200 hover:bg-slate-50 px-5.5 py-3 text-sm font-bold text-slate-500">Cancel</button>
                <button onClick={handleSave} disabled={loading || uploading} className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6.5 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50">{loading ? "Saving Changes..." : "Save Changes"}</button>
            </div>
        </div>
    );
}