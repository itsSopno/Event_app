'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAuth } from '@/context/AuthContext'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const HEADING = 'Code, compete and grow with us.'
const WORDMARK = 'Studio Sinners'

const MARQUEE = ['Hackathon', 'Bootcamp', 'Workshops', 'Meetup', 'Competition', 'Conference']

const EXPLORE = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Events', href: '/events' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
]

const EVENTS = [
    { label: 'Hackathon', href: '/events?category=hackathon' },
    { label: 'Bootcamp', href: '/events?category=bootcamp' },
    { label: 'Workshops', href: '/events?category=workshop' },
    { label: 'Meetup', href: '/events?category=meetup' },
    { label: 'Conference', href: '/events?category=conference' },
]

const SOCIALS = [
    {
        label: 'Twitter',
        href: '#',
        path: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z',
    },
    {
        label: 'YouTube',
        href: '#',
        path: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z',
    },
    {
        label: 'Facebook',
        href: '#',
        path: 'M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z',
    },
]

const LINK_CLS =
    'relative inline-block text-[15px] text-white/65 transition-colors duration-300 hover:text-white after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#dfee3b] after:transition-transform after:duration-300 hover:after:scale-x-100'

/* Small asterisk used between marquee items */
function Spark() {
    return (
        <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="currentColor" aria-hidden>
            <path d="M12 2l1.6 7.4L21 11l-7.4 1.6L12 20l-1.6-7.4L3 11l7.4-1.6L12 2Z" />
        </svg>
    )
}

export default function Footer() {
    const { user } = useAuth()
    const rootRef = useRef<HTMLElement>(null)

    const dashboardHref = user?.role === 'organizer' ? '/dashboard/organizer' : '/dashboard'
    const ctaHref = user ? dashboardHref : '/singup'

    const ACCOUNT = user
        ? [
              { label: 'Dashboard', href: dashboardHref },
              { label: 'Profile', href: '/profile' },
          ]
        : [
              { label: 'Log in', href: '/login' },
              { label: 'Register', href: '/singup' },
          ]

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const root = rootRef.current
        if (!root) return

        const strip = root.querySelector<HTMLElement>('.ft-marquee')
        let onEnter: (() => void) | undefined
        let onLeave: (() => void) | undefined

        const ctx = gsap.context(() => {
            // Marquee: endless scroll, slows down on hover
            const track = gsap.to('.ft-track', { xPercent: -50, duration: 32, ease: 'none', repeat: -1 })
            onEnter = () => gsap.to(track, { timeScale: 0.2, duration: 0.5 })
            onLeave = () => gsap.to(track, { timeScale: 1, duration: 0.5 })
            strip?.addEventListener('mouseenter', onEnter)
            strip?.addEventListener('mouseleave', onLeave)

            const trigger = { trigger: '.ft-main', start: 'top 80%', once: true }

            // Heading words rise out of a mask
            gsap.from('.ft-word', {
                yPercent: 115,
                duration: 1,
                ease: 'power3.out',
                stagger: 0.06,
                scrollTrigger: trigger,
            })

            // Text, buttons, link columns
            gsap.from('.ft-fade', {
                opacity: 0,
                y: 24,
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.1,
                delay: 0.25,
                scrollTrigger: trigger,
            })

            // Image: curtain reveal, then slow parallax while scrolling
            gsap.fromTo(
                '.ft-image',
                { clipPath: 'inset(100% 0% 0% 0%)' },
                {
                    clipPath: 'inset(0% 0% 0% 0%)',
                    duration: 1.3,
                    ease: 'power4.out',
                    scrollTrigger: trigger,
                }
            )
            gsap.fromTo(
                '.ft-img',
                { yPercent: -7 },
                {
                    yPercent: 7,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.ft-image',
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true,
                    },
                }
            )

            // Badge pops in, then the ring keeps turning
            gsap.from('.ft-badge', {
                scale: 0,
                rotate: -120,
                duration: 1,
                ease: 'back.out(1.6)',
                delay: 0.7,
                scrollTrigger: trigger,
            })
            gsap.to('.ft-ring', { rotate: 360, duration: 18, ease: 'none', repeat: -1 })

            // Giant wordmark: letters rise one by one
            gsap.from('.ft-letter', {
                yPercent: 110,
                duration: 1.2,
                ease: 'power4.out',
                stagger: 0.045,
                scrollTrigger: { trigger: '.ft-wordmark', start: 'top 95%', once: true },
            })

            // Bottom bar
            gsap.from('.ft-bottom', {
                opacity: 0,
                y: 16,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: { trigger: '.ft-bottom', start: 'top 98%', once: true },
            })
        }, root)

        return () => {
            if (onEnter) strip?.removeEventListener('mouseenter', onEnter)
            if (onLeave) strip?.removeEventListener('mouseleave', onLeave)
            ctx.revert()
        }
    }, [])

    return (
        <footer
            ref={rootRef}
            className="relative overflow-hidden bg-[#051817] text-white"
        >
            {/* ───────── Marquee strip ───────── */}
            <div aria-hidden className="ft-marquee overflow-hidden bg-[#dfee3b] py-4 text-[#041414]">
                <div className="ft-track flex w-max">
                    {[0, 1].map((half) => (
                        <div key={half} className="flex shrink-0 items-center gap-8 pr-8">
                            {MARQUEE.concat(MARQUEE).map((item, i) => (
                                <span key={`${half}-${i}`} className="flex items-center gap-8">
                                    <span className="whitespace-nowrap text-2xl font-bold tracking-tight md:text-3xl">
                                        {item}
                                    </span>
                                    <Spark />
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* ───────── Main ───────── */}
            <div className="ft-main mx-auto grid max-w-6xl gap-14 px-6 pb-16 pt-20 lg:grid-cols-12 lg:gap-10 lg:pt-28">
                {/* Left: message + links */}
                <div className="lg:col-span-7">
                    <h2 className="max-w-xl text-4xl font-bold leading-[1] tracking-tighter sm:text-5xl md:text-6xl">
                        {HEADING.split(' ').map((word, i) => (
                            <span key={i} className="-mb-[0.12em] mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                                <span className="ft-word inline-block">{word}</span>
                            </span>
                        ))}
                    </h2>

                    <p className="ft-fade mt-6 max-w-md text-lg leading-snug text-white/70">
                        Join a community of coders, streamers and gamers that hosts events,
                        shares knowledge and builds things together.
                    </p>

                    <div className="ft-fade mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                        <Link
                            href={ctaHref}
                            className="inline-flex h-12 items-stretch bg-[#dfee3b] text-[#041414] transition hover:brightness-95"
                        >
                            <span className="flex items-center px-4 text-[15px] font-medium">
                                {user ? 'Go to dashboard' : 'Join the community'}
                            </span>
                            <span className="flex w-12 items-center justify-center bg-[#041414] text-[#dfee3b]">
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M13 6l6 6-6 6" />
                                </svg>
                            </span>
                        </Link>
                        <Link href="/contact" className={LINK_CLS}>
                            Or talk to us
                        </Link>
                    </div>

                    {/* Link columns */}
                    <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
                        <div className="ft-fade">
                            <p className="mb-4 text-sm text-white/40">Explore</p>
                            <ul className="space-y-2.5">
                                {EXPLORE.map((l) => (
                                    <li key={l.label}>
                                        <Link href={l.href} className={LINK_CLS}>{l.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="ft-fade">
                            <p className="mb-4 text-sm text-white/40">Events</p>
                            <ul className="space-y-2.5">
                                {EVENTS.map((l) => (
                                    <li key={l.label}>
                                        <Link href={l.href} className={LINK_CLS}>{l.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="ft-fade col-span-2 sm:col-span-1">
                            <p className="mb-4 text-sm text-white/40">Account</p>
                            <ul className="space-y-2.5">
                                {ACCOUNT.map((l) => (
                                    <li key={l.label}>
                                        <Link href={l.href} className={LINK_CLS}>{l.label}</Link>
                                    </li>
                                ))}
                            </ul>

                            <p className="mb-4 mt-8 text-sm text-white/40">Follow</p>
                            <div className="flex gap-2">
                                {SOCIALS.map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={s.label}
                                        className="flex h-10 w-10 items-center justify-center border border-white/20 text-white/80 transition hover:border-[#dfee3b] hover:bg-[#dfee3b] hover:text-[#041414]"
                                    >
                                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                                            <path d={s.path} />
                                        </svg>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: image + rotating badge */}
                <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
                    <div className="ft-image relative aspect-[4/5] overflow-hidden bg-neutral-900 sm:aspect-[5/4] lg:aspect-[4/5]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="https://i.pinimg.com/736x/db/a6/f6/dba6f627ae90fb45801976c6255ab277.jpg"
                            alt="Sinners_Coding community"
                            className="ft-img absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#051817]/70 via-transparent to-transparent" />
                    </div>

                    <Link
                        href={ctaHref}
                        aria-label={user ? 'Go to dashboard' : 'Join the community'}
                        className="ft-badge absolute -bottom-8 -left-2 flex h-32 w-32 items-center justify-center rounded-full bg-[#dfee3b] text-[#041414] shadow-xl shadow-black/40 sm:h-36 sm:w-36 lg:-left-10"
                    >
                        <svg viewBox="0 0 120 120" className="ft-ring absolute inset-0 h-full w-full" aria-hidden>
                            <defs>
                                <path id="ft-circle" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" />
                            </defs>
                            <text fontSize="10.5" fontWeight="700" fill="currentColor">
                                <textPath href="#ft-circle" textLength="292" lengthAdjust="spacing">
                                    JOIN THE COMMUNITY • LEARN • PLAY •
                                </textPath>
                            </text>
                        </svg>
                        <svg viewBox="0 0 24 24" className="relative h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M7 17 17 7M8 7h9v9" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* ───────── Giant wordmark ───────── */}
            <div aria-hidden className="ft-wordmark mx-auto max-w-6xl select-none overflow-hidden px-6 pt-4">
                <p className="whitespace-nowrap pb-[0.12em] text-center text-[11.5vw] font-black leading-[0.9] tracking-tighter xl:text-[10.5rem]">
                    {WORDMARK.split('').map((ch, i) => (
                        <span key={i} className="inline-block overflow-hidden pb-[0.12em]">
                            <span className="ft-letter inline-block bg-gradient-to-b from-white/90 to-white/5 bg-clip-text text-transparent">
                                {ch}
                            </span>
                        </span>
                    ))}
                </p>
            </div>

            {/* ───────── Bottom bar ───────── */}
            <div className="ft-bottom border-t border-white/10">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-white/50 sm:flex-row">
                    <p className="text-center sm:text-left">
                        © 2026 Studio Sinners Ltd. All rights reserved.
                    </p>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        aria-label="Back to top"
                        className="flex h-10 w-10 items-center justify-center bg-[#dfee3b] text-[#041414] transition hover:brightness-95"
                    >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m6 15 6-6 6 6" />
                        </svg>
                    </button>
                </div>
            </div>
        </footer>
    )
}