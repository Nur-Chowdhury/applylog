// components/layout/sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    LayoutDashboard,
    History,
    Briefcase,
} from "lucide-react";

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
        <aside className="hidden md:flex md:w-72 md:flex-col border-r bg-white">
            <div className="border-b p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                        <Briefcase className="h-5 w-5" />
                    </div>

                    <div>
                        <h1 className="font-bold text-xl">
                            ApplyLog
                        </h1>

                        <p className="text-sm text-gray-500">
                            Job Tracker
                        </p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4">
                <div className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        const active =
                            pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
                                    active
                                        ? "bg-black text-white"
                                        : "hover:bg-gray-100"
                                )}
                            >
                                <Icon className="h-5 w-5" />

                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </aside>
    );
}