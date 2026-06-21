// components/dashboard/dashboard-grid.tsx

import { JobApplication } from "@prisma/client";

import { JobCard } from "./job-card";

interface DashboardGridProps {
    jobs: JobApplication[];
    onSelectJob: (job: JobApplication) => void;
}

export function DashboardGrid({
    jobs,
    onSelectJob,
}: DashboardGridProps) {
    return (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
                <JobCard
                    key={job.id}
                    job={job}
                    onClick={() => onSelectJob(job)}
                />
            ))}
        </div>
    );
}