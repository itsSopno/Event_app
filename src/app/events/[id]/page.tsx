// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
// import { api } from "@/lib/api";
// import { useAuth } from "@/context/AuthContext";

// const LIME = "#d4f542";
// const SEGMENTS = 16;
// const GRID_BG = {
//     backgroundImage:
//         "linear-gradient(rgba(212,245,66,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(212,245,66,0.035) 1px, transparent 1px)",
//     backgroundSize: "48px 48px",
// };

// interface Event {
//     _id: string;
//     title: string;
//     description: string;
//     date: string;
//     location: string;
//     category: string;
//     requiredSkills: string[];
//     maxCapacity: number;
//     registeredCount: number;
//     registrationDeadline: string;
//     status: string;
//     organizer: { name: string; email: string };
// }

// interface Registration {
//     _id: string;
//     status: string;
//     event?: { _id: string } | string;
// }

// /* ---------- small building blocks ---------- */

// function Crosshair({ className }: { className: string }) {
//     return (
//         <span
//             aria-hidden
//             className={`pointer-events-none absolute font-mono text-sm leading-none text-[#d4f542]/50 ${className}`}
//         >
//             +
//         </span>
//     );
// }

// function Panel({
//     title,
//     children,
//     className = "",
// }: {
//     title: string;
//     children: React.ReactNode;
//     className?: string;
// }) {
//     return (
//         <section className={`rounded-md border border-white/10 bg-[#120f0e] ${className}`}>
//             <div className="border-b border-white/10 px-5 py-3 font-mono text-xs text-[#d4f542]">
//                 {"// "}
//                 {title}
//             </div>
//             <div className="p-5">{children}</div>
//         </section>
//     );
// }

// function SpecRow({ label, children }: { label: string; children: React.ReactNode }) {
//     return (
//         <div className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
//             <dt className="w-40 shrink-0 font-mono text-xs text-white/40">{label}</dt>
//             <dd className="min-w-0 text-sm text-white/90">{children}</dd>
//         </div>
//     );
// }

// export default function EventDetailPage() {
//     const { id } = useParams<{ id: string }>();
//     const { user } = useAuth();
//     const router = useRouter();
//     const [event, setEvent] = useState<Event | null>(null);
//     const [registration, setRegistration] = useState<Registration | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [regLoading, setRegLoading] = useState(false);
//     const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

//     useEffect(() => {
//         const fetchEvent = async () => {
//             try {
//                 const res = await api.get<{ data: Event }>(`/api/events/${id}`);
//                 setEvent(res.data);
//             } catch {
//                 setEvent(null);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchEvent();
//     }, [id]);

//     useEffect(() => {
//         if (user?.role === "volunteer") {
//             api
//                 .get<{ data: Registration[] }>(`/api/registrations/my-registrations`)
//                 .then((res) => {
//                     const found = res.data.find((r) => {
//                         const eventId = typeof r.event === "object" ? r.event?._id : r.event;
//                         return eventId === id;
//                     });
//                     setRegistration(found || null);
//                 })
//                 .catch(() => { });
//         }
//     }, [user, id]);

//     const availableSlots = event ? Math.max(0, event.maxCapacity - (event.registeredCount || 0)) : 0;
//     const isFull = availableSlots === 0;
//     const isPastDeadline = event ? new Date(event.registrationDeadline) < new Date() : false;

//     const handleRegister = async () => {
//         if (!user) { router.push("/login"); return; }
//         setRegLoading(true);
//         setMessage(null);
//         try {
//             await api.post(`/api/registrations/events/${id}/register`, {});
//             setMessage({ type: "success", text: "Successfully registered! Check My Events to view your status." });
//             setRegistration({ _id: "temp", status: "registered" });
//             setEvent((prev) => prev ? { ...prev, registeredCount: (prev.registeredCount || 0) + 1 } : prev);
//         } catch (err: unknown) {
//             setMessage({ type: "error", text: err instanceof Error ? err.message : "Registration failed" });
//         } finally {
//             setRegLoading(false);
//         }
//     };

//     const handleCancel = async () => {
//         if (!registration) return;
//         if (!confirm("Cancel your registration?")) return;
//         setRegLoading(true);
//         try {
//             await api.put(`/api/registrations/${registration._id}/cancel`, {});
//             setMessage({ type: "success", text: "Registration cancelled." });
//             setRegistration(null);
//             setEvent((prev) => prev ? { ...prev, registeredCount: Math.max(0, (prev.registeredCount || 0) - 1) } : prev);
//         } catch (err: unknown) {
//             setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to cancel" });
//         } finally {
//             setRegLoading(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex min-h-screen items-center justify-center bg-[#051817]" style={GRID_BG}>
//                 <p className="animate-pulse font-mono text-sm text-[#d4f542]">$ loading event...</p>
//             </div>
//         );
//     }

//     if (!event) {
//         return (
//             <div
//                 className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#051817] px-4 text-center"
//                 style={GRID_BG}
//             >
//                 <p className="font-mono text-xs text-[#d4f542]">{"// 404"}</p>
//                 <p className="text-3xl font-bold uppercase tracking-tight text-white">Event not found</p>
//                 <p className="text-sm text-white/50">It may have been removed or the link is wrong.</p>
//                 <button
//                     onClick={() => router.push("/events")}
//                     className="mt-2 inline-flex items-center gap-2 rounded-sm bg-[#d4f542] px-4 py-2 font-mono text-xs font-medium text-black transition-colors hover:bg-white"
//                 >
//                     <ArrowLeft className="h-3.5 w-3.5" /> Back to events
//                 </button>
//             </div>
//         );
//     }

//     const registered = event.registeredCount || 0;
//     const filled = Math.round(Math.min(1, registered / Math.max(event.maxCapacity, 1)) * SEGMENTS);
//     const eventDate = new Date(event.date);

//     return (
//         <div className="min-h-screen bg-[#051817] text-white" style={GRID_BG}>
//             <div className="mx-auto max-w-5xl px-4 py-10">
//                 <button
//                     onClick={() => router.back()}
//                     className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-white/50 transition-colors hover:text-[#d4f542]"
//                 >
//                     <ArrowLeft className="h-3.5 w-3.5" /> back
//                 </button>

//                 <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
//                     {/* Main content */}
//                     <div className="space-y-6 lg:col-span-2">
//                         <header>
//                             <p className="font-mono text-xs text-[#d4f542]">
//                                 {"// "}
//                                 {event.category.toLowerCase()}
//                             </p>
//                             <h1 className="mt-3 text-4xl font-black uppercase leading-[0.95] tracking-tighter md:text-5xl">
//                                 {event.title}
//                             </h1>
//                             <p className="mt-4 max-w-prose leading-relaxed text-white/60">{event.description}</p>
//                         </header>

//                         <Panel title="details">
//                             <dl className="divide-y divide-white/10 -my-3">
//                                 <SpecRow label="date">
//                                     {eventDate.toLocaleDateString("en-US", {
//                                         weekday: "long",
//                                         day: "numeric",
//                                         month: "long",
//                                         year: "numeric",
//                                     })}
//                                 </SpecRow>
//                                 <SpecRow label="time">
//                                     {eventDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
//                                 </SpecRow>
//                                 <SpecRow label="location">{event.location}</SpecRow>
//                                 <SpecRow label="register by">
//                                     {new Date(event.registrationDeadline).toLocaleDateString("en-US", {
//                                         day: "numeric",
//                                         month: "long",
//                                         year: "numeric",
//                                     })}
//                                 </SpecRow>
//                                 <SpecRow label="registered">
//                                     {registered} / {event.maxCapacity} volunteers
//                                 </SpecRow>
//                             </dl>
//                         </Panel>

//                         {event.requiredSkills?.length > 0 && (
//                             <Panel title="required skills">
//                                 <div className="flex flex-wrap gap-2">
//                                     {event.requiredSkills.map((s) => (
//                                         <span
//                                             key={s}
//                                             className="rounded-sm border border-[#d4f542]/30 px-3 py-1 font-mono text-xs text-white/80"
//                                         >
//                                             {s}
//                                         </span>
//                                     ))}
//                                 </div>
//                             </Panel>
//                         )}

//                         <Panel title="organizer">
//                             <p className="font-medium text-white">{event.organizer?.name}</p>
//                             <p className="mt-1 font-mono text-xs text-white/50">{event.organizer?.email}</p>
//                         </Panel>
//                     </div>

//                     {/* Sidebar: registration */}
//                     <aside className="lg:col-span-1">
//                         <div className="group relative sticky top-6 rounded-md border border-white/10 bg-[#120f0e]">
//                             <Crosshair className="-left-1.5 -top-2" />
//                             <Crosshair className="-right-1.5 -top-2" />
//                             <Crosshair className="-bottom-2 -left-1.5" />
//                             <Crosshair className="-bottom-2 -right-1.5" />

//                             <div className="border-b border-white/10 px-5 py-3 font-mono text-xs text-[#d4f542]">
//                                 {"// registration"}
//                             </div>

//                             <div className="space-y-5 p-5">
//                                 {/* Capacity */}
//                                 <div>
//                                     <div className="mb-2 flex items-baseline justify-between font-mono text-xs">
//                                         <span className="text-white/50">volunteers</span>
//                                         <span className={isFull ? "text-red-400" : "text-[#d4f542]"}>
//                                             {availableSlots} slot{availableSlots !== 1 ? "s" : ""} left
//                                         </span>
//                                     </div>
//                                     <div className="flex gap-1" aria-hidden>
//                                         {Array.from({ length: SEGMENTS }).map((_, i) => (
//                                             <span
//                                                 key={i}
//                                                 className={`h-2.5 flex-1 rounded-[1px] ${
//                                                     i < filled
//                                                         ? isFull
//                                                             ? "bg-red-500"
//                                                             : "bg-[#d4f542]"
//                                                         : "bg-white/10"
//                                                 }`}
//                                             />
//                                         ))}
//                                     </div>
//                                 </div>

//                                 {message && (
//                                     <div
//                                         role="status"
//                                         className={`rounded-sm border px-4 py-3 font-mono text-xs leading-relaxed ${
//                                             message.type === "success"
//                                                 ? "border-[#d4f542]/40 bg-[#d4f542]/10 text-[#d4f542]"
//                                                 : "border-red-500/40 bg-red-500/10 text-red-300"
//                                         }`}
//                                     >
//                                         {message.text}
//                                     </div>
//                                 )}

//                                 {user?.role === "organizer" ? (
//                                     <p className="text-center text-sm text-white/50">
//                                         Organizers cannot register as volunteers.
//                                     </p>
//                                 ) : registration ? (
//                                     <div className="space-y-3">
//                                         <div className="text-center">
//                                             <span className="inline-flex items-center gap-2 font-mono text-sm font-medium text-[#d4f542]">
//                                                 <Check className="h-4 w-4" /> registered
//                                             </span>
//                                             <p className="mt-1 font-mono text-xs text-white/40">
//                                                 status: {registration.status}
//                                             </p>
//                                         </div>
//                                         <button
//                                             onClick={handleCancel}
//                                             disabled={regLoading}
//                                             className="w-full rounded-sm border border-red-500/50 py-2.5 font-mono text-xs text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-60"
//                                         >
//                                             {regLoading ? "Cancelling…" : "Cancel registration"}
//                                         </button>
//                                     </div>
//                                 ) : isFull ? (
//                                     <button
//                                         disabled
//                                         className="w-full cursor-not-allowed rounded-sm border border-white/15 py-3 font-mono text-xs text-white/40"
//                                     >
//                                         Event full
//                                     </button>
//                                 ) : isPastDeadline ? (
//                                     <button
//                                         disabled
//                                         className="w-full cursor-not-allowed rounded-sm border border-white/15 py-3 font-mono text-xs text-white/40"
//                                     >
//                                         Registration closed
//                                     </button>
//                                 ) : !user ? (
//                                     <button
//                                         onClick={() => router.push("/login")}
//                                         className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#d4f542] py-3 font-mono text-xs font-medium text-black transition-colors hover:bg-white"
//                                     >
//                                         Log in to register <ArrowUpRight className="h-3.5 w-3.5" />
//                                     </button>
//                                 ) : (
//                                     <button
//                                         onClick={handleRegister}
//                                         disabled={regLoading}
//                                         className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#d4f542] py-3 font-mono text-xs font-medium text-black transition-colors hover:bg-white disabled:opacity-60"
//                                     >
//                                         {regLoading ? "Registering…" : "Register as volunteer"}
//                                         {!regLoading && <ArrowUpRight className="h-3.5 w-3.5" />}
//                                     </button>
//                                 )}
//                             </div>
//                         </div>
//                     </aside>
//                 </div>
//             </div>
//         </div>
//     );
// }
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const SEGMENTS = 16;

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
    event?: { _id: string } | string;
}

/* ---------- small building blocks ---------- */

function Panel({
    title,
    children,
    className = "",
}: {
    title: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section className={className}>
            <div className="pb-3 font-mono text-xs text-[#d4f542]">
                {"// "}
                {title}
            </div>
            <div>{children}</div>
        </section>
    );
}

function SpecRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
            <dt className="w-40 shrink-0 font-mono text-xs text-white/40">{label}</dt>
            <dd className="min-w-0 text-sm text-white/90">{children}</dd>
        </div>
    );
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
                .get<{ data: Registration[] }>(`/api/registrations/my-registrations`)
                .then((res) => {
                    const found = res.data.find((r) => {
                        const eventId = typeof r.event === "object" ? r.event?._id : r.event;
                        return eventId === id;
                    });
                    setRegistration(found || null);
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
            await api.post(`/api/registrations/events/${id}/register`, {});
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
            await api.put(`/api/registrations/${registration._id}/cancel`, {});
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
            <div className="flex min-h-screen items-center justify-center bg-[#051817]">
                <p className="animate-pulse font-mono text-sm text-[#d4f542]">$ loading event...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div
                className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#051817] px-4 text-center"
               
            >
                <p className="font-mono text-xs text-[#d4f542]">{"// 404"}</p>
                <p className="text-3xl font-bold uppercase tracking-tight text-white">Event not found</p>
                <p className="text-sm text-white/50">It may have been removed or the link is wrong.</p>
                <button
                    onClick={() => router.push("/events")}
                    className="mt-2 inline-flex items-center gap-2 rounded-sm bg-[#d4f542] px-4 py-2 font-mono text-xs font-medium text-black transition-colors hover:bg-white"
                >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to events
                </button>
            </div>
        );
    }

    const registered = event.registeredCount || 0;
    const filled = Math.round(Math.min(1, registered / Math.max(event.maxCapacity, 1)) * SEGMENTS);
    const eventDate = new Date(event.date);

    return (
        <div className="min-h-screen bg-[#051817] text-white">
            <div className="mx-auto max-w-5xl px-4 py-10">
                <button
                    onClick={() => router.back()}
                    className="mb-10 inline-flex items-center gap-2 font-mono text-xs text-white/50 transition-colors hover:text-[#d4f542]"
                >
                    <ArrowLeft className="h-3.5 w-3.5" /> back
                </button>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {/* Main content */}
                    <div className="space-y-10 lg:col-span-2">
                        <header>
                            <p className="font-mono text-xs text-[#d4f542]">
                                {"// "}
                                {event.category.toLowerCase()}
                            </p>
                            <h1 className="mt-3 text-4xl font-black uppercase leading-[0.95] tracking-tighter md:text-5xl">
                                {event.title}
                            </h1>
                            <p className="mt-4 max-w-prose leading-relaxed text-white/60">{event.description}</p>
                        </header>

                        <Panel title="details">
                            <dl className="divide-y divide-white/10 border-y border-white/10">
                                <SpecRow label="date">
                                    {eventDate.toLocaleDateString("en-US", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </SpecRow>
                                <SpecRow label="time">
                                    {eventDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                                </SpecRow>
                                <SpecRow label="location">{event.location}</SpecRow>
                                <SpecRow label="register by">
                                    {new Date(event.registrationDeadline).toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </SpecRow>
                                <SpecRow label="registered">
                                    {registered} / {event.maxCapacity} volunteers
                                </SpecRow>
                            </dl>
                        </Panel>

                        {event.requiredSkills?.length > 0 && (
                            <Panel title="required skills">
                                <div className="flex flex-wrap gap-2">
                                    {event.requiredSkills.map((s) => (
                                        <span
                                            key={s}
                                            className="rounded-sm border border-[#d4f542]/30 px-3 py-1 font-mono text-xs text-white/80"
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </Panel>
                        )}

                        <Panel title="organizer">
                            <p className="font-medium text-white">{event.organizer?.name}</p>
                            <p className="mt-1 font-mono text-xs text-white/50">{event.organizer?.email}</p>
                        </Panel>
                    </div>

                    {/* Sidebar: registration */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-6">

                            <div className="pb-3 font-mono text-xs text-[#d4f542]">
                                {"// registration"}
                            </div>

                            <div className="space-y-5">
                                {/* Capacity */}
                                <div>
                                    <div className="mb-2 flex items-baseline justify-between font-mono text-xs">
                                        <span className="text-white/50">volunteers</span>
                                        <span className={isFull ? "text-red-400" : "text-[#d4f542]"}>
                                            {availableSlots} slot{availableSlots !== 1 ? "s" : ""} left
                                        </span>
                                    </div>
                                    <div className="flex gap-1" aria-hidden>
                                        {Array.from({ length: SEGMENTS }).map((_, i) => (
                                            <span
                                                key={i}
                                                className={`h-2.5 flex-1 rounded-[1px] ${
                                                    i < filled
                                                        ? isFull
                                                            ? "bg-red-500"
                                                            : "bg-[#d4f542]"
                                                        : "bg-white/10"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {message && (
                                    <div
                                        role="status"
                                        className={`rounded-sm border px-4 py-3 font-mono text-xs leading-relaxed ${
                                            message.type === "success"
                                                ? "border-[#d4f542]/40 bg-[#d4f542]/10 text-[#d4f542]"
                                                : "border-red-500/40 bg-red-500/10 text-red-300"
                                        }`}
                                    >
                                        {message.text}
                                    </div>
                                )}

                                {user?.role === "organizer" ? (
                                    <p className="text-center text-sm text-white/50">
                                        Organizers cannot register as volunteers.
                                    </p>
                                ) : registration ? (
                                    <div className="space-y-3">
                                        <div className="text-center">
                                            <span className="inline-flex items-center gap-2 font-mono text-sm font-medium text-[#d4f542]">
                                                <Check className="h-4 w-4" /> registered
                                            </span>
                                            <p className="mt-1 font-mono text-xs text-white/40">
                                                status: {registration.status}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleCancel}
                                            disabled={regLoading}
                                            className="w-full rounded-sm border border-red-500/50 py-2.5 font-mono text-xs text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-60"
                                        >
                                            {regLoading ? "Cancelling…" : "Cancel registration"}
                                        </button>
                                    </div>
                                ) : isFull ? (
                                    <button
                                        disabled
                                        className="w-full cursor-not-allowed rounded-sm border border-white/15 py-3 font-mono text-xs text-white/40"
                                    >
                                        Event full
                                    </button>
                                ) : isPastDeadline ? (
                                    <button
                                        disabled
                                        className="w-full cursor-not-allowed rounded-sm border border-white/15 py-3 font-mono text-xs text-white/40"
                                    >
                                        Registration closed
                                    </button>
                                ) : !user ? (
                                    <button
                                        onClick={() => router.push("/login")}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#d4f542] py-3 font-mono text-xs font-medium text-black transition-colors hover:bg-white"
                                    >
                                        Log in to register <ArrowUpRight className="h-3.5 w-3.5" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleRegister}
                                        disabled={regLoading}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#d4f542] py-3 font-mono text-xs font-medium text-black transition-colors hover:bg-white disabled:opacity-60"
                                    >
                                        {regLoading ? "Registering…" : "Register as volunteer"}
                                        {!regLoading && <ArrowUpRight className="h-3.5 w-3.5" />}
                                    </button>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}