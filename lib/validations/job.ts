import { z } from "zod";

export const createJobSchema = z.object({
    companyName: z
        .string()
        .min(1, "Company name is required"),

    jobPosition: z
        .string()
        .min(1, "Job position is required"),

    status: z.enum([
        "PROCESSING",
        "OFFERED",
        "ACCEPTED",
        "REJECTED",
        "WITHDRAWN",
    ]).default("PROCESSING"),

    jobType: z.enum([
        "FULL_TIME",
        "PART_TIME",
        "CONTRACT",
        "INTERNSHIP",
        "REMOTE",
        "HYBRID",
    ]).optional(),

    description: z.string().optional(),

    location: z.string().optional(),

    salary: z.string().optional(),

    jobPostingUrl: z.string().url().optional().or(z.literal("")),

    personalNotes: z.string().optional(),

    referrerName: z.string().optional(),

    referrerProfileLink: z.string().url().optional().or(z.literal("")),

    nextInterviewDate: z.string().optional(),

    fileName: z.string().optional(),

    fileUrl: z.string().optional(),

    fileType: z.string().optional(),

    fileSize: z.number().optional(),

    interviewCount: z.number().int().min(0).default(0),
});

export const updateJobSchema = createJobSchema.partial();