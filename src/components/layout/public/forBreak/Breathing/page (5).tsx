"use client";

import { useEffect, useRef, useState } from "react";
import { Card, PageShell, btnGhost, btnPrimary } from "../_components/shared";
import GridLines from "@/components/shared/GridLines/GridLines";

type Step = { label: string; secs: number; scale: number };
type PatternKey = "box" | "relax" | "easy";

const PATTERNS: Record<PatternKey, { name: string; hint: string; steps: Step[] }> = {
    box: {
        name: "Box 4-4-4-4",
        hint: "Calm and steady. Good before a hard task.",
        steps: [
            { label: "Inhale", secs: 4, scale: 1 },
            { label: "Hold", secs: 4, scale: 1 },
            { label: "Exhale", secs: 4, scale: 0.6 },
            { label: "Hold", secs: 4, scale: 0.6 },
        ],
    },
    relax: {
        name: "4-7-8",
        hint: "Slower breathing to unwind and de-stress.",
        steps: [
            { label: "Inhale", secs: 4, scale: 1 },
            { label: "Hold", secs: 7, scale: 1 },
            { label: "Exhale", secs: 8, scale: 0.6 },
        ],
    },
    easy: {
        name: "Easy 4-6",
        hint: "Simple. Longer exhale to slow your heart rate.",
        steps: [
            { label: "Inhale", secs: 4, scale: 1 },
            { label: "Exhale", secs: 6, scale: 0.6 },
        ],
    },
};

export default function BreathingPage() {
    const [key, setKey] = useState<PatternKey>("box");
    const [active, setActive] = useState(false);
    const [pos, setPos] = useState({ idx: 0, left: 4 });
    const [cycles, setCycles] = useState(0);

    const steps = PATTERNS[key].steps;
    const step = steps[pos.idx] ?? steps[0];
    const prevIdx = useRef(0);

    useEffect(() => {
        if (!active) return;
        const id = setInterval(() => {
            setPos((p) => {
                if (p.left > 1) return { ...p, left: p.left - 1 };
                const next = (p.idx + 1) % steps.length;
                return { idx: next, left: steps[next].secs };
            });
        }, 1000);
        return () => clearInterval(id);
    }, [active, steps]);

    // count a cycle each time we wrap back to the first step
    useEffect(() => {
        if (active && prevIdx.current === steps.length - 1 && pos.idx === 0) {
            setCycles((c) => c + 1);
        }
        prevIdx.current = pos.idx;
    }, [pos.idx, active, steps.length]);

    function start() {
        setPos({ idx: 0, left: steps[0].secs });
        prevIdx.current = 0;
        setActive(true);
    }
    function stop() {
        setActive(false);
        setPos({ idx: 0, left: steps[0].secs });
    }
    function choose(k: PatternKey) {
        setActive(false);
        setKey(k);
        setCycles(0);
        setPos({ idx: 0, left: PATTERNS[k].steps[0].secs });
    }

    return (
        <PageShell
            eyebrow="Breathing"
            title={
                <>
                    Breathe for
                    <br />
                    one minute.
                </>
            }
            intro="Follow the circle. Slow breathing lowers stress and helps you think clearly again. Sit back, relax your shoulders and unclench your jaw."
        >
          
            <Card
                tag="$ breathe --pattern"
                title="Breathing exercise"
                desc="Choose a pattern and breathe in time with the circle."
                className="mx-auto max-w-xl"
            >
                  <GridLines/>
                <div className="mb-3 flex flex-wrap gap-2">
                    {(Object.keys(PATTERNS) as PatternKey[]).map((k) => (
                        <button
                            key={k}
                            onClick={() => choose(k)}
                            className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition ${
                                key === k
                                    ? "bg-[#d6f33a] text-[#041a17]"
                                    : "border border-white/20 text-white/60 hover:text-white"
                            }`}
                        >
                            {PATTERNS[k].name}
                        </button>
                    ))}
                </div>
                <p className="mb-5 font-mono text-[12px] text-white/50">
                    <span className="text-[#d6f33a]">&gt;</span> {PATTERNS[key].hint}
                </p>

                <div className="relative mx-auto grid h-[240px] w-[240px] place-items-center">
                    <div className="absolute inset-0 border border-dashed border-white/15" />
                    <div
                        className="grid h-[220px] w-[220px] place-items-center rounded-full border border-[#d6f33a]/60 bg-[#d6f33a]/10"
                        style={{
                            transform: `scale(${active ? step.scale : 0.6})`,
                            transition: `transform ${
                                active ? step.secs : 0.4
                            }s ease-in-out`,
                        }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold">
                            {active ? step.label : "Ready"}
                        </span>
                        <span className="mt-1 font-mono text-sm text-white/55">
                            {active ? `${pos.left}s` : "press start"}
                        </span>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    {active ? (
                        <button className={btnGhost} onClick={stop}>
                            Stop
                        </button>
                    ) : (
                        <button className={btnPrimary} onClick={start}>
                            Start breathing
                        </button>
                    )}
                </div>
                <p className="mt-5 text-center font-mono text-[12px] text-white/55">
                    cycles completed: {cycles}
                </p>
            </Card>
        </PageShell>
    );
}
