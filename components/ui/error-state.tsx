// components/ui/error-state.tsx
import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export function ErrorState({
    title = "Retrieval Error",
    message = "An unexpected error occurred while loading content. Check connections and try again.",
    onRetry,
}: ErrorStateProps) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 mb-5">
                <AlertCircle className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-heading font-extrabold text-slate-900">{title}</h3>
            <p className="mt-2.5 text-sm text-slate-500 font-semibold leading-relaxed">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4.5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-all cursor-pointer mt-6"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Retry Loading
                </button>
            )}
        </div>
    );
}