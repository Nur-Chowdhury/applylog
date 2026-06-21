// components/dashboard/dashboard-client.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { LayoutGrid, List, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { JobStatus } from "@prisma/client";

import {
    DashboardStats,
    JobSortField,
    ViewMode,
    SerializedJob,
} from "@/types/job";

import { StatsBar } from "./stats-bar";
import { NoticeBoard } from "./notice-board";
import { SearchFilterBar } from "./search-filter-bar";
import { DashboardGrid } from "./dashboard-grid";
import { DashboardList } from "./dashboard-list";

import { AddJobModal } from "@/components/modals/add-job-modal";
import { JobDetailsModal } from "@/components/modals/job-details-modal";

interface DashboardClientProps {
    jobs: SerializedJob[];
    stats: DashboardStats;
    currentPage: number;
    pageSize: number;
    totalItems: number;
}

export function DashboardClient({
    jobs,
    stats,
    currentPage,
    pageSize,
    totalItems,
}: DashboardClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState<SerializedJob | null>(null);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<JobStatus | "ALL">("ALL");
    const [sortField, setSortField] = useState<JobSortField>("interviews");
    const [ascending, setAscending] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>("grid");

    const filteredJobs = useMemo(() => {
        let result = [...jobs];

        if (search.trim()) {
            const query = search.toLowerCase();

            result = result.filter((job) =>
                [
                    job.companyName,
                    job.jobPosition,
                    job.description,
                    job.location,
                    job.personalNotes,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase()
                    .includes(query)
            );
        }

        if (status !== "ALL") {
            result = result.filter(
                (job) => job.status === status
            );
        }

        result.sort((a, b) => {
            let comparison = 0;

            switch (sortField) {
                case "interviews":
                    comparison = a.interviewCount - b.interviewCount;
                    break;

                case "dateApplied":
                    comparison =
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime();
                    break;

                case "nextInterview":
                    comparison =
                        new Date(a.nextInterviewDate ?? 0).getTime() -
                        new Date(b.nextInterviewDate ?? 0).getTime();
                    break;

                case "company":
                    comparison = a.companyName.localeCompare(b.companyName);
                    break;
            }

            return ascending ? comparison : -comparison;
        });

        return result;
    }, [jobs, search, status, sortField, ascending]);

    const totalPages = Math.ceil(totalItems / pageSize);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(newPage));
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleLimitChange = (newLimit: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("limit", newLimit);
        params.set("page", "1"); // Reset back to first page
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <>
            <AddJobModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                onCreated={() => router.refresh()}
            />

            {selectedJob && (
                <JobDetailsModal
                    open={!!selectedJob}
                    job={selectedJob}
                    onClose={() => setSelectedJob(null)}
                    onUpdated={() => {
                        setSelectedJob(null);
                        router.refresh();
                    }}
                />
            )}

            <div className="space-y-6.5">
                <NoticeBoard jobs={jobs} />

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white border border-slate-200/70 p-5 rounded-3xl">
                    <div>
                        <h2 className="text-xl font-heading font-extrabold tracking-tight text-slate-900 leading-tight">
                            Active Application Pipeline
                        </h2>
                        <p className="text-xs text-slate-500 font-semibold mt-1">
                            Manage, filter, and schedule your active career leads
                        </p>
                    </div>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5.5 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 shadow-sm shadow-slate-950/10 cursor-pointer"
                    >
                        <Plus className="h-4.5 w-4.5" />
                        Add Application
                    </button>
                </div>

                <StatsBar stats={stats} />

                <SearchFilterBar
                    search={search}
                    setSearch={setSearch}
                    status={status}
                    setStatus={setStatus}
                    sortField={sortField}
                    setSortField={setSortField}
                    ascending={ascending}
                    setAscending={setAscending}
                />

                <div className="flex items-center justify-between bg-slate-100/50 p-2.5 rounded-2xl">
                    <div className="flex items-center gap-3 pl-2">
                        <p className="text-xs font-bold text-slate-500">
                            Showing {filteredJobs.length} of {totalItems} items
                        </p>
                        <select
                            value={String(pageSize)}
                            onChange={(e) => handleLimitChange(e.target.value)}
                            className="bg-white border border-slate-250 rounded-lg text-xs font-semibold px-2.5 py-1 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-slate-700 cursor-pointer"
                        >
                            <option value="6">6 / page</option>
                            <option value="12">12 / page</option>
                            <option value="24">24 / page</option>
                            <option value="48">48 / page</option>
                        </select>
                    </div>

                    <div className="flex gap-1.5">
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
                        <h3 className="text-lg font-heading font-bold text-slate-900">
                            No active jobs found
                        </h3>
                        <p className="mt-2.5 text-sm text-slate-500 font-semibold max-w-sm mx-auto">
                            Try adjusting filters, modifying searches, or create a brand new application.
                        </p>
                    </div>
                ) : viewMode === "grid" ? (
                    <DashboardGrid
                        jobs={filteredJobs}
                        onSelectJob={setSelectedJob}
                    />
                ) : (
                    <DashboardList
                        jobs={filteredJobs}
                        onSelectJob={setSelectedJob}
                    />
                )}

                {/* Dashboard Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-6">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 disabled:opacity-40 transition-all cursor-pointer"
                        >
                            <ChevronLeft className="h-4.5 w-4.5" />
                        </button>

                        {[...Array(totalPages)].map((_, i) => {
                            const pageNum = i + 1;
                            const active = pageNum === currentPage;

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                        active
                                            ? "bg-slate-950 text-white shadow-sm"
                                            : "bg-white border border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 disabled:opacity-40 transition-all cursor-pointer"
                        >
                            <ChevronRight className="h-4.5 w-4.5" />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}