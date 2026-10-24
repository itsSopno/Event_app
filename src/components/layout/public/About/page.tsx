
// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import GridLines from '../../../../components/shared/GridLines/GridLines'
// import { useAuth } from '@/context/AuthContext'

// const STATS = [
//     { value: '83+', label: 'Events hosted' },
//     { value: '88+', label: 'Active members' },
//     { value: '70+', label: 'Live streams' },
// ]

// const PILLARS = [
//     {
//         id: '01',
//         title: 'Learn by building',
//         tags: ['Workshops', 'Contests', 'Projects'],
//         desc: 'From your first line of code to full projects, we learn together through contests and hands-on workshops.',
//         image: 'https://i.pinimg.com/1200x/02/f0/67/02f0672b9ff87dba4794b82b2ac3be45.jpg',
//     },
//     {
//         id: '02',
//         title: 'Community first',
//         tags: ['Coders', 'Streamers', 'Gamers'],
//         desc: 'Coders, streamers and gamers sharing ideas, helping each other and growing every week.',
//         image: 'https://i.pinimg.com/736x/6c/35/96/6c3596047b1623322d957a1d696ddad1.jpg',
//     },
//     {
//         id: '03',
//         title: 'Live sessions',
//         tags: ['Streams', 'Game nights', 'Q&A'],
//         desc: 'Join live coding streams, game nights and open Q&A sessions. Watch, play and learn with everyone.',
//         image: 'https://i.pinimg.com/1200x/03/3d/25/033d257eedb0080f608c7e1beb3775f2.jpg',
//     },
// ]

// /* Arrow inside a dark square, used on the main buttons */
// function ArrowBox() {
//     return (
//         <span className="flex h-full w-12 items-center justify-center bg-black text-[#dfee3b]">
//             <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M5 12h14M13 6l6 6-6 6" />
//             </svg>
//         </span>
//     )
// }

// /* Faint pinwheel shape behind the content */
// function Pinwheel({ className = '' }: { className?: string }) {
//     return (
//         <svg aria-hidden viewBox="-120 -120 240 240" className={className}>
//             {Array.from({ length: 8 }).map((_, i) => (
//                 <path
//                     key={i}
//                     transform={`rotate(${i * 45})`}
//                     d="M0 0 C 18 -34, 52 -78, 104 -92 C 98 -52, 62 -14, 0 0Z"
//                 />
//             ))}
//         </svg>
//     )
// }

// export default function About() {
//     const { user } = useAuth()
//     const [openId, setOpenId] = useState<string | null>('01')

//     return (
//         <section
//             id="about"
//             className="relative overflow-hidden bg-[#051817] bg-[image:radial-gradient(ellipse_at_75%_30%,#0a2a28_0%,transparent_60%)] text-white"
//         >
//             <GridLines />

//             <Pinwheel className="pointer-events-none absolute -left-40 top-24 h-[640px] w-[640px] fill-white/[0.06]" />

//             <div className="relative mx-auto max-w-6xl px-6">
//                 {/* ───────── Row 1: label + heading + button ───────── */}
//                 <div className="grid gap-10 pb-20 pt-28 lg:grid-cols-[1fr_3fr]">
//                     <p className="text-lg font-medium">
//                         <span className="italic text-[#dfee3b]">//</span> About
//                     </p>

//                     <div>
//                         <h2 className="max-w-3xl text-5xl font-bold leading-[0.98] tracking-tighter md:text-7xl">
//                             Where coders, streamers and gamers grow together.
//                         </h2>

//                         <div className="mt-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
//                             <p className="max-w-sm text-lg leading-snug text-white/80">
//                                 We host events, share knowledge and build things together, from
//                                 contests to live sessions and game nights.
//                             </p>

//                             <Link
//                                 href={user ? '/dashboard' : '/singup'}
//                                 className="inline-flex h-12 items-stretch self-start bg-[#dfee3b] text-black transition hover:brightness-95 md:self-auto"
//                             >
//                                 <span className="flex items-center px-4 text-[15px] font-medium">
//                                     {user ? 'Go to dashboard' : 'Join the community'}
//                                 </span>
//                                 <ArrowBox />
//                             </Link>
//                         </div>
//                     </div>
//                 </div>

//                 {/* ───────── Row 2: stats + accordion ───────── */}
//                 <div className="grid gap-10 border-t border-white/10 py-14 lg:grid-cols-[1fr_3fr]">
//                     {/* Stats column */}
//                     <div className="lg:sticky lg:top-24 lg:self-start">
//                         <div className="flex h-14 w-14 items-center justify-center bg-[#dfee3b] text-black">
//                             <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                 <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
//                                 <circle cx="10" cy="7" r="4" />
//                                 <path d="M21 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
//                             </svg>
//                         </div>

//                         <dl className="mt-6 space-y-5">
//                             {STATS.map((s) => (
//                                 <div key={s.label}>
//                                     <dt className="sr-only">{s.label}</dt>
//                                     <dd>
//                                         <span className="block text-4xl font-bold tracking-tighter">{s.value}</span>
//                                         <span className="block text-sm text-white/60">{s.label}</span>
//                                     </dd>
//                                 </div>
//                             ))}
//                         </dl>
//                     </div>

//                     {/* Accordion */}
//                     <div>
//                         {PILLARS.map((p) => {
//                             const open = openId === p.id
//                             return (
//                                 <div key={p.id} className="border-t border-white/10 first:border-t-0">
//                                     <button
//                                         onClick={() => setOpenId(open ? null : p.id)}
//                                         aria-expanded={open}
//                                         aria-controls={`pillar-${p.id}`}
//                                         className="group grid w-full grid-cols-[1fr_auto] items-start gap-4 py-7 text-left"
//                                     >
//                                         <span className="block">
//                                             <span
//                                                 className={`block text-base font-medium transition-colors ${
//                                                     open ? 'text-white' : 'text-white/40'
//                                                 }`}
//                                             >
//                                                 {p.id} / Pillar
//                                             </span>
//                                             <span
//                                                 className={`mt-1 block text-4xl font-bold tracking-tighter transition-colors md:text-6xl ${
//                                                     open ? 'text-white' : 'text-white/40 group-hover:text-white/70'
//                                                 }`}
//                                             >
//                                                 {p.title}
//                                             </span>
//                                         </span>

//                                         <span className="flex items-center gap-3 pt-1">
//                                             <span
//                                                 className={`hidden gap-2 transition-opacity duration-300 md:flex ${
//                                                     open ? 'opacity-100' : 'opacity-0'
//                                                 }`}
//                                             >
//                                                 {p.tags.map((t) => (
//                                                     <span
//                                                         key={t}
//                                                         className="border border-[#dfee3b]/20 bg-[#dfee3b]/10 px-3 py-1.5 text-sm text-white"
//                                                     >
//                                                         {t}
//                                                     </span>
//                                                 ))}
//                                             </span>
//                                             <span
//                                                 aria-hidden
//                                                 className={`text-3xl font-light leading-none text-white transition-transform duration-300 ${
//                                                     open ? 'rotate-45' : ''
//                                                 } ${open ? '' : 'text-white/50'}`}
//                                             >
//                                                 +
//                                             </span>
//                                         </span>
//                                     </button>

//                                     {/* Expanding panel (CSS grid-rows trick, smooth height) */}
//                                     <div
//                                         id={`pillar-${p.id}`}
//                                         className={`grid transition-[grid-template-rows] duration-500 ease-out ${
//                                             open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
//                                         }`}
//                                     >
//                                         <div className="overflow-hidden">
//                                             <div className="relative mb-8 h-[280px] overflow-hidden bg-neutral-900 md:h-[320px]">
//                                                 {/* eslint-disable-next-line @next/next/no-img-element */}
//                                                 <img
//                                                     src={p.image}
//                                                     alt={p.title}
//                                                     className="absolute inset-0 h-full w-full object-cover"
//                                                 />
//                                                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

//                                                 <div className="absolute inset-x-0 bottom-0 flex flex-col justify-between gap-4 p-6 md:flex-row md:items-end">
//                                                     <p className="max-w-md text-lg leading-snug">{p.desc}</p>
//                                                     <Link
//                                                         href={user ? '/dashboard' : '/singup'}
//                                                         className="inline-flex items-center gap-2 self-start border-b border-white/50 pb-1 text-sm text-white/80 transition hover:border-[#dfee3b] hover:text-[#dfee3b] md:self-auto"
//                                                     >
//                                                         Get started
//                                                         <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//                                                             <path d="M5 12h14M13 6l6 6-6 6" />
//                                                         </svg>
//                                                     </Link>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )
//                         })}
//                     </div>
//                 </div>

//                 {/* ───────── Row 3: founder + quote ───────── */}
//                 <div className="grid gap-10 border-t border-white/10 py-20 lg:grid-cols-[1fr_3fr]">
//                     <div className="flex items-center gap-4 self-start">
//                         {/* eslint-disable-next-line @next/next/no-img-element */}
//                         <img
//                             src="/about/avatar.jpg"
//                             alt="Founder"
//                             className="h-14 w-14 rounded-full bg-neutral-800 object-cover"
//                         />
//                         <div>
//                             <p className="text-base font-semibold">Your Name</p>
//                             <p className="text-sm text-white/50">Founder &amp; Developer</p>
//                         </div>
//                     </div>

//                     <div>
//                         <svg className="h-9 w-9 text-[#dfee3b]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
//                             <path d="M3 21c0-6 1-11 6-14l1.5 2C8 11 8 13 8 14h4v7H3Zm11 0c0-6 1-11 6-14l1.5 2C19 11 19 13 19 14h4v7h-9Z" />
//                         </svg>
//                         <p className="mt-5 max-w-3xl text-3xl font-bold leading-[1.08] tracking-tighter md:text-5xl">
//                             I focus on building a space where people learn, compete and have fun. By
//                             mixing coding with community, we help every member grow from day one.
//                         </p>
//                         <p className="mt-8 font-serif text-3xl italic text-white/40">Sinners_Coding</p>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     )
// }
'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GridLines from '../../../../components/shared/GridLines/GridLines'
import { useAuth } from '@/context/AuthContext'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const HEADING = 'Where coders, streamers and gamers grow together.'

const STATS = [
    { value: 83, suffix: '+', label: 'Events hosted' },
    { value: 88, suffix: '+', label: 'Active members' },
    { value: 70, suffix: '+', label: 'Live streams' },
]

const PILLARS = [
   
    {    id: '01',
        title: 'Learn by building',
        tags: ['Workshops', 'Contests', 'Projects'],
        desc: 'From your first line of code to full projects, we learn together through contests and hands-on workshops.',
        image: 'https://i.pinimg.com/1200x/02/f0/67/02f0672b9ff87dba4794b82b2ac3be45.jpg',
    },
    {
        id: '02',
        title: 'Community first',
        tags: ['Coders', 'Streamers', 'Gamers'],
        desc: 'Coders, streamers and gamers sharing ideas, helping each other and growing every week.',
        image: 'https://i.pinimg.com/736x/6c/35/96/6c3596047b1623322d957a1d696ddad1.jpg',
    },
    {
        id: '03',
        title: 'Live sessions',
        tags: ['Streams', 'Game nights', 'Q&A'],
        desc: 'Join live coding streams, game nights and open Q&A sessions. Watch, play and learn with everyone.',
        image: 'https://i.pinimg.com/1200x/03/3d/25/033d257eedb0080f608c7e1beb3775f2.jpg',
    },
]

const reduceMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
const d = (s: number) => (reduceMotion() ? 0 : s)

/* Arrow inside a dark square, used on the main button */
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
    const rootRef = useRef<HTMLElement>(null)
    const panels = useRef<Record<string, HTMLDivElement | null>>({})
    const [openId, setOpenId] = useState<string | null>('01')

    /* ───────── Scroll entrance animations ───────── */
    useEffect(() => {
        if (reduceMotion()) return

        const ctx = gsap.context(() => {
            // Heading: words rise out of a mask
            gsap.from('.ab-word', {
                yPercent: 115,
                duration: 1,
                ease: 'power3.out',
                stagger: 0.06,
                scrollTrigger: { trigger: '.ab-hero', start: 'top 80%', once: true },
            })

            // Label, paragraph and button
            gsap.from('.ab-fade', {
                opacity: 0,
                y: 22,
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.14,
                delay: 0.2,
                scrollTrigger: { trigger: '.ab-hero', start: 'top 80%', once: true },
            })

            // Pinwheel: slow spin + gentle parallax while scrolling
            gsap.to('.ab-wheel', { rotate: 360, duration: 70, ease: 'none', repeat: -1 })
            gsap.to('.ab-wheel-wrap', {
                yPercent: -18,
                ease: 'none',
                scrollTrigger: {
                    trigger: rootRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            })

            // Stats: icon pops in, numbers count up
            gsap.from('.ab-icon', {
                scale: 0,
                rotate: -45,
                duration: 0.7,
                ease: 'back.out(1.8)',
                scrollTrigger: { trigger: '.ab-stats', start: 'top 85%', once: true },
            })

            gsap.utils.toArray<HTMLElement>('.ab-num').forEach((el) => {
                const end = Number(el.dataset.value)
                const suffix = el.dataset.suffix ?? ''
                const obj = { v: 0 }
                el.textContent = `0${suffix}`
                gsap.to(obj, {
                    v: end,
                    duration: 1.8,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
                    onUpdate: () => {
                        el.textContent = `${Math.round(obj.v)}${suffix}`
                    },
                })
            })

            gsap.from('.ab-stat-label', {
                opacity: 0,
                x: -12,
                duration: 0.6,
                stagger: 0.15,
                ease: 'power2.out',
                scrollTrigger: { trigger: '.ab-stats', start: 'top 85%', once: true },
            })

            // Accordion rows slide in one by one
            gsap.from('.pl-item', {
                opacity: 0,
                y: 40,
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.14,
                scrollTrigger: { trigger: '.ab-list', start: 'top 82%', once: true },
            })

            // Founder + quote
            gsap.from('.ab-founder', {
                opacity: 0,
                x: -24,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: { trigger: '.ab-quote-row', start: 'top 80%', once: true },
            })
            gsap.from('.ab-quote-mark', {
                scale: 0,
                rotate: -30,
                duration: 0.7,
                ease: 'back.out(2)',
                scrollTrigger: { trigger: '.ab-quote-row', start: 'top 80%', once: true },
            })
            gsap.from('.ab-quote', {
                opacity: 0,
                y: 30,
                duration: 0.9,
                ease: 'power3.out',
                stagger: 0.15,
                delay: 0.15,
                scrollTrigger: { trigger: '.ab-quote-row', start: 'top 80%', once: true },
            })
        }, rootRef)

        return () => ctx.revert()
    }, [])

    /* ───────── Accordion open / close ───────── */
    useEffect(() => {
        PILLARS.forEach((p) => {
            const panel = panels.current[p.id]
            if (!panel) return
            const isOpen = p.id === openId

            gsap.to(panel, {
                height: isOpen ? 'auto' : 0,
                duration: d(isOpen ? 0.65 : 0.4),
                ease: isOpen ? 'power3.out' : 'power2.inOut',
                overwrite: 'auto',
                onComplete: () => ScrollTrigger.refresh(),
            })

            // Tag chips in the row header
            const tagsWrap = rootRef.current?.querySelector<HTMLElement>(`[data-tags="${p.id}"]`)
            if (tagsWrap) {
                gsap.to(tagsWrap, { opacity: isOpen ? 1 : 0, duration: d(0.3), overwrite: 'auto' })
                if (isOpen) {
                    gsap.fromTo(
                        tagsWrap.children,
                        { opacity: 0, x: 16 },
                        { opacity: 1, x: 0, duration: d(0.5), stagger: 0.08, delay: 0.15, ease: 'power3.out' }
                    )
                }
            }

            // Image zooms out, text rises in
            if (isOpen) {
                gsap.fromTo(
                    panel.querySelector('.pl-img'),
                    { scale: 1.25 },
                    { scale: 1, duration: d(1.2), ease: 'power3.out' }
                )
                gsap.fromTo(
                    panel.querySelectorAll('.pl-rise'),
                    { opacity: 0, y: 22 },
                    { opacity: 1, y: 0, duration: d(0.6), stagger: 0.12, delay: 0.3, ease: 'power3.out' }
                )
            }
        })
    }, [openId])

    return (
        <section
            ref={rootRef}
            id="about"
            className="relative overflow-hidden bg-[#051817] bg-[image:radial-gradient(ellipse_at_75%_30%,#0a2a28_0%,transparent_60%)] text-white"
        >
            <GridLines />

            <div className="ab-wheel-wrap pointer-events-none absolute -left-40 top-24 h-[640px] w-[640px]">
                <Pinwheel className="ab-wheel h-full w-full fill-white/[0.06]" />
            </div>

            <div className="relative mx-auto max-w-6xl px-6">
                {/* ───────── Row 1: label + heading + button ───────── */}
                <div className="ab-hero grid gap-10 pb-20 pt-28 lg:grid-cols-[1fr_3fr]">
                    <p className="ab-fade text-lg font-medium">
                        <span className="italic text-[#dfee3b]">//</span> About
                    </p>

                    <div>
                        <h2 className="max-w-3xl text-5xl font-bold leading-[0.98] tracking-tighter md:text-7xl">
                            {HEADING.split(' ').map((word, i) => (
                                <Fragment key={i}>
                                    <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                                        <span className="ab-word inline-block">{word}</span>
                                    </span>{' '}
                                </Fragment>
                            ))}
                        </h2>

                        <div className="mt-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                            <p className="ab-fade max-w-sm text-lg leading-snug text-white/80">
                                We host events, share knowledge and build things together, from
                                contests to live sessions and game nights.
                            </p>

                            <Link
                                href={user ? '/dashboard' : '/singup'}
                                className="ab-fade inline-flex h-12 items-stretch self-start bg-[#dfee3b] text-black transition hover:brightness-95 md:self-auto"
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
                    <div className="ab-stats lg:sticky lg:top-24 lg:self-start">
                        <div className="ab-icon flex h-14 w-14 items-center justify-center bg-[#dfee3b] text-black">
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
                                        <span
                                            className="ab-num block text-4xl font-bold tabular-nums tracking-tighter"
                                            data-value={s.value}
                                            data-suffix={s.suffix}
                                        >
                                            {s.value}
                                            {s.suffix}
                                        </span>
                                        <span className="ab-stat-label block text-sm text-white/60">{s.label}</span>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    {/* Accordion */}
                    <div className="ab-list">
                        {PILLARS.map((p) => {
                            const open = openId === p.id
                            return (
                                <div key={p.id} className="pl-item border-t border-white/10 first:border-t-0">
                                    <button
                                        onClick={() => setOpenId(open ? null : p.id)}
                                        aria-expanded={open}
                                        aria-controls={`pillar-${p.id}`}
                                        className="group grid w-full grid-cols-[1fr_auto] items-start gap-4 py-7 text-left"
                                    >
                                        <span className="block">
                                            <span
                                                className={`block text-base font-medium transition-colors duration-300 ${
                                                    open ? 'text-white' : 'text-white/40'
                                                }`}
                                            >
                                                {p.id} / Pillar
                                            </span>
                                            <span
                                                className={`mt-1 block text-4xl font-bold tracking-tighter transition-colors duration-300 md:text-6xl ${
                                                    open ? 'text-white' : 'text-white/40 group-hover:text-white/70'
                                                }`}
                                            >
                                                {p.title}
                                            </span>
                                        </span>

                                        <span className="flex items-center gap-3 pt-1">
                                            <span data-tags={p.id} className="hidden gap-2 opacity-0 md:flex">
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
                                                className={`text-3xl font-light leading-none transition-all duration-300 ${
                                                    open ? 'rotate-45 text-[#dfee3b]' : 'text-white/50'
                                                }`}
                                            >
                                                +
                                            </span>
                                        </span>
                                    </button>

                                    <div
                                        id={`pillar-${p.id}`}
                                        ref={(el) => {
                                            panels.current[p.id] = el
                                        }}
                                        className="h-0 overflow-hidden"
                                    >
                                        <div className="relative mb-8 h-[280px] overflow-hidden bg-neutral-900 md:h-[320px]">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={p.image}
                                                alt={p.title}
                                                className="pl-img absolute inset-0 h-full w-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                            <div className="absolute inset-x-0 bottom-0 flex flex-col justify-between gap-4 p-6 md:flex-row md:items-end">
                                                <p className="pl-rise max-w-md text-lg leading-snug">{p.desc}</p>
                                                <Link
                                                    href={user ? '/dashboard' : '/singup'}
                                                    className="pl-rise inline-flex items-center gap-2 self-start border-b border-white/50 pb-1 text-sm text-white/80 transition hover:border-[#dfee3b] hover:text-[#dfee3b] md:self-auto"
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
                            )
                        })}
                    </div>
                </div>

                {/* ───────── Row 3: founder + quote ───────── */}
                <div className="ab-quote-row grid gap-10 border-t border-white/10 py-20 lg:grid-cols-[1fr_3fr]">
                    <div className="ab-founder flex items-center gap-4 self-start">
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
                        <svg className="ab-quote-mark h-9 w-9 text-[#dfee3b]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M3 21c0-6 1-11 6-14l1.5 2C8 11 8 13 8 14h4v7H3Zm11 0c0-6 1-11 6-14l1.5 2C19 11 19 13 19 14h4v7h-9Z" />
                        </svg>
                        <p className="ab-quote mt-5 max-w-3xl text-3xl font-bold leading-[1.08] tracking-tighter md:text-5xl">
                            I focus on building a space where people learn, compete and have fun. By
                            mixing coding with community, we help every member grow from day one.
                        </p>
                        <p className="ab-quote mt-8 font-serif text-3xl italic text-white/40">Studio Sinners</p>
                    </div>
                </div>
            </div>
        </section>
    )
}