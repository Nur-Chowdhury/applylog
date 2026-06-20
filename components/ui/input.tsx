import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({
    className,
    ...props
}: InputProps) {
    return (
        <input
            className={cn(
                "w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
                className
            )}
            {...props}
        />
    );
}