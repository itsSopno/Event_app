"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    category: string;
    requiredSkills: string[];
    maxCapacity: number;
    registeredCount: number;
    registrationDeadline: string;
    status: string;
    organizer: { name: string; email: string };
}

interface Registration {
    _id: string;
    status: string;
}

export default function EventDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const router = useRouter();
    const [event, setEvent] = useState<Event | null>(null);
    const [registration, setRegistration] = useState<Registration | null>(null);
    const [loading, setLoading] = useState(true);
    const [regLoading, setRegLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get<{ data: Event }>(`/api/events/${id}`);
                setEvent(res.data);
            } catch {
                setEvent(null);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    useEffect(() => {
        if (user?.role === "volunteer") {
            api
                .get<{ data: Registration[] }>(`/api/registrations/my?event=${id}`)
                .then((res) => {
                    const reg = res.data.find((r: Registration & { event: string }) => (r as unknown as { event: string }).event === id || true);
                    // We'll check after mount
                    setRegistration(res.data[0] || null);
                })
                .catch(() => { });
        }
    }, [user, id]);

    const availableSlots = event ? Math.max(0, event.maxCapacity - (event.registeredCount || 0)) : 0;
    const isFull = availableSlots === 0;
    const isPastDeadline = event ? new Date(event.registrationDeadline) < new Date() : false;

    const handleRegister = async () => {
        if (!user) { router.push("/login"); return; }
        setRegLoading(true);
        setMessage(null);
        try {
            await api.post("/api/registrations", { eventId: id });
            setMessage({ type: "success", text: "Successfully registered! Check My Events to view your status." });
            setRegistration({ _id: "temp", status: "registered" });
            setEvent((prev) => prev ? { ...prev, registeredCount: (prev.registeredCount || 0) + 1 } : prev);
        } catch (err: unknown) {
            setMessage({ type: "error", text: err instanceof Error ? err.message : "Registration failed" });
        } finally {
            setRegLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!registration) return;
        if (!confirm("Cancel your registration?")) return;
        setRegLoading(true);
        try {
            await api.delete(`/api/registrations/${registration._id}`);
            setMessage({ type: "success", text: "Registration cancelled." });
            setRegistration(null);
            setEvent((prev) => prev ? { ...prev, registeredCount: Math.max(0, (prev.registeredCount || 0) - 1) } : prev);
        } catch (err: unknown) {
            setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to cancel" });
        } finally {
            setRegLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#051817] flex items-center justify-center">
                <div className="text-[#4eca8b] animate-pulse text-lg">Loading event…</div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-[#051817] flex flex-col items-center justify-center gap-4">
                <p className="text-5xl">🔍</p>
                <p className="text-white text-xl">Event not found.</p>
                <button onClick={() => router.push("/events")} className="text-[#4eca8b] hover:underline">
                    Back to Events
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#051817] text-white">
            <div className="max-w-5xl mx-auto px-4 py-10">
                <button onClick={() => router.back()} className="text-gray-400 hover:text-[#4eca8b] transition mb-6 flex items-center gap-1">
                    ← Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <span className="text-xs font-medium text-[#4eca8b] bg-[#4eca8b]/10 px-3 py-1 rounded-full border border-[#4eca8b]/20">
                                {event.category}
                            </span>
                            <h1 className="text-3xl font-bold mt-3 mb-2">{event.title}</h1>
                            <p className="text-gray-400">{event.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: "📅", label: "Date", value: new Date(event.date).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
                                { icon: "📍", label: "Location", value: event.location },
                                { icon: "⏰", label: "Registration Deadline", value: new Date(event.registrationDeadline).toLocaleDateString() },
                                { icon: "👥", label: "Capacity", value: `${event.maxCapacity - availableSlots} / ${event.maxCapacity} registered` },
                            ].map((item) => (
                                <div key={item.label} className="bg-[#071f1e] border border-[#0d3330] rounded-xl p-4">
                                    <p className="text-sm text-gray-500 mb-1">{item.icon} {item.label}</p>
                                    <p className="text-white font-medium">{item.value}</p>
                                </div>
                            ))}
                        </div>

                        {event.requiredSkills?.length > 0 && (
                            <div className="bg-[#071f1e] border border-[#0d3330] rounded-xl p-5">
                                <h3 className="text-sm font-semibold text-gray-300 mb-3">Required Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {event.requiredSkills.map((s) => (
                                        <span key={s} className="text-sm bg-[#0a2a27] border border-[#0d3330] text-gray-300 px-3 py-1 rounded-lg">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-[#071f1e] border border-[#0d3330] rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-gray-300 mb-1">Organized by</h3>
                            <p className="text-white">{event.organizer?.name}</p>
                            <p className="text-gray-400 text-sm">{event.organizer?.email}</p>
                        </div>
                    </div>

                    {/* Sidebar – registration */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 bg-[#071f1e] border border-[#0d3330] rounded-xl p-6 space-y-4">
                            {/* Capacity bar */}
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">Volunteers</span>
                                    <span className={isFull ? "text-red-400" : "text-[#4eca8b]"}>
                                        {availableSlots} slot{availableSlots !== 1 ? "s" : ""} left
                                    </span>
                                </div>
                                <div className="h-2 bg-[#0a2a27] rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${isFull ? "bg-red-500" : "bg-[#4eca8b]"}`}
                                        style={{ width: `${Math.min(100, ((event.registeredCount || 0) / event.maxCapacity) * 100)}%` }}
                                    />
                                </div>
                            </div>

                            {message && (
                                <div className={`text-sm px-4 py-3 rounded-lg ${message.type === "success"
                                        ? "bg-green-900/20 border border-green-700 text-green-400"
                                        : "bg-red-900/20 border border-red-700 text-red-400"
                                    }`}>
                                    {message.text}
                                </div>
                            )}

                            {user?.role === "organizer" ? (
                                <p className="text-gray-400 text-sm text-center">Organizers cannot register as volunteers.</p>
                            ) : registration ? (
                                <div className="space-y-3">
                                    <div className="text-center">
                                        <span className="text-[#4eca8b] font-semibold">✓ Registered</span>
                                        <p className="text-gray-400 text-xs mt-1">Status: {registration.status}</p>
                                    </div>
                                    <button
                                        onClick={handleCancel}
                                        disabled={regLoading}
                                        className="w-full py-2.5 rounded-lg border border-red-800 text-red-400 hover:bg-red-900/20 transition text-sm disabled:opacity-60"
                                    >
                                        {regLoading ? "Cancelling…" : "Cancel Registration"}
                                    </button>
                                </div>
                            ) : isFull ? (
                                <button disabled className="w-full py-3 rounded-lg bg-gray-700 text-gray-400 cursor-not-allowed text-sm">
                                    Event Full
                                </button>
                            ) : isPastDeadline ? (
                                <button disabled className="w-full py-3 rounded-lg bg-gray-700 text-gray-400 cursor-not-allowed text-sm">
                                    Registration Closed
                                </button>
                            ) : !user ? (
                                <button
                                    onClick={() => router.push("/login")}
                                    className="w-full py-3 rounded-lg bg-[#4eca8b] text-[#051817] font-semibold hover:bg-[#3db87a] transition"
                                >
                                    Login to Register
                                </button>
                            ) : (
                                <button
                                    onClick={handleRegister}
                                    disabled={regLoading}
                                    className="w-full py-3 rounded-lg bg-[#4eca8b] text-[#051817] font-semibold hover:bg-[#3db87a] transition disabled:opacity-60"
                                >
                                    {regLoading ? "Registering…" : "Register as Volunteer →"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
