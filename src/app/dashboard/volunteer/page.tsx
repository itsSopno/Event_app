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

// Soft slate accent + a readable tint for small text on the dark background
const SLATE = "#6c7686";
const SLATE_LIGHT = "#a3adbc";

const focusRing =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a3adbc]";

const statusColor: Record<string, string> = {
    registered: "bg-[#6c7686]/20 text-[#c3cad6] border-[#6c7686]/50",
    confirmed: "bg-teal-900/30 text-teal-200/90 border-teal-700/40",
    attended: "bg-white/10 text-white border-white/20",
    cancelled: "bg-red-900/20 text-red-300/90 border-red-800/40",
};

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
    const attended = registrations.filter((r) => r.status === "attended").length;

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
        <div className="min-h-screen bg-[#051817] text-white font-mono">
            <div className="max-w-5xl mx-auto px-4 py-12 border-x border-dashed border-[#6c7686]/25">
                {/* Header */}
                <header className="mb-10">
                    <p className="text-[11px] mb-3" style={{ color: SLATE_LIGHT }}>
                        <span className="opacity-60">//</span> volunteer
                    </p>
                    <h1 className="font-sans text-5xl md:text-6xl font-black leading-[0.95] tracking-tight bg-gradient-to-b from-[#9bb3b0] to-[#4a6664] bg-clip-text text-transparent">
                        My events
                    </h1>
                    <p className="text-gray-400 text-xs mt-4">Track your registrations and participation status.</p>
                </header>

                {fetching ? (
                    <div className="animate-pulse text-sm" style={{ color: SLATE_LIGHT }}>
                        <span className="opacity-60">//</span> loading_events
                    </div>
                ) : (
                    <>
                        {/* Stats */}
                        <section aria-label="Overview" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                            <div className="rounded-2xl p-5 bg-gradient-to-br from-[#2f7f78] to-[#6c7686]">
                                <p className="text-[11px] text-white/80 mb-6"><span className="opacity-60">//</span> registered</p>
                                <p className="font-sans text-5xl font-black leading-none">{registrations.length}</p>
                                <p className="text-[11px] text-white/80 mt-2">Total registered</p>
                            </div>
                            <div className="bg-[#14100f] border border-white/5 rounded-2xl p-5">
                                <p className="text-[11px] text-gray-500 mb-6"><span className="opacity-60">//</span> upcoming</p>
                                <p className="font-sans text-5xl font-black leading-none">{upcoming.length}</p>
                                <p className="text-[11px] text-gray-400 mt-2">Upcoming</p>
                            </div>
                            <div className="bg-[#14100f] border border-white/5 rounded-2xl p-5">
                                <p className="text-[11px] text-gray-500 mb-6"><span className="opacity-60">//</span> attended</p>
                                <p className="font-sans text-5xl font-black leading-none">{attended}</p>
                                <p className="text-[11px] text-gray-400 mt-2">Attended</p>
                            </div>
                        </section>

                        <Section tag="upcoming" title="Upcoming events" count={upcoming.length}>
                            {upcoming.map((r) => (
                                <RegCard key={r._id} reg={r} onCancel={handleCancel} showCancel />
                            ))}
                        </Section>

                        <Section tag="past" title="Past events" count={past.length}>
                            {past.map((r) => (
                                <RegCard key={r._id} reg={r} onCancel={handleCancel} dim />
                            ))}
                        </Section>

                        {registrations.length === 0 && (
                            <div className="text-center py-20 border border-dashed border-[#6c7686]/30 rounded-2xl">
                                <p className="text-sm" style={{ color: SLATE_LIGHT }}>// no_registrations_yet</p>
                                <p className="text-gray-400 text-xs mt-2 mb-6">Find an event and sign up to volunteer.</p>
                                <Link
                                    href="/events"
                                    className={`inline-block text-xs font-bold text-white px-6 py-3 rounded-full bg-[#6c7686] hover:bg-[#7b8798] transition ${focusRing}`}
                                >
                                    Browse events
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function Section({ tag, title, count, children }: { tag: string; title: string; count: number; children: React.ReactNode }) {
    if (count === 0) return null;
    return (
        <section className="mb-12">
            <p className="text-[11px] mb-1" style={{ color: SLATE_LIGHT }}>
                <span className="opacity-60">//</span> {tag}
            </p>
            <h2 className="font-sans text-2xl font-semibold mb-5">
                {title} <span className="text-gray-500 text-sm font-normal font-mono">({count})</span>
            </h2>
            <div className="space-y-3">{children}</div>
        </section>
    );
}

function RegCard({
    reg,
    onCancel,
    showCancel,
    dim,
}: {
    reg: Registration;
    onCancel: (id: string) => void;
    showCancel?: boolean;
    dim?: boolean;
}) {
    if (!reg.event) return null;
    const d = new Date(reg.event.date);
    return (
        <div
            className={`bg-[#14100f] border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-5 hover:border-[#6c7686]/60 transition-colors ${dim ? "opacity-80" : ""}`}
        >
            {/* date block */}
            <div className="shrink-0 w-16 h-16 rounded-xl border border-[#6c7686]/40 bg-[#0a2523] flex flex-col items-center justify-center">
                <span className="font-sans text-2xl font-black leading-none">{d.getDate()}</span>
                <span className="text-[10px] uppercase mt-1" style={{ color: SLATE_LIGHT }}>
                    {d.toLocaleDateString("en-US", { month: "short" })}
                </span>
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-500 mb-1">
                    <span className="opacity-60">//</span> {reg.event.category?.toLowerCase()}
                </p>
                <Link
                    href={`/events/${reg.event._id}`}
                    className={`font-sans text-lg font-semibold hover:text-[#c3cad6] transition-colors rounded ${focusRing}`}
                >
                    {reg.event.title}
                </Link>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-gray-400 mt-2">
                    <span><span className="text-gray-600">space </span>{reg.event.location}</span>
                    <span><span className="text-gray-600">date </span>{d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                    <span><span className="text-gray-600">registered </span>{new Date(reg.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <span className={`text-[11px] px-2.5 py-1 rounded-full border ${statusColor[reg.status] ?? "bg-white/5 text-gray-400 border-white/10"}`}>
                    {reg.status}
                </span>
                {showCancel && reg.status !== "cancelled" && (
                    <button
                        onClick={() => onCancel(reg._id)}
                        className={`text-[11px] px-3.5 py-1.5 rounded-full border border-red-800/60 text-red-300/90 hover:bg-red-900/20 transition ${focusRing}`}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
}