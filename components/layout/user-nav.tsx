// components/layout/user-nav.tsx
"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { LogOut, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

export function UserNav() {
    const { data: session } = useSession();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut({ callbackUrl: "/" });
            toast.success("Successfully logged out");
        } catch {
            toast.error("Error signing out");
        }
    };

    if (!session?.user) return null;

    const initials = session.user.name
        ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";

    return (
        <div className="relative">
            <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 rounded-xl p-1.5 hover:bg-slate-100 transition-all cursor-pointer"
            >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-sm tracking-wider">
                    {initials}
                </div>
                <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                        {session.user.name}
                    </p>
                    <p className="text-[10px] text-slate-500 leading-none">
                        {session.user.email}
                    </p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 hidden lg:block" />
            </button>

            {dropdownOpen && (
                <>
                    <div 
                        onClick={() => setDropdownOpen(false)} 
                        className="fixed inset-0 z-30 cursor-default" 
                    />
                    <div className="absolute right-0 mt-2.5 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl z-40 animate-in fade-in-50 duration-100">
                        <div className="px-3.5 py-3 border-b border-slate-100">
                            <p className="text-sm font-bold text-slate-900">{session.user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer mt-1"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}