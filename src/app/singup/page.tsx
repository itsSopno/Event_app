"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Role = "organizer" | "volunteer";

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("volunteer");
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
      await register(name, email, password, role);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[#051817]">
      <div className="w-full max-w-md">
        <div className="bg-[#071f1e] border border-[#0d3330] rounded-2xl p-8 shadow-2xl">
          <p className="text-[#4eca8b] text-sm font-mono mb-2">
            <span className="opacity-60">//</span> Join Sinners_Code
          </p>
          <h1 className="text-3xl font-bold text-white mb-1">Create account</h1>
          <p className="text-gray-400 text-sm mb-8">
            Already have one?{" "}
            <Link href="/login" className="text-[#4eca8b] hover:underline">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-[#0a2a27] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#0a2a27] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full bg-[#0a2a27] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">I am joining as a…</label>
              <div className="grid grid-cols-2 gap-3">
                {(["volunteer", "organizer"] as Role[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-3 rounded-lg border text-sm font-medium transition capitalize ${role === r
                        ? "bg-[#4eca8b] border-[#4eca8b] text-[#051817]"
                        : "bg-transparent border-[#0d3330] text-gray-400 hover:border-[#4eca8b]"
                      }`}
                  >
                    {r === "volunteer" ? "🙋 Volunteer" : "🎯 Organizer"}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4eca8b] hover:bg-[#3db87a] text-[#051817] font-semibold py-3 rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create account →"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}