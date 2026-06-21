// components/ui/empty-state.tsx
import { Sparkles } from "lucide-react";

interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({
    title,
    description,
    actionLabel,
    onAction,
}: EmptyStateProps) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 mb-5">
                <Sparkles className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-heading font-extrabold text-slate-900">{title}</h3>
            <p className="mt-2.5 text-sm text-slate-500 font-semibold leading-relaxed">{description}</p>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5.5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-all cursor-pointer mt-6"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}