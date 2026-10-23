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

// Soft slate accent
const SLATE = "#6c7686";
const SLATE_LIGHT = "#a3adbc"; // readable tint of the accent for small text on dark bg

const focusRing =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a3adbc]";

const statusStyle = (s: string) =>
    s === "published"
        ? "bg-[#6c7686]/20 text-[#c3cad6] border-[#6c7686]/50"
        : s === "draft"
            ? "bg-white/5 text-gray-400 border-white/10"
            : "bg-amber-900/20 text-amber-300/90 border-amber-700/40";

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
            <div className="min-h-screen bg-[#051817] flex items-center justify-center font-mono">
                <div className="animate-pulse text-sm" style={{ color: SLATE_LIGHT }}>
                    <span className="opacity-60">//</span> loading_dashboard
                </div>
            </div>
        );
    }

    const small = [
        { tag: "total_events", label: "Total events", value: stats?.totalEvents ?? 0 },
        { tag: "volunteers", label: "Total volunteers", value: stats?.totalVolunteers ?? 0 },
        { tag: "open_slots", label: "Available slots", value: stats?.availableSlots ?? 0 },
        { tag: "completed", label: "Completed events", value: stats?.completedEvents ?? 0 },
    ];

    const links = [
        { href: "/dashboard/organizer/events", label: "Manage events", desc: "Edit, publish, close or delete your events." },
        { href: "/dashboard/organizer/analytics", label: "Analytics", desc: "Registration trends and capacity charts." },
        { href: "/dashboard/organizer/create-event", label: "New event", desc: "Create an event with AI-written drafts." },
    ];

    return (
        <div className="min-h-screen bg-[#051817] text-white font-mono">
            <div className="max-w-6xl mx-auto px-4 py-12 border-x border-dashed border-[#6c7686]/25">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                    <div>
                        <p className="text-[11px] mb-3" style={{ color: SLATE_LIGHT }}>
                            <span className="opacity-60">//</span> organizer
                        </p>
                        <h1 className="font-sans text-4xl md:text-5xl font-black leading-[1] tracking-tight bg-gradient-to-b from-[#9bb3b0] to-[#4a6664] bg-clip-text text-transparent">
                            Welcome back,
                            <br />
                            {user?.name?.split(" ")[0]}
                        </h1>
                    </div>
                    <Link
                        href="/dashboard/organizer/create-event"
                        className={`self-start md:self-auto text-xs font-bold text-white px-6 py-3 rounded-full bg-[#6c7686] hover:bg-[#7b8798] transition ${focusRing}`}
                    >
                        Create event
                    </Link>
                </header>

                {/* Stats */}
                <section aria-label="Overview" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {/* featured */}
                    <div className="col-span-2 row-span-1 lg:row-span-2 rounded-2xl p-6 flex flex-col justify-between min-h-[200px] bg-gradient-to-br from-[#2f7f78] to-[#6c7686]">
                        <p className="text-[11px] text-white/80">
                            <span className="opacity-60">//</span> upcoming_events
                        </p>
                        <div>
                            <p className="font-sans text-7xl font-black leading-none">{stats?.upcomingEvents ?? 0}</p>
                            <p className="text-xs text-white/80 mt-2">Events coming up</p>
                        </div>
                    </div>

                    {small.map((s) => (
                        <div key={s.tag} className="bg-[#14100f] border border-white/5 rounded-2xl p-5">
                            <p className="text-[11px] text-gray-500 mb-6">
                                <span className="opacity-60">//</span> {s.tag}
                            </p>
                            <p className="font-sans text-4xl font-black">{s.value}</p>
                            <p className="text-[11px] text-gray-400 mt-1">{s.label}</p>
                        </div>
                    ))}
                </section>

                {/* Quick links */}
                <nav aria-label="Quick links" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`group bg-[#14100f] border border-white/5 rounded-2xl p-5 hover:border-[#6c7686] transition-colors ${focusRing}`}
                        >
                            <p className="font-sans text-lg font-semibold group-hover:text-[#c3cad6] transition-colors">{link.label}</p>
                            <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">{link.desc}</p>
                        </Link>
                    ))}
                </nav>

                {/* Upcoming events table */}
                {stats?.upcomingEventsList && stats.upcomingEventsList.length > 0 && (
                    <section>
                        <p className="text-[11px] mb-1" style={{ color: SLATE_LIGHT }}>
                            <span className="opacity-60">//</span> schedule
                        </p>
                        <h2 className="font-sans text-2xl font-semibold mb-5">Upcoming events</h2>

                        <div className="bg-[#14100f] border border-white/5 rounded-2xl overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-white/5 text-gray-500">
                                        <th className="text-left font-normal px-5 py-3">event</th>
                                        <th className="text-left font-normal px-5 py-3 hidden md:table-cell">date</th>
                                        <th className="text-left font-normal px-5 py-3">capacity</th>
                                        <th className="text-left font-normal px-5 py-3">status</th>
                                        <th className="px-5 py-3"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.upcomingEventsList.map((ev) => {
                                        const registered = ev.registeredCount || 0;
                                        const slots = Math.max(0, ev.maxCapacity - registered);
                                        const pct = Math.min(100, (registered / Math.max(1, ev.maxCapacity)) * 100);
                                        return (
                                            <tr key={ev._id} className="border-b border-white/5 last:border-0 hover:bg-[#6c7686]/10 transition-colors">
                                                <td className="px-5 py-4 font-sans text-sm font-medium text-white">{ev.title}</td>
                                                <td className="px-5 py-4 text-gray-400 hidden md:table-cell">
                                                    {new Date(ev.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                                                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: SLATE_LIGHT }} />
                                                        </div>
                                                        <span className="text-gray-400 whitespace-nowrap">{registered}/{ev.maxCapacity}, {slots} left</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full border ${statusStyle(ev.status)}`}>
                                                        {ev.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <Link
                                                        href={`/dashboard/organizer/events/${ev._id}`}
                                                        className={`px-3.5 py-1.5 rounded-full border border-[#6c7686]/60 hover:bg-[#6c7686] hover:text-white transition ${focusRing}`}
                                                        style={{ color: SLATE_LIGHT }}
                                                    >
                                                        Manage
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}