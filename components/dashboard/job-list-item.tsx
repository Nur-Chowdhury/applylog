// components/dashboard/job-list-item.tsx

import { format } from "date-fns";

import { JobApplication } from "@prisma/client";

interface JobListItemProps {
    job: JobApplication;
    onClick: () => void;
}

export function JobListItem({
    job,
    onClick,
}: JobListItemProps) {
    return (
        <button
            onClick={onClick}
            className="flex w-full items-center justify-between rounded-2xl border bg-white p-4 text-left transition hover:shadow-md"
        >
            <div>
                <h3 className="font-semibold">
                    {job.jobPosition}
                </h3>

                <p className="text-sm text-gray-500">
                    {job.companyName}
                </p>
            </div>

            <div className="text-right">
                <p>
                    {job.interviewCount}
                    {" "}interviews
                </p>

                <p className="text-sm text-gray-500">
                    {format(
                        job.createdAt,
                        "MMM d, yyyy"
                    )}
                </p>
            </div>
        </button>
    );
}