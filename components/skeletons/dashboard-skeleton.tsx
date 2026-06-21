// components/skeletons/dashboard-skeleton.tsx
export function DashboardSkeleton() {
    return (
        <div className="space-y-6.5 animate-pulse">
            <div className="h-28 bg-slate-200 rounded-3xl w-full" />
            <div className="flex justify-between items-center h-14 bg-white border border-slate-200/50 rounded-2xl px-5 w-full">
                <div className="h-4 bg-slate-200 rounded-md w-40" />
                <div className="h-10 bg-slate-200 rounded-xl w-32" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-white border border-slate-200 rounded-2xl" />
                ))}
            </div>
            <div className="h-20 bg-white border border-slate-200 rounded-3xl w-full" />
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-48 bg-white border border-slate-200 rounded-2xl" />
                ))}
            </div>
        </div>
    );
}