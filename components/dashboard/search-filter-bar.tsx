// components/dashboard/search-filter-bar.tsx

"use client";

import { Search } from "lucide-react";

import { JobStatus } from "@prisma/client";

import { JobSortField } from "@/types/job";

interface SearchFilterBarProps {
    search: string;
    setSearch: (value: string) => void;

    status: JobStatus | "ALL";
    setStatus: (
        value: JobStatus | "ALL"
    ) => void;

    sortField: JobSortField;
    setSortField: (
        value: JobSortField
    ) => void;

    ascending: boolean;
    setAscending: (
        value: boolean
    ) => void;
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
        <div className="rounded-2xl border bg-white p-4">
            <div className="grid gap-3 lg:grid-cols-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Search jobs..."
                        className="w-full rounded-xl border px-10 py-2 outline-none"
                    />
                </div>

                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(
                            e.target.value as JobStatus | "ALL"
                        )
                    }
                    className="rounded-xl border px-3 py-2"
                >
                    <option value="ALL">
                        All Statuses
                    </option>

                    <option value="PROCESSING">
                        Processing
                    </option>

                    <option value="OFFERED">
                        Offered
                    </option>

                    <option value="ACCEPTED">
                        Accepted
                    </option>
                </select>

                <select
                    value={sortField}
                    onChange={(e) =>
                        setSortField(
                            e.target
                                .value as JobSortField
                        )
                    }
                    className="rounded-xl border px-3 py-2"
                >
                    <option value="interviews">
                        Interviews
                    </option>

                    <option value="dateApplied">
                        Date Applied
                    </option>

                    <option value="nextInterview">
                        Next Interview
                    </option>

                    <option value="company">
                        Company
                    </option>
                </select>

                <button
                    onClick={() =>
                        setAscending(
                            !ascending
                        )
                    }
                    className="rounded-xl border px-4 py-2 hover:bg-gray-50"
                >
                    {ascending
                        ? "Ascending"
                        : "Descending"}
                </button>
            </div>
        </div>
    );
}