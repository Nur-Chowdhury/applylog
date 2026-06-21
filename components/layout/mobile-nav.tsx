// components/layout/mobile-nav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Briefcase, LayoutDashboard, History } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const menuItems = [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "History", href: "/history", icon: History },
    ];

    return (
        <div className="md:hidden">
            <button
                onClick={() => setOpen(true)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-all cursor-pointer"
            >
                <Menu className="h-6 w-6" />
            </button>

            {open && (
                <>
                    <div
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity"
                    />

                    <div className="fixed left-0 top-0 z-50 h-full w-76 bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-250">
                        <div className="flex items-center justify-between border-b border-slate-100 p-5">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-xs">
                                    <Briefcase className="h-4.5 w-4.5" />
                                </div>
                                <span className="font-heading font-extrabold text-base text-slate-950 tracking-tight">
                                    ApplyLog
                                </span>
                            </div>

                            <button
                                onClick={() => setOpen(false)}
                                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-all cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <nav className="p-5 flex-1 space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const active = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all",
                                            active
                                                ? "bg-slate-950 text-white"
                                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                        
                        <div className="p-5 border-t border-slate-100 text-center text-xs font-semibold text-slate-400">
                            ApplyLog Mobile Gateway
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}