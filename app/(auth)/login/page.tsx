"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { loginSchema } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
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

        const parsed = loginSchema.safeParse(form);

        if (!parsed.success) {
            toast.error("Invalid input");
            return;
        }

        setLoading(true);

        const res = await signIn("credentials", {
            email: form.email,
            password: form.password,
            redirect: false,
        });

        setLoading(false);

        if (res?.error) {
            toast.error("Invalid credentials");
            return;
        }

        toast.success("Welcome back!");
        router.push("/dashboard");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow"
            >
                <h1 className="text-2xl font-bold">Login</h1>

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
                    Login
                </Button>
            </form>
        </div>
    );
}