"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import GridLines from "@/components/shared/GridLines/GridLines";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const TOPICS = [
    "General question",
    "Volunteering",
    "Organizing an event",
    "Report a problem",
];

const inputCls =
    "w-full bg-white/5 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#dfee3b] focus:ring-1 focus:ring-[#dfee3b]/60 transition";

const Icon = {
    mail: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
        </svg>
    ),
    phone: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
        </svg>
    ),
    pin: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
            <circle cx="12" cy="10" r="2.5" />
        </svg>
    ),
    clock: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </svg>
    ),
    check: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
    ),
};

// Replace these with your real contact details
const EMAIL = "hello@yourdomain.com";
const CONTACTS = [
    { icon: Icon.mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
    { icon: Icon.phone, label: "Phone", value: "+880 1xxx xxxxxx", href: "tel:+8801000000000" },
    { icon: Icon.pin, label: "Office", value: "Dhaka, Bangladesh" },
    { icon: Icon.clock, label: "Hours", value: "Sun–Thu, 10am–6pm (GMT+6)" },
];

/* Lime button with a dark arrow box, same as the About section */
function ArrowButtonInner({ children }: { children: React.ReactNode }) {
    return (
        <>
            <span className="text-[15px] font-medium">{children}</span>
            <span className="flex h-10 w-10 items-center justify-center bg-[#041414] text-[#dfee3b]">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
            </span>
        </>
    );
}

const btnCls =
    "inline-flex h-12 items-center justify-between gap-10 bg-[#dfee3b] pl-4 pr-1 text-[#041414] transition hover:brightness-95 disabled:opacity-60";

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

    // Entrance: hero on load, the rest as it scrolls into view
    useEffect(() => {
        if (reduce()) return;
        const ctx = gsap.context(() => {
            gsap
                .timeline({ defaults: { ease: "power3.out" } })
                .from(".ct-word", { yPercent: 115, duration: 1, stagger: 0.07 })
                .from(".ct-fade", { opacity: 0, y: 20, duration: 0.7, stagger: 0.12 }, "-=0.6");

            gsap.from(".ct-method", {
                opacity: 0,
                y: 28,
                duration: 0.7,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: { trigger: ".ct-methods", start: "top 85%", once: true },
            });

            gsap.from(".ct-form", {
                opacity: 0,
                y: 36,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: { trigger: ".ct-form", start: "top 88%", once: true },
            });
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
                .from(".ct-ok-ring", { scale: 0, rotate: -45, duration: d(0.6), ease: "back.out(1.8)" })
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
        <main ref={rootRef} className="relative min-h-screen text-white">
            <GridLines/>
            <div className="relative mx-auto max-w-6xl px-4">
                {/* Vertical column lines */}

                <div className="relative z-10">
                    {/* ───────── Hero ───────── */}
                    <div className="grid gap-8 pb-16 pt-16 md:pt-24 lg:grid-cols-5 lg:gap-0">
                        <p className="ct-fade text-lg font-medium lg:pl-4">
                            <span className="italic text-[#dfee3b]">//</span> Contact
                        </p>

                        <div className="lg:col-span-4 lg:pr-4">
                            <h1 className="max-w-3xl text-5xl font-bold leading-[0.98] tracking-tighter md:text-7xl">
                                {["Talk to us.", "We read everything."].map((line) => (
                                    <span key={line} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
                                        {line.split(" ").map((w, i) => (
                                            <span key={i} className="mr-[0.25em] inline-block overflow-hidden align-bottom">
                                                <span className="ct-word inline-block">{w}</span>
                                            </span>
                                        ))}
                                    </span>
                                ))}
                            </h1>

                            <div className="mt-8 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                                <p className="ct-fade max-w-md text-lg leading-snug text-white/70">
                                    Questions about an event, trouble with your account or an idea for
                                    the platform. A real person will reply, usually within one working day.
                                </p>
                                <a href={`mailto:${EMAIL}`} className={`ct-fade ${btnCls} self-start md:self-auto`}>
                                    <ArrowButtonInner>Email us</ArrowButtonInner>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ───────── 01: Reach us ───────── */}
                    <div className="grid gap-8 border-t border-white/10 py-14 lg:grid-cols-5 lg:gap-0">
                        <p className="text-lg font-medium lg:pl-4">
                            <span className="italic text-[#dfee3b]">//</span> 01
                        </p>

                        <div className="lg:col-span-4 lg:pr-4">
                            <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">Reach us directly</h2>

                            <ul className="ct-methods mt-10 grid gap-8 sm:grid-cols-2">
                                {CONTACTS.map((c) => {
                                    const inner = (
                                        <>
                                            <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#dfee3b] text-[#041414]">
                                                {c.icon}
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block text-sm text-white/55">{c.label}</span>
                                                <span className="block break-words text-xl font-semibold tracking-tight text-white">
                                                    {c.value}
                                                </span>
                                            </span>
                                        </>
                                    );
                                    return (
                                        <li key={c.label} className="ct-method">
                                            {c.href ? (
                                                <a
                                                    href={c.href}
                                                    className="flex items-center gap-4 underline decoration-transparent decoration-2 underline-offset-4 transition hover:decoration-[#dfee3b]"
                                                >
                                                    {inner}
                                                </a>
                                            ) : (
                                                <div className="flex items-center gap-4">{inner}</div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>

                            <p className="mt-10 text-[15px] text-white/60">
                                Looking for a quick answer? Check the{" "}
                                <Link
                                    href="/faq"
                                    className="font-medium text-white underline decoration-[#dfee3b] decoration-2 underline-offset-4"
                                >
                                    FAQ
                                </Link>{" "}
                                first.
                            </p>
                        </div>
                    </div>

                    {/* ───────── 02: Form ───────── */}
                    <div className="grid gap-8 border-t border-white/10 pb-24 pt-14 lg:grid-cols-5 lg:gap-0">
                        <p className="text-lg font-medium lg:pl-4">
                            <span className="italic text-[#dfee3b]">//</span> 02
                        </p>

                        <div className="lg:col-span-4 lg:pr-4">
                            <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">Send a message</h2>

                            <div className="ct-form mt-10 max-w-2xl">
                                {sent ? (
                                    <div className="border border-white/15 bg-white/[0.04] p-8 sm:p-10">
                                        <div className="ct-ok-ring flex h-16 w-16 items-center justify-center bg-[#dfee3b] text-[#041414]">
                                            {Icon.check}
                                        </div>
                                        <h3 className="ct-ok-text mt-6 text-3xl font-bold tracking-tighter">Message sent</h3>
                                        <p className="ct-ok-text mt-2 max-w-md text-[15px] text-white/70">
                                            Thanks, {name.split(" ")[0] || "friend"}. We will reply to{" "}
                                            <span className="font-medium text-white">{email}</span> within one
                                            working day.
                                        </p>
                                        <div className="ct-ok-text mt-7 flex flex-col gap-3 sm:flex-row">
                                            <button
                                                onClick={resetForm}
                                                className="h-12 border border-white/25 px-5 text-[15px] font-medium text-white transition hover:border-[#dfee3b]"
                                            >
                                                Send another message
                                            </button>
                                            <Link href="/" className={btnCls}>
                                                <ArrowButtonInner>Back to home</ArrowButtonInner>
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-7">
                                        {/* Topic chips */}
                                        <fieldset>
                                            <legend className="mb-3 text-sm font-medium text-white">What is this about?</legend>
                                            <div className="flex flex-wrap gap-2">
                                                {TOPICS.map((t) => {
                                                    const active = t === topic;
                                                    return (
                                                        <button
                                                            key={t}
                                                            type="button"
                                                            onClick={() => setTopic(t)}
                                                            aria-pressed={active}
                                                            className={`border px-4 py-2 text-sm transition ${
                                                                active
                                                                    ? "border-[#dfee3b] bg-[#dfee3b] font-medium text-[#041414]"
                                                                    : "border-white/20 text-white/80 hover:border-white"
                                                            }`}
                                                        >
                                                            {t}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </fieldset>

                                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="ct-name" className="mb-1.5 block text-sm font-medium text-white">
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
                                                <label htmlFor="ct-email" className="mb-1.5 block text-sm font-medium text-white">
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
                                            <label htmlFor="ct-message" className="mb-1.5 block text-sm font-medium text-white">
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
                                            <p className="mt-1 text-right text-xs text-white/50">{message.length}/1000</p>
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
                                            <p role="alert" className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                                {error}
                                            </p>
                                        )}

                                        <button type="submit" disabled={sending} className={btnCls}>
                                            <ArrowButtonInner>{sending ? "Sending…" : "Send message"}</ArrowButtonInner>
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}