// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";

// export default function SignupPage() {
//   const router = useRouter();
//   const { register } = useAuth();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (password.length < 8) {
//       setError("Password must be at least 8 characters.");
//       return;
//     }
//     setError("");
//     setLoading(true);
//     try {
//       await register(name, email, password);
//       // After signup → go to profile setup
//       router.push("/setup-profile");
//     } catch (err: unknown) {
//       setError(err instanceof Error ? err.message : "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <main className="min-h-screen flex items-center justify-center px-4 bg-[#051817]">
//       <div className="w-full max-w-md">
//         <div className="bg-[#071f1e] border border-[#0d3330] rounded-2xl p-8 shadow-2xl">
//           <p className="text-[#4eca8b] text-sm font-mono mb-2">
//             <span className="opacity-60">//</span> Join Sinners_Code
//           </p>
//           <h1 className="text-3xl font-bold text-white mb-1">Create account</h1>
//           <p className="text-gray-400 text-sm mb-8">
//             Already have one?{" "}
//             <Link href="/login" className="text-[#4eca8b] hover:underline">
//               Sign in
//             </Link>
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label className="block text-sm text-gray-300 mb-1.5">Full Name</label>
//               <input
//                 type="text"
//                 required
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="Your name"
//                 className="w-full bg-[#0a2a27] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition"
//               />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-300 mb-1.5">Email</label>
//               <input
//                 type="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="you@example.com"
//                 className="w-full bg-[#0a2a27] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition"
//               />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-300 mb-1.5">Password</label>
//               <input
//                 type="password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="At least 8 characters"
//                 className="w-full bg-[#0a2a27] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition"
//               />
//             </div>

//             {error && (
//               <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">
//                 {error}
//               </p>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-[#4eca8b] hover:bg-[#3db87a] text-[#051817] font-semibold py-3 rounded-lg transition disabled:opacity-60"
//             >
//               {loading ? "Creating account…" : "Continue →"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </main>
//   );
// }
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const roles = [
  {
    title: "Participant",
    desc: "Join hackathons, workshops and meetups, and build with the community.",
    note: "Instant access",
    approval: false,
  },
  {
    title: "Volunteer",
    desc: "Support events as a mentor, judge or helper.",
    note: "Needs admin approval",
    approval: true,
  },
  {
    title: "Organizer",
    desc: "Create events, manage registrations and track your analytics.",
    note: "Instant access",
    approval: false,
  },
];

const steps = [
  {
    n: "01",
    title: "Create your account",
    desc: "Add your name, email and a password.",
  },
  {
    n: "02",
    title: "Complete your registration form",
    desc: "Choose how you want to join: Participant, Volunteer or Organizer.",
  },
  {
    n: "03",
    title: "Start exploring",
    desc: "Volunteer requests are reviewed by an admin before they go live.",
  },
];

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      // After signup → registration form (choose role)
      router.push("/setup-profile");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
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

      <div className="relative mx-auto grid w-full max-w-6xl items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        {/* LEFT: intro + how it works */}
        <section>
          <p className="mb-3 text-[15px] italic">
            <span className="mr-1 text-[#d6f33a]">//</span>Join Sinners_Code
          </p>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
            Join the community.
            <br />
            Pick how you want to take part.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65">
            Sinners_Code organizes hackathons, workshops and meetups. Create
            your account first, then tell us how you want to be involved.
          </p>

          {/* steps */}
          <ol className="mt-10 space-y-5">
            {steps.map((s) => (
              <li key={s.n} className="flex gap-4">
                <span className="mt-0.5 font-mono text-sm text-[#d6f33a]">
                  {s.n}
                </span>
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="text-sm text-white/60">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* roles */}
          <div className="mt-10">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">
              Roles you can choose after signup
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {roles.map((r) => (
                <div
                  key={r.title}
                  className="border border-white/12 bg-white/[0.03] p-4"
                >
                  <p className="font-semibold">{r.title}</p>
                  <p className="mt-1.5 text-[13px] leading-snug text-white/60">
                    {r.desc}
                  </p>
                  <p
                    className={`mt-3 inline-block px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                      r.approval
                        ? "bg-[#d6f33a] text-[#041a17]"
                        : "border border-white/20 text-white/60"
                    }`}
                  >
                    {r.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RIGHT: form */}
        <section className="relative border border-white/12 bg-[#08241f]/75 p-8 backdrop-blur-sm">
          <span className="absolute -left-[5px] -top-[9px] text-base leading-none text-white/50">
            +
          </span>
          <span className="absolute -bottom-[9px] -right-[5px] text-base leading-none text-white/50">
            +
          </span>

          <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#d6f33a]">
            Step 1 of 2
          </p>
          <h2 className="text-3xl font-bold tracking-tight">Create account</h2>
          <p className="mb-7 mt-1.5 text-sm text-white/60">
            Already have one?{" "}
            <Link href="/login" className="text-[#d6f33a] hover:underline">
              Log in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className={labelClass}>
                Full name
              </label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email
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
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
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
              <p className="border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-between bg-white pl-4 font-bold text-[#041a17] transition hover:bg-[#d6f33a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Continue to registration"}
              <span className="ml-3 grid h-[46px] w-[46px] place-items-center bg-[#041a17] text-white">
                →
              </span>
            </button>
          </form>

          <div className="mt-6 border-t border-white/10 pt-5 text-[13px] leading-relaxed text-white/55">
            <p>
              <span className="text-white/80">What happens next:</span> after
              creating your account you&apos;ll fill in a short registration form
              and choose to join as a Participant, Volunteer or Organizer.
            </p>
            <p className="mt-2">
              Volunteer accounts become active once an admin approves your
              request.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}