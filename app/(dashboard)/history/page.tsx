// app/(dashboard)/history/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { HistoryClient } from "@/components/history/history-client";
import { SerializedJob } from "@/types/job";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const jobs = await prisma.jobApplication.findMany({
        where: {
            userId: session.user.id,
            status: {
                in: [
                    "REJECTED",
                    "WITHDRAWN",
                ],
            },
        },
        orderBy: {
            updatedAt: "desc",
        },
    });

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
        total: serializedJobs.length,
        rejectedCount: serializedJobs.filter((j) => j.status === "REJECTED").length,
        withdrawnCount: serializedJobs.filter((j) => j.status === "WITHDRAWN").length,
        averageInterviews: serializedJobs.length > 0 
            ? parseFloat((serializedJobs.reduce((acc, curr) => acc + curr.interviewCount, 0) / serializedJobs.length).toFixed(1))
            : 0,
    };

    return (
        <HistoryClient 
            initialJobs={serializedJobs} 
            stats={stats} 
        />
    );
}