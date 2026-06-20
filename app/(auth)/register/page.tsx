"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { registerSchema } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const parsed = registerSchema.safeParse(form);

        if (!parsed.success) {
            toast.error("Invalid input");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Registration failed");
                return;
            }

            toast.success("Account created!");
            router.push("/login");
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow"
            >
                <h1 className="text-2xl font-bold">Create Account</h1>

                <Input
                    name="name"
                    placeholder="Full name"
                    value={form.name}
                    onChange={handleChange}
                />

                <Input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />

                <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                />

                <Button type="submit" loading={loading}>
                    Register
                </Button>
            </form>
        </div>
    );
}