// 'use client'

// import Link from 'next/link'
// import GridLines from '../../../../components/shared/GridLines/GridLines'
// import { useAuth } from '@/context/AuthContext'
// const STATS = [
//     { id: '01', value: '83+', label: 'Events hosted', featured: true },
//     { id: '02', value: '88+', label: 'Active members' },
//     { id: '03', value: '70+', label: 'Live streams' },
// ]

// const FEATURES = [
//     {
//         id: '04',
//         title: 'Learn by building',
//         desc: 'From first line of code to full projects, we learn together through contests and workshops.',
//     },
//     {
//         id: '05',
//         title: 'Community first',
//         desc: 'Coders, streamers and gamers sharing ideas, helping each other and growing every week.',
//     },
// ]

// export default function About() {
//     const { user } = useAuth();
//     return (
//         <section id="about" className="relative overflow-hidden bg-[#051817] bg-[image:radial-gradient(ellipse_at_75%_30%,#0a2a28_0%,transparent_60%)] text-white">
//             <GridLines />
//             <div className="mx-auto max-w-7xl px-6">
//                 {/* Giant heading */}
//                 <h2 className="select-none bg-gradient-to-r from-[#2dd4bf] to-[#6c7686] bg-clip-text pt-10 text-center text-[24vw] font-black uppercase leading-[0.8] tracking-tighter text-transparent lg:text-[20rem]">
//                     About
//                 </h2>

//                 {/* Intro + image */}
//                 <div className="mt-16 grid items-start gap-10 lg:grid-cols-2">
//                     <div>
//                         <h3 className="text-3xl font-semibold uppercase leading-[1.05] tracking-tight md:text-5xl">
//                             A growing community of coders, streamers and gamers.
//                         </h3>
//                         <p className="mt-6 text-2xl font-semibold uppercase leading-[1.1] tracking-tight text-neutral-500 md:text-4xl">
//                             We host events, share knowledge and build things together, from
//                             contests to live sessions and game nights.
//                         </p>
//                         <p className="mt-10 font-serif text-5xl italic text-[#6c7686]">
//                             Sinners_Coding
//                         </p>
//                     </div>

//                     <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#2dd4bf] to-[#6c7686]">
//                         {/* eslint-disable-next-line @next/next/no-img-element */}
//                         <img
//                             src="https://i.pinimg.com/736x/19/f9/9e/19f99e101ac2a9453b4a8c7e3ad93bd8.jpg"
//                             alt="Sinners_Coding community"
//                             className="aspect-[4/5] w-full object-cover"
//                         />
//                     </div>
//                 </div>

//                 {/* Founder + quote */}
//                 <div className="mt-28 grid gap-10 lg:grid-cols-[1fr_2fr]">
//                     <div className="flex items-center gap-4 self-start">
//                         {/* eslint-disable-next-line @next/next/no-img-element */}
//                         <img
//                             src="/about/avatar.jpg"
//                             alt="Founder"
//                             className="h-14 w-14 rounded-full bg-neutral-800 object-cover"
//                         />
//                         <div>
//                             <p className="text-sm font-semibold uppercase">Your Name</p>
//                             <p className="text-xs uppercase text-neutral-400">Founder &amp; Developer</p>
//                         </div>
//                     </div>

//                     <div>
//                         <svg className="h-10 w-10 text-[#6c7686]" viewBox="0 0 24 24" fill="currentColor">
//                             <path d="M3 21c0-6 1-11 6-14l1.5 2C8 11 8 13 8 14h4v7H3Zm11 0c0-6 1-11 6-14l1.5 2C19 11 19 13 19 14h4v7h-9Z" />
//                         </svg>
//                         <p className="mt-4 text-3xl font-semibold uppercase leading-[1.05] tracking-tight md:text-5xl">
//                             I focus on building a space where people learn, compete and have fun.
//                             By mixing coding with community, we help every member grow from day one.
//                         </p>
//                     </div>
//                 </div>

//                 {/* Bento stats */}
//                 <div className="mt-20 grid gap-4 pb-24 lg:grid-cols-4">
//                     {STATS.map((s) => (
//                         <div
//                             key={s.id}
//                             className={`relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-2xl border border-white/5 p-8 ${s.featured
//                                 ? 'bg-gradient-to-br from-[#2dd4bf] to-[#6c7686] lg:col-span-2'
//                                 : 'bg-neutral-900'
//                                 }`}
//                         >
//                             <span className="font-mono text-sm">
//                                 <span className="text-[#6c7686]">/</span> {s.id}
//                             </span>
//                             <div>
//                                 <p className="text-7xl font-bold tracking-tighter">{s.value}</p>
//                                 <p
//                                     className={`mt-2 text-sm font-medium uppercase ${s.featured ? 'text-white/80' : 'text-neutral-400'
//                                         }`}
//                                 >
//                                     {s.label}
//                                 </p>
//                             </div>
//                         </div>
//                     ))}

//                     {FEATURES.map((f) => (
//                         <div
//                             key={f.id}
//                             className="flex min-h-[240px] flex-col justify-between rounded-2xl border border-white/5 bg-neutral-900 p-8 lg:col-span-2"
//                         >
//                             <span className="font-mono text-sm">
//                                 <span className="text-[#6c7686]">/</span> {f.id}
//                             </span>
//                             <div>
//                                 <h4 className="text-2xl font-semibold uppercase">{f.title}</h4>
//                                 <p className="mt-2 max-w-md text-sm uppercase leading-snug text-neutral-400">
//                                     {f.desc}
//                                 </p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="pb-24 text-center">
//                     {user ? (
//                         <Link
//                             href="/dashboard"
//                             className="rounded-md bg-white px-6 py-3 font-mono text-xs uppercase tracking-widest text-black hover:bg-white/80"
//                         >
//                             Go to dashboard
//                         </Link>
//                     ) : (
//                         <Link
//                             href="/singup"
//                             className="rounded-md bg-white px-6 py-3 font-mono text-xs uppercase tracking-widest text-black hover:bg-white/80"
//                         >
//                             Join the community
//                         </Link>
//                     )}
//                 </div>
//             </div>
//         </section>
//     )
// }
'use client'

import { useState } from 'react'
import Link from 'next/link'
import GridLines from '../../../../components/shared/GridLines/GridLines'
import { useAuth } from '@/context/AuthContext'

const STATS = [
    { value: '83+', label: 'Events hosted' },
    { value: '88+', label: 'Active members' },
    { value: '70+', label: 'Live streams' },
]

const PILLARS = [
    {
        id: '01',
        title: 'Learn by building',
        tags: ['Workshops', 'Contests', 'Projects'],
        desc: 'From your first line of code to full projects, we learn together through contests and hands-on workshops.',
        image: 'https://i.pinimg.com/736x/19/f9/9e/19f99e101ac2a9453b4a8c7e3ad93bd8.jpg',
    },
    {
        id: '02',
        title: 'Community first',
        tags: ['Coders', 'Streamers', 'Gamers'],
        desc: 'Coders, streamers and gamers sharing ideas, helping each other and growing every week.',
        image: 'https://i.pinimg.com/736x/19/f9/9e/19f99e101ac2a9453b4a8c7e3ad93bd8.jpg',
    },
    {
        id: '03',
        title: 'Live sessions',
        tags: ['Streams', 'Game nights', 'Q&A'],
        desc: 'Join live coding streams, game nights and open Q&A sessions. Watch, play and learn with everyone.',
        image: 'https://i.pinimg.com/736x/19/f9/9e/19f99e101ac2a9453b4a8c7e3ad93bd8.jpg',
    },
]

/* Arrow inside a dark square, used on the main buttons */
function ArrowBox() {
    return (
        <span className="flex h-full w-12 items-center justify-center bg-black text-[#dfee3b]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
        </span>
    )
}

/* Faint pinwheel shape behind the content */
function Pinwheel({ className = '' }: { className?: string }) {
    return (
        <svg aria-hidden viewBox="-120 -120 240 240" className={className}>
            {Array.from({ length: 8 }).map((_, i) => (
                <path
                    key={i}
                    transform={`rotate(${i * 45})`}
                    d="M0 0 C 18 -34, 52 -78, 104 -92 C 98 -52, 62 -14, 0 0Z"
                />
            ))}
        </svg>
    )
}

export default function About() {
    const { user } = useAuth()
    const [openId, setOpenId] = useState<string | null>('01')

    return (
        <section
            id="about"
            className="relative overflow-hidden bg-[#051817] bg-[image:radial-gradient(ellipse_at_75%_30%,#0a2a28_0%,transparent_60%)] text-white"
        >
            <GridLines />

            <Pinwheel className="pointer-events-none absolute -left-40 top-24 h-[640px] w-[640px] fill-white/[0.06]" />

            <div className="relative mx-auto max-w-6xl px-6">
                {/* ───────── Row 1: label + heading + button ───────── */}
                <div className="grid gap-10 pb-20 pt-28 lg:grid-cols-[1fr_3fr]">
                    <p className="text-lg font-medium">
                        <span className="italic text-[#dfee3b]">//</span> About
                    </p>

                    <div>
                        <h2 className="max-w-3xl text-5xl font-bold leading-[0.98] tracking-tighter md:text-7xl">
                            Where coders, streamers and gamers grow together.
                        </h2>

                        <div className="mt-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                            <p className="max-w-sm text-lg leading-snug text-white/80">
                                We host events, share knowledge and build things together, from
                                contests to live sessions and game nights.
                            </p>

                            <Link
                                href={user ? '/dashboard' : '/singup'}
                                className="inline-flex h-12 items-stretch self-start bg-[#dfee3b] text-black transition hover:brightness-95 md:self-auto"
                            >
                                <span className="flex items-center px-4 text-[15px] font-medium">
                                    {user ? 'Go to dashboard' : 'Join the community'}
                                </span>
                                <ArrowBox />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ───────── Row 2: stats + accordion ───────── */}
                <div className="grid gap-10 border-t border-white/10 py-14 lg:grid-cols-[1fr_3fr]">
                    {/* Stats column */}
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <div className="flex h-14 w-14 items-center justify-center bg-[#dfee3b] text-black">
                            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                                <circle cx="10" cy="7" r="4" />
                                <path d="M21 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>

                        <dl className="mt-6 space-y-5">
                            {STATS.map((s) => (
                                <div key={s.label}>
                                    <dt className="sr-only">{s.label}</dt>
                                    <dd>
                                        <span className="block text-4xl font-bold tracking-tighter">{s.value}</span>
                                        <span className="block text-sm text-white/60">{s.label}</span>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    {/* Accordion */}
                    <div>
                        {PILLARS.map((p) => {
                            const open = openId === p.id
                            return (
                                <div key={p.id} className="border-t border-white/10 first:border-t-0">
                                    <button
                                        onClick={() => setOpenId(open ? null : p.id)}
                                        aria-expanded={open}
                                        aria-controls={`pillar-${p.id}`}
                                        className="group grid w-full grid-cols-[1fr_auto] items-start gap-4 py-7 text-left"
                                    >
                                        <span className="block">
                                            <span
                                                className={`block text-base font-medium transition-colors ${
                                                    open ? 'text-white' : 'text-white/40'
                                                }`}
                                            >
                                                {p.id} / Pillar
                                            </span>
                                            <span
                                                className={`mt-1 block text-4xl font-bold tracking-tighter transition-colors md:text-6xl ${
                                                    open ? 'text-white' : 'text-white/40 group-hover:text-white/70'
                                                }`}
                                            >
                                                {p.title}
                                            </span>
                                        </span>

                                        <span className="flex items-center gap-3 pt-1">
                                            <span
                                                className={`hidden gap-2 transition-opacity duration-300 md:flex ${
                                                    open ? 'opacity-100' : 'opacity-0'
                                                }`}
                                            >
                                                {p.tags.map((t) => (
                                                    <span
                                                        key={t}
                                                        className="border border-[#dfee3b]/20 bg-[#dfee3b]/10 px-3 py-1.5 text-sm text-white"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </span>
                                            <span
                                                aria-hidden
                                                className={`text-3xl font-light leading-none text-white transition-transform duration-300 ${
                                                    open ? 'rotate-45' : ''
                                                } ${open ? '' : 'text-white/50'}`}
                                            >
                                                +
                                            </span>
                                        </span>
                                    </button>

                                    {/* Expanding panel (CSS grid-rows trick, smooth height) */}
                                    <div
                                        id={`pillar-${p.id}`}
                                        className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                                            open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                                        }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="relative mb-8 h-[280px] overflow-hidden bg-neutral-900 md:h-[320px]">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={p.image}
                                                    alt={p.title}
                                                    className="absolute inset-0 h-full w-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                                <div className="absolute inset-x-0 bottom-0 flex flex-col justify-between gap-4 p-6 md:flex-row md:items-end">
                                                    <p className="max-w-md text-lg leading-snug">{p.desc}</p>
                                                    <Link
                                                        href={user ? '/dashboard' : '/singup'}
                                                        className="inline-flex items-center gap-2 self-start border-b border-white/50 pb-1 text-sm text-white/80 transition hover:border-[#dfee3b] hover:text-[#dfee3b] md:self-auto"
                                                    >
                                                        Get started
                                                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M5 12h14M13 6l6 6-6 6" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* ───────── Row 3: founder + quote ───────── */}
                <div className="grid gap-10 border-t border-white/10 py-20 lg:grid-cols-[1fr_3fr]">
                    <div className="flex items-center gap-4 self-start">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/about/avatar.jpg"
                            alt="Founder"
                            className="h-14 w-14 rounded-full bg-neutral-800 object-cover"
                        />
                        <div>
                            <p className="text-base font-semibold">Your Name</p>
                            <p className="text-sm text-white/50">Founder &amp; Developer</p>
                        </div>
                    </div>

                    <div>
                        <svg className="h-9 w-9 text-[#dfee3b]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M3 21c0-6 1-11 6-14l1.5 2C8 11 8 13 8 14h4v7H3Zm11 0c0-6 1-11 6-14l1.5 2C19 11 19 13 19 14h4v7h-9Z" />
                        </svg>
                        <p className="mt-5 max-w-3xl text-3xl font-bold leading-[1.08] tracking-tighter md:text-5xl">
                            I focus on building a space where people learn, compete and have fun. By
                            mixing coding with community, we help every member grow from day one.
                        </p>
                        <p className="mt-8 font-serif text-3xl italic text-white/40">Sinners_Coding</p>
                    </div>
                </div>
            </div>
        </section>
    )
}