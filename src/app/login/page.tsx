// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";

// export default function LoginPage() {
//     const router = useRouter();
//     const { login } = useAuth();
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     async function handleSubmit(e: React.FormEvent) {
//         e.preventDefault();
//         setError("");
//         setLoading(true);
//         try {
//             await login(email, password);
//             router.push("/dashboard");
//         } catch (err: unknown) {
//             setError(err instanceof Error ? err.message : "Login failed");
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <main className="min-h-screen flex items-center justify-center px-4 bg-[#051817]">
//             <div className="w-full max-w-md">
//                 <div className="bg-[#071f1e] border border-[#0d3330] rounded-2xl p-8 shadow-2xl">
//                     <p className="text-[#4eca8b] text-sm font-mono mb-2">
//                         <span className="opacity-60">//</span> Welcome back
//                     </p>
//                     <h1 className="text-3xl font-bold text-white mb-1">Sign in</h1>
//                     <p className="text-gray-400 text-sm mb-8">
//                         New here?{" "}
//                         <Link href="/singup" className="text-[#4eca8b] hover:underline">
//                             Create account
//                         </Link>
//                     </p>

//                     <form onSubmit={handleSubmit} className="space-y-5">
//                         <div>
//                             <label className="block text-sm text-gray-300 mb-1.5">Email</label>
//                             <input
//                                 type="email"
//                                 required
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 placeholder="you@example.com"
//                                 className="w-full bg-[#0a2a27] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm text-gray-300 mb-1.5">Password</label>
//                             <input
//                                 type="password"
//                                 required
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 placeholder="••••••••"
//                                 className="w-full bg-[#0a2a27] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition"
//                             />
//                         </div>

//                         {error && (
//                             <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">
//                                 {error}
//                             </p>
//                         )}

//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full bg-[#4eca8b] hover:bg-[#3db87a] text-[#051817] font-semibold py-3 rounded-lg transition disabled:opacity-60 flex items-center justify-center gap-2"
//                         >
//                             {loading ? "Signing in…" : "Sign in →"}
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         </main>
//     );
// }
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// [text, tailwind color class] tokens for the fake code window
type Token = [string, string];
const codeLines: Token[][] = [
    [["// authenticate, then get back to building", "text-white/40"]],
    [
        ["const ", "text-[#d6f33a]"],
        ["dev ", "text-white"],
        ["= ", "text-white/60"],
        ["await ", "text-[#d6f33a]"],
        ["login", "text-[#7dd3c0]"],
        ["(email, password);", "text-white/80"],
    ],
    [],
    [
        ["if ", "text-[#d6f33a]"],
        ["(dev.", "text-white/80"],
        ["isAuthenticated", "text-white"],
        [") {", "text-white/80"],
    ],
    [
        ["  router.", "text-white/80"],
        ["push", "text-[#7dd3c0]"],
        ["(", "text-white/80"],
        ['"/dashboard"', "text-[#f0b35c]"],
        [");", "text-white/80"],
    ],
    [["  // hackathons, workshops, meetups", "text-white/40"]],
    [["}", "text-white/80"]],
];

const tags = ["#hackathons", "#workshops", "#meetups", "#open-source"];

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
            router.push("/dashboard");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    }

    const inputClass =
        "w-full bg-white/[0.04] border border-white/15 px-4 py-3 text-white placeholder-white/35 outline-none transition focus:border-[#d6f33a] focus:bg-[#d6f33a]/5";
    const labelClass =
        "block mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/60";

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#041a17] px-4 pb-16 pt-28 text-white">
            {/* background glow + grid lines, same feel as the hero */}
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

            <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
                {/* LEFT: copy + code window (below the form on mobile) */}
                <section className="order-2 lg:order-1">
                    <p className="mb-3 text-[15px] italic">
                        <span className="mr-1 text-[#d6f33a]">//</span>Welcome back,
                        developer
                    </p>
                    <h1 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
                        Log in and
                        <br />
                        ship something new.
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65">
                        Pick up where you left off. Check your events, manage your
                        registrations and keep building with the Sinners_Code
                        community.
                    </p>

                    {/* code window */}
                    <div className="mt-8 max-w-xl overflow-hidden border border-white/12 bg-[#031412]/80">
                        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                            <div className="flex gap-1.5">
                                <span className="h-2.5 w-2.5 bg-white/20" />
                                <span className="h-2.5 w-2.5 bg-white/20" />
                                <span className="h-2.5 w-2.5 bg-[#d6f33a]" />
                            </div>
                            <span className="font-mono text-[11px] tracking-wider text-white/45">
                                login.ts
                            </span>
                        </div>
                        <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-6 sm:text-[13px]">
                            {codeLines.map((line, i) => (
                                <div key={i} className="flex">
                                    <span className="mr-4 w-4 select-none text-right text-white/25">
                                        {i + 1}
                                    </span>
                                    <code>
                                        {line.length === 0
                                            ? "\u00A0"
                                            : line.map(([text, color], j) => (
                                                  <span key={j} className={color}>
                                                      {text}
                                                  </span>
                                              ))}
                                    </code>
                                </div>
                            ))}
                        </pre>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {tags.map((t) => (
                            <span
                                key={t}
                                className="border border-white/15 px-2.5 py-1 font-mono text-[11px] tracking-wide text-white/60"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                </section>

                {/* RIGHT: form (first on mobile) */}
                <section className="relative order-1 border border-white/12 bg-[#08241f]/75 p-6 backdrop-blur-sm sm:p-8 lg:order-2">
                    <span className="absolute -left-[5px] -top-[9px] text-base leading-none text-white/50">
                        +
                    </span>
                    <span className="absolute -bottom-[9px] -right-[5px] text-base leading-none text-white/50">
                        +
                    </span>

                    <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#d6f33a]">
                        $ auth --login
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight">Sign in</h2>
                    <p className="mb-7 mt-1.5 text-sm text-white/60">
                        New here?{" "}
                        <Link href="/singup" className="text-[#d6f33a] hover:underline">
                            Create account
                        </Link>
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className={labelClass}>
                                email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className={labelClass}>
                                password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`${inputClass} pr-16`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] uppercase tracking-widest text-white/60 hover:text-[#d6f33a]"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p
                                role="alert"
                                className="border border-red-400/40 bg-red-400/10 px-4 py-3 font-mono text-[13px] text-red-300"
                            >
                                <span className="mr-1">Error:</span>
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-between bg-white pl-4 font-bold text-[#041a17] transition hover:bg-[#d6f33a] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Authenticating…" : "Sign in"}
                            <span className="ml-3 grid h-[46px] w-[46px] place-items-center bg-[#041a17] text-white">
                                →
                            </span>
                        </button>
                    </form>

                    <p className="mt-6 border-t border-white/10 pt-5 font-mono text-[12px] leading-relaxed text-white/50">
                        <span className="text-[#d6f33a]">&gt;</span> Applied as a
                        volunteer? You can log in once an admin approves your request.
                    </p>
                </section>
            </div>
        </main>
    );
}