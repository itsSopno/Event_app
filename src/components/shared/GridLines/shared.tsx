import Link from "next/link";

/* ---------------------------------- helpers --------------------------------- */

export const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export function beep() {
    try {
        const ctx = new (window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
                .webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 660;
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
        osc.start();
        osc.stop(ctx.currentTime + 0.85);
    } catch {
        /* audio not available, ignore */
    }
}

export function notify(title: string, body: string) {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission === "granted") {
        new Notification(title, { body });
    }
}

export function requestNotifyPermission() {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission === "default") {
        Notification.requestPermission();
    }
}

/* ------------------------------- button styles ------------------------------- */

export const btnPrimary =
    "bg-[#d6f33a] px-5 py-2.5 font-bold text-[#041a17] transition hover:brightness-105 active:translate-y-px disabled:opacity-50";
export const btnGhost =
    "border border-white/20 px-5 py-2.5 font-semibold text-white/80 transition hover:border-[#d6f33a] hover:text-[#d6f33a]";

/* --------------------------------- layout UI --------------------------------- */

/** Page wrapper: dark green background, grid lines, back link, heading. */
export function PageShell({
    eyebrow,
    title,
    intro,
    back = true,
    maxWidth = "max-w-3xl",
    children,
}: {
    eyebrow: string;
    title: React.ReactNode;
    intro: string;
    back?: boolean;
    maxWidth?: string;
    children: React.ReactNode;
}) {
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#041a17] px-4 pb-20 pt-28 text-white">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(900px 500px at 85% -10%, rgba(214,243,58,0.08), transparent 60%), radial-gradient(700px 500px at 0% 100%, rgba(40,90,80,0.35), transparent 60%)",
                }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px)",
                    backgroundSize: "270px 100%",
                    backgroundPosition: "center",
                }}
            />

            <div className={`relative mx-auto w-full ${maxWidth}`}>
                {back && (
                    <Link
                        href="/take-a-break"
                        className="mb-8 inline-block font-mono text-[12px] uppercase tracking-[0.14em] text-white/55 transition hover:text-[#d6f33a]"
                    >
                        &larr; all break tools
                    </Link>
                )}
                <header className="mb-12">
                    <p className="mb-3 text-[15px] italic">
                        <span className="mr-1 text-[#d6f33a]">//</span>
                        {eyebrow}
                    </p>
                    <h1 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
                        {title}
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65">
                        {intro}
                    </p>
                </header>
                {children}
            </div>
        </main>
    );
}

export function Card({
    tag,
    title,
    desc,
    children,
    className = "",
}: {
    tag: string;
    title: string;
    desc: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section
            className={`relative border border-white/12 bg-[#08241f]/75 p-6 backdrop-blur-sm sm:p-8 ${className}`}
        >
            <span className="absolute -left-[5px] -top-[9px] text-base leading-none text-white/50">
                +
            </span>
            <span className="absolute -bottom-[9px] -right-[5px] text-base leading-none text-white/50">
                +
            </span>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#d6f33a]">
                {tag}
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                {title}
            </h2>
            <p className="mb-6 mt-1.5 text-sm leading-relaxed text-white/60">
                {desc}
            </p>
            {children}
        </section>
    );
}
