"use client";

import "./hero.css";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import image from './hero.jpg'
gsap.registerPlugin(useGSAP);

const BRAND = "Sinners_Code";

const TECH = [
  { name: "Next.js", mark: "N" },
  { name: "React", mark: "R" },
  { name: "TypeScript", mark: "TS" },
  { name: "Node.js", mark: "No" },
  { name: "MongoDB", mark: "Mo" },
  { name: "Tailwind CSS", mark: "Tw" },
  { name: "GitHub", mark: "Gh" },
  { name: "Vercel", mark: "V" },
  { name: "Docker", mark: "Do" },
  { name: "Python", mark: "Py" },
];

const CODE: { t: string; c?: string }[][] = [
  [{ t: "const ", c: "k" }, { t: "event", c: "v" }, { t: " = {" }],
  [{ t: "  title: " }, { t: '"Dhaka Hackathon"', c: "s" }, { t: "," }],
  [{ t: "  roles: [" }, { t: '"Mentor"', c: "s" }, { t: ", " }, { t: '"Judge"', c: "s" }, { t: "]," }],
  [{ t: "  slots: " }, { t: "12", c: "n" }, { t: "," }],
  [{ t: "};" }],
  [],
  [{ t: "volunteer", c: "v" }, { t: ".join(event);" }],
];

// Put your photo in /public/images/featured-event.jpg (portrait, about 540x680 or bigger).
const FEATURED = {
  image: "/images/featured-event.jpg",
  alt: "hero image",
  caption: "A   good programmer has a lot of projects",
  slots: "127.0.0.1",
};

const VLINES = [0, 20, 60, 80, 100];

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Bolt() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

function TechGroup({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="hero__group" aria-hidden={hidden}>
      {TECH.map((t) => (
        <li key={t.name} className="hero__tech">
          <span className="hero__tech-mark">{t.mark}</span>
          {t.name}
        </li>
      ))}
    </ul>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [imgFailed, setImgFailed] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".hero__label", { y: 10, opacity: 0, duration: 0.5 })
          .from(".hero__line-inner", { yPercent: 105, duration: 0.9, stagger: 0.1, ease: "power4.out" }, "-=0.2")
          .from(".hero__sub", { y: 14, opacity: 0, duration: 0.5 }, "-=0.45")
          .from(".hero__cta", { y: 12, opacity: 0, duration: 0.5 }, "-=0.35")
          .from(".hero__feature", { y: 28, opacity: 0, duration: 0.9, ease: "expo.out" }, 0.45)
          .from(".hero__trust", { opacity: 0, y: 10, duration: 0.6 }, "-=0.5");

        gsap.to(".hero__gear svg", {
          rotation: 360,
          duration: 70,
          ease: "none",
          repeat: -1,
          transformOrigin: "50% 50%",
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="hero">
      {/* Grid frame */}
      <div className="hero__lines" aria-hidden>
        <div className="hero__lines-inner">
          {VLINES.map((p) => (
            <span
              key={p}
              className={`hero__vline${p === 0 || p === 100 ? "" : " hero__vline--inner"}`}
              style={{ left: `calc(${p}% - ${p === 100 ? 1 : 0}px)` }}
            />
          ))}
          <span className="hero__hline hero__hline--top" />
          <span className="hero__hline hero__hline--bottom" />
        </div>
      </div>

      {/* Decorative gear */}
      <div className="hero__gear" aria-hidden>
        <svg viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="44">
          {Array.from({ length: 8 }).map((_, i) => (
            <path key={i} d="M200 128 C 262 128, 300 92, 304 18" transform={`rotate(${i * 45} 200 200)`} />
          ))}
        </svg>
      </div>

      <div className="hero__inner">
        <p className="hero__label">
          <span>//</span> Meet {BRAND}
        </p>
        
        <h1 className="hero__title">
          <span className="hero__line">
            <span className="hero__line-inner">We Power Tech Events</span>
          </span>
          <span className="hero__line">
            <span className="hero__line-inner">That Build Community.</span>
          </span>
        </h1>

        <div className="hero__copy">
          <p className="hero__sub">
            {BRAND} oirganize hackathons, workshops and meetups, and bring in skilled volunteers to run them. Join as a mentor, judge or helper, or support our events in any other way you can
          </p>

          <Link href="/events" className="hero__cta">
            Explore Events
            <span className="hero__cta-icon">
              <Arrow />
            </span>
          </Link>
        </div>

        {/* Featured event */}
        <Link href="/events" className="hero__feature" aria-label="Featured event: Dhaka Hackathon 2026">
          <span className="hero__feature-label">
            <Bolt /> 
          </span>

          <div className={`hero__shot${imgFailed ? " hero__shot--fallback" : ""}`}>
            {imgFailed ? (
              <div className="hero__window">
                <div className="hero__window-bar">
                  <i /> <i /> <i />
                  <span>dhaka-hackathon.ts</span>
                </div>
                <pre className="hero__code">
                  {CODE.map((line, i) => (
                    <div key={i} className="hero__code-line">
                      {line.map((tok, j) => (
                        <span key={j} className={tok.c ? `hero__tok-${tok.c}` : undefined}>
                          {tok.t}
                        </span>
                      ))}
                    </div>
                  ))}
                </pre>
              </div>
            ) : (
              <Image
                src={image}
                alt={FEATURED.alt}
                fill
                priority
                sizes="(max-width: 1024px) 340px, 270px"
                className="hero__img"
                onError={() => setImgFailed(true)}
              />
            )}
            <span className="hero__slots">{FEATURED.slots}</span>
          </div>

          <span className="hero__caption">{FEATURED.caption}</span>
        </Link>

        {/* Tech marquee */}
        <div className="hero__trust">
          <p className="hero__trust-label">Powered by the stack developers love</p>
          <div className="hero__marquee">
            <div className="hero__track">
              <TechGroup />
              <TechGroup hidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}