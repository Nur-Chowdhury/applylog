import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatSalary(
    salary?: string | null
) {
    if (!salary) {
        return "Not specified";
    }

    return salary;
}

export function truncate(
    text: string,
    maxLength: number
) {
    if (text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, maxLength)}...`;
}