
'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import './navbar.css'
import { LucideIcon, ShieldLock, UserRoundPlusIcon, CodeXml, MonitorPause, Toolbox, Cog } from 'lucide-react'
type DropItem = {
    title: string
    desc: string
    href: string
    icon: LucideIcon
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
                icon: ShieldLock,
                image: '/nav/login.png',
                imageTitle: 'Welcome back',
                imageDesc: 'Log in and continue where you left off.',
            },
            {
                title: 'REGISTER',
                desc: 'Create a new account',
                href: '/singup',
                icon: UserRoundPlusIcon,
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
                title: 'Hackathon',
                desc: 'Contests and workshops',
                href: './coding.jpg',
                icon: CodeXml,
                image: 'https://i.pinimg.com/1200x/40/5b/91/405b9141b1639a6e78d0c7e1a89742df.jpg',
                imageTitle: 'Coding events',
                imageDesc: 'Compete, learn and build with other coders.',
            },
            {
                title: 'Bootcamp',
                desc: 'Watch sessions live',
                href: '/event/live-stream',
                icon: MonitorPause,
                image: 'https://i.pinimg.com/736x/51/29/07/5129075af0f53791c7563c8151d8d91a.jpg',
                imageTitle: 'Live streams',
                imageDesc: 'Join live sessions and ask questions in real time.',
            },
            {
                title: 'Workshops',
                desc: 'Workshops for freaher',
                href: '/event/workshop',
                icon: Toolbox,
                image: 'https://i.pinimg.com/1200x/1a/3e/1f/1a3e1fcedb692caaa90e5bae5f09f38c.jpg',
                imageTitle: 'Workshop',
                imageDesc: 'for freaher learning.',
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
                                    className={`flex items-center gap-1 font-mono text-xs uppercase tracking-widest transition-colors hover:text-indigo-400 ${openIndex === i ? 'text-indigo-400' : ''
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
                                        className={`flex items-center gap-4 rounded-lg p-4 transition-colors ${activeItem === idx ? 'bg-neutral-100' : ''
                                            }`}
                                    >
                                        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-neutral-200">
                                            <it.icon className="h-5 w-5" strokeWidth={1.75} />
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