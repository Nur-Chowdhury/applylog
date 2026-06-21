// components/skeletons/analytics-skeleton.tsx
export function AnalyticsSkeleton() {
    return (
        <div className="space-y-6.5 animate-pulse">
            <div className="h-20 bg-white border border-slate-200 rounded-3xl w-full" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-28 bg-white border border-slate-200 rounded-2xl" />
                ))}
            </div>
            <div className="grid gap-6 md:grid-cols-12">
                <div className="h-96 bg-white border border-slate-200 rounded-3xl md:col-span-8" />
                <div className="h-96 bg-white border border-slate-200 rounded-3xl md:col-span-4" />
                <div className="h-96 bg-white border border-slate-200 rounded-3xl md:col-span-12" />
            </div>
        </div>
    );
}