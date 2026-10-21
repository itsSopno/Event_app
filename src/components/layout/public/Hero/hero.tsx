"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIES = [
  "Hackathon",
  "Workshop",
  "Meetup",
  "Contest",
  "Bootcamp",
  "Webinar",
];

const SKILLS = [
  "React", "Next.js", "TypeScript", "Python", "Node.js", "UI/UX",
  "Mentoring", "Public Speaking", "DevOps", "Data Science", "Flutter", "Judging",
];

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (category) params.set("category", category);
    router.push(`/events?${params.toString()}`);
  }

  return (
    <section className="relative isolate overflow-hidden bg-[#070b0a] text-white">
      {/* Background */}
      <div className="hero-grid absolute inset-0 -z-10" />
      <div className="absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[140px]" />
      <div className="absolute -right-32 top-1/2 -z-10 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 pb-24 pt-20 sm:px-6 lg:grid-cols-12 lg:pt-28">
        {/* LEFT */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-mono text-xs text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Volunteer slots open now
          </div>

          <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Power the next
            <br />
            generation of{" "}
            <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              developers.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
            Mentor at hackathons, judge coding contests, speak at meetups. Or
            host your own event and manage every volunteer in one place.
          </p>

          {/* Terminal search */}
          <form
            onSubmit={handleSearch}
            className="mt-10 flex max-w-2xl flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2 backdrop-blur sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-2 px-3">
              <span className="font-mono text-emerald-400">$</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="find events --title=..."
                aria-label="Search events by title"
                className="h-11 w-full bg-transparent font-mono text-sm text-white placeholder:text-white/30 focus:outline-none"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Category"
              className="h-11 rounded-xl border border-white/10 bg-[#0d1412] px-3 font-mono text-sm text-white/70 focus:outline-none"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="h-11 rounded-xl bg-emerald-400 px-6 text-sm font-semibold text-black transition hover:bg-emerald-300"
            >
              Search
            </button>
          </form>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/register?role=volunteer"
              className="group inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-medium transition hover:border-emerald-400/60 hover:bg-white/5"
            >
              Become a volunteer
              <span className="transition group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/register?role=organizer"
              className="text-sm text-white/60 underline-offset-4 transition hover:text-white hover:underline"
            >
              I&apos;m hosting an event
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative lg:col-span-5">
          {/* Editor window */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1311]/90 shadow-2xl shadow-emerald-500/10 backdrop-blur">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              <span className="ml-3 font-mono text-xs text-white/40">
                event.ts
              </span>
            </div>

            <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-7">
              <code>
                <span className="text-purple-400">const</span>{" "}
                <span className="text-cyan-300">event</span>{" "}
                <span className="text-white/60">=</span> {"{"}
                {"\n"}
                {"  "}title<span className="text-white/60">:</span>{" "}
                <span className="text-amber-300">&quot;Dhaka Hackathon&quot;</span>,
                {"\n"}
                {"  "}category<span className="text-white/60">:</span>{" "}
                <span className="text-amber-300">&quot;Hackathon&quot;</span>,
                {"\n"}
                {"  "}needs<span className="text-white/60">:</span> [
                <span className="text-amber-300">&quot;Mentor&quot;</span>,{" "}
                <span className="text-amber-300">&quot;Judge&quot;</span>],
                {"\n"}
                {"  "}capacity<span className="text-white/60">:</span>{" "}
                <span className="text-orange-300">20</span>,
                {"\n"}
                {"  "}registered<span className="text-white/60">:</span>{" "}
                <span className="text-orange-300">17</span>,
                {"\n"}
                {"  "}slotsLeft<span className="text-white/60">:</span>{" "}
                <span className="text-emerald-300">3</span>,
                {"\n"}
                {"  "}status<span className="text-white/60">:</span>{" "}
                <span className="text-amber-300">&quot;open&quot;</span>
                {"\n"}
                {"}"};
                <span className="animate-blink ml-1 inline-block h-4 w-2 translate-y-0.5 bg-emerald-400" />
              </code>
            </pre>
          </div>

          {/* Floating capacity card */}
          <div className="animate-float absolute -bottom-10 -left-6 w-64 rounded-2xl border border-white/10 bg-[#0f1816]/95 p-4 shadow-xl backdrop-blur sm:-left-12">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-white/50">Mentor slots</span>
              <span className="font-semibold text-emerald-300">3 left</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-white/40">
              <span>17 / 20 registered</span>
              <span>Closes in 2d</span>
            </div>
          </div>

          {/* Floating status badge */}
          <div className="animate-float absolute -right-2 -top-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 font-mono text-xs text-emerald-300 backdrop-blur [animation-delay:1.5s] sm:-right-6">
            ✓ Confirmed
          </div>
        </div>
      </div>

      {/* Skill marquee */}
      <div className="border-y border-white/10 bg-white/[0.02] py-4">
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="animate-marquee flex w-max gap-10">
            {[...SKILLS, ...SKILLS].map((skill, i) => (
              <span
                key={i}
                className="font-mono text-sm uppercase tracking-widest text-white/40"
              >
                {skill}
                <span className="ml-10 text-emerald-400/60">/</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}