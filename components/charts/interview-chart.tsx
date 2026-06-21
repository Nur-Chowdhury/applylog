// components/charts/interview-chart.tsx
"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface InterviewChartProps {
    data: Array<{ index: number; company: string; interviews: number }>;
}

export function InterviewChart({ data }: InterviewChartProps) {
    if (data.length === 0) {
        return (
            <p className="text-xs font-semibold text-slate-400 text-center">Interviews trend will appear here as you log dates.</p>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="company" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                    contentStyle={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0" }}
                    labelStyle={{ fontWeight: "bold", color: "#0f172a" }}
                />
                <Line
                    type="monotone"
                    dataKey="interviews"
                    name="Completed Interviews"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                    dot={{ r: 4 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}