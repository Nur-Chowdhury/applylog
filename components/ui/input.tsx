// components/ui/input.tsx
import { cn } from "@/lib/utils";

export function Input({
    className,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={cn(
                "w-full rounded-xl border border-slate-200 bg-white px-4.5 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none hover:border-slate-300 focus:border-slate-950 transition-all shadow-2xs focus:ring-1 focus:ring-slate-950",
                className
            )}
            {...props}
        />
    );
}

// is that everything? lots of functionalities haven't been added yet. read all of my requirements and generate everything that haven't been generated or created yet