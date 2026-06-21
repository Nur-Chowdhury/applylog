// components/dashboard/stats-bar.tsx
import { DashboardStats } from "@/types/job";
import { Briefcase, Clock, Trophy, Sparkles } from "lucide-react";

interface StatsBarProps {
    stats: DashboardStats;
}

export function StatsBar({
    stats,
}: StatsBarProps) {
    const cards = [
        {
            label: "Active Tracked",
            value: stats.activeJobs,
            icon: Briefcase,
            color: "text-slate-900 bg-slate-50 border-slate-150",
        },
        {
            label: "In Processing",
            value: stats.processingJobs,
            icon: Clock,
            color: "text-amber-600 bg-amber-50/50 border-amber-100",
        },
        {
            label: "Offers Made",
            value: stats.offeredJobs,
            icon: Trophy,
            color: "text-emerald-600 bg-emerald-50/50 border-emerald-100",
        },
        {
            label: "Interviews Completed",
            value: stats.interviewsCompleted,
            icon: Sparkles,
            color: "text-blue-600 bg-blue-50/50 border-blue-100",
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <div
                        key={card.label}
                        className="rounded-2xl border border-slate-200/80 bg-white p-5.5 shadow-sm flex items-center justify-between transition-transform duration-200 hover:-translate-y-0.5"
                    >
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                {card.label}
                            </p>
                            <p className="mt-2 text-3xl font-extrabold text-slate-900 leading-none">
                                {card.value}
                            </p>
                        </div>
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${card.color}`}>
                            <Icon className="h-5 w-5" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}