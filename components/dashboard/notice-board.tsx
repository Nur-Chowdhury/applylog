// components/dashboard/notice-board.tsx

import { differenceInCalendarDays } from "date-fns";

import { JobApplication } from "@prisma/client";

interface NoticeBoardProps {
    jobs: JobApplication[];
}

function getLabel(days: number) {
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";

    return `In ${days} days`;
}

function getColor(days: number) {
    if (days <= 1) {
        return "border-red-200 bg-red-50";
    }

    if (days <= 3) {
        return "border-amber-200 bg-amber-50";
    }

    return "border-blue-200 bg-blue-50";
}

export function NoticeBoard({
    jobs,
}: NoticeBoardProps) {
    const now = new Date();

    const upcomingJobs = jobs
        .filter(
            (job) =>
                job.nextInterviewDate &&
                job.nextInterviewDate >= now
        )
        .sort(
            (a, b) =>
                new Date(
                    a.nextInterviewDate!
                ).getTime() -
                new Date(
                    b.nextInterviewDate!
                ).getTime()
        );

    if (upcomingJobs.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3">
            <h2 className="text-xl font-bold">
                Upcoming Interviews
            </h2>

            {upcomingJobs.map((job) => {
                const days =
                    differenceInCalendarDays(
                        new Date(
                            job.nextInterviewDate!
                        ),
                        now
                    );

                return (
                    <div
                        key={job.id}
                        className={`rounded-xl border p-4 ${getColor(days)}`}
                    >
                        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="font-semibold">
                                    {job.companyName}
                                </p>

                                <p className="text-sm text-gray-600">
                                    {job.jobPosition}
                                </p>
                            </div>

                            <span className="font-medium">
                                {getLabel(days)}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}