// app/api/jobs/route.ts

import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createJobSchema } from "@/lib/validations/job";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const jobs = await prisma.jobApplication.findMany({
            where: {userId: session.user.id,},
            orderBy: [{interviewCount: "desc",},{createdAt: "desc",},],
        });

        return NextResponse.json(jobs);
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch jobs" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();

        const parsed = createJobSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {error: parsed.error.flatten(),},
                {status: 400,}
            );
        }

        const data = parsed.data;

        const job = await prisma.jobApplication.create({
            data: {
                companyName: data.companyName.trim(),
                jobPosition: data.jobPosition.trim(),

                status:
                    data.status ??
                    "PROCESSING",

                jobType: data.jobType,

                description: data.description?.trim() || null,

                location: data.location?.trim() || null,

                salary: data.salary?.trim() || null,

                jobPostingUrl: data.jobPostingUrl?.trim() || null,

                personalNotes: data.personalNotes?.trim() || null,

                referrerName: data.referrerName?.trim() || null,

                referrerProfileLink: data.referrerProfileLink?.trim() || null,

                interviewCount: data.interviewCount ?? 0,

                nextInterviewDate:
                    data.nextInterviewDate
                        ? new Date(data.nextInterviewDate)
                        : null,

                fileName: data.fileName,
                fileUrl: data.fileUrl,
                fileType: data.fileType,
                fileSize: data.fileSize,

                userId: session.user.id,
            },
        });

        return NextResponse.json(job, {
            status: 201,
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Failed to create job" },
            { status: 500 }
        );
    }
}