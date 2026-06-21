// components/modals/job-details-modal.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { SerializedJob } from "@/types/job";
import { JobView } from "@/components/jobs/job-view";
import { JobEditForm } from "@/components/jobs/job-edit-form";
import { DeleteJobDialog } from "@/components/jobs/delete-job-dialog";
import { X } from "lucide-react";
import toast from "react-hot-toast";

interface JobDetailsModalProps {
    job: SerializedJob;
    open: boolean;
    onClose: () => void;
    onUpdated?: () => void;
}

export function JobDetailsModal({
    job,
    open,
    onClose,
    onUpdated,
}: JobDetailsModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [editing, setEditing] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        function handleEscape(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        if (open) {
            window.addEventListener("keydown", handleEscape);
        }
        return () => window.removeEventListener("keydown", handleEscape);
    }, [open, onClose]);

    if (!open) return null;

    async function handleDeleteConfirm() {
        try {
            setLoading(true);
            const response = await fetch(`/api/jobs/${job.id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error();

            toast.success("Application permanently removed");
            onClose();
            if (onUpdated) onUpdated();
            else window.location.reload();
        } catch {
            toast.error("Failed to delete application record");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto"
        >
            <div
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
            >
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 shrink-0 bg-slate-50/50 rounded-t-3xl">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {editing ? "Form Editor Mode" : "Detailed Overview"}
                    </span>
                    <button
                        onClick={onClose}
                        className="rounded-xl p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-800 transition-all cursor-pointer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    {confirmDelete ? (
                        <div className="py-4.5">
                            <DeleteJobDialog
                                onConfirm={handleDeleteConfirm}
                                onCancel={() => setConfirmDelete(false)}
                                loading={loading}
                            />
                        </div>
                    ) : editing ? (
                        <JobEditForm
                            job={job}
                            onCancel={() => setEditing(false)}
                            onSuccess={() => {
                                setEditing(false);
                                onClose();
                                if (onUpdated) onUpdated();
                                else window.location.reload();
                            }}
                        />
                    ) : (
                        <JobView
                            job={job}
                            onEdit={() => setEditing(true)}
                            onDeleteTrigger={() => setConfirmDelete(true)}
                            onClose={onClose}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}