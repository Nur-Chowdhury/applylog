// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { SerializedJob } from "@/types/job";

export const dynamic = "force-dynamic";

interface SearchParams {
    page?: string;
    limit?: string;
}

export default async function DashboardPage(props: {
    searchParams: Promise<SearchParams>;
}) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const resolvedParams = await props.searchParams;
    const page = Math.max(1, parseInt(resolvedParams.page || "1"));
    const limit = Math.max(5, Math.min(50, parseInt(resolvedParams.limit || "12")));
    const skip = (page - 1) * limit;

    // Fetch paginated jobs
    const [jobs, totalJobsCount] = await Promise.all([
        prisma.jobApplication.findMany({
            where: {
                userId: session.user.id,
                status: {
                    in: ["PROCESSING", "OFFERED", "ACCEPTED"],
                },
            },
            skip,
            take: limit,
            orderBy: [
                { interviewCount: "desc" },
                { createdAt: "desc" },
            ],
        }),
        prisma.jobApplication.count({
            where: {
                userId: session.user.id,
                status: {
                    in: ["PROCESSING", "OFFERED", "ACCEPTED"],
                },
            },
        }),
    ]);

    const serializedJobs: SerializedJob[] = jobs.map((job) => ({
        id: job.id,
        companyName: job.companyName,
        jobPosition: job.jobPosition,
        status: job.status,
        jobType: job.jobType,
        description: job.description,
        location: job.location,
        salary: job.salary,
        jobPostingUrl: job.jobPostingUrl,
        personalNotes: job.personalNotes,
        referrerName: job.referrerName,
        referrerProfileLink: job.referrerProfileLink,
        fileName: job.fileName,
        fileUrl: job.fileUrl,
        fileType: job.fileType,
        fileSize: job.fileSize,
        interviewCount: job.interviewCount,
        nextInterviewDate: job.nextInterviewDate ? job.nextInterviewDate.toISOString() : null,
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt.toISOString(),
        userId: job.userId,
    }));

    const stats = {
        activeJobs: totalJobsCount,
        processingJobs: await prisma.jobApplication.count({
            where: { userId: session.user.id, status: "PROCESSING" },
        }),
        offeredJobs: await prisma.jobApplication.count({
            where: { userId: session.user.id, status: "OFFERED" },
        }),
        interviewsCompleted: serializedJobs.reduce(
            (total, job) => total + job.interviewCount,
            0
        ),
    };

    return (
        <DashboardClient
            jobs={serializedJobs}
            stats={stats}
            currentPage={page}
            pageSize={limit}
            totalItems={totalJobsCount}
        />
    );
}