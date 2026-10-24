import Link from 'next/link'
import './about.css'
import GridLines from '../../../../components/shared/GridLines/GridLines'
const STATS = [
    { id: '01', value: '83+', label: 'Events hosted', featured: true },
    { id: '02', value: '88+', label: 'Active members' },
    { id: '03', value: '70+', label: 'Live streams' },
]

const FEATURES = [
    {
        id: '04',
        title: 'Learn by building',
        desc: 'From first line of code to full projects, we learn together through contests and workshops.',
    },
    {
        id: '05',
        title: 'Community first',
        desc: 'Coders, streamers and gamers sharing ideas, helping each other and growing every week.',
    },
]

export default function About() {
    return (
        <section id="about" className="relative overflow-hidden bg-[#051817] bg-[image:radial-gradient(ellipse_at_75%_30%,#0a2a28_0%,transparent_60%)] text-white">
            <GridLines />
            <div className="mx-auto max-w-7xl px-6">
                {/* Giant heading */}
                <h2 className="select-none bg-gradient-to-r from-[#2dd4bf] to-[#6c7686] bg-clip-text pt-10 text-center text-[24vw] font-black uppercase leading-[0.8] tracking-tighter text-transparent lg:text-[20rem]">
                    About
                </h2>

                {/* Intro + image */}
                <div className="mt-16 grid items-start gap-10 lg:grid-cols-2">
                    <div>
                        <h3 className="text-3xl font-semibold uppercase leading-[1.05] tracking-tight md:text-5xl">
                            A growing community of coders, streamers and gamers.
                        </h3>
                        <p className="mt-6 text-2xl font-semibold uppercase leading-[1.1] tracking-tight text-neutral-500 md:text-4xl">
                            We host events, share knowledge and build things together, from
                            contests to live sessions and game nights.
                        </p>
                        <p className="mt-10 font-serif text-5xl italic text-[#6c7686]">
                            Sinners_Coding
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#2dd4bf] to-[#6c7686]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="https://i.pinimg.com/736x/19/f9/9e/19f99e101ac2a9453b4a8c7e3ad93bd8.jpg"
                            alt="Sinners_Coding community"
                            className="aspect-[4/5] w-full object-cover"
                        />
                    </div>
                </div>

                {/* Founder + quote */}
                <div className="mt-28 grid gap-10 lg:grid-cols-[1fr_2fr]">
                    <div className="flex items-center gap-4 self-start">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/about/avatar.jpg"
                            alt="Founder"
                            className="h-14 w-14 rounded-full bg-neutral-800 object-cover"
                        />
                        <div>
                            <p className="text-sm font-semibold uppercase">Your Name</p>
                            <p className="text-xs uppercase text-neutral-400">Founder &amp; Developer</p>
                        </div>
                    </div>

                    <div>
                        <svg className="h-10 w-10 text-[#6c7686]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 21c0-6 1-11 6-14l1.5 2C8 11 8 13 8 14h4v7H3Zm11 0c0-6 1-11 6-14l1.5 2C19 11 19 13 19 14h4v7h-9Z" />
                        </svg>
                        <p className="mt-4 text-3xl font-semibold uppercase leading-[1.05] tracking-tight md:text-5xl">
                            I focus on building a space where people learn, compete and have fun.
                            By mixing coding with community, we help every member grow from day one.
                        </p>
                    </div>
                </div>

                {/* Bento stats */}
                <div className="mt-20 grid gap-4 pb-24 lg:grid-cols-4">
                    {STATS.map((s) => (
                        <div
                            key={s.id}
                            className={`relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-2xl border border-white/5 p-8 ${s.featured
                                ? 'bg-gradient-to-br from-[#2dd4bf] to-[#6c7686] lg:col-span-2'
                                : 'bg-neutral-900'
                                }`}
                        >
                            <span className="font-mono text-sm">
                                <span className="text-[#6c7686]">/</span> {s.id}
                            </span>
                            <div>
                                <p className="text-7xl font-bold tracking-tighter">{s.value}</p>
                                <p
                                    className={`mt-2 text-sm font-medium uppercase ${s.featured ? 'text-white/80' : 'text-neutral-400'
                                        }`}
                                >
                                    {s.label}
                                </p>
                            </div>
                        </div>
                    ))}

                    {FEATURES.map((f) => (
                        <div
                            key={f.id}
                            className="flex min-h-[240px] flex-col justify-between rounded-2xl border border-white/5 bg-neutral-900 p-8 lg:col-span-2"
                        >
                            <span className="font-mono text-sm">
                                <span className="text-[#6c7686]">/</span> {f.id}
                            </span>
                            <div>
                                <h4 className="text-2xl font-semibold uppercase">{f.title}</h4>
                                <p className="mt-2 max-w-md text-sm uppercase leading-snug text-neutral-400">
                                    {f.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pb-24 text-center">
                    <Link
                        href="/signup"
                        className="rounded-md bg-white px-6 py-3 font-mono text-xs uppercase tracking-widest text-black hover:bg-white/80"
                    >
                        Join the community
                    </Link>
                </div>
            </div>
        </section>
    )
}