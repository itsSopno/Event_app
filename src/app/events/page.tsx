"use client";

import { useState } from "react";
import Link from "next/link";
import { useEvents, Event } from "@/hooks/useEvents";

const CATEGORIES = [
    "All", "Hackathon", "Workshop", "Meetup", "Webinar", "Conference",
    "Bootcamp", "Competition", "Volunteering", "Other",
];

const LIME = "#d6f53c";

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export default function EventsPage() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [upcoming, setUpcoming] = useState("true");
    const [page, setPage] = useState(1);

    const { events, loading, pagination } = useEvents({
        search,
        category: category === "All" ? undefined : category.toLowerCase(),
        status: upcoming === "all" ? undefined : "published",
        page,
        limit: 9,
    });

    const total = pagination?.total ?? 0;
    const availableSlots = (e: Event) => Math.max(0, e.maxCapacity - (e.registeredCount || 0));
    const isFull = (e: Event) => availableSlots(e) === 0;

    return (
        <div className="min-h-screen text-white font-mono bg-[#051817] bg-[image:radial-gradient(ellipse_at_75%_30%,#0a2a28_0%,transparent_60%)]">
            {/* faint blueprint grid behind everything */}
            {/* <div
                aria-hidden
                className="pointer-events-none fixed inset-0 opacity-[0.07]"
                style={{
                    backgroundImage:
                        "linear-gradient(#6fe0c8 1px, transparent 1px), linear-gradient(90deg, #6fe0c8 1px, transparent 1px)",
                    backgroundSize: "56px 56px",
                    maskImage: "radial-gradient(ellipse at 70% 20%, black 0%, transparent 70%)",
                    WebkitMaskImage: "radial-gradient(ellipse at 70% 20%, black 0%, transparent 70%)",
                }}
            /> */}

            <div className="relative max-w-6xl mx-auto px-4 border-x border-dashed border-[#6fe0c8]/15">
                {/* ───────── Header ───────── */}
                <header className="pt-16 pb-10">
                    <p className="text-[11px] mb-4" style={{ color: LIME }}>
                        <span className="opacity-60">//</span> upcoming events
                    </p>
                    <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tight bg-gradient-to-b from-[#9bb3b0] to-[#4a6664] bg-clip-text text-transparent font-sans">
                        EVENT
                        <br />
                        COLLECTION
                    </h1>

                    {/* Search + select */}
                    <div className="mt-10 flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs">⌕</span>
                            <input
                                type="text"
                                placeholder="Search events"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="w-full bg-[#0a2523]/70 border border-[#6fe0c8]/15 rounded-full pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#6c7686] transition"
                            />
                        </div>
                        <select
                            value={upcoming}
                            onChange={(e) => { setUpcoming(e.target.value); setPage(1); }}
                            className="bg-[#0a2523]/70 border border-[#6fe0c8]/15 rounded-full px-5 py-2.5 text-sm text-white focus:outline-none focus:border-[#6c7686] transition"
                        >
                            <option value="true">Upcoming</option>
                            <option value="false">Past</option>
                            <option value="all">All</option>
                        </select>
                    </div>

                    {/* Category chips */}
                    <div className="flex flex-wrap gap-2 mt-5">
                        {CATEGORIES.map((c) => {
                            const active = category === c;
                            return (
                                <button
                                    key={c}
                                    onClick={() => { setCategory(c); setPage(1); }}
                                    className={`px-3.5 py-1.5 rounded-full text-[11px] border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6c7686] ${active
                                        ? "bg-[#6c7686] border-[#6c7686] text-[#051817] font-bold"
                                        : "border-[#6fe0c8]/20 text-gray-400 hover:border-[#6c7686] hover:text-white"
                                        }`}
                                >
                                    {active ? "" : "// "}{c.toLowerCase()}
                                </button>
                            );
                        })}
                    </div>
                </header>

                {/* ───────── Grid ───────── */}
                <main className="pb-24">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-[#14100f] border border-white/5 rounded-2xl overflow-hidden animate-pulse">
                                    <div className="h-36 bg-[#1d1816]" />
                                    <div className="p-5 space-y-3">
                                        <div className="h-4 bg-[#1d1816] rounded w-2/3" />
                                        <div className="h-3 bg-[#1d1816] rounded w-full" />
                                        <div className="h-3 bg-[#1d1816] rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-24 border border-dashed border-[#6fe0c8]/20 rounded-2xl">
                            <p className="text-sm" style={{ color: LIME }}>// no_events_found</p>
                            <p className="text-gray-400 text-sm mt-2">Change the category or search to see more events.</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-500 text-[11px] mb-5">
                                {total} event{total !== 1 ? "s" : ""} found
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {events.map((event) => {
                                    const full = isFull(event);
                                    const slots = availableSlots(event);
                                    const joined = event.registeredCount || 0;
                                    const pct = Math.min(100, Math.round((joined / Math.max(1, event.maxCapacity)) * 100));

                                    return (
                                        <Link
                                            href={`/events/${event._id}`}
                                            key={event._id}
                                            className="group flex flex-col bg-[#14100f] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6c7686]/60 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6c7686]"
                                        >
                                            {/* Top band: grid preview + category + date */}
                                            <div
                                                className="relative h-32 border-b border-white/5"
                                                style={{
                                                    backgroundColor: "#0a2523",
                                                    backgroundImage:
                                                        "linear-gradient(rgba(111,224,200,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(111,224,200,.12) 1px, transparent 1px)",
                                                    backgroundSize: "28px 28px",
                                                }}
                                            >
                                                <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-[11px]">
                                                    <span className="px-2.5 py-1 rounded-full bg-[#14100f]/80 border border-white/10" style={{ color: LIME }}>
                                                        <span className="opacity-60">//</span> {event.category?.toLowerCase()}
                                                    </span>
                                                    <span className="text-gray-300">{fmtDate(event.date)}</span>
                                                </div>
                                                <span
                                                    className="absolute bottom-3 left-4 text-[11px] font-bold px-2 py-0.5 rounded text-[#051817]"
                                                    style={{ background: LIME }}
                                                >
                                                    {new Date(event.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                                </span>
                                            </div>

                                            {/* Body */}
                                            <div className="p-5 flex flex-col flex-1">
                                                <h2 className="font-sans text-xl font-semibold leading-snug mb-2 line-clamp-2 group-hover:text-[#6c7686] transition-colors">
                                                    {event.title}
                                                </h2>
                                                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-5">
                                                    {event.description}
                                                </p>

                                                {/* meta rows */}
                                                <dl className="text-[11px] divide-y divide-white/5 border-y border-white/5 mb-5">
                                                    <div className="flex gap-4 py-2">
                                                        <dt className="w-14 text-gray-600">space</dt>
                                                        <dd className="text-gray-300 truncate">{event.location}</dd>
                                                    </div>
                                                    {event.requiredSkills?.length > 0 && (
                                                        <div className="flex gap-4 py-2">
                                                            <dt className="w-14 text-gray-600">skills</dt>
                                                            <dd className="text-gray-300 truncate">
                                                                {event.requiredSkills.slice(0, 3).join(", ")}
                                                                {event.requiredSkills.length > 3 && ` +${event.requiredSkills.length - 3}`}
                                                            </dd>
                                                        </div>
                                                    )}
                                                    {event.registrationDeadline && (
                                                        <div className="flex gap-4 py-2">
                                                            <dt className="w-14 text-gray-600">closes</dt>
                                                            <dd className="text-gray-300">{fmtDate(event.registrationDeadline)}</dd>
                                                        </div>
                                                    )}
                                                </dl>

                                                {/* capacity bar */}
                                                <div className="mt-auto">
                                                    <div className="h-1 rounded-full bg-white/10 overflow-hidden mb-3">
                                                        <div
                                                            className="h-full rounded-full"
                                                            style={{ width: `${pct}%`, background: full ? "#f87171" : LIME }}
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[11px] text-gray-500">
                                                            {joined}/{event.maxCapacity} joined, {slots} left
                                                        </span>
                                                        {full ? (
                                                            <span className="text-[11px] text-red-400 border border-red-500/40 rounded-full px-3 py-1.5">
                                                                Event full
                                                            </span>
                                                        ) : (
                                                            <span
                                                                className="text-[11px] font-bold rounded px-3.5 py-1.5 text-[#051817] group-hover:brightness-110 transition"
                                                                style={{ background: LIME }}
                                                            >
                                                                Join event
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            {total > 9 && (
                                <div className="flex justify-center items-center gap-3 mt-12 text-xs">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-4 py-2 rounded-full border border-[#6fe0c8]/20 text-gray-300 disabled:opacity-30 hover:border-[#6c7686] transition"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-gray-500">
                                        page {page} / {Math.ceil(total / 9)}
                                    </span>
                                    <button
                                        onClick={() => setPage((p) => p + 1)}
                                        disabled={page * 9 >= total}
                                        className="px-4 py-2 rounded-full border border-[#6fe0c8]/20 text-gray-300 disabled:opacity-30 hover:border-[#6c7686] transition"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}