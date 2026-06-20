import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const result = registerSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.flatten() },
                { status: 400 }
            );
        }

        const { name, email, password } = result.data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}