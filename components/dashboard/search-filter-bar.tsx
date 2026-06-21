// components/dashboard/search-filter-bar.tsx
"use client";

import { Search, ArrowUpDown } from "lucide-react";
import { JobStatus } from "@prisma/client";
import { JobSortField } from "@/types/job";

interface SearchFilterBarProps {
    search: string;
    setSearch: (value: string) => void;
    status: JobStatus | "ALL";
    setStatus: (value: JobStatus | "ALL") => void;
    sortField: JobSortField;
    setSortField: (value: JobSortField) => void;
    ascending: boolean;
    setAscending: (value: boolean) => void;
}

export function SearchFilterBar({
    search,
    setSearch,
    status,
    setStatus,
    sortField,
    setSortField,
    ascending,
    setAscending,
}: SearchFilterBarProps) {
    return (
        <div className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm">
            <div className="grid gap-3.5 md:grid-cols-12 items-center">
                <div className="relative md:col-span-5">
                    <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by company, position, note..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium outline-none hover:border-slate-300 focus:border-slate-900 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
                    />
                </div>

                <div className="relative md:col-span-3">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as JobStatus | "ALL")}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-semibold outline-none hover:border-slate-300 focus:border-slate-900 focus:bg-white transition-all text-slate-700 cursor-pointer"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="OFFERED">Offered</option>
                        <option value="ACCEPTED">Accepted</option>
                    </select>
                </div>

                <div className="relative md:col-span-3">
                    <select
                        value={sortField}
                        onChange={(e) => setSortField(e.target.value as JobSortField)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-semibold outline-none hover:border-slate-300 focus:border-slate-900 focus:bg-white transition-all text-slate-700 cursor-pointer"
                    >
                        <option value="interviews">Sort by Interviews Done</option>
                        <option value="dateApplied">Sort by Date Applied</option>
                        <option value="nextInterview">Sort by Next Interview Date</option>
                        <option value="company">Sort by Company Name</option>
                    </select>
                </div>

                <div className="md:col-span-1">
                    <button
                        type="button"
                        onClick={() => setAscending(!ascending)}
                        className="flex h-11.5 w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
                        title={ascending ? "Sorting Ascending" : "Sorting Descending"}
                    >
                        <ArrowUpDown className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}