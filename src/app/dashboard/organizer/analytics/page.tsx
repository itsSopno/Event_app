"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from "recharts";

interface Analytics {
    eventsByCategory: { _id: string; count: number }[];
    regByEvent: { eventTitle: string; count: number }[];
    statusBreakdown: { _id: string; count: number }[];
    capacityUtilization: { title: string; maxCapacity: number; registered: number; utilization: number }[];
}

const COLORS = ["#4eca8b", "#3b82f6", "#a855f7", "#f59e0b", "#ef4444", "#06b6d4"];

export default function AnalyticsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (loading) return;
        if (!user || user.role !== "organizer") { router.replace("/login"); return; }
        api
            .get<{ data: Analytics }>("/api/events/organizer/analytics")
            .then((res) => setAnalytics(res.data))
            .catch(() => { })
            .finally(() => setFetching(false));
    }, [user, loading, router]);

    if (loading || fetching) {
        return (
            <div className="min-h-screen bg-[#051817] flex items-center justify-center">
                <div className="text-[#4eca8b] animate-pulse">Loading analytics…</div>
            </div>
        );
    }

    const categoryData = analytics?.eventsByCategory.map((d) => ({ name: d._id, value: d.count })) ?? [];
    const regData = analytics?.regByEvent.slice(0, 8).map((d) => ({ name: d.eventTitle?.slice(0, 20) + (d.eventTitle?.length > 20 ? "…" : ""), count: d.count })) ?? [];
    const statusData = analytics?.statusBreakdown.map((d) => ({ name: d._id, value: d.count })) ?? [];

    const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
        if (active && payload?.length) {
            return (
                <div className="bg-[#071f1e] border border-[#0d3330] rounded-lg px-3 py-2 text-sm">
                    <p className="text-gray-300">{label}</p>
                    <p className="text-[#4eca8b] font-semibold">{payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-[#051817] text-white">
            <div className="max-w-7xl mx-auto px-4 py-10">
                <p className="text-[#4eca8b] font-mono text-sm mb-1"><span className="opacity-60">//</span> Organizer</p>
                <h1 className="text-3xl font-bold mb-8">Analytics</h1>

                {(!analytics || categoryData.length === 0) ? (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-4">📊</p>
                        <p className="text-gray-400">No data yet. Create and publish events to see analytics.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Chart row 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Events by category - Pie */}
                            <div className="bg-[#071f1e] border border-[#0d3330] rounded-xl p-6">
                                <h2 className="font-semibold mb-4 text-gray-200">Events by Category</h2>
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                                            {categoryData.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Registration status breakdown - Pie */}
                            <div className="bg-[#071f1e] border border-[#0d3330] rounded-xl p-6">
                                <h2 className="font-semibold mb-4 text-gray-200">Volunteer Status Breakdown</h2>
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                                            {statusData.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Registrations by event - Bar */}
                        {regData.length > 0 && (
                            <div className="bg-[#071f1e] border border-[#0d3330] rounded-xl p-6">
                                <h2 className="font-semibold mb-4 text-gray-200">Volunteer Registrations by Event</h2>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={regData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#0d3330" />
                                        <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} angle={-30} textAnchor="end" interval={0} />
                                        <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} allowDecimals={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="count" fill="#4eca8b" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Capacity utilization table */}
                        {analytics?.capacityUtilization && analytics.capacityUtilization.length > 0 && (
                            <div className="bg-[#071f1e] border border-[#0d3330] rounded-xl p-6">
                                <h2 className="font-semibold mb-4 text-gray-200">Event Capacity Utilization</h2>
                                <div className="space-y-3">
                                    {analytics.capacityUtilization.map((ev) => (
                                        <div key={ev.title}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-300 truncate max-w-xs">{ev.title}</span>
                                                <span className="text-gray-400 ml-2">{ev.registered}/{ev.maxCapacity} ({ev.utilization}%)</span>
                                            </div>
                                            <div className="h-2 bg-[#0a2a27] rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${ev.utilization >= 100 ? "bg-red-500" : ev.utilization >= 70 ? "bg-yellow-400" : "bg-[#4eca8b]"}`}
                                                    style={{ width: `${Math.min(100, ev.utilization)}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
