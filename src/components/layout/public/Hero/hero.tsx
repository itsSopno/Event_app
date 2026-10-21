"use client";

import "./hero.css";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const CATEGORIES = ["Hackathon", "Workshop", "Meetup", "Contest", "Bootcamp", "Webinar"];
const ROLES = ["Mentor", "Judge", "Speaker", "Tech Support", "Registration Desk", "Photographer"];
const SKILLS = [
  "React", "Next.js", "TypeScript", "Python", "Node.js", "UI/UX",
  "Mentoring", "Public Speaking", "DevOps", "Data Science", "Flutter", "Judging",
];

const RING_LENGTH = 276.46;
const REGISTERED = 17;
const CAPACITY = 20;

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
        /* ---------- Intro ---------- */
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".hero__eyebrow", { y: 16, opacity: 0, duration: 0.6 })
          .from(".hero__word", { yPercent: 110, duration: 1, stagger: 0.07, ease: "power4.out" }, "-=0.3")
          .fromTo(
            ".hero__underline path",
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" },
            "-=0.4"
          )
          .from(".hero__sub", { y: 20, opacity: 0, duration: 0.7 }, "-=0.6")
          .from(".hero__search", { y: 24, opacity: 0, scale: 0.97, duration: 0.7 }, "-=0.5")
          .from(".hero__links > *", { y: 12, opacity: 0, stagger: 0.08, duration: 0.5 }, "-=0.4")
          .from(
            ".tile",
            { y: 60, opacity: 0, scale: 0.94, duration: 0.9, stagger: 0.12, ease: "expo.out" },
            "-=0.3"
          )
          .fromTo(
            ".ring__bar",
            { strokeDashoffset: RING_LENGTH },
            { strokeDashoffset: RING_LENGTH * (1 - REGISTERED / CAPACITY), duration: 1.4, ease: "power3.out" },
            "-=0.6"
          )
          .from(".role", { y: 14, opacity: 0, stagger: 0.06, duration: 0.5 }, "-=1")
          .from(".hero__marquee", { opacity: 0, duration: 0.8 }, "-=0.4");

        /* ---------- Count-up ---------- */
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count);
          const suffix = el.dataset.suffix ?? "";
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 1.8,
            delay: 1.2,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = Math.round(obj.v).toLocaleString() + suffix;
            },
          });
        });

        /* ---------- Role highlight loop ---------- */
        const roleEls = gsap.utils.toArray<HTMLElement>(".role");
        let idx = 0;
        const cycle = gsap.delayedCall(2.4, function tick() {
          roleEls.forEach((r, i) => r.classList.toggle("role--active", i === idx));
          idx = (idx + 1) % roleEls.length;
          cycle.restart(true);
        });

        /* ---------- Marquee ---------- */
        const marquee = gsap.to(".hero__track", {
          xPercent: -50,
          duration: 40,
          repeat: -1,
          ease: "none",
        });
        const marqueeEl = root.current?.querySelector(".hero__marquee");
        const slow = () => gsap.to(marquee, { timeScale: 0.2, duration: 0.5 });
        const fast = () => gsap.to(marquee, { timeScale: 1, duration: 0.5 });
        marqueeEl?.addEventListener("mouseenter", slow);
        marqueeEl?.addEventListener("mouseleave", fast);

        /* ---------- Glow drift ---------- */
        gsap.to(".hero__glow", { scale: 1.12, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });

        /* ---------- Tile tilt (desktop only) ---------- */
        const cleanups: Array<() => void> = [];
        if (window.matchMedia("(hover: hover) and (min-width: 1025px)").matches) {
          gsap.utils.toArray<HTMLElement>(".tile:not(.tile--stack)").forEach((tile) => {
            const rx = gsap.quickTo(tile, "rotateX", { duration: 0.6, ease: "power3" });
            const ry = gsap.quickTo(tile, "rotateY", { duration: 0.6, ease: "power3" });
            const move = (e: MouseEvent) => {
              const b = tile.getBoundingClientRect();
              const nx = (e.clientX - b.left) / b.width - 0.5;
              const ny = (e.clientY - b.top) / b.height - 0.5;
              rx(-ny * 6);
              ry(nx * 8);
            };
            const leave = () => {
              rx(0);
              ry(0);
            };
            tile.addEventListener("mousemove", move);
            tile.addEventListener("mouseleave", leave);
            cleanups.push(() => {
              tile.removeEventListener("mousemove", move);
              tile.removeEventListener("mouseleave", leave);
            });
          });
        }

        return () => {
          cycle.kill();
          marqueeEl?.removeEventListener("mouseenter", slow);
          marqueeEl?.removeEventListener("mouseleave", fast);
          cleanups.forEach((fn) => fn());
        };
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  const headline: Array<{ words: string[]; mark?: boolean }> = [
    { words: ["Where", "developers"] },
    { words: ["give", "back."], mark: true },
  ];

  return (
    <section ref={root} className="hero">
      <div className="hero__dots" />
      <div className="hero__glow" />

      <div className="hero__container">
        <div className="hero__top">
          <div className="hero__eyebrow">
            <span className="hero__pulse" />
            Volunteer slots open for 12 events
          </div>

          <h1 className="hero__title">
            {headline.map((line, li) => (
              <span key={li} className="hero__line">
                {line.words.map((w, wi) => {
                  const isLast = line.mark && wi === line.words.length - 1;
                  return (
                    <span key={w}>
                      <span className="hero__word">
                        {isLast ? (
                          <span className="hero__mark">
                            {w}
                            <svg className="hero__underline" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden>
                              <path d="M2 8 C 50 2, 120 2, 198 7" pathLength={1} />
                            </svg>
                          </span>
                        ) : (
                          w
                        )}
                      </span>
                      {wi < line.words.length - 1 ? " " : ""}
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>

          <p className="hero__sub">
            Mentor at hackathons, judge coding contests, speak at meetups. Or host your own
            event and manage every volunteer in one place.
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

          <div className="hero__links">
            <Link href="/register?role=volunteer" className="hero__link hero__link--strong">
              Become a volunteer
            </Link>
            <Link href="/register?role=organizer" className="hero__link">
              I&apos;m hosting an event →
            </Link>
          </div>
        </div>

        {/* Bento */}
        <div className="hero__bento">
          <article className="tile tile--event">
            <div className="event__head">
              <span className="tile__label">Featured event</span>
              <span className="chip">Hackathon</span>
            </div>
            <h2 className="event__title">Dhaka Hackathon 2026</h2>
            <p className="event__meta">12 Nov 2026 · Dhaka</p>

            <div className="event__body">
              <div className="ring">
                <svg viewBox="0 0 100 100" aria-hidden>
                  <circle className="ring__track" cx="50" cy="50" r="44" />
                  <circle className="ring__bar" cx="50" cy="50" r="44" />
                </svg>
                <div className="ring__text">
                  <span className="ring__num" data-count="3">3</span>
                  <span className="ring__sub">slots left</span>
                </div>
              </div>
              <div className="event__facts">
                <div>
                  <strong>{REGISTERED} / {CAPACITY}</strong>
                  <span>volunteers registered</span>
                </div>
                <div>
                  <strong className="event__deadline">Closes in 2 days</strong>
                  <span>registration deadline</span>
                </div>
              </div>
            </div>
          </article>

          <article className="tile tile--roles">
            <span className="tile__label">Pick your role</span>
            <h3 className="roles__title">Bring the skills you already have</h3>
            <div className="roles__list">
              {ROLES.map((r) => (
                <span key={r} className="role">{r}</span>
              ))}
            </div>
            <div className="roles__foot">
              <div className="avatars" aria-hidden>
                <span>RA</span>
                <span>SK</span>
                <span>MH</span>
                <span>+9</span>
              </div>
              Mentors joined this week
            </div>
          </article>

          <div className="tile tile--stack">
            <article className="tile">
              <span className="tile__label">Volunteers</span>
              <div className="stat__num" data-count="1280" data-suffix="+">1,280+</div>
              <p className="stat__note">across 6 cities</p>
            </article>
            <article className="tile tile--lime">
              <span className="tile__label">Events hosted</span>
              <div className="stat__num" data-count="86">86</div>
              <p className="stat__note">and counting</p>
            </article>
          </div>
        </div>
      </div>

      <div className="hero__marquee">
        <div className="hero__track">
          {[...SKILLS, ...SKILLS].map((skill, i) => (
            <span key={i} className="hero__skill">{skill}</span>
          ))}
        </div>
      </div>
    </section>
  );
}