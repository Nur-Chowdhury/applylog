// components/dashboard/notice-board.tsx
import { differenceInCalendarDays } from "date-fns";
import { SerializedJob } from "@/types/job";
import { Calendar, Bell } from "lucide-react";

interface NoticeBoardProps {
    jobs: SerializedJob[];
}

function getLabel(days: number) {
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `In ${days} days`;
}

function getColor(days: number) {
    if (days <= 1) {
        return "border-rose-100 bg-rose-50 text-rose-900";
    }
    if (days <= 3) {
        return "border-amber-100 bg-amber-50 text-amber-900";
    }
    return "border-blue-100 bg-blue-50 text-blue-900";
}

export function NoticeBoard({
    jobs,
}: NoticeBoardProps) {
    const now = new Date();

    const upcomingJobs = jobs
        .filter((job) => {
            if (!job.nextInterviewDate) return false;
            const interviewDate = new Date(job.nextInterviewDate);
            return interviewDate >= now;
        })
        .sort(
            (a, b) =>
                new Date(a.nextInterviewDate!).getTime() -
                new Date(b.nextInterviewDate!).getTime()
        );

    if (upcomingJobs.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3.5 bg-white border border-slate-200/70 p-5 md:p-6 rounded-3xl shadow-xs animate-in fade-in-50 duration-200">
            <div className="flex items-center gap-2.5">
                <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                    <Bell className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-lg font-heading font-extrabold text-slate-900 tracking-tight">
                    Upcoming Interview Reminders
                </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingJobs.map((job) => {
                    const days = differenceInCalendarDays(
                        new Date(job.nextInterviewDate!),
                        now
                    );

                    const colors = getColor(days);

                    return (
                        <div
                            key={job.id}
                            className={`rounded-2xl border p-4.5 flex flex-col justify-between gap-3 ${colors} shadow-2xs transition-all hover:scale-[1.01]`}
                        >
                            <div>
                                <p className="font-heading font-extrabold tracking-tight text-base leading-snug">
                                    {job.companyName}
                                </p>
                                <p className="text-xs opacity-75 font-semibold mt-0.5">
                                    {job.jobPosition}
                                </p>
                            </div>

                            <div className="flex items-center justify-between mt-1 pt-2.5 border-t border-current/10">
                                <div className="flex items-center gap-1.5 text-xs font-semibold">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>
                                        {new Date(job.nextInterviewDate!).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                                <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded-md bg-white/50">
                                    {getLabel(days)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}