"use client";

import "./hero.css";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const CATEGORIES = ["Hackathon", "Workshop", "Meetup", "Contest", "Bootcamp", "Webinar"];

const ROSTER = [
  { role: "Mentor", filled: 7, total: 8 },
  { role: "Judge", filled: 3, total: 4 },
  { role: "Speaker", filled: 2, total: 2 },
  { role: "Tech Support", filled: 5, total: 6 },
];

const STATS = [
  { value: 1280, suffix: "+", label: "Volunteers joined" },
  { value: 86, suffix: "", label: "Events hosted" },
  { value: 6, suffix: "", label: "Cities covered" },
  { value: 42, suffix: "", label: "Open volunteer slots" },
];

const filled = ROSTER.reduce((s, r) => s + r.filled, 0);
const capacity = ROSTER.reduce((s, r) => s + r.total, 0);

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
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".hero__eyebrow", { y: 12, opacity: 0, duration: 0.6 })
          .from(".hero__line-inner", { yPercent: 105, duration: 0.9, stagger: 0.12, ease: "power4.out" }, "-=0.3")
          .fromTo(".hero__mark", { "--mark-scale": 0 }, { "--mark-scale": 1, duration: 0.7, ease: "power2.inOut" }, "-=0.35")
          .from(".hero__sub", { y: 16, opacity: 0, duration: 0.6 }, "-=0.5")
          .from(".hero__search", { y: 16, opacity: 0, duration: 0.6 }, "-=0.4")
          .from(".hero__quick, .hero__cta", { y: 12, opacity: 0, stagger: 0.08, duration: 0.5 }, "-=0.35")
          .from(".roster", { y: 32, opacity: 0, duration: 0.9, ease: "expo.out" }, 0.4)
          .from(".row", { y: 10, opacity: 0, stagger: 0.07, duration: 0.5 }, "-=0.5")
          .from(".row__bar", { scaleX: 0, duration: 1, stagger: 0.07, ease: "power3.inOut" }, "-=0.5")
          .from(".hero__stats", { opacity: 0, y: 16, duration: 0.7 }, "-=0.6");

        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count);
          const suffix = el.dataset.suffix ?? "";
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 1.6,
            delay: 1,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = Math.round(obj.v).toLocaleString() + suffix;
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="hero">
      <div className="hero__grid-bg" aria-hidden />

      <div className="hero__container">
        {/* Copy */}
        <div className="hero__copy">
          <span className="hero__eyebrow">Volunteer platform for tech communities</span>

          <h1 className="hero__title">
            <span className="hero__line">
              <span className="hero__line-inner">Where developers</span>
            </span>
            <span className="hero__line">
              <span className="hero__line-inner">
                <span className="hero__mark">give back.</span>
              </span>
            </span>
          </h1>

          <p className="hero__sub">
            Find mentor, judge and speaker roles at hackathons, workshops and meetups, or
            host your own event and manage every volunteer in one place.
          </p>

          <form onSubmit={handleSearch} className="hero__search" role="search">
            <label className="hero__field">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                className="hero__input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events by title"
                aria-label="Search events by title"
              />
            </label>
            <select
              className="hero__select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Category"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button type="submit" className="hero__btn">Search</button>
          </form>

          <div className="hero__quick">
            <span>Popular:</span>
            {["Hackathon", "Workshop", "Meetup"].map((c) => (
              <Link key={c} href={`/events?category=${c}`} className="hero__tag">
                {c}
              </Link>
            ))}
          </div>

          <div className="hero__cta">
            <Link href="/register?role=volunteer" className="hero__cta-main">
              Become a volunteer
            </Link>
            <Link href="/register?role=organizer" className="hero__cta-alt">
              I&apos;m hosting an event
            </Link>
          </div>
        </div>

        {/* Roster card */}
        <div className="hero__visual">
          <div className="roster">
            <article className="roster__card">
              <header className="roster__head">
                <div className="roster__top">
                  <span className="roster__label">Volunteer roster</span>
                  <span className="chip">Hackathon</span>
                </div>
                <h2 className="roster__title">Dhaka Hackathon 2026</h2>
                <p className="roster__meta">12 Nov 2026 · Dhaka</p>
              </header>

              <div className="roster__rows">
                {ROSTER.map(({ role, filled: f, total }) => {
                  const isFull = f === total;
                  return (
                    <div key={role} className="row">
                      <div className="row__top">
                        <span className="row__name">{role}</span>
                        <span className="row__count">
                          {isFull && <span className="row__full">Full</span>}
                          {f} / {total}
                        </span>
                      </div>
                      <div className="row__track">
                        <div
                          className={`row__bar${isFull ? " row__bar--full" : ""}`}
                          style={{ width: `${(f / total) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <footer className="roster__foot">
                <div className="roster__left">
                  <strong>
                    {capacity - filled} slots left · {filled}/{capacity}
                  </strong>
                  <span>Registration closes in 2 days</span>
                </div>
                <Link href="/events" className="roster__link">
                  View event
                </Link>
              </footer>
            </article>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="hero__stats">
        <div className="hero__stats-inner">
          {STATS.map((s) => (
            <div key={s.label} className="stat">
              <div className="stat__num" data-count={s.value} data-suffix={s.suffix}>
                {s.value.toLocaleString()}
                {s.suffix}
              </div>
              <div className="stat__label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}