// components/jobs/job-view.tsx
"use client";

import { format } from "date-fns";
import { Calendar, LinkIcon, FileText, Trash2, Pencil } from "lucide-react";
import { SerializedJob } from "@/types/job";
import { getCompanyGradient, getStatusStyles, getInterviewCountdown } from "@/lib/utils";

interface JobViewProps {
    job: SerializedJob;
    onEdit: () => void;
    onDeleteTrigger: () => void;
    onClose: () => void;
}

export function JobView({
    job,
    onEdit,
    onDeleteTrigger,
    onClose,
}: JobViewProps) {
    const avatarGradient = getCompanyGradient(job.companyName);
    const statusTheme = getStatusStyles(job.status);
    const countdown = getInterviewCountdown(job.nextInterviewDate);
    const isImage = job.fileUrl && job.fileType?.startsWith("image/");

    return (
        <div className="space-y-6.5">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-105 pb-5.5">
                <div className="flex items-center gap-4">
                    <div className={`flex h-15 w-15 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${avatarGradient} text-white font-heading font-extrabold text-2xl shadow-sm`}>
                        {job.companyName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight leading-tight">
                            {job.jobPosition}
                        </h2>
                        <p className="text-sm font-bold text-slate-500 mt-0.5">
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
                        <span className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
                            {job.jobType.replace("_", " ")}
                        </span>
                    )}
                </div>
            </div>

            {/* Informational Parameter Block */}
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
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Interviews Completed</span>
                    <p className="mt-1.5 text-base font-extrabold text-slate-800 truncate">{job.interviewCount}</p>
                </div>

                <div className="rounded-2xl border border-slate-200/70 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date Logged</span>
                    <p className="mt-1.5 text-base font-extrabold text-slate-800 truncate">
                        {format(new Date(job.createdAt), "MMMM d, yyyy")}
                    </p>
                </div>
            </div>

            {/* Countdown and notification schedules */}
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

            {/* Description Block */}
            <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Role Description</h4>
                <div className="rounded-2xl border border-slate-200/70 p-4.5 bg-slate-50/50">
                    <p className="text-sm text-slate-600 font-medium whitespace-pre-wrap leading-relaxed">
                        {job.description || "No description provided."}
                    </p>
                </div>
            </div>

            {/* Personal Notes */}
            <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Personal Notes & Strategy</h4>
                <div className="rounded-2xl border border-slate-200/70 p-4.5 bg-slate-50/50">
                    <p className="text-sm text-slate-600 font-medium whitespace-pre-wrap leading-relaxed">
                        {job.personalNotes || "No notes logged for this application."}
                    </p>
                </div>
            </div>

            {/* Linkages & Referral details */}
            <div className="grid gap-4.5 md:grid-cols-2 pt-2">
                <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">External Vacancy Link</h4>
                    {job.jobPostingUrl ? (
                        <a
                            href={job.jobPostingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-between gap-3 w-full rounded-2xl border border-slate-200 p-4 hover:border-slate-350 bg-white transition-all group font-bold text-sm text-slate-700"
                        >
                            <span className="truncate max-w-50">Open Job Board Posting</span>
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

            {/* Document display preview block */}
            {job.fileUrl && (
                <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Attached Application File</h4>
                    {isImage ? (
                        <div className="rounded-2xl border border-slate-200 p-4.5 bg-slate-50 flex flex-col items-center justify-center gap-3">
                            <div className="relative max-h-80 w-full overflow-hidden rounded-xl border border-slate-200/60 bg-white flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={job.fileUrl} alt="Preview" className="object-contain max-h-76 w-auto" />
                            </div>
                            <div className="flex w-full items-center justify-between text-xs font-bold text-slate-600 px-1">
                                <span className="truncate max-w-62.5">{job.fileName}</span>
                                <a href={job.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
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
                                    <p className="font-bold text-slate-800">{job.fileName || "Download Document"}</p>
                                </div>
                            </div>
                            <a href={job.fileUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white hover:bg-slate-850 transition-all">
                                Download
                            </a>
                        </div>
                    )}
                </div>
            )}

            {/* Layout view mode options */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 pt-5 mt-8 shrink-0">
                <button
                    onClick={onDeleteTrigger}
                    className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-100 bg-rose-50/50 hover:bg-rose-50 text-rose-700 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer"
                >
                    <Trash2 className="h-4 w-4" />
                    Delete Record
                </button>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-2xl border border-slate-200 hover:bg-slate-50 px-6 py-2.5 text-sm font-bold text-slate-500 transition-all cursor-pointer"
                    >
                        Close
                    </button>
                    <button
                        onClick={onEdit}
                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-2.5 text-sm font-bold text-white hover:bg-slate-800 shadow-sm transition-all cursor-pointer"
                    >
                        <Pencil className="h-4 w-4" />
                        Edit details
                    </button>
                </div>
            </div>
        </div>
    );
}