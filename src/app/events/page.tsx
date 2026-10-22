"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

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
}

interface ApiResponse {
    data: { events: Event[]; pagination: { total: number } };
}

const CATEGORIES = [
    "All", "Hackathon", "Workshop", "Meetup", "Webinar", "Conference",
    "Bootcamp", "Competition", "Volunteering", "Other",
];

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [upcoming, setUpcoming] = useState<string>("true");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            if (category !== "All") params.set("category", category);
            if (upcoming !== "all") params.set("upcoming", upcoming);
            params.set("status", "published");
            params.set("page", String(page));
            params.set("limit", "9");
            const res = await api.get<ApiResponse>(`/api/events?${params}`);
            setEvents(res.data.events);
            setTotal(res.data.pagination.total);
        } catch {
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, [search, category, upcoming, page]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const availableSlots = (e: Event) => Math.max(0, e.maxCapacity - (e.registeredCount || 0));
    const isFull = (e: Event) => availableSlots(e) === 0;

    return (
        <div className="min-h-screen bg-[#051817] text-white">
            {/* Header */}
            <div className="border-b border-[#0d3330] bg-[#071f1e]">
                <div className="max-w-7xl mx-auto px-4 py-10">
                    <p className="text-[#4eca8b] font-mono text-sm mb-2"><span className="opacity-60">//</span> Discover</p>
                    <h1 className="text-4xl font-bold mb-6">Browse Events</h1>

                    {/* Search + Filters */}
                    <div className="flex flex-col md:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Search events…"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="flex-1 bg-[#0a2a27] border border-[#0d3330] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition"
                        />
                        <select
                            value={upcoming}
                            onChange={(e) => { setUpcoming(e.target.value); setPage(1); }}
                            className="bg-[#0a2a27] border border-[#0d3330] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#4eca8b] transition"
                        >
                            <option value="true">Upcoming</option>
                            <option value="false">Past</option>
                            <option value="all">All</option>
                        </select>
                    </div>

                    {/* Category chips */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {CATEGORIES.map((c) => (
                            <button
                                key={c}
                                onClick={() => { setCategory(c); setPage(1); }}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${category === c
                                        ? "bg-[#4eca8b] border-[#4eca8b] text-[#051817]"
                                        : "border-[#0d3330] text-gray-400 hover:border-[#4eca8b]"
                                    }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            <div className="max-w-7xl mx-auto px-4 py-10">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-[#071f1e] border border-[#0d3330] rounded-xl p-6 animate-pulse">
                                <div className="h-4 bg-[#0d3330] rounded w-1/3 mb-4" />
                                <div className="h-6 bg-[#0d3330] rounded w-3/4 mb-2" />
                                <div className="h-4 bg-[#0d3330] rounded w-full mb-1" />
                                <div className="h-4 bg-[#0d3330] rounded w-2/3" />
                            </div>
                        ))}
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-4">📭</p>
                        <p className="text-gray-400 text-lg">No events found. Try a different filter.</p>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-400 text-sm mb-6">{total} event{total !== 1 ? "s" : ""} found</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event) => (
                                <Link
                                    href={`/events/${event._id}`}
                                    key={event._id}
                                    className="group bg-[#071f1e] border border-[#0d3330] rounded-xl p-6 hover:border-[#4eca8b] transition-all duration-200 flex flex-col"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-medium text-[#4eca8b] bg-[#4eca8b]/10 px-2.5 py-1 rounded-full">
                                            {event.category}
                                        </span>
                                        {isFull(event) ? (
                                            <span className="text-xs text-red-400 bg-red-900/20 px-2.5 py-1 rounded-full border border-red-800">Full</span>
                                        ) : (
                                            <span className="text-xs text-green-400">{availableSlots(event)} slots left</span>
                                        )}
                                    </div>

                                    <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-[#4eca8b] transition line-clamp-2">
                                        {event.title}
                                    </h2>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{event.description}</p>

                                    <div className="space-y-1.5 text-sm text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <span>📅</span>
                                            <span>{new Date(event.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>📍</span>
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                        {event.registrationDeadline && (
                                            <div className="flex items-center gap-2">
                                                <span>⏰</span>
                                                <span>Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>

                                    {event.requiredSkills?.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-4">
                                            {event.requiredSkills.slice(0, 3).map((s) => (
                                                <span key={s} className="text-xs bg-[#0a2a27] border border-[#0d3330] text-gray-300 px-2 py-0.5 rounded">
                                                    {s}
                                                </span>
                                            ))}
                                            {event.requiredSkills.length > 3 && (
                                                <span className="text-xs text-gray-500">+{event.requiredSkills.length - 3}</span>
                                            )}
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {total > 9 && (
                            <div className="flex justify-center gap-2 mt-10">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 rounded-lg border border-[#0d3330] text-gray-400 disabled:opacity-40 hover:border-[#4eca8b] transition"
                                >
                                    ← Prev
                                </button>
                                <span className="px-4 py-2 text-gray-400">Page {page}</span>
                                <button
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={page * 9 >= total}
                                    className="px-4 py-2 rounded-lg border border-[#0d3330] text-gray-400 disabled:opacity-40 hover:border-[#4eca8b] transition"
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
