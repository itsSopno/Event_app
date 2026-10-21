// "use client";

// // import "./navbar.css";
// import { useEffect, useRef, useState } from "react";
// import type { ReactNode } from "react";
// import Link from "next/link";
// import Image from "next/image";

// const BRAND = "DevVolunteer";

// type IconName = "bulb" | "calendar" | "heart" | "users" | "book" | "chat";
// type ArtName = "lines" | "grid" | "dots" | "rings" | "diag" | "blocks";

// type Item = {
//   id: string;
//   title: string;
//   desc: string;
//   href: string;
//   icon: IconName;
//   art: ArtName; // fallback artwork shown until you add the real photo
//   image: string; // put the photo in /public/images/nav/
//   previewTitle: string;
//   previewText: string;
// };

// const ITEMS: Item[] = [
//   {
//     id: "why",
//     title: "Why",
//     desc: `The story behind ${BRAND}`,
//     href: "/#about",
//     icon: "bulb",
//     art: "lines",
//     image: "/images/nav/why.jpg",
//     previewTitle: "Why we run community events",
//     previewText: "How a few developers started organizing events, and why skilled volunteers make them work.",
//   },
//   {
//     id: "events",
//     title: "Events",
//     desc: "Browse upcoming events",
//     href: "/events",
//     icon: "calendar",
//     art: "grid",
//     image: "/images/nav/events.jpg",
//     previewTitle: "Find your next event",
//     previewText: "Hackathons, workshops and meetups that are open for volunteers right now.",
//   },
//   {
//     id: "roles",
//     title: "Roles",
//     desc: "Mentor, judge, helper and more",
//     href: "/#roles",
//     icon: "heart",
//     art: "dots",
//     image: "/images/nav/roles.jpg",
//     previewTitle: "Pick a role that fits you",
//     previewText: "See which skills each event needs, from mentoring and judging to photography.",
//   },
//   {
//     id: "host",
//     title: "Organizers",
//     desc: "Host and manage your events",
//     href: "/register?role=organizer",
//     icon: "users",
//     art: "rings",
//     image: "/images/nav/host.jpg",
//     previewTitle: "Run your own event",
//     previewText: "Publish an event, set volunteer slots and track every registration in one place.",
//   },
//   {
//     id: "guide",
//     title: "Guide",
//     desc: "How volunteering works",
//     href: "/#how-it-works",
//     icon: "book",
//     art: "diag",
//     image: "/images/nav/guide.jpg",
//     previewTitle: "Volunteer in three steps",
//     previewText: "Find an event, register with your skill, then show up and help.",
//   },
//   {
//     id: "community",
//     title: "Community",
//     desc: "Meet the people behind it",
//     href: "/#community",
//     icon: "chat",
//     art: "blocks",
//     image: "/images/nav/community.jpg",
//     previewTitle: "Meet the community",
//     previewText: "Developers, students and mentors who give their time to make events happen.",
//   },
// ];

// const ICONS: Record<IconName, ReactNode> = {
//   bulb: (
//     <>
//       <path d="M9 18h6M10 22h4" />
//       <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2Z" />
//     </>
//   ),
//   calendar: (
//     <>
//       <rect x="3" y="5" width="18" height="16" rx="2" />
//       <path d="M16 3v4M8 3v4M3 11h18" />
//     </>
//   ),
//   heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8Z" />,
//   users: (
//     <>
//       <circle cx="9" cy="7" r="4" />
//       <path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2M16 3.1a4 4 0 0 1 0 7.8M22 21v-2a4 4 0 0 0-3-3.9" />
//     </>
//   ),
//   book: <path d="M4 19.5V5.5A2.5 2.5 0 0 1 6.5 3H20v14H6.5A2.5 2.5 0 0 0 4 19.5Zm0 0A2.5 2.5 0 0 0 6.5 22H20v-5" />,
//   chat: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />,
// };

// function Icon({ name }: { name: IconName }) {
//   return (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
//       {ICONS[name]}
//     </svg>
//   );
// }

// function Chevron() {
//   return (
//     <svg className="nav__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
//       <path d="m6 9 6 6 6-6" />
//     </svg>
//   );
// }

// export default function Navbar() {
//   const ref = useRef<HTMLElement>(null);
//   const [open, setOpen] = useState(false); // desktop dropdown
//   const [active, setActive] = useState(0);
//   const [mobile, setMobile] = useState(false);
//   const [mobileExplore, setMobileExplore] = useState(false);
//   const [failed, setFailed] = useState<Record<string, boolean>>({});

//   const current = ITEMS[active];

//   function closeAll() {
//     setOpen(false);
//     setMobile(false);
//   }

//   function openDropdown() {
//     setActive(0);
//     setOpen(true);
//   }

//   useEffect(() => {
//     function onDown(e: PointerEvent) {
//       if (ref.current && !ref.current.contains(e.target as Node)) closeAll();
//     }
//     function onKey(e: KeyboardEvent) {
//       if (e.key === "Escape") closeAll();
//     }
//     document.addEventListener("pointerdown", onDown);
//     document.addEventListener("keydown", onKey);
//     return () => {
//       document.removeEventListener("pointerdown", onDown);
//       document.removeEventListener("keydown", onKey);
//     };
//   }, []);

//   return (
//     <header ref={ref} className="nav">
//       <div className="nav__inner">
//         <Link href="/" className="nav__brand" onClick={closeAll}>
//           {BRAND}
//         </Link>

//         {/* Desktop links */}
//         <ul className="nav__links">
//           <li>
//             <Link href="/events" className="nav__link" onClick={closeAll}>
//               Events
//             </Link>
//           </li>

//           <li
//             onPointerEnter={(e) => {
//               if (e.pointerType === "mouse" && !open) openDropdown();
//             }}
//             onPointerLeave={(e) => {
//               if (e.pointerType === "mouse") setOpen(false);
//             }}
//           >
//             <button
//               type="button"
//               className="nav__link"
//               aria-haspopup="true"
//               aria-expanded={open}
//               aria-controls="nav-explore"
//               onClick={() => (open ? setOpen(false) : openDropdown())}
//             >
//               Explore <Chevron />
//             </button>

//             <div id="nav-explore" className="nav__panel" data-open={open}>
//               <ul className="nav__list">
//                 {ITEMS.map((it, i) => (
//                   <li key={it.id}>
//                     <Link
//                       href={it.href}
//                       className="nav__item"
//                       data-active={i === active}
//                       onPointerEnter={() => setActive(i)}
//                       onFocus={() => setActive(i)}
//                       onClick={closeAll}
//                       tabIndex={open ? 0 : -1}
//                     >
//                       <span className="nav__item-icon">
//                         <Icon name={it.icon} />
//                       </span>
//                       <span>
//                         <span className="nav__item-title">{it.title}</span>
//                         <span className="nav__item-desc">{it.desc}</span>
//                       </span>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>

//               <div className="nav__preview" aria-live="polite">
//                 <div className="nav__shot">
//                   {ITEMS.map((it, i) => (
//                     <div key={it.id} className="nav__shot-item" data-active={i === active}>
//                       {failed[it.id] ? (
//                         <div className={`nav__art nav__art--${it.art}`} />
//                       ) : (
//                         <Image
//                           src={it.image}
//                           alt=""
//                           fill
//                           sizes="340px"
//                           className="nav__img"
//                           onError={() => setFailed((f) => ({ ...f, [it.id]: true }))}
//                         />
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 <p className="nav__preview-title">{current.previewTitle}</p>
//                 <p className="nav__preview-text">{current.previewText}</p>
//               </div>
//             </div>
//           </li>

//           <li>
//             <Link href="/#contact" className="nav__link" onClick={closeAll}>
//               Contact
//             </Link>
//           </li>
//         </ul>

//         {/* Desktop actions */}
//         <div className="nav__actions">
//           <Link href="/login" className="nav__btn nav__btn--ghost">
//             Log in
//           </Link>
//           <Link href="/register" className="nav__btn nav__btn--solid">
//             Get started
//           </Link>
//         </div>

//         {/* Mobile toggle */}
//         <button
//           type="button"
//           className="nav__burger"
//           aria-label={mobile ? "Close menu" : "Open menu"}
//           aria-expanded={mobile}
//           aria-controls="nav-mobile"
//           onClick={() => setMobile((m) => !m)}
//         >
//           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
//             {mobile ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
//           </svg>
//         </button>
//       </div>

//       {/* Mobile menu */}
//       <div id="nav-mobile" className="nav__mobile" data-open={mobile}>
//         <Link href="/events" className="nav__m-link" onClick={closeAll}>
//           Events
//         </Link>

//         <button
//           type="button"
//           className="nav__m-link"
//           aria-expanded={mobileExplore}
//           onClick={() => setMobileExplore((v) => !v)}
//         >
//           Explore <Chevron />
//         </button>
//         {mobileExplore && (
//           <ul className="nav__m-sub">
//             {ITEMS.map((it) => (
//               <li key={it.id}>
//                 <Link href={it.href} className="nav__m-item" onClick={closeAll}>
//                   <span className="nav__item-icon">
//                     <Icon name={it.icon} />
//                   </span>
//                   <span>
//                     <span className="nav__item-title">{it.title}</span>
//                     <span className="nav__item-desc">{it.desc}</span>
//                   </span>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         )}

//         <Link href="/#contact" className="nav__m-link" onClick={closeAll}>
//           Contact
//         </Link>

//         <div className="nav__m-actions">
//           <Link href="/login" className="nav__btn nav__btn--ghost" onClick={closeAll}>
//             Log in
//           </Link>
//           <Link href="/register" className="nav__btn nav__btn--solid" onClick={closeAll}>
//             Get started
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// }
'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import './navbar.css'
type DropItem = {
    title: string
    desc: string
    href: string
    icon: string
    image: string // /public folder er vitore image rakho
    imageTitle: string
    imageDesc: string
}

type NavItem = {
    label: string
    href?: string
    items?: DropItem[]
}

const NAV: NavItem[] = [
    { label: 'About', href: '/about' },
    {
        label: 'Auth',
        items: [
            {
                title: 'LOGIN',
                desc: 'Sign in to your account',
                href: '/login',
                icon: '🔑',
                image: '/nav/login.png',
                imageTitle: 'Welcome back',
                imageDesc: 'Log in and continue where you left off.',
            },
            {
                title: 'REGISTER',
                desc: 'Create a new account',
                href: '/register',
                icon: '✨',
                image: '/nav/register.png',
                imageTitle: 'Join the community',
                imageDesc: 'Create your account in less than a minute.',
            },
        ],
    },
    {
        label: 'Event',
        items: [
            {
                title: 'CODING',
                desc: 'Contests and workshops',
                href: './coding.jpg',
                icon: '</>',
                image: './coding.jpg',
                imageTitle: 'Coding events',
                imageDesc: 'Compete, learn and build with other coders.',
            },
            {
                title: 'LIVE_STREAM',
                desc: 'Watch sessions live',
                href: '/event/live-stream',
                icon: '📡',
                image: '/nav/live.png',
                imageTitle: 'Live streams',
                imageDesc: 'Join live sessions and ask questions in real time.',
            },
            {
                title: 'GAMING',
                desc: 'Play with the community',
                href: '/event/gaming',
                icon: '🎮',
                image: '/nav/gaming.png',
                imageTitle: 'Gaming nights',
                imageDesc: 'Tournaments and casual matches every week.',
            },
        ],
    },
]

export default function Navbar() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)
    const [activeItem, setActiveItem] = useState<number>(0)
    const [mobileOpen, setMobileOpen] = useState(false)
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const open = (i: number) => {
        if (closeTimer.current) clearTimeout(closeTimer.current)
        setOpenIndex(i)
        setActiveItem(0)
    }
    const scheduleClose = () => {
        closeTimer.current = setTimeout(() => setOpenIndex(null), 120)
    }

    return (
        <header className="sticky top-0 z-50 w-full text-white bg-[#051817] bg-[image:radial-gradient(ellipse_at_75%_30%,#0a2a28_0%,transparent_60%)]">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                {/* Brand name (logo er jaigay) */}
                <Link href="/" className="text-xl font-bold tracking-tight">
                    Sinners_Coding
                </Link>

                {/* Desktop menu */}
                <ul className="hidden items-center gap-8 lg:flex">
                    {NAV.map((n, i) => (
                        <li
                            key={n.label}
                            className="relative"
                            onMouseEnter={() => (n.items ? open(i) : setOpenIndex(null))}
                            onMouseLeave={scheduleClose}
                        >
                            {n.items ? (
                                <button
                                    className={`flex items-center gap-1 font-mono text-xs uppercase tracking-widest transition-colors hover:text-indigo-400 ${
                                        openIndex === i ? 'text-indigo-400' : ''
                                    }`}
                                >
                                    {n.label}
                                    <svg
                                        className={`h-3 w-3 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="m6 9 6 6 6-6" />
                                    </svg>
                                </button>
                            ) : (
                                <Link
                                    href={n.href!}
                                    className="font-mono text-xs uppercase tracking-widest transition-colors hover:text-indigo-400"
                                >
                                    {n.label}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Right side: Search + buttons (blue mark kora stats nai) */}
                <div className="hidden items-center gap-3 lg:flex">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-44 rounded-md border border-white/20 bg-transparent px-3 py-1.5 text-sm outline-none placeholder:text-white/40 focus:border-indigo-400"
                    />
                    <Link
                        href="/login"
                        className="rounded-md border border-white/30 px-4 py-1.5 font-mono text-xs uppercase tracking-widest hover:bg-white/10"
                    >
                        Log in
                    </Link>
                    <Link
                        href="/register"
                        className="rounded-md bg-white px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-black hover:bg-white/80"
                    >
                        Get started
                    </Link>
                </div>

                {/* Mobile toggle */}
                <button
                    aria-label="Menu"
                    className="lg:hidden"
                    onClick={() => setMobileOpen((v) => !v)}
                >
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </nav>

            {/* Desktop mega dropdown */}
            {openIndex !== null && NAV[openIndex].items && (
                <div
                    className="absolute left-0 right-0 top-full hidden justify-center px-6 lg:flex"
                    onMouseEnter={() => closeTimer.current && clearTimeout(closeTimer.current)}
                    onMouseLeave={scheduleClose}
                >
                    <div className="mt-1 grid w-full max-w-4xl grid-cols-[1fr_1.1fr] overflow-hidden rounded-xl bg-white text-black shadow-2xl">
                        {/* Left: list */}
                        <ul className="p-3">
                            {NAV[openIndex].items!.map((it, idx) => (
                                <li key={it.title}>
                                    <Link
                                        href={it.href}
                                        onMouseEnter={() => setActiveItem(idx)}
                                        className={`flex items-center gap-4 rounded-lg p-4 transition-colors ${
                                            activeItem === idx ? 'bg-neutral-100' : ''
                                        }`}
                                    >
                                        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-neutral-200 text-sm">
                                            {it.icon}
                                        </span>
                                        <span>
                                            <span className="block font-mono text-xs font-semibold tracking-widest">
                                                {it.title}
                                            </span>
                                            <span className="block text-sm text-neutral-500">{it.desc}</span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Right: hover korle image change hobe */}
                        <div className="border-l border-neutral-200 bg-neutral-50 p-4">
                            {NAV[openIndex].items!.map((it, idx) => (
                                <div
                                    key={it.image}
                                    className={activeItem === idx ? 'block' : 'hidden'}
                                >
                                    <div className="aspect-video overflow-hidden rounded-lg bg-black">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={it.image}
                                            alt={it.imageTitle}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <h4 className="mt-3 text-sm font-semibold">{it.imageTitle}</h4>
                                    <p className="text-xs text-neutral-500">{it.imageDesc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="border-t border-white/10 px-6 pb-4 lg:hidden">
                    <ul className="space-y-1 py-3">
                        {NAV.map((n) => (
                            <li key={n.label}>
                                {n.items ? (
                                    <details>
                                        <summary className="cursor-pointer py-2 font-mono text-xs uppercase tracking-widest">
                                            {n.label}
                                        </summary>
                                        <ul className="ml-4 space-y-1 border-l border-white/10 pl-3">
                                            {n.items.map((it) => (
                                                <li key={it.title}>
                                                    <Link href={it.href} className="block py-1.5 text-sm text-white/70">
                                                        {it.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
                                ) : (
                                    <Link
                                        href={n.href!}
                                        className="block py-2 font-mono text-xs uppercase tracking-widest"
                                    >
                                        {n.label}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className="flex gap-3">
                        <Link href="/login" className="flex-1 rounded-md border border-white/30 py-2 text-center text-xs uppercase">
                            Log in
                        </Link>
                        <Link href="/register" className="flex-1 rounded-md bg-white py-2 text-center text-xs uppercase text-black">
                            Get started
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}