// components/dashboard/stats-bar.tsx

import { DashboardStats } from "@/types/job";

interface StatsBarProps {
    stats: DashboardStats;
}

export function StatsBar({
    stats,
}: StatsBarProps) {
    const cards = [
        {
            label: "Active Jobs",
            value: stats.activeJobs,
        },
        {
            label: "Processing",
            value: stats.processingJobs,
        },
        {
            label: "Offers",
            value: stats.offeredJobs,
        },
        {
            label: "Interviews",
            value: stats.interviewsCompleted,
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="rounded-2xl border bg-white p-5 shadow-sm"
                >
                    <p className="text-sm text-gray-500">
                        {card.label}
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                        {card.value}
                    </p>
                </div>
            ))}
        </div>
    );
}