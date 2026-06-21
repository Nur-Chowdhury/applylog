// components/modals/job-detail-modal.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { X, Pencil, Trash2, LinkIcon, FileText, Calendar, Plus, Minus, Upload, Check, ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { SerializedJob } from "@/types/job";
import { JobStatus, JobType } from "@prisma/client";
import { getCompanyGradient, getStatusStyles, getInterviewCountdown } from "@/lib/utils";

interface JobDetailModalProps {
    job: SerializedJob;
    open: boolean;
    onClose: () => void;
    onUpdated?: () => void;
}

export function JobDetailModal({
    job,
    open,
    onClose,
    onUpdated,
}: JobDetailModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    // Initializing state directly from props since the component remounts on key change
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

    const avatarGradient = getCompanyGradient(job.companyName);
    const statusTheme = getStatusStyles(job.status);
    const countdown = getInterviewCountdown(job.nextInterviewDate);

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

            setFileData({
                fileName: data.fileName,
                fileUrl: data.fileUrl,
                fileType: data.fileType,
                fileSize: data.fileSize,
            });
            toast.success("New file uploaded successfully");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error uploading document");
        } finally {
            setUploading(false);
        }
    }

    async function handleUpdate() {
        if (!companyName.trim() || !jobPosition.trim()) {
            toast.error("Company Name and Job Position are required.");
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
                    jobPostingUrl: formattedUrl || null,
                    referrerName: referrerName.trim() || null,
                    referrerProfileLink: formattedRef || null,
                    ...fileData,
                }),
            });

            if (!response.ok) throw new Error();

            toast.success("Application changes saved");
            setEditing(false);
            onClose();
            if (onUpdated) onUpdated();
            else window.location.reload();
        } catch {
            toast.error("Unable to save updates at this time");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        try {
            setLoading(true);
            const response = await fetch(`/api/jobs/${job.id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error();

            toast.success("Application record deleted");
            onClose();
            if (onUpdated) onUpdated();
            else window.location.reload();
        } catch {
            toast.error("Failed to delete application record");
        } finally {
            setLoading(false);
        }
    }

    const isImage = fileData.fileUrl && fileData.fileType?.startsWith("image/");

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto"
        >
            <div
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
            >
                {/* Header Control Buttons */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 shrink-0 bg-slate-50/50 rounded-t-3xl">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {editing ? "Form Editor Mode" : "Detailed Overview"}
                    </span>

                    <div className="flex items-center gap-2">
                        {!editing && (
                            <button
                                onClick={() => setEditing(true)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit Entry
                            </button>
                        )}

                        <button
                            onClick={onClose}
                            className="rounded-xl p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-800 transition-all cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Main Content Body */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    {editing ? (
                        <div className="space-y-5">
                            <div className="grid gap-4.5 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Company Name</label>
                                    <input
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 px-4.5 py-3 text-sm font-medium outline-none text-slate-800 focus:border-slate-950"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Job Position</label>
                                    <input
                                        type="text"
                                        value={jobPosition}
                                        onChange={(e) => setJobPosition(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 px-4.5 py-3 text-sm font-medium outline-none text-slate-800 focus:border-slate-950"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4.5 md:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Tracking Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as JobStatus)}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-bold text-slate-700 outline-none focus:border-slate-950 cursor-pointer"
                                    >
                                        <option value="PROCESSING">Processing</option>
                                        <option value="OFFERED">Offered</option>
                                        <option value="ACCEPTED">Accepted</option>
                                        <option value="REJECTED">Rejected</option>
                                        <option value="WITHDRAWN">Withdrawn</option>
                                    </select>
                                end</div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Job Category</label>
                                    <select
                                        value={jobType}
                                        onChange={(e) => setJobType(e.target.value as JobType)}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-slate-950 cursor-pointer"
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
                                        className="w-full rounded-xl border border-slate-200 px-4.5 py-3 text-sm font-medium outline-none text-slate-800 focus:border-slate-950"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Salary</label>
                                    <input
                                        type="text"
                                        value={salary}
                                        onChange={(e) => setSalary(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 px-4.5 py-3 text-sm font-medium outline-none text-slate-800 focus:border-slate-950"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4.5 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Next Scheduled Interview</label>
                                    <input
                                        type="datetime-local"
                                        value={nextInterviewDate}
                                        onChange={(e) => setNextInterviewDate(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none text-slate-700 focus:border-slate-950 cursor-pointer"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Completed Interview Count</label>
                                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-1.5 rounded-xl max-w-50">
                                        <button
                                            type="button"
                                            onClick={() => setInterviewCount(Math.max(0, interviewCount - 1))}
                                            className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-all shadow-2xs cursor-pointer"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="flex-1 text-center font-heading font-extrabold text-sm text-slate-900">
                                            {interviewCount}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setInterviewCount(interviewCount + 1)}
                                            className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-all shadow-2xs cursor-pointer"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">Job Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium outline-none text-slate-800 focus:border-slate-950"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">Personal Notes</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium outline-none text-slate-800 focus:border-slate-950"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">Posting Vacancy URL</label>
                                <input
                                    type="text"
                                    value={jobPostingUrl}
                                    onChange={(e) => setJobPostingUrl(e.target.value)}
                                    placeholder="https://company.com/job"
                                    className="w-full rounded-xl border border-slate-200 px-4.5 py-3 text-sm font-medium outline-none text-slate-800 focus:border-slate-950"
                                />
                            </div>

                            <div className="grid gap-4.5 md:grid-cols-2 pt-3 border-t border-slate-100">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Referrer Name</label>
                                    <input
                                        type="text"
                                        value={referrerName}
                                        onChange={(e) => setReferrerName(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 px-4.5 py-3 text-sm font-medium outline-none text-slate-800 focus:border-slate-950"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Referrer Profile Link</label>
                                    <input
                                        type="text"
                                        value={referrerProfileLink}
                                        onChange={(e) => setReferrerProfileLink(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 px-4.5 py-3 text-sm font-medium outline-none text-slate-800 focus:border-slate-950"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-4.5">
                                <label className="text-xs font-bold text-slate-700 block mb-2">Attached Documents / Confirmation Image</label>
                                <div className="flex items-center gap-4.5 p-4.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                                    <div className="relative shrink-0">
                                        <input
                                            type="file"
                                            id="edit-file-upload"
                                            accept=".pdf,image/*"
                                            disabled={uploading}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleUpload(file);
                                            }}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="edit-file-upload"
                                            className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 transition-all shadow-2xs cursor-pointer"
                                        >
                                            <Upload className="h-4 w-4" />
                                            Replace File
                                        </label>
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
                                <button
                                    type="button"
                                    onClick={() => setEditing(false)}
                                    className="rounded-2xl border border-slate-200 hover:bg-slate-50 px-5.5 py-3 text-sm font-bold text-slate-500 transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleUpdate}
                                    disabled={loading || uploading}
                                    className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6.5 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 shadow-sm shadow-slate-950/10 cursor-pointer disabled:opacity-50"
                                >
                                    {loading ? "Saving Changes..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6.5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5.5">
                                <div className="flex items-center gap-4">
                                    <div className={`flex h-15 w-15 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${avatarGradient} text-white font-heading font-extrabold text-2xl shadow-sm`}>
                                        {job.companyName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="font-heading font-extrabold text-2xl text-slate-950 tracking-tight leading-tight">
                                            {job.jobPosition}
                                        </h2>
                                        <p className="text-sm font-semibold text-slate-500 mt-0.5">
                                            {job.companyName}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2.5">
                                    <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold border ${statusTheme.bg} capitalize`}>
                                        <span className={`h-2 w-2 rounded-full ${statusTheme.dot}`} />
                                        {job.status.toLowerCase()}
                                    </span>

                                    {job.jobType && (
                                        <span className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-full">
                                            {job.jobType.replace("_", " ")}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-4 pt-2">
                                <div className="rounded-2xl border border-slate-200/70 p-4">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Salary Package</span>
                                    <p className="mt-1.5 text-base font-extrabold text-slate-800 truncate">{job.salary || "-"}</p>
                                </div>

                                <div className="rounded-2xl border border-slate-200/70 p-4">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Location</span>
                                    <p className="mt-1.5 text-base font-extrabold text-slate-800 truncate">{job.location || "-"}</p>
                                </div>

                                <div className="rounded-2xl border border-slate-200/70 p-4">
                                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Completed Interviews</span>
                                    <p className="mt-1.5 text-base font-extrabold text-slate-800 truncate">{job.interviewCount}</p>
                                </div>

                                <div className="rounded-2xl border border-slate-200/70 p-4">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date Logged</span>
                                    <p className="mt-1.5 text-base font-extrabold text-slate-800 truncate">
                                        {format(new Date(job.createdAt), "MMMM d, yyyy")}
                                    </p>
                                </div>
                            </div>

                            {job.nextInterviewDate && (
                                <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                                    countdown && countdown.days <= 1 
                                        ? "bg-rose-50 border-rose-150 text-rose-950" 
                                        : "bg-amber-50 border-amber-150 text-amber-950"
                                }`}>
                                    <div className="flex items-center gap-2.5">
                                        <Calendar className="h-5 w-5 opacity-75 shrink-0" />
                                        <div className="text-sm">
                                            <p className="font-bold">Next Interview Scheduled</p>
                                            <p className="opacity-80 font-medium text-xs mt-0.5">
                                                {format(new Date(job.nextInterviewDate), "PPPP 'at' p")}
                                            </p>
                                        </div>
                                    </div>
                                    {countdown && (
                                        <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-md bg-white/70 shadow-2xs self-start sm:self-auto">
                                            {countdown.text}
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className="space-y-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Role Description</h4>
                                <div className="rounded-2xl border border-slate-200/70 p-4.5 bg-slate-50/50">
                                    <p className="text-sm text-slate-600 font-medium whitespace-pre-wrap leading-relaxed">
                                        {job.description || "No description provided."}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Personal Notes & Strategy</h4>
                                <div className="rounded-2xl border border-slate-200/70 p-4.5 bg-slate-50/50">
                                    <p className="text-sm text-slate-600 font-medium whitespace-pre-wrap leading-relaxed">
                                        {job.personalNotes || "No notes logged for this application."}
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4.5 md:grid-cols-2 pt-2">
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">External Vacancy Link</h4>
                                    {job.jobPostingUrl ? (
                                        <a
                                            href={job.jobPostingUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-between gap-3 w-full rounded-2xl border border-slate-200 p-4 hover:border-slate-300 bg-white transition-all group font-bold text-sm text-slate-700"
                                        >
                                            <span className="truncate max-w-50">Open Job Board Posting</span>
                                            <ArrowUpRight className="h-4.5 w-4.5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                                        </a>
                                    ) : (
                                        <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400 font-semibold">
                                            No posting link attached
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Referrer Information</h4>
                                    {job.referrerName ? (
                                        <div className="rounded-2xl border border-slate-200 p-4 bg-white flex items-center justify-between gap-2.5">
                                            <div className="text-xs">
                                                <p className="font-extrabold text-slate-800">{job.referrerName}</p>
                                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Application Referral</p>
                                            </div>
                                            {job.referrerProfileLink && (
                                                <a
                                                    href={job.referrerProfileLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="rounded-xl border border-slate-250 bg-slate-50 hover:bg-slate-100 p-2 text-slate-600 transition-all shrink-0"
                                                    title="View referrer profile"
                                                >
                                                    <LinkIcon className="h-4 w-4" />
                                                </a>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400 font-semibold">
                                            No referrer logged
                                        </div>
                                    )}
                                </div>
                            </div>

                            {fileData.fileUrl && (
                                <div className="space-y-3 pt-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Attached Application File</h4>
                                    
                                    {isImage ? (
                                        <div className="rounded-2xl border border-slate-200 p-4.5 bg-slate-50 flex flex-col items-center justify-center gap-3">
                                            <div className="relative max-h-80 w-full overflow-hidden rounded-xl border border-slate-200/60 bg-white flex items-center justify-center">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img 
                                                    src={fileData.fileUrl} 
                                                    alt="Application document preview" 
                                                    className="object-contain max-h-76 w-auto"
                                                />
                                            </div>
                                            <div className="flex w-full items-center justify-between text-xs font-bold text-slate-600 px-1">
                                                <span className="truncate max-w-62.5">{fileData.fileName}</span>
                                                <a 
                                                    href={fileData.fileUrl} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    View Full Resolution
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-3 bg-slate-50/30">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div className="text-xs truncate max-w-50 sm:max-w-md">
                                                    <p className="font-bold text-slate-800">{fileData.fileName || "Download Attached PDF"}</p>
                                                    {fileData.fileSize && (
                                                        <p className="text-[10px] text-slate-400 mt-0.5">{(fileData.fileSize / 1024).toFixed(1)} KB</p>
                                                    )}
                                                </div>
                                            </div>
                                            <a
                                                href={fileData.fileUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white hover:bg-slate-850 shadow-sm shadow-slate-950/10 transition-all"
                                            >
                                                Download PDF
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 pt-5 mt-8 shrink-0">
                                {confirmDelete ? (
                                    <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 p-2 rounded-2xl">
                                        <span className="text-xs font-extrabold text-rose-700 px-2">Are you sure?</span>
                                        <button
                                            onClick={handleDelete}
                                            disabled={loading}
                                            className="rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-700 transition-all cursor-pointer"
                                        >
                                            Yes, Delete
                                        </button>
                                        <button
                                            onClick={() => setConfirmDelete(false)}
                                            className="rounded-xl bg-slate-100 border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setConfirmDelete(true)}
                                        className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-100 hover:border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-700 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete Log Entry
                                    </button>
                                )}

                                <button
                                    onClick={onClose}
                                    className="rounded-2xl border border-slate-200 hover:bg-slate-50 px-6 py-2.5 text-sm font-bold text-slate-500 transition-all cursor-pointer self-end sm:self-auto"
                                >
                                    Close Details
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}