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

export default function FaqPage() {
    const rootRef = useRef<HTMLElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const panels = useRef<Record<string, HTMLDivElement | null>>({});
    const icons = useRef<Record<string, HTMLSpanElement | null>>({});

    const [category, setCategory] = useState<Category>("general");
    const [openId, setOpenId] = useState<string | null>("g1");

    const items = FAQS.filter((f) => f.category === category);

    // Respect reduced motion: animations finish instantly
    const d = (seconds: number) =>
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? 0
            : seconds;

    // 1. Page load: one orchestrated entrance
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            tl.from(".faq-title-line", {
                yPercent: 110,
                duration: d(0.9),
                stagger: 0.12,
            })
                .from(".faq-intro", { opacity: 0, y: 16, duration: d(0.6) }, "-=0.5")
                .from(
                    ".faq-cat",
                    { opacity: 0, x: -16, duration: d(0.5), stagger: 0.08 },
                    "-=0.4"
                )
                .from(".faq-help", { opacity: 0, y: 16, duration: d(0.6) }, "-=0.3");
        }, rootRef);
        return () => ctx.revert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 2. Category change: questions slide in one after another
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".faq-item",
                { opacity: 0, y: 18 },
                {
                    opacity: 1,
                    y: 0,
                    duration: d(0.5),
                    stagger: 0.07,
                    ease: "power2.out",
                    delay: 0.15,
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
                    duration: d(isOpen ? 0.45 : 0.3),
                    ease: isOpen ? "power2.out" : "power2.inOut",
                });
                gsap.to(panel.firstElementChild, {
                    opacity: isOpen ? 1 : 0,
                    y: isOpen ? 0 : -6,
                    duration: d(0.35),
                    delay: isOpen ? 0.1 : 0,
                });
            }
            if (icon) {
                gsap.to(icon, {
                    rotate: isOpen ? 45 : 0,
                    duration: d(0.3),
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
        <main
            ref={rootRef}
            className="relative min-h-screen bg-[#051817] bg-[image:radial-gradient(ellipse_at_80%_0%,#0a2a28_0%,transparent_60%)] text-white"
        >
            <GridLines />

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
                {/* ───────── Left: intro + categories ───────── */}
                <aside className="lg:col-span-2 lg:sticky lg:top-24 self-start">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
                        <span className="block overflow-hidden pb-1">
                            <span className="faq-title-line block">Questions,</span>
                        </span>
                        <span className="block overflow-hidden pb-1">
                            <span className="faq-title-line block text-[#4eca8b]">answered.</span>
                        </span>
                    </h1>

                    <p className="faq-intro mt-5 text-gray-400 text-[15px] leading-relaxed max-w-sm">
                        Everything about joining events, applying as a volunteer and running your own.
                    </p>

                    <nav aria-label="FAQ categories" className="mt-8 flex lg:flex-col gap-2 flex-wrap">
                        {CATEGORIES.map((c) => {
                            const active = c.key === category;
                            const count = FAQS.filter((f) => f.category === c.key).length;
                            return (
                                <button
                                    key={c.key}
                                    onClick={() => switchCategory(c.key)}
                                    aria-pressed={active}
                                    className={`faq-cat flex items-center justify-between gap-6 px-4 py-2.5 rounded-xl border text-sm transition ${
                                        active
                                            ? "bg-[#4eca8b] border-[#4eca8b] text-[#051817] font-semibold"
                                            : "border-[#0d3330] text-gray-300 hover:border-[#4eca8b]/60"
                                    }`}
                                >
                                    <span>{c.label}</span>
                                    <span className={active ? "text-[#051817]/70" : "text-gray-500"}>{count}</span>
                                </button>
                            );
                        })}
                    </nav>

                    <div className="faq-help mt-10 rounded-2xl border border-[#0d3330] bg-[#071f1e] p-5">
                        <p className="font-semibold text-sm">Can&apos;t find your answer?</p>
                        <p className="text-gray-400 text-sm mt-1">Send us a message and we will reply by email.</p>
                        <Link
                            href="/contact"
                            className="inline-block mt-4 px-5 py-2 rounded-xl bg-[#4eca8b] text-[#051817] text-sm font-semibold hover:bg-[#3db87a] transition"
                        >
                            Contact us
                        </Link>
                    </div>
                </aside>

                {/* ───────── Right: accordion ───────── */}
                <section className="lg:col-span-3">
                    <div ref={listRef} className="border-t border-[#0d3330]">
                        {items.map((item) => {
                            const isOpen = item.id === openId;
                            return (
                                <div
                                    key={item.id}
                                    className={`faq-item border-b border-[#0d3330] transition-colors ${
                                        isOpen ? "bg-[#071f1e]/70" : ""
                                    }`}
                                >
                                    <h2>
                                        <button
                                            onClick={() => setOpenId(isOpen ? null : item.id)}
                                            aria-expanded={isOpen}
                                            aria-controls={`panel-${item.id}`}
                                            id={`trigger-${item.id}`}
                                            className="w-full flex items-center justify-between gap-6 text-left px-3 sm:px-5 py-5 group"
                                        >
                                            <span
                                                className={`text-base sm:text-lg font-medium transition-colors ${
                                                    isOpen ? "text-[#4eca8b]" : "text-white group-hover:text-[#4eca8b]"
                                                }`}
                                            >
                                                {item.q}
                                            </span>
                                            <span
                                                ref={(el) => {
                                                    icons.current[item.id] = el;
                                                }}
                                                aria-hidden
                                                className="shrink-0 w-8 h-8 rounded-full border border-[#0d3330] flex items-center justify-center text-[#4eca8b] text-xl leading-none"
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
                                        <p className="px-3 sm:px-5 pb-6 pr-12 sm:pr-16 text-gray-400 text-[15px] leading-relaxed max-w-prose">
                                            {item.a}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </main>
    );
}