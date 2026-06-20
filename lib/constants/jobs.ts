// lib/constants/jobs.ts

import {
    JobStatus,
    JobType
} from "@prisma/client";

export const ACTIVE_STATUSES: JobStatus[] = [
    JobStatus.PROCESSING,
    JobStatus.OFFERED,
    JobStatus.ACCEPTED
];

export const HISTORY_STATUSES: JobStatus[] = [
    JobStatus.REJECTED,
    JobStatus.WITHDRAWN
];

export const JOB_STATUS_OPTIONS = [
    {
        label: "Processing",
        value: JobStatus.PROCESSING
    },
    {
        label: "Offered",
        value: JobStatus.OFFERED
    },
    {
        label: "Accepted",
        value: JobStatus.ACCEPTED
    },
    {
        label: "Rejected",
        value: JobStatus.REJECTED
    },
    {
        label: "Withdrawn",
        value: JobStatus.WITHDRAWN
    }
];

export const JOB_TYPE_OPTIONS = [
    {
        label: "Full Time",
        value: JobType.FULL_TIME
    },
    {
        label: "Part Time",
        value: JobType.PART_TIME
    },
    {
        label: "Contract",
        value: JobType.CONTRACT
    },
    {
        label: "Internship",
        value: JobType.INTERNSHIP
    },
    {
        label: "Remote",
        value: JobType.REMOTE
    },
    {
        label: "Hybrid",
        value: JobType.HYBRID
    }
];