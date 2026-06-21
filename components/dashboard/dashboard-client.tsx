// components/dashboard/dashboard-client.tsx

"use client";

import { useMemo, useState } from "react";

import {
    LayoutGrid,
    List,
} from "lucide-react";

import {
    JobApplication,
    JobStatus,
} from "@prisma/client";

import {
    DashboardStats,
    JobSortField,
    ViewMode,
} from "@/types/job";

import { StatsBar } from "./stats-bar";
import { NoticeBoard } from "./notice-board";
import { SearchFilterBar } from "./search-filter-bar";

import { DashboardGrid } from "./dashboard-grid";
import { DashboardList } from "./dashboard-list";

interface DashboardClientProps {
    jobs: JobApplication[];
    stats: DashboardStats;
}

export function DashboardClient({
    jobs,
    stats,
}: DashboardClientProps) {
    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState<JobStatus | "ALL">(
            "ALL"
        );

    const [sortField, setSortField] =
        useState<JobSortField>(
            "interviews"
        );

    const [ascending, setAscending] =
        useState(false);

    const [viewMode, setViewMode] =
        useState<ViewMode>("grid");

    const [, setSelectedJob] =
        useState<JobApplication | null>(
            null
        );

    const filteredJobs = useMemo(() => {
        let result = [...jobs];

        if (search.trim()) {
            const query =
                search.toLowerCase();

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
                (job) =>
                    job.status === status
            );
        }

        result.sort((a, b) => {
            let comparison = 0;

            switch (sortField) {
                case "interviews":
                    comparison =
                        a.interviewCount -
                        b.interviewCount;
                    break;

                case "dateApplied":
                    comparison =
                        new Date(
                            a.createdAt
                        ).getTime() -
                        new Date(
                            b.createdAt
                        ).getTime();
                    break;

                case "nextInterview":
                    comparison =
                        new Date(
                            a.nextInterviewDate ??
                                0
                        ).getTime() -
                        new Date(
                            b.nextInterviewDate ??
                                0
                        ).getTime();
                    break;

                case "company":
                    comparison =
                        a.companyName.localeCompare(
                            b.companyName
                        );
                    break;
            }

            return ascending
                ? comparison
                : -comparison;
        });

        return result;
    }, [
        jobs,
        search,
        status,
        sortField,
        ascending,
    ]);

    return (
        <div className="space-y-6">
            <NoticeBoard jobs={jobs} />

            <StatsBar stats={stats} />

            <SearchFilterBar
                search={search}
                setSearch={setSearch}
                status={status}
                setStatus={setStatus}
                sortField={sortField}
                setSortField={setSortField}
                ascending={ascending}
                setAscending={
                    setAscending
                }
            />

            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    {filteredJobs.length} results
                </p>

                <div className="flex gap-2">
                    <button
                        onClick={() =>
                            setViewMode(
                                "grid"
                            )
                        }
                        className={`rounded-lg border p-2 ${
                            viewMode ===
                            "grid"
                                ? "bg-black text-white"
                                : ""
                        }`}
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </button>

                    <button
                        onClick={() =>
                            setViewMode(
                                "list"
                            )
                        }
                        className={`rounded-lg border p-2 ${
                            viewMode ===
                            "list"
                                ? "bg-black text-white"
                                : ""
                        }`}
                    >
                        <List className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {filteredJobs.length === 0 ? (
                <div className="rounded-2xl border bg-white p-12 text-center">
                    <h3 className="text-xl font-semibold">
                        No applications found
                    </h3>

                    <p className="mt-2 text-gray-500">
                        Try adjusting your
                        search or filters.
                    </p>
                </div>
            ) : viewMode === "grid" ? (
                <DashboardGrid
                    jobs={filteredJobs}
                    onSelectJob={
                        setSelectedJob
                    }
                />
            ) : (
                <DashboardList
                    jobs={filteredJobs}
                    onSelectJob={
                        setSelectedJob
                    }
                />
            )}
        </div>
    );
}