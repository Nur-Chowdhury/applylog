// components/dashboard/dashboard-grid.tsx
import { SerializedJob } from "@/types/job";
import { JobCard } from "./job-card";

interface DashboardGridProps {
    jobs: SerializedJob[];
    onSelectJob: (job: SerializedJob) => void;
}

export function DashboardGrid({
    jobs,
    onSelectJob,
}: DashboardGridProps) {
    return (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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