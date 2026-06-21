// app/analytics/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Trophy, Sparkles, TrendingUp, Percent } from "lucide-react";
import { ApplicationsChart } from "@/components/charts/applications-chart";
import { StatusChart } from "@/components/charts/status-chart";
import { InterviewChart } from "@/components/charts/interview-chart";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    // Retrieve all user applications to compute precise calculations
    const allJobs = await prisma.jobApplication.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "asc" },
    });

    const total = allJobs.length;
    const processing = allJobs.filter((j) => j.status === "PROCESSING").length;
    const rejected = allJobs.filter((j) => j.status === "REJECTED").length;
    const offered = allJobs.filter((j) => j.status === "OFFERED").length;
    const accepted = allJobs.filter((j) => j.status === "ACCEPTED").length;
    const withdrawn = allJobs.filter((j) => j.status === "WITHDRAWN").length;

    // Calculations
    const successRate = total > 0 ? Math.round(((offered + accepted) / total) * 100) : 0;
    const acceptanceRate = (offered + accepted) > 0 ? Math.round((accepted / (offered + accepted)) * 100) : 0;

    const withInterviews = allJobs.filter((j) => j.interviewCount > 0).length;
    const interviewConversionRate = total > 0 ? Math.round((withInterviews / total) * 100) : 0;

    // Weekly and Monthly Applications counters
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const appsThisWeek = allJobs.filter((j) => new Date(j.createdAt) >= oneWeekAgo).length;
    const appsThisMonth = allJobs.filter((j) => new Date(j.createdAt) >= oneMonthAgo).length;

    const totalInterviews = allJobs.reduce((acc, curr) => acc + curr.interviewCount, 0);
    const averageInterviews = total > 0 ? parseFloat((totalInterviews / total).toFixed(1)) : 0;

    // Grouping by month for chart trends
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyGroups: Record<string, { name: string; count: number; offers: number }> = {};

    // Initialize recent 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(now.getMonth() - i);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        monthlyGroups[key] = { name: `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`, count: 0, offers: 0 };
    }

    allJobs.forEach((job) => {
        const date = new Date(job.createdAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        if (monthlyGroups[key]) {
            monthlyGroups[key].count += 1;
            if (job.status === "OFFERED" || job.status === "ACCEPTED") {
                monthlyGroups[key].offers += 1;
            }
        }
    });

    const monthlyChartData = Object.values(monthlyGroups);

    const statusChartData = [
        { name: "Processing", value: processing, color: "#f59e0b" },
        { name: "Offered", value: offered, color: "#10b981" },
        { name: "Accepted", value: accepted, color: "#0ea5e9" },
        { name: "Rejected", value: rejected, color: "#f43f5e" },
        { name: "Withdrawn", value: withdrawn, color: "#64748b" },
    ].filter((item) => item.value > 0);

    const interviewTrendData = allJobs.map((j, idx) => ({
        index: idx + 1,
        company: j.companyName,
        interviews: j.interviewCount,
    })).slice(-10); // recent 10 items

    return (
        <div className="space-y-6.5">
            <div className="flex flex-col gap-1.5 bg-white border border-slate-200/70 p-5 rounded-3xl">
                <h2 className="text-xl font-heading font-extrabold tracking-tight text-slate-900 leading-tight">
                    Applications Analytics Panel
                </h2>
                <p className="text-xs text-slate-500 font-semibold">
                    Monitor success metrics, interview trends, and workflow conversions
                </p>
            </div>

            {/* Metrics cards grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200/70 bg-white p-5.5 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Success Rate</span>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-slate-900">{successRate}%</span>
                        <Percent className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="text-[10px] font-semibold text-slate-400 mt-1.5">Applications resulting in offers</p>
                </div>

                <div className="rounded-2xl border border-slate-200/70 bg-white p-5.5 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Acceptance Rate</span>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-slate-900">{acceptanceRate}%</span>
                        <Trophy className="h-4 w-4 text-amber-500" />
                    </div>
                    <p className="text-[10px] font-semibold text-slate-400 mt-1.5">Offers translated to acceptance</p>
                </div>

                <div className="rounded-2xl border border-slate-200/70 bg-white p-5.5 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Interview Conversion</span>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-slate-900">{interviewConversionRate}%</span>
                        <Sparkles className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="text-[10px] font-semibold text-slate-400 mt-1.5">Ratio of jobs granting interviews</p>
                </div>

                <div className="rounded-2xl border border-slate-200/70 bg-white p-5.5 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Interviews</span>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-slate-900">{averageInterviews}</span>
                        <TrendingUp className="h-4 w-4 text-indigo-500" />
                    </div>
                    <p className="text-[10px] font-semibold text-slate-400 mt-1.5">Interviews per application logged</p>
                </div>
            </div>

            {/* Extra KPI Statistics Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-150 bg-white p-4.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Logged This Week</p>
                    <p className="text-xl font-extrabold text-slate-800 mt-1">{appsThisWeek} leads</p>
                </div>
                <div className="rounded-2xl border border-slate-150 bg-white p-4.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Logged This Month</p>
                    <p className="text-xl font-extrabold text-slate-800 mt-1">{appsThisMonth} leads</p>
                </div>
                <div className="rounded-2xl border border-slate-150 bg-white p-4.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Offers Received</p>
                    <p className="text-xl font-extrabold text-emerald-600 mt-1">{offered + accepted} offers</p>
                </div>
                <div className="rounded-2xl border border-slate-150 bg-white p-4.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Disqualifications</p>
                    <p className="text-xl font-extrabold text-rose-500 mt-1">{rejected} rejections</p>
                </div>
            </div>

            {/* Interactive Charts grids */}
            <div className="grid gap-6 md:grid-cols-12">
                <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-xs md:col-span-8">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Application Trends & Offers</h3>
                    <div className="h-80 w-full">
                        <ApplicationsChart data={monthlyChartData} />
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-xs md:col-span-4">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Pipeline Distribution</h3>
                    <div className="h-80 w-full flex items-center justify-center">
                        <StatusChart data={statusChartData} />
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-xs md:col-span-12">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Interview Completion Trends</h3>
                    <div className="h-80 w-full">
                        <InterviewChart data={interviewTrendData} />
                    </div>
                </div>
            </div>
        </div>
    );
}