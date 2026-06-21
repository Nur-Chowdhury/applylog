// components/dashboard/job-list-item.tsx
import { format } from "date-fns";
import { SerializedJob } from "@/types/job";
import { getCompanyGradient, getStatusStyles, getInterviewCountdown } from "@/lib/utils";
import { Calendar, Sparkles, Building, ChevronRight } from "lucide-react";

interface JobListItemProps {
    job: SerializedJob;
    onClick?: () => void;
}

export function JobListItem({
    job,
    onClick,
}: JobListItemProps) {
    const avatarGradient = getCompanyGradient(job.companyName);
    const statusTheme = getStatusStyles(job.status);
    const countdown = getInterviewCountdown(job.nextInterviewDate);

    return (
        <div
            onClick={onClick}
            className="group flex flex-col md:flex-row md:items-center justify-between cursor-pointer rounded-2xl border border-slate-200/70 bg-white p-4.5 gap-4.5 shadow-sm hover:shadow-md transition-all duration-200"
        >
            <div className="flex items-center gap-3.5">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${avatarGradient} text-white font-heading font-extrabold text-sm shadow-sm`}>
                    {job.companyName.charAt(0).toUpperCase()}
                </div>

                <div>
                    <h3 className="font-heading font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug text-base">
                        {job.jobPosition}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building className="h-3 w-3 shrink-0" />
                        {job.companyName}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3.5 md:ml-auto">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusTheme.bg} capitalize`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${statusTheme.dot}`} />
                    {job.status.toLowerCase()}
                </span>

                {job.jobType && (
                    <span className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                        {job.jobType.replace("_", " ")}
                    </span>
                )}

                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-blue-50/20 border border-blue-50/80 px-2.5 py-1 rounded-lg">
                    <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                    <span>Completed: {job.interviewCount}</span>
                </span>

                {countdown ? (
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg uppercase ${
                        countdown.days <= 1 ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                    }`}>
                        Interview {countdown.text}
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(job.createdAt), "MMM d, yyyy")}
                    </span>
                )}
                
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-500 transition-colors hidden md:block" />
            </div>
        </div>
    );
}