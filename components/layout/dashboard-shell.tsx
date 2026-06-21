// components/layout/dashboard-shell.tsx
"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { UserNav } from "./user-nav";

interface DashboardShellProps {
    children: ReactNode;
}

export function DashboardShell({
    children,
}: DashboardShellProps) {
    const pathname = usePathname();

    const getPageTitle = () => {
        if (pathname === "/dashboard") return "Dashboard";
        if (pathname === "/history") return "History Archive";
        return "Workspace";
    };

    return (
        <div className="min-h-screen flex bg-slate-50">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
                    <div className="flex items-center justify-between px-6 py-4.5">
                        <div className="flex items-center gap-3">
                            <MobileNav />
                            <h1 className="font-heading font-extrabold text-xl text-slate-950 tracking-tight">
                                {getPageTitle()}
                            </h1>
                        </div>

                        <UserNav />
                    </div>
                </header>

                <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}