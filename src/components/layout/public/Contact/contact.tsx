"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import GridLines from "@/components/shared/GridLines/GridLines";

const TOPICS = [
    "General question",
    "Volunteering",
    "Organizing an event",
    "Report a problem",
];

const inputCls =
    "w-full bg-[#051817] border border-[#0d3330] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] focus:ring-1 focus:ring-[#4eca8b]/40 transition";

const Icon = {
    mail: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
        </svg>
    ),
    phone: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
        </svg>
    ),
    pin: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
            <circle cx="12" cy="10" r="2.5" />
        </svg>
    ),
    clock: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </svg>
    ),
    check: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
    ),
};

// Replace these with your real contact details
const CONTACTS = [
    { icon: Icon.mail, label: "Email", value: "hello@yourdomain.com", href: "mailto:hello@yourdomain.com" },
    { icon: Icon.phone, label: "Phone", value: "+880 1xxx xxxxxx", href: "tel:+8801000000000" },
    { icon: Icon.pin, label: "Office", value: "Dhaka, Bangladesh" },
    { icon: Icon.clock, label: "Hours", value: "Sun–Thu, 10am–6pm (GMT+6)" },
];

export default function ContactPage() {
    const { user: authUser } = useAuth();
    const rootRef = useRef<HTMLElement>(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [topic, setTopic] = useState(TOPICS[0]);
    const [message, setMessage] = useState("");
    const [trap, setTrap] = useState(""); // honeypot, real users never fill this
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const reduce = () =>
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const d = (s: number) => (reduce() ? 0 : s);

    // Prefill from logged-in user
    useEffect(() => {
        if (authUser) {
            setName((n) => n || authUser.name || "");
            setEmail((e) => e || authUser.email || "");
        }
    }, [authUser]);

    // Page load: one orchestrated entrance
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            tl.from(".ct-title-line", { yPercent: 110, duration: d(0.9), stagger: 0.12 })
                .from(".ct-intro", { opacity: 0, y: 16, duration: d(0.6) }, "-=0.5")
                .from(".ct-method", { opacity: 0, x: -16, duration: d(0.5), stagger: 0.09 }, "-=0.4")
                .from(".ct-form", { opacity: 0, y: 28, duration: d(0.8) }, "-=0.9");
        }, rootRef);
        return () => ctx.revert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Success state animation
    useEffect(() => {
        if (!sent) return;
        const ctx = gsap.context(() => {
            gsap
                .timeline({ defaults: { ease: "power3.out" } })
                .from(".ct-ok-ring", { scale: 0, duration: d(0.5), ease: "back.out(1.8)" })
                .from(".ct-ok-text", { opacity: 0, y: 14, duration: d(0.5), stagger: 0.1 }, "-=0.2");
        }, rootRef);
        return () => ctx.revert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sent]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (trap) return; // bot
        setSending(true);
        setError("");
        try {
            await api.post("/api/contact", {
                name: name.trim(),
                email: email.trim(),
                topic,
                message: message.trim(),
            });
            setSent(true);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "We could not send your message. Please try again."
            );
        } finally {
            setSending(false);
        }
    };

    const resetForm = () => {
        setMessage("");
        setTopic(TOPICS[0]);
        setSent(false);
    };

    return (
        <main
            ref={rootRef}
            className="relative min-h-screen bg-[#051817] bg-[image:radial-gradient(ellipse_at_80%_0%,#0a2a28_0%,transparent_60%)] text-white"
        >
            <GridLines />

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
                {/* ───────── Left: intro + contact methods ───────── */}
                <aside className="lg:col-span-2">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
                        <span className="block overflow-hidden pb-1">
                            <span className="ct-title-line block">Talk to us.</span>
                        </span>
                        <span className="block overflow-hidden pb-1">
                            <span className="ct-title-line block text-[#4eca8b]">We read everything.</span>
                        </span>
                    </h1>

                    <p className="ct-intro mt-5 text-gray-400 text-[15px] leading-relaxed max-w-sm">
                        Questions about an event, trouble with your account or an idea for the
                        platform. Send a message and a real person will reply, usually within one
                        working day.
                    </p>

                    <ul className="mt-9 space-y-5">
                        {CONTACTS.map((c) => {
                            const inner = (
                                <>
                                    <span className="w-11 h-11 shrink-0 rounded-xl bg-[#071f1e] border border-[#0d3330] flex items-center justify-center text-[#4eca8b]">
                                        {c.icon}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block text-xs text-gray-500">{c.label}</span>
                                        <span className="block text-sm text-gray-200 break-words">{c.value}</span>
                                    </span>
                                </>
                            );
                            return (
                                <li key={c.label} className="ct-method">
                                    {c.href ? (
                                        <a href={c.href} className="flex items-center gap-4 group hover:[&_span.block:last-child]:text-[#4eca8b] transition">
                                            {inner}
                                        </a>
                                    ) : (
                                        <div className="flex items-center gap-4">{inner}</div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>

                    <p className="ct-method mt-9 text-sm text-gray-500">
                        Looking for a quick answer? Check the{" "}
                        <Link href="/faq" className="text-[#4eca8b] hover:underline">
                            FAQ
                        </Link>{" "}
                        first.
                    </p>
                </aside>

                {/* ───────── Right: form ───────── */}
                <section className="lg:col-span-3">
                    <div className="ct-form rounded-3xl border border-[#0d3330] bg-[#071f1e] p-6 sm:p-9">
                        {sent ? (
                            <div className="py-10 text-center">
                                <div className="ct-ok-ring mx-auto w-20 h-20 rounded-full bg-[#4eca8b]/15 border border-[#4eca8b]/40 flex items-center justify-center text-[#4eca8b]">
                                    {Icon.check}
                                </div>
                                <h2 className="ct-ok-text mt-6 text-2xl font-bold">Message sent</h2>
                                <p className="ct-ok-text mt-2 text-gray-400 text-[15px] max-w-sm mx-auto">
                                    Thanks, {name.split(" ")[0] || "friend"}. We will reply to{" "}
                                    <span className="text-gray-200">{email}</span> within one working day.
                                </p>
                                <div className="ct-ok-text mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                                    <button
                                        onClick={resetForm}
                                        className="px-6 py-2.5 rounded-xl border border-[#0d3330] text-gray-200 text-sm hover:border-[#4eca8b] transition"
                                    >
                                        Send another message
                                    </button>
                                    <Link
                                        href="/"
                                        className="px-6 py-2.5 rounded-xl bg-[#4eca8b] text-[#051817] text-sm font-semibold hover:bg-[#3db87a] transition"
                                    >
                                        Back to home
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6" noValidate={false}>
                                <div>
                                    <h2 className="text-xl font-semibold">Send us a message</h2>
                                    <p className="text-sm text-gray-500 mt-1">All fields are required.</p>
                                </div>

                                {/* Topic chips */}
                                <fieldset>
                                    <legend className="text-sm text-gray-300 mb-2.5">What is this about?</legend>
                                    <div className="flex flex-wrap gap-2">
                                        {TOPICS.map((t) => {
                                            const active = t === topic;
                                            return (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    onClick={() => setTopic(t)}
                                                    aria-pressed={active}
                                                    className={`px-4 py-2 rounded-full border text-sm transition ${
                                                        active
                                                            ? "bg-[#4eca8b] border-[#4eca8b] text-[#051817] font-semibold"
                                                            : "border-[#0d3330] text-gray-300 hover:border-[#4eca8b]/60"
                                                    }`}
                                                >
                                                    {t}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </fieldset>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="ct-name" className="block text-sm text-gray-300 mb-1.5">
                                            Your name
                                        </label>
                                        <input
                                            id="ct-name"
                                            type="text"
                                            required
                                            autoComplete="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Full name"
                                            className={inputCls}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="ct-email" className="block text-sm text-gray-300 mb-1.5">
                                            Email
                                        </label>
                                        <input
                                            id="ct-email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className={inputCls}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="ct-message" className="block text-sm text-gray-300 mb-1.5">
                                        Message
                                    </label>
                                    <textarea
                                        id="ct-message"
                                        rows={6}
                                        required
                                        minLength={10}
                                        maxLength={1000}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Tell us what you need help with. Include the event name if it is about a specific event."
                                        className={`${inputCls} resize-none`}
                                    />
                                    <p className="text-gray-600 text-xs text-right mt-1">{message.length}/1000</p>
                                </div>

                                {/* Honeypot: hidden from people, bots fill it */}
                                <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
                                    <label htmlFor="ct-website">Website</label>
                                    <input
                                        id="ct-website"
                                        type="text"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        value={trap}
                                        onChange={(e) => setTrap(e.target.value)}
                                    />
                                </div>

                                {error && (
                                    <p
                                        role="alert"
                                        className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-xl px-4 py-3"
                                    >
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full py-3 rounded-xl bg-[#4eca8b] text-[#051817] font-semibold hover:bg-[#3db87a] transition disabled:opacity-60 text-sm"
                                >
                                    {sending ? "Sending…" : "Send message"}
                                </button>
                            </form>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}