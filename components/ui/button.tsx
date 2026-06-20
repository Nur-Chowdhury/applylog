import { cn } from "@/lib/utils";

interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
}

export function Button({
    className,
    loading,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            disabled={loading}
            className={cn(
                "rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50",
                className
            )}
            {...props}
        >
            {loading ? "Loading..." : children}
        </button>
    );
}