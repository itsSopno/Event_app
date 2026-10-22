"use client";

import { useEffect, useState } from "react";
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

const EYE_INTERVAL = 20 * 60;
const LOOK_SECONDS = 20;

export default function EyeRulePage() {
    const [enabled, setEnabled] = useState(false);
    const [eye, setEye] = useState<{ phase: "waiting" | "looking"; left: number }>({
        phase: "waiting",
        left: EYE_INTERVAL,
    });

    useEffect(() => {
        if (!enabled) return;
        const id = setInterval(() => {
            setEye((p) => {
                if (p.left > 1) return { ...p, left: p.left - 1 };
                return p.phase === "waiting"
                    ? { phase: "looking", left: LOOK_SECONDS }
                    : { phase: "waiting", left: EYE_INTERVAL };
            });
        }, 1000);
        return () => clearInterval(id);
    }, [enabled]);

    // fire the reminder when the look-away phase begins
    useEffect(() => {
        if (enabled && eye.phase === "looking" && eye.left === LOOK_SECONDS) {
            beep();
            notify(
                "Look away for 20 seconds",
                "Focus on something about 20 feet (6 m) away."
            );
        }
    }, [enabled, eye.phase, eye.left]);

    function toggle() {
        if (!enabled) requestNotifyPermission();
        setEye({ phase: "waiting", left: EYE_INTERVAL });
        setEnabled((e) => !e);
    }

    return (
        <PageShell
            eyebrow="Eye care"
            title={
                <>
                    The 20-20-20
                    <br />
                    rule.
                </>
            }
            intro="Every 20 minutes, look at something 20 feet (6 metres) away for 20 seconds. It reduces eye strain and screen fatigue."
        >
            <Card
                tag="$ eyes --rule 20-20-20"
                title="Eye break reminder"
                desc="Turn it on and keep this tab open while you code. We will play a soft sound and show a notification when it is time to look away."
                className="mx-auto max-w-xl"
            >
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">
                    {enabled ? "next reminder in" : "reminder is off"}
                </p>
                <p className="font-mono text-5xl font-bold tabular-nums sm:text-6xl">
                    {enabled ? fmt(eye.left) : "--:--"}
                </p>

                <div className="mt-8">
                    <button onClick={toggle} className={enabled ? btnGhost : btnPrimary}>
                        {enabled ? "Turn off reminder" : "Turn on reminder"}
                    </button>
                </div>
            </Card>

            <p className="mx-auto mt-10 max-w-xl font-mono text-[12px] leading-relaxed text-white/45">
                <span className="text-[#d6f33a]">&gt;</span> The reminder only works
                while this tab stays open. Blink often and keep your screen about an
                arm&apos;s length away.
            </p>

            {enabled && eye.phase === "looking" && (
                <div
                    role="alertdialog"
                    aria-label="Look away from the screen"
                    className="fixed inset-0 z-50 grid place-items-center bg-[#041a17]/95 px-6 text-center"
                >
                    <div>
                        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#d6f33a]">
                            // eye break
                        </p>
                        <h3 className="mt-3 text-4xl font-bold sm:text-6xl">
                            Look away from the screen
                        </h3>
                        <p className="mx-auto mt-4 max-w-md text-white/65">
                            Focus on something about 20 feet (6 m) away. Out the window
                            works well.
                        </p>
                        <p className="mt-8 font-mono text-7xl font-bold tabular-nums text-[#d6f33a]">
                            {eye.left}
                        </p>
                        <button
                            className={`${btnGhost} mt-10`}
                            onClick={() => setEye({ phase: "waiting", left: EYE_INTERVAL })}
                        >
                            Skip
                        </button>
                    </div>
                </div>
            )}
        </PageShell>
    );
}
