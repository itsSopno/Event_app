"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Registration {
    _id: string;
    status: string;
    createdAt: string;
    event: {
        _id: string;
        title: string;
        date: string;
        location: string;
        category: string;
        status: string;
    };
}

export default function VolunteerDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (loading) return;
        if (!user) { router.replace("/login"); return; }
        if (user.role === "organizer") { router.replace("/dashboard/organizer"); return; }
        api
            .get<{ data: Registration[] }>("/api/registrations/my-registrations")
            .then((res) => setRegistrations(res.data))
            .catch(() => { })
            .finally(() => setFetching(false));
    }, [user, loading, router]);

    const now = new Date();
    const upcoming = registrations.filter(
        (r) => r.event && new Date(r.event.date) >= now && r.status !== "cancelled"
    );
    const past = registrations.filter(
        (r) => r.event && new Date(r.event.date) < now
    );

    const statusColor: Record<string, string> = {
        registered: "bg-blue-900/30 text-blue-400",
        confirmed: "bg-green-900/30 text-green-400",
        attended: "bg-purple-900/30 text-purple-400",
        cancelled: "bg-red-900/30 text-red-400",
    };

    const handleCancel = async (regId: string) => {
        if (!confirm("Cancel your registration?")) return;
        try {
            await api.delete(`/api/registrations/${regId}`);
            setRegistrations((prev) => prev.filter((r) => r._id !== regId));
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to cancel");
        }
    };

    return (
        <div className="min-h-screen bg-[#051817] text-white">
            <div className="max-w-5xl mx-auto px-4 py-10">
                <p className="text-[#4eca8b] font-mono text-sm mb-1"><span className="opacity-60">//</span> Volunteer</p>
                <h1 className="text-3xl font-bold mb-2">My Events</h1>
                <p className="text-gray-400 mb-8">Track your registrations and participation status.</p>

                {fetching ? (
                    <div className="text-[#4eca8b] animate-pulse">Loading…</div>
                ) : (
                    <>
                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-4 mb-10">
                            {[
                                { label: "Total Registered", value: registrations.length, icon: "📋" },
                                { label: "Upcoming", value: upcoming.length, icon: "📅" },
                                { label: "Attended", value: registrations.filter((r) => r.status === "attended").length, icon: "✅" },
                            ].map((s) => (
                                <div key={s.label} className="bg-[#071f1e] border border-[#0d3330] rounded-xl p-5 text-center">
                                    <p className="text-2xl mb-1">{s.icon}</p>
                                    <p className="text-2xl font-bold text-[#4eca8b]">{s.value}</p>
                                    <p className="text-gray-400 text-xs">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Upcoming */}
                        <Section title="Upcoming Events" count={upcoming.length}>
                            {upcoming.map((r) => (
                                <RegCard key={r._id} reg={r} statusColor={statusColor} onCancel={handleCancel} showCancel />
                            ))}
                        </Section>

                        {/* Past */}
                        <Section title="Past Events" count={past.length}>
                            {past.map((r) => (
                                <RegCard key={r._id} reg={r} statusColor={statusColor} onCancel={handleCancel} />
                            ))}
                        </Section>

                        {registrations.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-5xl mb-4">🔍</p>
                                <p className="text-gray-400 mb-4">No registrations yet.</p>
                                <Link href="/events" className="text-[#4eca8b] hover:underline">Browse events →</Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
    if (count === 0) return null;
    return (
        <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">
                {title} <span className="text-gray-500 text-sm font-normal">({count})</span>
            </h2>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

function RegCard({
    reg,
    statusColor,
    onCancel,
    showCancel,
}: {
    reg: Registration;
    statusColor: Record<string, string>;
    onCancel: (id: string) => void;
    showCancel?: boolean;
}) {
    if (!reg.event) return null;
    return (
        <div className="bg-[#071f1e] border border-[#0d3330] rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500">{reg.event.category}</span>
                </div>
                <Link href={`/events/${reg.event._id}`} className="text-white font-semibold hover:text-[#4eca8b] transition">
                    {reg.event.title}
                </Link>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-1">
                    <span>📅 {new Date(reg.event.date).toLocaleDateString()}</span>
                    <span>📍 {reg.event.location}</span>
                    <span>Registered: {new Date(reg.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full ${statusColor[reg.status]}`}>{reg.status}</span>
                {showCancel && reg.status !== "cancelled" && (
                    <button
                        onClick={() => onCancel(reg._id)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-800 text-red-400 hover:bg-red-900/20 transition"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
}
