// lib/validations/job.ts
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

    // Adding .nullable() allows empty values from inputs to be saved as null safely
    jobType: z.enum([
        "FULL_TIME",
        "PART_TIME",
        "CONTRACT",
        "INTERNSHIP",
        "REMOTE",
        "HYBRID",
    ]).nullable().optional(),

    description: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    salary: z.string().nullable().optional(),
    
    jobPostingUrl: z.string().url().or(z.literal("")).nullable().optional(),
    
    personalNotes: z.string().nullable().optional(),
    referrerName: z.string().nullable().optional(),
    
    referrerProfileLink: z.string().url().or(z.literal("")).nullable().optional(),
    
    nextInterviewDate: z.string().nullable().optional(),
    fileName: z.string().nullable().optional(),
    fileUrl: z.string().nullable().optional(),
    fileType: z.string().nullable().optional(),
    fileSize: z.number().nullable().optional(),
    
    interviewCount: z.number().int().min(0).default(0),
});

export const updateJobSchema = createJobSchema.partial();