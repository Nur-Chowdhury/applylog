// components/dashboard/job-card.tsx
import { format } from "date-fns";
import { SerializedJob } from "@/types/job";
import { getCompanyGradient, getStatusStyles, getInterviewCountdown } from "@/lib/utils";
import { Calendar, Building, DollarSign, MapPin, Sparkles, AlertCircle } from "lucide-react";

interface JobCardProps {
    job: SerializedJob;
    onClick?: () => void;
}

export function JobCard({
    job,
    onClick,
}: JobCardProps) {
    const avatarGradient = getCompanyGradient(job.companyName);
    const statusTheme = getStatusStyles(job.status);
    const countdown = getInterviewCountdown(job.nextInterviewDate);

    return (
        <div
            onClick={onClick}
            className="group relative flex flex-col justify-between overflow-hidden cursor-pointer rounded-2xl border border-slate-200/75 bg-white shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 animate-in fade-in-50"
        >
            <div className="p-5.5">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${avatarGradient} text-white font-heading font-extrabold text-base shadow-sm`}>
                            {job.companyName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-heading font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-1">
                                {job.jobPosition}
                            </h3>
                            <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center gap-1">
                                <Building className="h-3 w-3 shrink-0" />
                                {job.companyName}
                            </p>
                        </div>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusTheme.bg} capitalize`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusTheme.dot}`} />
                        {job.status.toLowerCase()}
                    </span>
                </div>

                <div className="mt-4.5 flex flex-wrap gap-1.5">
                    {job.jobType && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-slate-50 text-[11px] font-semibold text-slate-600 border border-slate-100">
                            {job.jobType.replace("_", " ")}
                        </span>
                    )}
                    {job.location && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-50 text-[11px] font-semibold text-slate-600 border border-slate-100">
                            <MapPin className="h-2.5 w-2.5 shrink-0" />
                            {job.location}
                        </span>
                    )}
                    {job.salary && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50/50 text-[11px] font-semibold text-emerald-700 border border-emerald-100">
                            <DollarSign className="h-2.5 w-2.5 shrink-0" />
                            {job.salary}
                        </span>
                    )}
                </div>

                {job.description && (
                    <p className="mt-4 text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                        {job.description}
                    </p>
                )}

                <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                        <span>Completed: {job.interviewCount}</span>
                    </span>

                    {!countdown && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(new Date(job.createdAt), "MMM d, yyyy")}
                        </span>
                    )}
                </div>
            </div>

            {countdown && (
                <div className={`w-full px-5.5 py-2.5 text-xs font-bold flex items-center gap-2 justify-between mt-auto border-t ${
                    countdown.days <= 1 
                        ? "bg-rose-50 text-rose-700 border-rose-100" 
                        : "bg-amber-50 text-amber-700 border-amber-100"
                }`}>
                    <div className="flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>Upcoming Interview:</span>
                    </div>
                    <span className="uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md bg-white/70">
                        {countdown.text}
                    </span>
                </div>
            )}
        </div>
    );
}