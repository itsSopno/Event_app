"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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

    return (
        <main className="min-h-screen flex items-center justify-center px-4 bg-[#051817]">
            <div className="w-full max-w-md">
                <div className="bg-[#071f1e] border border-[#0d3330] rounded-2xl p-8 shadow-2xl">
                    <p className="text-[#4eca8b] text-sm font-mono mb-2">
                        <span className="opacity-60">//</span> Welcome back
                    </p>
                    <h1 className="text-3xl font-bold text-white mb-1">Sign in</h1>
                    <p className="text-gray-400 text-sm mb-8">
                        New here?{" "}
                        <Link href="/singup" className="text-[#4eca8b] hover:underline">
                            Create account
                        </Link>
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
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
                                placeholder="••••••••"
                                className="w-full bg-[#0a2a27] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition"
                            />
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#4eca8b] hover:bg-[#3db87a] text-[#051817] font-semibold py-3 rounded-lg transition disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {loading ? "Signing in…" : "Sign in →"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
