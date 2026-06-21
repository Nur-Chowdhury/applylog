// components/layout/mobile-nav.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function MobileNav() {
    const [open, setOpen] =
        useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="md:hidden"
            >
                <Menu className="h-6 w-6" />
            </button>

            {open && (
                <>
                    <div
                        onClick={() =>
                            setOpen(false)
                        }
                        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                    />

                    <div className="fixed left-0 top-0 z-50 h-full w-72 bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b p-4">
                            <h2 className="font-bold">
                                ApplyLog
                            </h2>

                            <button
                                onClick={() =>
                                    setOpen(false)
                                }
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <nav className="p-4 space-y-2">
                            <Link
                                href="/dashboard"
                                className="block rounded-lg px-3 py-2 hover:bg-gray-100"
                            >
                                Dashboard
                            </Link>

                            <Link
                                href="/history"
                                className="block rounded-lg px-3 py-2 hover:bg-gray-100"
                            >
                                History
                            </Link>
                        </nav>
                    </div>
                </>
            )}
        </>
    );
}