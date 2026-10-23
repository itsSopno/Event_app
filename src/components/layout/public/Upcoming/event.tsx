'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
    ArrowUpRight,
    ChevronLeft,
    ChevronRight,
    Code2,
    Gamepad2,
    Radio,
    Search,
    Tag,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEvents } from '@/hooks/useEvents'

const PER_PAGE = 2 // ekbare koyta card dekhabe
const SEGMENTS = 12 // capacity bar er block shonkha

type EventItem = {
    _id: string
    title: string
    description: string
    date: string
    location: string
    category: string
    maxCapacity: number
    registeredCount: number
    requiredSkills: string[]
    registrationDeadline: string
    status: 'draft' | 'published' | 'closed' | 'completed'
    organizer: { _id: string; name: string; email: string } | string
    image?: string
    availableSlots: number
    isFull: boolean
    createdAt: string
}

const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

function categoryIcon(category: string): LucideIcon {
    const c = category.toLowerCase()
    if (c.includes('cod')) return Code2
    if (c.includes('live') || c.includes('stream')) return Radio
    if (c.includes('gam')) return Gamepad2
    return Tag
}

export default function EventsPage() {
    const { events: data, loading } = useEvents({
        status: 'published',
        upcoming: 'true',
    }) as { events?: EventItem[]; loading: boolean }

    const events = useMemo(() => data ?? [], [data])

    const [category, setCategory] = useState('All')
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)

    const categories = useMemo(
        () => ['All', ...Array.from(new Set(events.map((e) => e.category)))],
        [events],
    )

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        return events
            .filter(
                (e) =>
                    (category === 'All' || e.category === category) &&
                    (!q ||
                        e.title.toLowerCase().includes(q) ||
                        e.description.toLowerCase().includes(q)),
            )
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }, [events, category, query])

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
    const currentPage = Math.min(page, totalPages)
    const visible = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

    const changeCategory = (c: string) => {
        setCategory(c)
        setPage(1)
    }
    const changeQuery = (v: string) => {
        setQuery(v)
        setPage(1)
    }

    return (
        <main className="min-h-screen bg-[#051817] bg-[image:radial-gradient(ellipse_at_75%_30%,#0a2a28_0%,transparent_60%)] text-[#6c7686]">
            <div className="mx-auto max-w-7xl px-6 pb-24 pt-16">
                <p className="font-mono text-xs uppercase tracking-widest text-[#2dd4bf]">
                    / Upcoming events
                </p>
                <h1 className="mt-3 bg-gradient-to-r from-[#6c7686] to-[#6c7686] bg-clip-text text-6xl font-black uppercase leading-[0.9] tracking-tighter text-transparent md:text-8xl">
                    Event
                    <br />
                    Collection
                </h1>

                {/* Controls */}
                <div className="mt-12 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((c) => {
                            const Icon = c === 'All' ? null : categoryIcon(c)
                            return (
                                <button
                                    key={c}
                                    onClick={() => changeCategory(c)}
                                    className={`flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                                        category === c
                                            ? 'border-[#2dd4bf] bg-[#2dd4bf] text-black'
                                            : 'border-white/15 text-white/70 hover:border-white/40 hover:text-white'
                                    }`}
                                >
                                    {Icon && <Icon className="h-3.5 w-3.5" />}
                                    {c}
                                </button>
                            )
                        })}
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                        <input
                            value={query}
                            onChange={(e) => changeQuery(e.target.value)}
                            placeholder="Search events"
                            className="w-full rounded-full border border-white/15 bg-transparent py-2 pl-9 pr-4 text-sm outline-none placeholder:text-white/40 focus:border-[#2dd4bf] sm:w-64"
                        />
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="mt-10 grid gap-5 md:grid-cols-2">
                        {Array.from({ length: PER_PAGE }).map((_, i) => (
                            <div key={i} className="h-[34rem] animate-pulse rounded-md bg-neutral-900" />
                        ))}
                    </div>
                )}

                {/* Cards (2ta kore) */}
                {!loading && visible.length > 0 && (
                    <div className="mt-10 grid gap-5 md:grid-cols-2">
                        {visible.map((e) => (
                            <EventCard key={e._id} event={e} />
                        ))}
                    </div>
                )}

                {/* Empty */}
                {!loading && filtered.length === 0 && (
                    <div className="mt-16 rounded-2xl border border-dashed border-white/15 p-16 text-center">
                        <p className="text-lg font-semibold uppercase">No upcoming events</p>
                        <p className="mt-2 text-sm text-neutral-400">
                            Try another category or clear your search.
                        </p>
                    </div>
                )}

                {/* Pagination: shudhu 1 page er beshi hole dekhabe */}
                {!loading && totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-between">
                        <button
                            onClick={() => setPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center gap-2 rounded-md border border-white/15 px-5 py-3 font-mono text-xs uppercase tracking-widest transition-colors hover:border-[#2dd4bf] hover:text-[#2dd4bf] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-white"
                        >
                            <ChevronLeft className="h-4 w-4" /> Previous
                        </button>

                        <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                            Page <span className="text-white">{currentPage}</span> / {totalPages}
                        </span>

                        <button
                            onClick={() => setPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-2 rounded-md bg-white px-5 py-3 font-mono text-xs uppercase tracking-widest text-black transition-colors hover:bg-[#2dd4bf] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                        >
                            Next <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
        </main>
    )
}

/* ---------- Card (terminal style, site theme: dark + lime #d4f542) ---------- */

function CategoryTag({ category }: { category: string }) {
    const Icon = categoryIcon(category)
    return (
        <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#d4f542]">
            <Icon className="h-3.5 w-3.5" />
            {'// '}
            {category.toLowerCase()}
        </span>
    )
}

function SpecRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex gap-4 font-mono text-xs leading-relaxed">
            <dt className="w-16 shrink-0 text-white/35">{label}</dt>
            <dd className="min-w-0 text-white/80">{children}</dd>
        </div>
    )
}

function Crosshair({ className }: { className: string }) {
    return (
        <span
            aria-hidden
            className={`pointer-events-none absolute font-mono text-sm leading-none text-[#d4f542]/40 transition-colors group-hover:text-[#d4f542] ${className}`}
        >
            +
        </span>
    )
}

function EventCard({ event }: { event: EventItem }) {
    const percent = Math.min(
        100,
        Math.round((event.registeredCount / Math.max(event.maxCapacity, 1)) * 100),
    )
    const filled = Math.round((percent / 100) * SEGMENTS)

    return (
        <Link
            href={`/events/${event._id}`}
            className="group relative flex flex-col rounded-md border border-white/10 bg-[#120f0e] transition-colors hover:border-[#d4f542]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d4f542]"
        >
            {/* Grid crosshair corners, same as the site background */}
            <Crosshair className="-left-1.5 -top-2" />
            <Crosshair className="-right-1.5 -top-2" />
            <Crosshair className="-bottom-2 -left-1.5" />
            <Crosshair className="-bottom-2 -right-1.5" />

            {/* Header strip */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                <CategoryTag category={event.category} />
                <span className="font-mono text-xs text-white/60">{fmtDate(event.date)}</span>
            </div>

            {/* Image: grayscale by default, colour on hover */}
            <div
                className="relative aspect-video overflow-hidden border-b border-white/10 bg-[#06201d]"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(212,245,66,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(212,245,66,0.08) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            >
                {event.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={event.image}
                        alt={event.title}
                        className="absolute inset-0 h-full w-full object-cover grayscale transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                    />
                )}
                <span className="absolute bottom-3 left-3 rounded-sm bg-[#d4f542] px-2 py-1 font-mono text-xs font-medium text-black">
                    {fmtTime(event.date)}
                </span>
                {event.isFull && (
                    <span className="absolute right-3 top-3 rounded-sm border border-white/40 bg-black/70 px-2 py-1 font-mono text-xs text-white backdrop-blur">
                        full
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
                <h3 className="text-xl font-bold uppercase leading-tight tracking-tight text-white">
                    {event.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/50">
                    {event.description}
                </p>

                <dl className="mt-5 space-y-1.5 border-l border-[#d4f542]/30 pl-4">
                    {event.location && <SpecRow label="where">{event.location}</SpecRow>}
                    {event.requiredSkills?.length > 0 && (
                        <SpecRow label="skills">
                            {event.requiredSkills.slice(0, 3).join(', ')}
                        </SpecRow>
                    )}
                    {event.registrationDeadline && (
                        <SpecRow label="closes">{fmtDate(event.registrationDeadline)}</SpecRow>
                    )}
                </dl>

                {/* Capacity + CTA */}
                <div className="mt-auto pt-6">
                    <div className="flex gap-1" aria-hidden>
                        {Array.from({ length: SEGMENTS }).map((_, i) => (
                            <span
                                key={i}
                                className={`h-2 flex-1 rounded-[1px] ${
                                    i < filled ? 'bg-[#d4f542]' : 'bg-white/10'
                                }`}
                            />
                        ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="font-mono text-xs text-white/50">
                            {event.isFull
                                ? 'no slots left'
                                : `${event.registeredCount}/${event.maxCapacity} joined, ${event.availableSlots} left`}
                        </span>
                        <span
                            className={`inline-flex shrink-0 items-center gap-2 rounded-sm px-4 py-2 font-mono text-xs font-medium transition-colors ${
                                event.isFull
                                    ? 'border border-white/20 text-white group-hover:border-white/50'
                                    : 'bg-[#d4f542] text-black group-hover:bg-white'
                            }`}
                        >
                            {event.isFull ? 'View details' : 'Join event'}
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}