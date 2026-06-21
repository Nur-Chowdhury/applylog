// components/jobs/delete-job-dialog.tsx
"use client";

import { Trash2 } from "lucide-react";

interface DeleteJobDialogProps {
    onConfirm: () => void;
    onCancel: () => void;
    loading: boolean;
}

export function DeleteJobDialog({
    onConfirm,
    onCancel,
    loading,
}: DeleteJobDialogProps) {
    return (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in-50 duration-200">
            <div className="text-xs text-rose-800 font-medium">
                <p className="font-bold flex items-center gap-1.5"><Trash2 className="h-4 w-4 shrink-0" /> Confirm Purging Application?</p>
                <p className="opacity-90 mt-1">This operation is permanent. It will instantly remove all application states and attached records.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <button
                    onClick={onCancel}
                    disabled={loading}
                    className="rounded-xl border border-rose-200 bg-white hover:bg-rose-50/20 px-3.5 py-2 text-xs font-bold text-rose-700 cursor-pointer disabled:opacity-50 transition-all"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className="rounded-xl bg-rose-600 hover:bg-rose-700 px-3.5 py-2 text-xs font-bold text-white cursor-pointer disabled:opacity-50 transition-all shadow-xs"
                >
                    {loading ? "Deleting..." : "Purge Record"}
                </button>
            </div>
        </div>
    );
}