// components/layout/dashboard-shell.tsx

import { ReactNode } from "react";

import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";

interface DashboardShellProps {
    children: ReactNode;
}

export function DashboardShell({
    children,
}: DashboardShellProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                <Sidebar />

                <div className="flex-1">
                    <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
                        <div className="flex items-center gap-4 px-4 py-4">
                            <MobileNav />

                            <h1 className="font-semibold text-lg">
                                Dashboard
                            </h1>
                        </div>
                    </header>

                    <main className="p-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}