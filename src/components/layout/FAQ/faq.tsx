"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import GridLines from "@/components/shared/GridLines/GridLines";

type Category = "general" | "volunteers" | "organizers";

interface FaqItem {
    id: string;
    category: Category;
    q: string;
    a: string;
}

const CATEGORIES: { key: Category; label: string }[] = [
    { key: "general", label: "General" },
    { key: "volunteers", label: "For volunteers" },
    { key: "organizers", label: "For organizers" },
];

const FAQS: FaqItem[] = [
    // General
    {
        id: "g1",
        category: "general",
        q: "What is this platform?",
        a: "It connects people who want to help with the organizers who need them. Organizers post events, volunteers apply, and everyone can browse what is happening nearby.",
    },
    {
        id: "g2",
        category: "general",
        q: "Is it free to use?",
        a: "Yes. Creating an account, browsing events, applying and posting events are all free.",
    },
    {
        id: "g3",
        category: "general",
        q: "Do I need an account to browse events?",
        a: "No. Anyone can browse events and read details. You need an account to apply, save events or create your own.",
    },
    {
        id: "g4",
        category: "general",
        q: "How do I reset my password?",
        a: "Go to your profile, open Password and choose Change password. If you cannot log in, use Forgot password on the login page and we will email you a reset link.",
    },
    // Volunteers
    {
        id: "v1",
        category: "volunteers",
        q: "How do I apply to an event?",
        a: "Open an event, read the details and select Apply as volunteer. The organizer will review your profile and respond.",
    },
    {
        id: "v2",
        category: "volunteers",
        q: "Why does my profile matter?",
        a: "Organizers look at your bio, skills and interests before accepting you. A complete profile helps them see whether you are a good match.",
    },
    {
        id: "v3",
        category: "volunteers",
        q: "Can I cancel an application?",
        a: "Yes. Open My applications, pick the event and select Withdraw. Please do this as early as you can so the organizer can find someone else.",
    },
    {
        id: "v4",
        category: "volunteers",
        q: "How will I know if I was accepted?",
        a: "You will get a notification and the status on My applications will change from Pending to Accepted or Declined.",
    },
    // Organizers
    {
        id: "o1",
        category: "organizers",
        q: "How do I create an event?",
        a: "Switch to an organizer account, open your dashboard and select Create event. Add a title, date, location, a cover image and how many volunteers you need.",
    },
    {
        id: "o2",
        category: "organizers",
        q: "How do I choose volunteers?",
        a: "Open the event, go to Applicants and review each profile. Accept or decline with one click, and accepted volunteers are notified straight away.",
    },
    {
        id: "o3",
        category: "organizers",
        q: "Can I edit an event after publishing?",
        a: "Yes. You can update details at any time. Volunteers who already applied are notified when the date or location changes.",
    },
    {
        id: "o4",
        category: "organizers",
        q: "How do I close applications?",
        a: "Open the event and select Close applications. People can still view the event, but no one can apply.",
    },
];

/* Lime button with a dark arrow box, same as the About, Contact and Footer */
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
    "inline-flex h-12 items-center justify-between gap-10 bg-[#dfee3b] pl-4 pr-1 text-[#041414] transition hover:brightness-95";

export default function FaqPage() {
    const rootRef = useRef<HTMLElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const panels = useRef<Record<string, HTMLDivElement | null>>({});
    const icons = useRef<Record<string, HTMLSpanElement | null>>({});

    const [category, setCategory] = useState<Category>("general");
    const [openId, setOpenId] = useState<string | null>("g1");

    const items = FAQS.filter((f) => f.category === category);
    const activeLabel = CATEGORIES.find((c) => c.key === category)?.label;

    // Respect reduced motion: animations finish instantly
    const d = (seconds: number) =>
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? 0
            : seconds;

    // 1. Page load: one orchestrated entrance
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap
                .timeline({ defaults: { ease: "power3.out" } })
                .from(".faq-word", { yPercent: 115, duration: d(1), stagger: 0.07 })
                .from(".faq-fade", { opacity: 0, y: 20, duration: d(0.7), stagger: 0.12 }, "-=0.6")
                .from(".faq-cat", { opacity: 0, x: -16, duration: d(0.5), stagger: 0.08 }, "-=0.5");
        }, rootRef);
        return () => ctx.revert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 2. Category change: questions slide in one after another
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".faq-item",
                { opacity: 0, y: 24 },
                {
                    opacity: 1,
                    y: 0,
                    duration: d(0.6),
                    stagger: 0.08,
                    ease: "power3.out",
                    delay: 0.2,
                    clearProps: "transform",
                }
            );
        }, listRef);
        return () => ctx.revert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

    // 3. Accordion open / close
    useEffect(() => {
        items.forEach((item) => {
            const panel = panels.current[item.id];
            const icon = icons.current[item.id];
            const isOpen = item.id === openId;
            if (panel) {
                gsap.to(panel, {
                    height: isOpen ? "auto" : 0,
                    duration: d(isOpen ? 0.5 : 0.35),
                    ease: isOpen ? "power3.out" : "power2.inOut",
                });
                gsap.to(panel.firstElementChild, {
                    opacity: isOpen ? 1 : 0,
                    y: isOpen ? 0 : -8,
                    duration: d(0.4),
                    delay: isOpen ? 0.12 : 0,
                });
            }
            if (icon) {
                gsap.to(icon, {
                    rotate: isOpen ? 45 : 0,
                    duration: d(0.35),
                    ease: "power2.out",
                });
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openId, category]);

    const switchCategory = (key: Category) => {
        if (key === category) return;
        setOpenId(null);
        setCategory(key);
    };

    return (
        <main ref={rootRef} className="relative min-h-screen text-white">
             <GridLines/>
            <div className="relative mx-auto max-w-6xl px-4">
                {/* Vertical column lines */}
                {/* <div aria-hidden className="pointer-events-none absolute inset-y-0 left-4 right-4 hidden grid-cols-5 lg:grid">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className={`border-l border-white/[0.07] ${i === 4 ? "border-r" : ""}`} />
                    ))}
                </div> */}

                <div className="relative z-10">
                    {/* ───────── Hero ───────── */}
                    <div className="grid gap-8 pb-16 pt-16 md:pt-24 lg:grid-cols-5 lg:gap-0">
                        <p className="faq-fade text-lg font-medium lg:pl-4">
                            <span className="italic text-[#dfee3b]">//</span> FAQ
                        </p>

                        <div className="lg:col-span-4 lg:pr-4">
                            <h1 className="max-w-3xl text-5xl font-bold leading-[0.98] tracking-tighter md:text-7xl">
                                {["Questions,", "answered."].map((line) => (
                                    <span key={line} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
                                        <span className="mr-[0.25em] inline-block overflow-hidden align-bottom">
                                            <span className="faq-word inline-block">{line}</span>
                                        </span>
                                    </span>
                                ))}
                            </h1>

                            <div className="mt-8 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                                <p className="faq-fade max-w-md text-lg leading-snug text-white/70">
                                    Everything about joining events, applying as a volunteer and
                                    running your own.
                                </p>
                                <Link href="/contact" className={`faq-fade ${btnCls} self-start md:self-auto`}>
                                    <ArrowButtonInner>Contact us</ArrowButtonInner>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* ───────── Categories + accordion ───────── */}
                    <div className="grid gap-10 border-t border-white/10 pb-24 pt-14 lg:grid-cols-5 lg:gap-0">
                        {/* Category tabs */}
                        <nav
                            aria-label="FAQ categories"
                            className="flex flex-wrap gap-2 self-start lg:sticky lg:top-24 lg:flex-col lg:pl-4 lg:pr-6"
                        >
                            {CATEGORIES.map((c) => {
                                const active = c.key === category;
                                const count = FAQS.filter((f) => f.category === c.key).length;
                                return (
                                    <button
                                        key={c.key}
                                        onClick={() => switchCategory(c.key)}
                                        aria-pressed={active}
                                        className={`faq-cat flex items-center justify-between gap-4 border px-4 py-2.5 text-left text-sm transition ${
                                            active
                                                ? "border-[#dfee3b] bg-[#dfee3b] font-medium text-[#041414]"
                                                : "border-white/20 text-white/80 hover:border-white"
                                        }`}
                                    >
                                        <span>{c.label}</span>
                                        <span
                                            className={`flex h-5 min-w-5 items-center justify-center px-1 text-xs ${
                                                active ? "bg-[#041414] text-[#dfee3b]" : "bg-white/10 text-white/60"
                                            }`}
                                        >
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Accordion */}
                        <section className="lg:col-span-4 lg:pr-4">
                            <p className="mb-6 text-lg font-medium">
                                <span className="italic text-[#dfee3b]">//</span> {activeLabel}
                            </p>

                            <div ref={listRef} className="border-t border-white/10">
                                {items.map((item) => {
                                    const isOpen = item.id === openId;
                                    return (
                                        <div
                                            key={item.id}
                                            className={`faq-item border-b border-l-4 border-b-white/10 transition-colors duration-300 ${
                                                isOpen
                                                    ? "border-l-[#dfee3b] bg-[#dfee3b]/10"
                                                    : "border-l-transparent"
                                            }`}
                                        >
                                            <h2>
                                                <button
                                                    onClick={() => setOpenId(isOpen ? null : item.id)}
                                                    aria-expanded={isOpen}
                                                    aria-controls={`panel-${item.id}`}
                                                    id={`trigger-${item.id}`}
                                                    className="group flex w-full items-center justify-between gap-6 px-4 py-6 text-left sm:px-6"
                                                >
                                                    <span className="text-xl font-semibold tracking-tight text-white sm:text-2xl md:text-3xl">
                                                        {item.q}
                                                    </span>
                                                    <span
                                                        ref={(el) => {
                                                            icons.current[item.id] = el;
                                                        }}
                                                        aria-hidden
                                                        className={`flex h-10 w-10 shrink-0 items-center justify-center border text-2xl font-light leading-none transition-colors duration-300 ${
                                                            isOpen
                                                                ? "border-[#dfee3b] bg-[#dfee3b] text-[#041414]"
                                                                : "border-white/25 text-white group-hover:border-[#dfee3b] group-hover:bg-[#dfee3b] group-hover:text-[#041414]"
                                                        }`}
                                                    >
                                                        +
                                                    </span>
                                                </button>
                                            </h2>

                                            <div
                                                id={`panel-${item.id}`}
                                                role="region"
                                                aria-labelledby={`trigger-${item.id}`}
                                                ref={(el) => {
                                                    panels.current[item.id] = el;
                                                }}
                                                className="h-0 overflow-hidden"
                                            >
                                                <p className="max-w-2xl px-4 pb-7 pr-16 text-[17px] leading-relaxed text-white/75 sm:px-6 sm:pr-20">
                                                    {item.a}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <p className="mt-10 text-[15px] text-white/60">
                                Still stuck?{" "}
                                <Link
                                    href="/contact"
                                    className="font-medium text-white underline decoration-[#dfee3b] decoration-2 underline-offset-4"
                                >
                                    Send us a message
                                </Link>{" "}
                                and we will reply by email.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}