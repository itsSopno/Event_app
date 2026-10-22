"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    Card,
    PageShell,
    btnGhost,
    btnPrimary,
    beep,
    fmt,
    notify,
    requestNotifyPermission,
} from "../_components/shared";

const MODES = {
    focus: { label: "Focus", mins: 25 },
    short: { label: "Short break", mins: 5 },
    long: { label: "Long break", mins: 15 },
} as const;
type ModeKey = keyof typeof MODES;

export default function PomodoroPage() {
    const [mode, setMode] = useState<ModeKey>("focus");
    const [remaining, setRemaining] = useState<number>(MODES.focus.mins * 60);
    const [running, setRunning] = useState(false);
    const [sessions, setSessions] = useState(0);

    const remainingRef = useRef(remaining);
    remainingRef.current = remaining;
    const sessionsRef = useRef(sessions);
    sessionsRef.current = sessions;

    const total = MODES[mode].mins * 60;

    const switchMode = useCallback((m: ModeKey) => {
        setRunning(false);
        setMode(m);
        setRemaining(MODES[m].mins * 60);
    }, []);

    // countdown based on a fixed end time, so it stays accurate in background tabs
    useEffect(() => {
        if (!running) return;
        const endAt = Date.now() + remainingRef.current * 1000;
        const id = setInterval(() => {
            const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
            setRemaining(left);
            if (left === 0) {
                clearInterval(id);
                setRunning(false);
                beep();
                if (mode === "focus") {
                    const done = sessionsRef.current + 1;
                    setSessions(done);
                    const next: ModeKey = done % 4 === 0 ? "long" : "short";
                    notify("Focus session done", "Stand up, drink water, rest your eyes.");
                    setMode(next);
                    setRemaining(MODES[next].mins * 60);
                } else {
                    notify("Break over", "Ready for the next focus session?");
                    setMode("focus");
                    setRemaining(MODES.focus.mins * 60);
                }
            }
        }, 250);
        return () => clearInterval(id);
    }, [running, mode]);

    // show the timer in the browser tab
    useEffect(() => {
        if (!running) return;
        const prev = document.title;
        document.title = `${fmt(remaining)} · ${MODES[mode].label}`;
        return () => {
            document.title = prev;
        };
    }, [running, remaining, mode]);

    const R = 88;
    const C = 2 * Math.PI * R;
    const progress = remaining / total;

    return (
        <PageShell
            eyebrow="Pomodoro"
            title={
                <>
                    Focus, then
                    <br />
                    actually rest.
                </>
            }
            intro="Work in short, focused sprints and take real breaks. After every 4 focus sessions you get a longer break. Keep this tab open while the timer runs."
        >
            <Card
                tag="$ pomodoro --start"
                title="Pomodoro timer"
                desc="Pick a mode, press start, and stay on one task until the timer ends."
                className="mx-auto max-w-xl"
            >
                <div className="mb-6 flex flex-wrap gap-2">
                    {(Object.keys(MODES) as ModeKey[]).map((k) => (
                        <button
                            key={k}
                            onClick={() => switchMode(k)}
                            className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition ${
                                mode === k
                                    ? "bg-[#d6f33a] text-[#041a17]"
                                    : "border border-white/20 text-white/60 hover:text-white"
                            }`}
                        >
                            {MODES[k].label} · {MODES[k].mins}m
                        </button>
                    ))}
                </div>

                <div className="relative mx-auto h-[240px] w-[240px]">
                    <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
                        <circle
                            cx="100"
                            cy="100"
                            r={R}
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="6"
                        />
                        <circle
                            cx="100"
                            cy="100"
                            r={R}
                            fill="none"
                            stroke="#d6f33a"
                            strokeWidth="6"
                            strokeLinecap="butt"
                            strokeDasharray={C}
                            strokeDashoffset={C * (1 - progress)}
                            style={{ transition: "stroke-dashoffset 0.3s linear" }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-mono text-5xl font-bold tabular-nums">
                            {fmt(remaining)}
                        </span>
                        <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">
                            {MODES[mode].label}
                        </span>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button
                        className={btnPrimary}
                        onClick={() => {
                            if (!running) requestNotifyPermission();
                            setRunning((r) => !r);
                        }}
                    >
                        {running ? "Pause" : remaining < total ? "Resume" : "Start"}
                    </button>
                    <button
                        className={btnGhost}
                        onClick={() => {
                            setRunning(false);
                            setRemaining(total);
                        }}
                    >
                        Reset
                    </button>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 font-mono text-[12px] text-white/55">
                    <span>sessions:</span>
                    {[0, 1, 2, 3].map((i) => (
                        <span
                            key={i}
                            className={`h-2.5 w-2.5 ${
                                i < sessions % 4 || (sessions > 0 && sessions % 4 === 0)
                                    ? "bg-[#d6f33a]"
                                    : "bg-white/15"
                            }`}
                        />
                    ))}
                    <span className="ml-1">{sessions} done</span>
                </div>
            </Card>

            <p className="mx-auto mt-10 max-w-xl font-mono text-[12px] leading-relaxed text-white/45">
                <span className="text-[#d6f33a]">&gt;</span> During breaks: stand up,
                drink water, stretch. Do not open another screen.
            </p>
        </PageShell>
    );
}
