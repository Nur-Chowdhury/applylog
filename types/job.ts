// types/job.ts

import {
    JobApplication,
    JobStatus,
    JobType
} from "@prisma/client";

export interface JobFilters {
    search: string;
    status: JobStatus | "ALL";
}

export type JobSortField =
    | "interviews"
    | "dateApplied"
    | "nextInterview"
    | "company";

export type ViewMode =
    | "grid"
    | "list";

export interface DashboardStats {
    activeJobs: number;
    processingJobs: number;
    offeredJobs: number;
    interviewsCompleted: number;
}

export type JobWithUser = JobApplication & {
    user: {
        id: string;
        name: string;
        email: string;
    };
};

export interface CreateJobPayload {
    companyName: string;
    jobPosition: string;

    jobType?: JobType;

    description?: string;

    location?: string;

    salary?: string;

    jobPostingUrl?: string;

    personalNotes?: string;

    referrerName?: string;

    referrerProfileLink?: string;

    nextInterviewDate?: string;

    interviewCount?: number;

    fileUrl?: string;
    fileName?: string;
    fileType?: string;
    fileSize?: number;
}