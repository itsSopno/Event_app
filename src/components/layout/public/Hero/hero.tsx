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
  { role: "Tech support", filled: 5, total: 6 },
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

        tl.from(".hero__status", { y: 10, opacity: 0, duration: 0.5 })
          .from(".hero__line-inner", { yPercent: 105, duration: 0.85, stagger: 0.1, ease: "power4.out" }, "-=0.2")
          .from(".hero__sub", { y: 14, opacity: 0, duration: 0.5 }, "-=0.45")
          .from(".hero__search", { y: 14, opacity: 0, duration: 0.5 }, "-=0.35")
          .from(".hero__quick, .hero__cta", { y: 10, opacity: 0, stagger: 0.08, duration: 0.45 }, "-=0.3")
          .from(".hero__card-wrap", { y: 28, opacity: 0, duration: 0.9, ease: "expo.out" }, 0.35)
          .from(".hero__row", { y: 8, opacity: 0, stagger: 0.07, duration: 0.45 }, "-=0.5")
          .from(".hero__bar", { scaleX: 0, duration: 0.9, stagger: 0.07, ease: "power3.inOut" }, "-=0.5")
          .from(".hero__stats", { opacity: 0, y: 12, duration: 0.6 }, "-=0.6");

        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count);
          const suffix = el.dataset.suffix ?? "";
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 1.5,
            delay: 0.9,
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
          <span className="hero__status">
            <span className="hero__dot" aria-hidden />
            Volunteer registrations are open
          </span>

          <h1 className="hero__title">
            <span className="hero__line">
              <span className="hero__line-inner">Where developers</span>
            </span>
            <span className="hero__line">
              <span className="hero__line-inner">give back.</span>
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

            <label className="hero__select-wrap">
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
              <svg className="hero__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </label>

            <button type="submit" className="hero__btn">Search events</button>
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
              Host an event
            </Link>
          </div>
        </div>

        {/* Roster card */}
        <div className="hero__visual">
          <div className="hero__card-wrap">
            <article className="hero__card">
              <header className="hero__card-head">
                <div className="hero__card-top">
                  <span className="hero__chip">Hackathon</span>
                  <span className="hero__open">
                    <span className="hero__dot" aria-hidden />
                    Open
                  </span>
                </div>
                <h2 className="hero__card-title">Dhaka Hackathon 2026</h2>
                <div className="hero__meta">
                  <span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <rect x="3" y="5" width="18" height="16" rx="2" />
                      <path d="M16 3v4M8 3v4M3 11h18" />
                    </svg>
                    12 Nov 2026
                  </span>
                  <span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    Dhaka
                  </span>
                </div>
              </header>

              <div className="hero__rows">
                {ROSTER.map(({ role, filled: f, total }) => {
                  const isFull = f === total;
                  return (
                    <div key={role} className="hero__row">
                      <div className="hero__row-top">
                        <span className="hero__row-name">{role}</span>
                        <span className="hero__row-count">
                          {isFull && <span className="hero__full">Full</span>}
                          {f} of {total}
                        </span>
                      </div>
                      <div className="hero__track" aria-hidden>
                        <div
                          className={`hero__bar${isFull ? " hero__bar--full" : ""}`}
                          style={{ width: `${(f / total) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <footer className="hero__card-foot">
                <div className="hero__left">
                  <strong>{capacity - filled} slots left</strong>
                  <span>{filled} of {capacity} filled. Closes in 2 days</span>
                </div>
                <Link href="/events" className="hero__card-link">
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
            <div key={s.label} className="hero__stat">
              <div className="hero__stat-num" data-count={s.value} data-suffix={s.suffix}>
                {s.value.toLocaleString()}
                {s.suffix}
              </div>
              <div className="hero__stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}