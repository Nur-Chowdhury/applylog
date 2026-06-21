// components/dashboard/dashboard-list.tsx

import { JobApplication } from "@prisma/client";

import { JobListItem } from "./job-list-item";

interface DashboardListProps {
    jobs: JobApplication[];
    onSelectJob: (job: JobApplication) => void;
}

export function DashboardList({
    jobs,
    onSelectJob,
}: DashboardListProps) {
    return (
        <div className="space-y-3">
            {jobs.map((job) => (
                <JobListItem
                    key={job.id}
                    job={job}
                    onClick={() => onSelectJob(job)}
                />
            ))}
        </div>
    );
}