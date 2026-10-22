"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Stats {
    totalEvents: number;
    upcomingEvents: number;
    completedEvents: number;
    totalVolunteers: number;
    availableSlots: number;
    upcomingEventsList: {
        _id: string;
        title: string;
        date: string;
        maxCapacity: number;
        registeredCount: number;
        status: string;
    }[];
}

export default function OrganizerDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        if (loading) return;
        if (!user) { router.replace("/login"); return; }
        if (user.role !== "organizer") { router.replace("/dashboard/volunteer"); return; }
        api
            .get<{ data: Stats }>("/api/events/organizer/dashboard")
            .then((res) => setStats(res.data))
            .catch(() => { })
            .finally(() => setStatsLoading(false));
    }, [user, loading, router]);

    if (loading || statsLoading) {
        return (
            <div className="min-h-screen bg-[#051817] flex items-center justify-center">
                <div className="text-[#4eca8b] animate-pulse">Loading dashboard…</div>
            </div>
        );
    }

    const statCards = [
        { label: "Total Events", value: stats?.totalEvents ?? 0, icon: "📋", color: "text-blue-400" },
        { label: "Upcoming Events", value: stats?.upcomingEvents ?? 0, icon: "📅", color: "text-[#4eca8b]" },
        { label: "Total Volunteers", value: stats?.totalVolunteers ?? 0, icon: "🙋", color: "text-purple-400" },
        { label: "Available Slots", value: stats?.availableSlots ?? 0, icon: "🎯", color: "text-yellow-400" },
        { label: "Completed Events", value: stats?.completedEvents ?? 0, icon: "✅", color: "text-gray-400" },
    ];

    return (
        <div className="min-h-screen bg-[#051817] text-white">
            <div className="max-w-7xl mx-auto px-4 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-[#4eca8b] font-mono text-sm mb-1"><span className="opacity-60">//</span> Organizer</p>
                        <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
                    </div>
                    <Link
                        href="/dashboard/organizer/create-event"
                        className="bg-[#4eca8b] hover:bg-[#3db87a] text-[#051817] font-semibold px-5 py-2.5 rounded-lg transition flex items-center gap-2"
                    >
                        + Create Event
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                    {statCards.map((s) => (
                        <div key={s.label} className="bg-[#071f1e] border border-[#0d3330] rounded-xl p-5">
                            <p className="text-2xl mb-2">{s.icon}</p>
                            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-gray-400 text-xs mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Quick links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    {[
                        { href: "/dashboard/organizer/events", label: "Manage Events", desc: "Edit, publish, close or delete events", icon: "🗂️" },
                        { href: "/dashboard/organizer/analytics", label: "Analytics", desc: "Charts, registration trends, capacity", icon: "📊" },
                        { href: "/dashboard/organizer/create-event", label: "New Event", desc: "Create a new event with AI assistance", icon: "✨" },
                    ].map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="bg-[#071f1e] border border-[#0d3330] rounded-xl p-5 hover:border-[#4eca8b] transition group"
                        >
                            <p className="text-2xl mb-2">{link.icon}</p>
                            <p className="text-white font-semibold group-hover:text-[#4eca8b] transition">{link.label}</p>
                            <p className="text-gray-400 text-sm mt-1">{link.desc}</p>
                        </Link>
                    ))}
                </div>

                {/* Upcoming events list */}
                {stats?.upcomingEventsList && stats.upcomingEventsList.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
                        <div className="bg-[#071f1e] border border-[#0d3330] rounded-xl overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[#0d3330]">
                                        <th className="text-left px-5 py-3 text-gray-400 font-medium">Event</th>
                                        <th className="text-left px-5 py-3 text-gray-400 font-medium hidden md:table-cell">Date</th>
                                        <th className="text-left px-5 py-3 text-gray-400 font-medium">Capacity</th>
                                        <th className="text-left px-5 py-3 text-gray-400 font-medium">Status</th>
                                        <th className="px-5 py-3" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.upcomingEventsList.map((ev) => {
                                        const slots = Math.max(0, ev.maxCapacity - (ev.registeredCount || 0));
                                        return (
                                            <tr key={ev._id} className="border-b border-[#0a2a27] last:border-0 hover:bg-[#0a2a27] transition">
                                                <td className="px-5 py-3 font-medium text-white">{ev.title}</td>
                                                <td className="px-5 py-3 text-gray-400 hidden md:table-cell">
                                                    {new Date(ev.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 h-1.5 bg-[#0d3330] rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-[#4eca8b] rounded-full"
                                                                style={{ width: `${Math.min(100, ((ev.registeredCount || 0) / ev.maxCapacity) * 100)}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-gray-400 text-xs">{slots} left</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${ev.status === "published" ? "bg-green-900/30 text-green-400" :
                                                            ev.status === "draft" ? "bg-gray-700 text-gray-400" :
                                                                "bg-yellow-900/30 text-yellow-400"
                                                        }`}>
                                                        {ev.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <Link href={`/dashboard/organizer/events/${ev._id}`} className="text-[#4eca8b] hover:underline text-xs">
                                                        Manage →
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
