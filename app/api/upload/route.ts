// app/api/upload/route.ts

import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";

const MAX_FILE_SIZE =
    10 * 1024 * 1024;

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
];

export async function POST(
    request: Request
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    error:
                        "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const formData =
            await request.formData();

        const file =
            formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json(
                {
                    error:
                        "No file uploaded",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            file.size >
            MAX_FILE_SIZE
        ) {
            return NextResponse.json(
                {
                    error:
                        "File size exceeds 10MB",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            !ALLOWED_TYPES.includes(
                file.type
            )
        ) {
            return NextResponse.json(
                {
                    error:
                        "Unsupported file type",
                },
                {
                    status: 400,
                }
            );
        }

        const extension =
            file.name.includes(".")
                ? file.name
                      .split(".")
                      .pop()
                : "";

        const filePath = [
            session.user.id,
            randomUUID(),
            extension
                ? `.${extension}`
                : "",
        ].join("");

        const arrayBuffer =
            await file.arrayBuffer();

        const { error } =
            await supabase.storage
                .from(
                    "job-applications"
                )
                .upload(
                    filePath,
                    Buffer.from(
                        arrayBuffer
                    ),
                    {
                        contentType:
                            file.type,
                        upsert: false,
                    }
                );

        if (error) {
            return NextResponse.json(
                {
                    error:
                        error.message,
                },
                {
                    status: 500,
                }
            );
        }

        const {
            data: publicData,
        } = supabase.storage
            .from(
                "job-applications"
            )
            .getPublicUrl(
                filePath
            );

        return NextResponse.json({
            success: true,

            fileName:
                file.name,

            fileUrl:
                publicData.publicUrl,

            fileType:
                file.type,

            fileSize:
                file.size,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error:
                    "Upload failed",
            },
            {
                status: 500,
            }
        );
    }
}