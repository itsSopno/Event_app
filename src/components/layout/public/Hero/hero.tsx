"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const CATEGORIES = ["Hackathon", "Workshop", "Meetup", "Contest", "Bootcamp", "Webinar"];

const SKILLS = [
  "React", "Next.js", "TypeScript", "Python", "Node.js", "UI/UX",
  "Mentoring", "Public Speaking", "DevOps", "Data Science", "Flutter", "Judging",
];

const HEADLINE = ["Power the next", "generation of", "developers."];

export default function Hero() {
  const router = useRouter();
  const root = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (category) params.set("category", category);
    router.push(`/events?${params.toString()}`);
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* ---------- Intro timeline ---------- */
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".h-badge", { y: 20, opacity: 0, duration: 0.6 })
          .from(
            ".h-line",
            { yPercent: 115, duration: 1.1, stagger: 0.12, ease: "power4.out" },
            "-=0.3"
          )
          .from(".h-sub", { y: 24, opacity: 0, duration: 0.8 }, "-=0.6")
          .from(".h-search", { y: 30, opacity: 0, duration: 0.8 }, "-=0.6")
          .from(".h-cta > *", { y: 20, opacity: 0, stagger: 0.1, duration: 0.6 }, "-=0.5")
          .from(
            ".h-editor",
            {
              y: 80,
              opacity: 0,
              rotateX: -18,
              rotateY: 12,
              transformPerspective: 1200,
              duration: 1.4,
              ease: "expo.out",
            },
            0.4
          )
          .from(
            ".h-code-line",
            { opacity: 0, x: -14, stagger: 0.11, duration: 0.5 },
            "-=0.7"
          )
          .from(".h-float", { scale: 0.7, opacity: 0, stagger: 0.2, duration: 0.9, ease: "back.out(1.8)" }, "-=0.3")
          .from(".h-bar", { scaleX: 0, transformOrigin: "left center", duration: 1.2, ease: "power3.inOut" }, "<")
          .from(".h-marquee", { opacity: 0, y: 20, duration: 0.8 }, "-=0.8");

        /* ---------- Count-up numbers ---------- */
        const counters = { registered: 0, left: 20 };
        gsap.to(counters, {
          registered: 17,
          left: 3,
          duration: 1.8,
          delay: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            gsap.utils.toArray<HTMLElement>(".n-registered").forEach(
              (el) => (el.textContent = String(Math.round(counters.registered)))
            );
            gsap.utils.toArray<HTMLElement>(".n-left").forEach(
              (el) => (el.textContent = String(Math.round(counters.left)))
            );
          },
        });

        /* ---------- Continuous motion ---------- */
        gsap.to(".h-float-a", { y: -12, duration: 2.6, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(".h-float-b", { y: 10, duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.5 });
        gsap.to(".h-cursor", { opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: "steps(1)" });
        gsap.to(".h-blob", { scale: 1.15, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });

        // Marquee (hover e slow)
        const marquee = gsap.to(".h-track", {
          xPercent: -50,
          duration: 35,
          repeat: -1,
          ease: "none",
        });
        const marqueeEl = root.current?.querySelector(".h-marquee");
        const slow = () => gsap.to(marquee, { timeScale: 0.25, duration: 0.5 });
        const fast = () => gsap.to(marquee, { timeScale: 1, duration: 0.5 });
        marqueeEl?.addEventListener("mouseenter", slow);
        marqueeEl?.addEventListener("mouseleave", fast);

        /* ---------- Mouse parallax + spotlight ---------- */
        const section = root.current!;
        const spotX = gsap.quickTo(".h-spot", "x", { duration: 0.6, ease: "power3" });
        const spotY = gsap.quickTo(".h-spot", "y", { duration: 0.6, ease: "power3" });
        const edRX = gsap.quickTo(".h-editor", "rotateX", { duration: 0.8, ease: "power3" });
        const edRY = gsap.quickTo(".h-editor", "rotateY", { duration: 0.8, ease: "power3" });
        const depthEls = gsap.utils.toArray<HTMLElement>("[data-depth]");
        const depthSetters = depthEls.map((el) => ({
          x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" }),
          y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" }),
          d: Number(el.dataset.depth),
        }));

        const onMove = (e: MouseEvent) => {
          const r = section.getBoundingClientRect();
          const px = e.clientX - r.left;
          const py = e.clientY - r.top;
          const nx = px / r.width - 0.5;
          const ny = py / r.height - 0.5;

          spotX(px - 250);
          spotY(py - 250);
          edRX(-ny * 10);
          edRY(nx * 12);
          depthSetters.forEach(({ x, y, d }) => {
            x(nx * d);
            y(ny * d);
          });
        };
        section.addEventListener("mousemove", onMove);

        /* ---------- Magnetic buttons ---------- */
        const magnets = gsap.utils.toArray<HTMLElement>(".h-magnet");
        const cleanups = magnets.map((el) => {
          const mx = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
          const my = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
          const move = (e: MouseEvent) => {
            const b = el.getBoundingClientRect();
            mx((e.clientX - (b.left + b.width / 2)) * 0.3);
            my((e.clientY - (b.top + b.height / 2)) * 0.3);
          };
          const leave = () => {
            mx(0);
            my(0);
          };
          el.addEventListener("mousemove", move);
          el.addEventListener("mouseleave", leave);
          return () => {
            el.removeEventListener("mousemove", move);
            el.removeEventListener("mouseleave", leave);
          };
        });

        return () => {
          section.removeEventListener("mousemove", onMove);
          marqueeEl?.removeEventListener("mouseenter", slow);
          marqueeEl?.removeEventListener("mouseleave", fast);
          cleanups.forEach((fn) => fn());
        };
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative isolate overflow-hidden bg-[#070b0a] text-white">
      {/* Background */}
      <div className="hero-grid absolute inset-0 -z-10" />
      <div className="h-blob absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[140px]" />
      <div className="absolute -right-32 top-1/2 -z-10 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="h-spot pointer-events-none absolute left-0 top-0 -z-10 hidden h-[500px] w-[500px] rounded-full bg-emerald-400/10 blur-[100px] md:block" />

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 pb-24 pt-20 sm:px-6 lg:grid-cols-12 lg:pt-28">
        {/* LEFT */}
        <div className="lg:col-span-7">
          <div className="h-badge inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-mono text-xs text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Volunteer slots open now
          </div>

          <h1 className="mt-6 text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            {HEADLINE.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-2">
                <span
                  className={`h-line block ${
                    i === HEADLINE.length - 1
                      ? "bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent"
                      : ""
                  }`}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p className="h-sub mt-6 max-w-xl text-lg leading-relaxed text-white/60">
            Mentor at hackathons, judge coding contests, speak at meetups. Or host
            your own event and manage every volunteer in one place.
          </p>

          <form
            onSubmit={handleSearch}
            className="h-search mt-10 flex max-w-2xl flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2 backdrop-blur sm:flex-row sm:items-center"
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
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              type="submit"
              className="h-magnet h-11 rounded-xl bg-emerald-400 px-6 text-sm font-semibold text-black transition-colors hover:bg-emerald-300"
            >
              Search
            </button>
          </form>

          <div className="h-cta mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/register?role=volunteer"
              className="h-magnet group inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-medium transition-colors hover:border-emerald-400/60 hover:bg-white/5"
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
        <div className="relative lg:col-span-5" style={{ perspective: 1200 }}>
          <div
            className="h-editor overflow-hidden rounded-2xl border border-white/10 bg-[#0c1311]/90 shadow-2xl shadow-emerald-500/10 backdrop-blur"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              <span className="ml-3 font-mono text-xs text-white/40">event.ts</span>
            </div>

            <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-7">
              <code className="block">
                <span className="h-code-line block">
                  <span className="text-purple-400">const</span>{" "}
                  <span className="text-cyan-300">event</span>{" "}
                  <span className="text-white/60">=</span> {"{"}
                </span>
                <span className="h-code-line block">
                  {"  "}title<span className="text-white/60">:</span>{" "}
                  <span className="text-amber-300">&quot;Dhaka Hackathon&quot;</span>,
                </span>
                <span className="h-code-line block">
                  {"  "}category<span className="text-white/60">:</span>{" "}
                  <span className="text-amber-300">&quot;Hackathon&quot;</span>,
                </span>
                <span className="h-code-line block">
                  {"  "}needs<span className="text-white/60">:</span> [
                  <span className="text-amber-300">&quot;Mentor&quot;</span>,{" "}
                  <span className="text-amber-300">&quot;Judge&quot;</span>],
                </span>
                <span className="h-code-line block">
                  {"  "}capacity<span className="text-white/60">:</span>{" "}
                  <span className="text-orange-300">20</span>,
                </span>
                <span className="h-code-line block">
                  {"  "}registered<span className="text-white/60">:</span>{" "}
                  <span className="n-registered text-orange-300">17</span>,
                </span>
                <span className="h-code-line block">
                  {"  "}slotsLeft<span className="text-white/60">:</span>{" "}
                  <span className="n-left text-emerald-300">3</span>,
                </span>
                <span className="h-code-line block">
                  {"  "}status<span className="text-white/60">:</span>{" "}
                  <span className="text-amber-300">&quot;open&quot;</span>
                </span>
                <span className="h-code-line block">
                  {"}"};
                  <span className="h-cursor ml-1 inline-block h-4 w-2 translate-y-0.5 bg-emerald-400" />
                </span>
              </code>
            </pre>
          </div>

          {/* Floating capacity card */}
          <div data-depth="40" className="absolute -bottom-10 -left-6 sm:-left-12">
            <div className="h-float h-float-a w-64 rounded-2xl border border-white/10 bg-[#0f1816]/95 p-4 shadow-xl backdrop-blur">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-white/50">Mentor slots</span>
                <span className="font-semibold text-emerald-300">
                  <span className="n-left">3</span> left
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-bar h-full w-[85%] rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-white/40">
                <span><span className="n-registered">17</span> / 20 registered</span>
                <span>Closes in 2d</span>
              </div>
            </div>
          </div>

          {/* Floating status badge */}
          <div data-depth="-30" className="absolute -right-2 -top-5 sm:-right-6">
            <div className="h-float h-float-b rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 font-mono text-xs text-emerald-300 backdrop-blur">
              ✓ Confirmed
            </div>
          </div>
        </div>
      </div>

      {/* Skill marquee */}
      <div className="h-marquee border-y border-white/10 bg-white/[0.02] py-4">
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="h-track flex w-max gap-10">
            {[...SKILLS, ...SKILLS].map((skill, i) => (
              <span key={i} className="font-mono text-sm uppercase tracking-widest text-white/40">
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