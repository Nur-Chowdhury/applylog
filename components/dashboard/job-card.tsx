// components/dashboard/job-card.tsx

import { format } from "date-fns";

import { JobApplication } from "@prisma/client";

interface JobCardProps {
    job: JobApplication;
    onClick: () => void;
}

export function JobCard({
    job,
    onClick,
}: JobCardProps) {
    return (
        <button
            onClick={onClick}
            className="w-full rounded-2xl border bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
        >
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-purple-600 text-lg font-bold text-white">
                    {job.companyName
                        .charAt(0)
                        .toUpperCase()}
                </div>

                <div>
                    <h3 className="font-bold">
                        {job.jobPosition}
                    </h3>

                    <p className="text-sm text-gray-500">
                        {job.companyName}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {job.jobType && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                        {job.jobType}
                    </span>
                )}

                {job.location && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                        {job.location}
                    </span>
                )}
            </div>

            <p className="mt-4 line-clamp-3 text-sm text-gray-600">
                {job.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
                <span className="text-sm">
                    Interviews:{" "}
                    {job.interviewCount}
                </span>

                <span className="text-xs text-gray-500">
                    {format(
                        job.createdAt,
                        "MMM d, yyyy"
                    )}
                </span>
            </div>
        </button>
    );
}