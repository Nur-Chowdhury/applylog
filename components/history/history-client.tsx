// components/history/history-client.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { History, LayoutGrid, List, Smile } from "lucide-react";
import { SerializedJob } from "@/types/job";
import { JobStatus } from "@prisma/client";
import { DashboardGrid } from "../dashboard/dashboard-grid";
import { DashboardList } from "../dashboard/dashboard-list";
import { JobDetailModal } from "../modals/job-detail-modal";

interface HistoryClientProps {
    initialJobs: SerializedJob[];
    stats: {
        total: number;
        rejectedCount: number;
        withdrawnCount: number;
        averageInterviews: number;
    };
}

export function HistoryClient({
    initialJobs,
    stats,
}: HistoryClientProps) {
    const router = useRouter();
    const [selectedJob, setSelectedJob] = useState<SerializedJob | null>(null);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<JobStatus | "ALL">("ALL");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const filteredJobs = useMemo(() => {
        return initialJobs.filter((job) => {
            const matchesSearch = [job.companyName, job.jobPosition, job.description]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesStatus = status === "ALL" || job.status === status;

            return matchesSearch && matchesStatus;
        });
    }, [initialJobs, search, status]);

    return (
        <div className="space-y-6.5">
            {/* UPGRADED: Conditionally rendering using selectedJob.id as key clears all synchronization warnings */}
            {selectedJob && (
                <JobDetailModal
                    key={selectedJob.id}
                    open={!!selectedJob}
                    job={selectedJob}
                    onClose={() => setSelectedJob(null)}
                    onUpdated={() => {
                        setSelectedJob(null);
                        router.refresh();
                    }}
                />
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white border border-slate-200/70 p-5 rounded-3xl shadow-sm">
                <div>
                    <h2 className="text-xl font-heading font-extrabold tracking-tight text-slate-900 leading-tight">
                        Archived Applications History
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                        Review, study notes, or restore your Rejected and Withdrawn entries
                    </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    <History className="h-5.5 w-5.5" />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Archived</p>
                    <p className="mt-2 text-3xl font-extrabold text-slate-900">{stats.total}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs uppercase tracking-wider text-rose-500 font-semibold">Rejected</p>
                    <p className="mt-2 text-3xl font-extrabold text-rose-600">{stats.rejectedCount}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Withdrawn</p>
                    <p className="mt-2 text-3xl font-extrabold text-slate-600">{stats.withdrawnCount}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg Interviews Done</p>
                    <p className="mt-2 text-3xl font-extrabold text-indigo-600">{stats.averageInterviews}</p>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm grid gap-3.5 md:grid-cols-12 items-center">
                <div className="relative md:col-span-8">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search archived files..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4.5 text-sm font-medium outline-none hover:border-slate-300 focus:border-slate-950 focus:bg-white transition-all text-slate-800"
                    />
                </div>
                <div className="relative md:col-span-4">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as JobStatus | "ALL")}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-semibold outline-none hover:border-slate-300 focus:border-slate-950 focus:bg-white transition-all text-slate-700 cursor-pointer"
                    >
                        <option value="ALL">All Archive Types</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="WITHDRAWN">Withdrawn</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center justify-between bg-slate-100/50 p-2.5 rounded-2xl">
                <p className="text-xs font-bold text-slate-500 pl-2">
                    Found {filteredJobs.length} entry{filteredJobs.length === 1 ? "" : "s"}
                </p>
                <div className="flex gap-1">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`rounded-xl p-2 transition-all cursor-pointer ${
                            viewMode === "grid"
                                ? "bg-slate-950 text-white"
                                : "text-slate-400 hover:text-slate-800 hover:bg-white"
                        }`}
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`rounded-xl p-2 transition-all cursor-pointer ${
                            viewMode === "list"
                                ? "bg-slate-950 text-white"
                                : "text-slate-400 hover:text-slate-800 hover:bg-white"
                        }`}
                    >
                        <List className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {filteredJobs.length === 0 ? (
                <div className="rounded-3xl border border-slate-200/70 bg-white p-16 text-center shadow-xs">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-5">
                        <Smile className="h-7 w-7 animate-bounce" />
                    </div>
                    <h3 className="text-xl font-heading font-extrabold text-slate-900">
                        The archives are clean!
                    </h3>
                    <p className="mt-3.5 text-sm text-slate-500 font-semibold max-w-sm mx-auto leading-relaxed">
                        Every single application counts as progress. Keep learning, keep tailoring your projects, and your next big breakthrough is right around the corner!
                    </p>
                </div>
            ) : viewMode === "grid" ? (
                <DashboardGrid jobs={filteredJobs} onSelectJob={setSelectedJob} />
            ) : (
                <DashboardList jobs={filteredJobs} onSelectJob={setSelectedJob} />
            )}
        </div>
    );
}