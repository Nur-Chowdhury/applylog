// components/layout/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "History",
        href: "/history",
        icon: History,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex md:w-72 md:flex-col border-r border-slate-200/80 bg-white min-h-screen">
            <div className="border-b border-slate-100 p-6.5">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-md shadow-slate-950/10">
                        <Briefcase className="h-5.5 w-5.5" />
                    </div>
                    <div>
                        <h1 className="font-heading font-extrabold text-lg text-slate-950 tracking-tight leading-none">
                            ApplyLog
                        </h1>
                        <p className="text-xs font-semibold text-slate-400 mt-1">
                            Job Application Tracker
                        </p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-5 space-y-2.5">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 group",
                                active
                                    ? "bg-slate-950 text-white shadow-md shadow-slate-950/10"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <Icon className={cn(
                                "h-5 w-5 transition-transform duration-200 group-hover:scale-105",
                                active ? "text-white" : "text-slate-400 group-hover:text-slate-700"
                            )} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6.5 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400 font-medium">Keep moving forward</p>
            </div>
        </aside>
    );
}