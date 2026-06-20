import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            Professional Job Application Tracker
          </span>

          <h1 className="mt-8 font-heading text-5xl font-bold tracking-tight text-slate-900 md:text-7xl">
            Track Every Application.
            <br />
            Never Miss An Interview.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-600">
            Organize your job search, manage interviews,
            track offers, upload application documents,
            and stay ahead of every opportunity.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Get Started Free
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-medium text-slate-900 transition hover:bg-slate-100"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <h3 className="font-heading text-xl font-semibold">
              Track Applications
            </h3>

            <p className="mt-3 text-slate-600">
              Store every application in one place and
              never lose track of your progress.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-card">
            <h3 className="font-heading text-xl font-semibold">
              Interview Reminders
            </h3>

            <p className="mt-3 text-slate-600">
              Stay prepared with upcoming interview
              notifications and countdowns.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-card">
            <h3 className="font-heading text-xl font-semibold">
              Manage Offers
            </h3>

            <p className="mt-3 text-slate-600">
              Compare opportunities and keep a complete
              record of your career journey.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}