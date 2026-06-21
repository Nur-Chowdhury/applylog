// app/page.tsx
import Link from "next/link";
import { Briefcase, ArrowRight, CheckCircle, Calendar, Sparkles } from "lucide-react";
import { auth } from "@/auth";

export default async function LandingPage() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50">
      <header className="border-b border-slate-100 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-md">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-slate-900">
              ApplyLog
            </span>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="rounded-xl bg-slate-950 px-4.5 py-2 text-sm font-semibold text-white shadow-xs transition-all hover:bg-slate-800"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-600 transition-all hover:text-slate-950"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-slate-950 px-4.5 py-2 text-sm font-semibold text-white shadow-xs transition-all hover:bg-slate-800"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Simplify your career search journey</span>
          </div>

          <h1 className="mt-8 font-heading text-4xl font-extrabold tracking-tight text-slate-950 sm:text-6xl md:text-7xl leading-tight">
            Track Every Application.
            <br />
            <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Never Miss An Interview.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-600 leading-relaxed">
            Organize your job search, schedule interviews, monitor offers,
            secure your documents, and stay prepared for your career progress.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={session ? "/dashboard" : "/register"}
              className="group inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-7 py-4 text-base font-bold text-white shadow-lg shadow-slate-950/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Start Tracking Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href={session ? "/dashboard" : "/login"}
              className="rounded-2xl border border-slate-200 bg-white px-7 py-4 text-base font-bold text-slate-800 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50"
            >
              Sign in to Account
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-28">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xs transition-all duration-300 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h3 className="mt-6 font-heading text-xl font-bold text-slate-950">
              Visual Applications Board
            </h3>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Maintain an active dashboard tracking Processing, Offered, and Accepted pipelines. Move applications instantly.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xs transition-all duration-300 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="mt-6 font-heading text-xl font-bold text-slate-900">
              Countdown Notice Board
            </h3>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Never forget an interview. Urgent upcoming interviews trigger smart colored notifications based on time remaining.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xs transition-all duration-300 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-6 font-heading text-xl font-bold text-slate-950">
              Upload Files & Docs
            </h3>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Keep original vacancy postings, customized resume files, and email confirmations saved in cloud storage.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-10 bg-white">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} ApplyLog. Professional tool for tracking personal job applications.</p>
        </div>
      </footer>
    </main>
  );
}