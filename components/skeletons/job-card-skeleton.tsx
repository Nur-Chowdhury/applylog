// components/skeletons/job-card-skeleton.tsx
export function JobCardSkeleton() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5.5 shadow-sm space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="h-11 w-11 bg-slate-200 rounded-xl" />
                <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                    <div className="h-3 bg-slate-200 rounded-md w-1/2" />
                </div>
            </div>
            <div className="flex gap-2">
                <div className="h-6 bg-slate-200 rounded-lg w-16" />
                <div className="h-6 bg-slate-200 rounded-lg w-24" />
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded-md w-full" />
                <div className="h-3 bg-slate-200 rounded-md w-5/6" />
            </div>
            <div className="h-px bg-slate-100 w-full pt-2" />
            <div className="flex justify-between items-center">
                <div className="h-3 bg-slate-200 rounded-md w-24" />
                <div className="h-3 bg-slate-200 rounded-md w-16" />
            </div>
        </div>
    );
}