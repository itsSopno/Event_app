"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Event {
    _id: string;
    title: string;
    date: string;
    location: string;
    category: string;
    maxCapacity: number;
    registeredCount: number;
    status: "draft" | "published" | "closed";
}

export default function ManageEventsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [fetching, setFetching] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    const fetchEvents = useCallback(async () => {
        setFetching(true);
        try {
            const res = await api.get<{ data: Event[] }>("/api/events/organizer/my-events");
            setEvents(res.data);
        } catch {
            setEvents([]);
        } finally {
            setFetching(false);
        }
    }, []);

    useEffect(() => {
        if (loading) return;
        if (!user || user.role !== "organizer") { router.replace("/login"); return; }
        fetchEvents();
    }, [user, loading, router, fetchEvents]);

    const handleStatusChange = async (id: string, status: string) => {
        try {
            await api.put(`/api/events/${id}`, { status });
            setEvents((prev) => prev.map((e) => (e._id === id ? { ...e, status: status as Event["status"] } : e)));
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this event? All registrations will also be removed.")) return;
        setDeleting(id);
        try {
            await api.delete(`/api/events/${id}`);
            setEvents((prev) => prev.filter((e) => e._id !== id));
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to delete event");
        } finally {
            setDeleting(null);
        }
    };

    const statusColors: Record<string, string> = {
        draft: "bg-gray-700 text-gray-300",
        published: "bg-green-900/30 text-green-400",
        closed: "bg-yellow-900/30 text-yellow-400",
    };

    return (
        <div className="min-h-screen bg-[#051817] text-white">
            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-[#4eca8b] font-mono text-sm mb-1"><span className="opacity-60">//</span> Organizer</p>
                        <h1 className="text-3xl font-bold">Manage Events</h1>
                    </div>
                    <Link
                        href="/dashboard/organizer/create-event"
                        className="bg-[#4eca8b] hover:bg-[#3db87a] text-[#051817] font-semibold px-5 py-2.5 rounded-lg transition text-sm"
                    >
                        + New Event
                    </Link>
                </div>

                {fetching ? (
                    <div className="text-[#4eca8b] animate-pulse">Loading…</div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-4">📭</p>
                        <p className="text-gray-400 mb-4">No events yet.</p>
                        <Link href="/dashboard/organizer/create-event" className="text-[#4eca8b] hover:underline">
                            Create your first event →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {events.map((ev) => {
                            const slots = Math.max(0, ev.maxCapacity - (ev.registeredCount || 0));
                            return (
                                <div
                                    key={ev._id}
                                    className="bg-[#071f1e] border border-[#0d3330] rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[ev.status]}`}>{ev.status}</span>
                                            <span className="text-xs text-gray-500">{ev.category}</span>
                                        </div>
                                        <h3 className="text-white font-semibold">{ev.title}</h3>
                                        <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-1">
                                            <span>📅 {new Date(ev.date).toLocaleDateString()}</span>
                                            <span>📍 {ev.location}</span>
                                            <span>👥 {ev.registeredCount || 0}/{ev.maxCapacity} ({slots} slots left)</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        {/* Status actions */}
                                        {ev.status === "draft" && (
                                            <button
                                                onClick={() => handleStatusChange(ev._id, "published")}
                                                className="text-xs px-3 py-1.5 rounded-lg bg-green-900/30 border border-green-700 text-green-400 hover:bg-green-800/30 transition"
                                            >
                                                Publish
                                            </button>
                                        )}
                                        {ev.status === "published" && (
                                            <button
                                                onClick={() => handleStatusChange(ev._id, "closed")}
                                                className="text-xs px-3 py-1.5 rounded-lg bg-yellow-900/30 border border-yellow-700 text-yellow-400 hover:bg-yellow-800/30 transition"
                                            >
                                                Close Registrations
                                            </button>
                                        )}

                                        <Link
                                            href={`/dashboard/organizer/events/${ev._id}`}
                                            className="text-xs px-3 py-1.5 rounded-lg border border-[#0d3330] text-gray-300 hover:border-[#4eca8b] transition"
                                        >
                                            Volunteers →
                                        </Link>
                                        <Link
                                            href={`/dashboard/organizer/events/${ev._id}/edit`}
                                            className="text-xs px-3 py-1.5 rounded-lg border border-[#0d3330] text-gray-300 hover:border-[#4eca8b] transition"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(ev._id)}
                                            disabled={deleting === ev._id}
                                            className="text-xs px-3 py-1.5 rounded-lg border border-red-800 text-red-400 hover:bg-red-900/20 transition disabled:opacity-60"
                                        >
                                            {deleting === ev._id ? "Deleting…" : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
