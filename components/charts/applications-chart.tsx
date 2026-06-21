// components/charts/applications-chart.tsx
"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ApplicationsChartProps {
    data: Array<{ name: string; count: number; offers: number }>;
}

export function ApplicationsChart({ data }: ApplicationsChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                    contentStyle={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0" }}
                    labelStyle={{ fontWeight: "bold", color: "#0f172a" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", marginTop: "10px" }} />
                <Bar dataKey="count" name="Applications" fill="#0f172a" radius={[6, 6, 0, 0]} maxBarSize={40} />
                <Bar dataKey="offers" name="Offers" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
        </ResponsiveContainer>
    );
}