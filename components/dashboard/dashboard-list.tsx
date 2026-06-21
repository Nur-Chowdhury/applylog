// components/dashboard/dashboard-list.tsx
import { SerializedJob } from "@/types/job";
import { JobListItem } from "./job-list-item";

interface DashboardListProps {
    jobs: SerializedJob[];
    onSelectJob: (job: SerializedJob) => void;
}

export function DashboardList({
    jobs,
    onSelectJob,
}: DashboardListProps) {
    return (
        <div className="flex flex-col gap-3.5">
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