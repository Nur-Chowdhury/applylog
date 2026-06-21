// app/(dashboard)/layout.tsx

import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { DashboardShell } from "@/components/layout/dashboard-shell";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default async function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <DashboardShell>
            {children}
        </DashboardShell>
    );
}