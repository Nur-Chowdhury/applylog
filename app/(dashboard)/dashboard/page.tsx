// app/dashboard/page.tsx

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const jobs =
        await prisma.jobApplication.findMany({
            where: {
                userId: session.user.id,

                status: {
                    in: [
                        "PROCESSING",
                        "OFFERED",
                        "ACCEPTED",
                    ],
                },
            },

            orderBy: [
                {
                    interviewCount: "desc",
                },
                {
                    createdAt: "desc",
                },
            ],
        });

    const stats = {
        activeJobs: jobs.length,

        processingJobs: jobs.filter(
            (job) =>
                job.status ===
                "PROCESSING"
        ).length,

        offeredJobs: jobs.filter(
            (job) =>
                job.status === "OFFERED"
        ).length,

        interviewsCompleted:
            jobs.reduce(
                (total, job) =>
                    total +
                    job.interviewCount,
                0
            ),
    };

    return (
        <DashboardClient
            jobs={jobs}
            stats={stats}
        />
    );
}