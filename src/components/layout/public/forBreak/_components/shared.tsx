"use client";

import { ReactNode } from "react";
import GridLines from "@/components/shared/GridLines/GridLines";

// ── Button styles ─────────────────────────────────────────────────────────────
export const btnPrimary =
    "bg-[#d6f33a] text-[#041a17] font-mono text-[12px] uppercase tracking-[0.14em] px-5 py-2.5 transition hover:brightness-110 active:scale-95";

export const btnGhost =
    "border border-white/25 text-white/70 font-mono text-[12px] uppercase tracking-[0.14em] px-5 py-2.5 transition hover:border-white/50 hover:text-white active:scale-95";

// ── Utilities ─────────────────────────────────────────────────────────────────

/** Format seconds → MM:SS */
export function fmt(secs: number): string {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

/** Play a soft 440 Hz beep via Web Audio API */
export function beep(duration = 0.25, freq = 440, vol = 0.25): void {
    if (typeof window === "undefined") return;
    try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    } catch {
        // AudioContext not available — silently ignore
    }
}

/** Show a browser notification (if permission granted) */
export function notify(title: string, body: string): void {
    if (typeof window === "undefined") return;
    if (Notification.permission === "granted") {
        new Notification(title, { body });
    }
}

/** Request notification permission */
export function requestNotifyPermission(): void {
    if (typeof window === "undefined") return;
    if (Notification.permission === "default") {
        Notification.requestPermission();
    }
}

// ── Card ──────────────────────────────────────────────────────────────────────
interface CardProps {
    tag?: string;
    title: string;
    desc?: string;
    className?: string;
    children?: ReactNode;
}

export function Card({ tag, title, desc, className = "", children }: CardProps) {
    return (
        <div
            className={`border border-white/10 bg-[#071f1e] p-6 sm:p-8 ${className}`}
        >
            {tag && (
                <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[#d6f33a]/70">
                    {tag}
                </p>
            )}
            <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
            {desc && (
                <p className="mt-2 font-mono text-[12px] leading-relaxed text-white/50">
                    {desc}
                </p>
            )}
            {children && <div className="mt-6">{children}</div>}
        </div>
    );
}

// ── PageShell ─────────────────────────────────────────────────────────────────
interface PageShellProps {
    eyebrow?: string;
    title: ReactNode;
    intro?: string;
    children?: ReactNode;
}

export function PageShell({ eyebrow, title, intro, children }: PageShellProps) {
    return (
        <main className="relative min-h-screen bg-[#051817] bg-[image:radial-gradient(ellipse_at_75%_30%,#0a2a28_0%,transparent_60%)] px-6 py-16 text-white sm:px-10">
            <GridLines />
            <div className="relative mx-auto max-w-3xl z-10">
                {eyebrow && (
                    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#d6f33a]/70">
                        // {eyebrow}
                    </p>
                )}
                <h1 className="text-4xl font-bold leading-tight sm:text-6xl">{title}</h1>
                {intro && (
                    <p className="mt-5 max-w-xl font-mono text-[13px] leading-relaxed text-white/55">
                        {intro}
                    </p>
                )}
                <div className="mt-12 space-y-8">{children}</div>
            </div>
        </main>
    );
}
