// app/api/jobs/[jobId]/route.ts


import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import {
    updateJobSchema,
} from "@/lib/validations/job";

interface RouteContext {
    params: Promise<{
        jobId: string;
    }>;
}

export async function GET(
    req: Request,
    { params }: RouteContext
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { jobId } = await params;

        const job =
            await prisma.jobApplication.findFirst({
                where: {
                id: jobId,
                userId: session.user.id,
                },
            });

        if (!job) {
            return NextResponse.json(
                { error: "Job not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(job);
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch job" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: Request,
    { params }: RouteContext
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { jobId } = await params;

        const existing =
            await prisma.jobApplication.findFirst({
                where: {
                    id: jobId,
                    userId: session.user.id,
                },
            });

        if (!existing) {
            return NextResponse.json(
                { error: "Job not found" },
                { status: 404 }
            );
        }

        const body = await req.json();

        const parsed = updateJobSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {error: parsed.error.flatten(),},
                {status: 400,}
            );
        }

        const updated =
            await prisma.jobApplication.update({
                where: {id: jobId,},

                data: {
                    ...parsed.data,

                    nextInterviewDate:
                        parsed.data.nextInterviewDate
                        ? new Date(
                            parsed.data.nextInterviewDate
                            )
                        : undefined,
                },
            });

        return NextResponse.json(updated);
    } catch {
        return NextResponse.json(
            { error: "Failed to update job" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: RouteContext
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { jobId } = await params;

        const existing = await prisma.jobApplication.findFirst({
            where: {
                id: jobId,
                userId: session.user.id,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Job not found" },
                { status: 404 }
            );
        }

        await prisma.jobApplication.delete({ where: {id: jobId,}, });

        return NextResponse.json({
            success: true,
        });
    } catch {
        return NextResponse.json(
            { error: "Failed to delete job" },
            { status: 500 }
        );
    }
}