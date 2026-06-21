// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInCalendarDays, isToday, isTomorrow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatSalary(salary?: string | null) {
    if (!salary) {
        return "Not specified";
    }
    return salary;
}

export function truncate(text: string, maxLength: number) {
    if (text.length <= maxLength) {
        return text;
    }
    return `${text.slice(0, maxLength)}...`;
}

export function getCompanyGradient(companyName: string) {
    const gradients = [
        "from-blue-600 to-indigo-700",
        "from-emerald-600 to-teal-700",
        "from-purple-600 to-pink-700",
        "from-rose-600 to-orange-700",
        "from-cyan-600 to-blue-700",
        "from-violet-600 to-fuchsia-700",
        "from-amber-600 to-red-700",
    ];
    let hash = 0;
    for (let i = 0; i < companyName.length; i++) {
        hash = companyName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
}

export function getStatusStyles(status: string) {
    switch (status) {
        case "PROCESSING":
            return {
                bg: "bg-amber-50 border-amber-200 text-amber-800",
                dot: "bg-amber-500",
            };
        case "OFFERED":
            return {
                bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
                dot: "bg-emerald-500",
            };
        case "ACCEPTED":
            return {
                bg: "bg-sky-50 border-sky-200 text-sky-800",
                dot: "bg-sky-500",
            };
        case "REJECTED":
            return {
                bg: "bg-rose-50 border-rose-200 text-rose-800",
                dot: "bg-rose-500",
            };
        case "WITHDRAWN":
            return {
                bg: "bg-slate-50 border-slate-200 text-slate-800",
                dot: "bg-slate-500",
            };
        default:
            return {
                bg: "bg-gray-50 border-gray-200 text-gray-800",
                dot: "bg-gray-500",
            };
    }
}

export function getInterviewCountdown(dateStr: string | null) {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const today = new Date();
    const diff = differenceInCalendarDays(date, today);

    if (diff < 0) {
        return null;
    }

    if (isToday(date)) return { text: "Today", days: 0 };
    if (isTomorrow(date)) return { text: "Tomorrow", days: 1 };
    return { text: `In ${diff} days`, days: diff };
}