"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES = [
    "Hackathon", "Workshop", "Meetup", "Webinar", "Conference",
    "Bootcamp", "Competition", "Volunteering", "Other",
];

interface AiResult {
    description: string;
    roles: string[];
    skills: string[];
    promotional: string;
}

export default function CreateEventPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [form, setForm] = useState({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "Workshop",
        maxCapacity: 20,
        requiredSkills: "",
        registrationDeadline: "",
    });
    const [aiIdea, setAiIdea] = useState("");
    const [aiResult, setAiResult] = useState<AiResult | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    if (!loading && (!user || user.role !== "organizer")) {
        router.replace("/login");
        return null;
    }

    const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
        setForm((prev) => ({ ...prev, [k]: v }));

    const handleAI = async () => {
        if (!aiIdea.trim()) return;
        setAiLoading(true);
        setAiResult(null);
        try {
            const res = await api.post<{ data: AiResult }>("/api/ai/generate-description", {
                idea: aiIdea,
            });
            setAiResult(res.data);
            if (res.data.description) set("description", res.data.description);
            if (res.data.skills?.length)
                set("requiredSkills", res.data.skills.join(", "));
        } catch {
            // fallback mock
            const mock: AiResult = {
                description: `${aiIdea} — A community-driven event designed to bring together passionate individuals to collaborate, learn, and grow. Participants will engage in hands-on activities with expert mentors and fellow enthusiasts.`,
                roles: ["Mentor", "Coordinator", "Technical Support", "Participant"],
                skills: ["Communication", "Problem Solving", "Teamwork", "Leadership"],
                promotional: `Join us for an exciting ${aiIdea}! Connect with like-minded people, learn from experts, and make a real impact in your community. Register now before spots fill up!`,
            };
            setAiResult(mock);
            set("description", mock.description);
            set("requiredSkills", mock.skills.join(", "));
        } finally {
            setAiLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent, status: "draft" | "published") => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            const skills = form.requiredSkills
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
            await api.post("/api/events", { ...form, requiredSkills: skills, status });
            router.push("/dashboard/organizer/events");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to create event");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#051817] text-white">
            <div className="max-w-3xl mx-auto px-4 py-10">
                <button
                    onClick={() => router.back()}
                    className="text-gray-400 hover:text-[#4eca8b] transition mb-6 flex items-center gap-1"
                >
                    ← Back
                </button>
                <p className="text-[#4eca8b] font-mono text-sm mb-1">
                    <span className="opacity-60">//</span> Organizer
                </p>
                <h1 className="text-3xl font-bold mb-8">Create New Event</h1>

                {/* AI Assistant */}
                <div className="bg-gradient-to-br from-[#0a2a27] to-[#071f1e] border border-[#4eca8b]/30 rounded-xl p-6 mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">✨</span>
                        <h2 className="text-lg font-semibold text-[#4eca8b]">AI Event Description Assistant</h2>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                        Describe your event idea and AI will generate a description, skills, and promotional message.
                    </p>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={aiIdea}
                            onChange={(e) => setAiIdea(e.target.value)}
                            placeholder="e.g. We want to organize a coding bootcamp for beginners"
                            className="flex-1 bg-[#051817] border border-[#0d3330] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition text-sm"
                        />
                        <button
                            type="button"
                            onClick={handleAI}
                            disabled={aiLoading || !aiIdea.trim()}
                            className="bg-[#4eca8b] hover:bg-[#3db87a] text-[#051817] font-semibold px-4 py-2.5 rounded-lg transition disabled:opacity-60 text-sm whitespace-nowrap"
                        >
                            {aiLoading ? "Generating…" : "Generate ✨"}
                        </button>
                    </div>

                    {aiResult && (
                        <div className="mt-5 space-y-3 text-sm">
                            <div className="bg-[#051817] rounded-lg p-4 border border-[#0d3330]">
                                <p className="text-gray-400 text-xs mb-1">📝 Description</p>
                                <p className="text-gray-200">{aiResult.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-[#051817] rounded-lg p-4 border border-[#0d3330]">
                                    <p className="text-gray-400 text-xs mb-2">🎭 Suggested Roles</p>
                                    <ul className="space-y-1">
                                        {aiResult.roles?.map((r) => (
                                            <li key={r} className="text-gray-300 flex items-center gap-1.5">
                                                <span className="text-[#4eca8b] text-xs">→</span>{r}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-[#051817] rounded-lg p-4 border border-[#0d3330]">
                                    <p className="text-gray-400 text-xs mb-2">🛠️ Required Skills</p>
                                    <ul className="space-y-1">
                                        {aiResult.skills?.map((s) => (
                                            <li key={s} className="text-gray-300 flex items-center gap-1.5">
                                                <span className="text-[#4eca8b] text-xs">→</span>{s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="bg-[#051817] rounded-lg p-4 border border-[#0d3330]">
                                <p className="text-gray-400 text-xs mb-1">📣 Promotional Message</p>
                                <p className="text-gray-200 italic">"{aiResult.promotional}"</p>
                            </div>
                            <p className="text-[#4eca8b] text-xs">↑ Fields auto-filled. Review and edit below before publishing.</p>
                        </div>
                    )}
                </div>

                {/* Form */}
                <form className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-300 mb-1.5">Event Title *</label>
                            <input
                                type="text"
                                required
                                value={form.title}
                                onChange={(e) => set("title", e.target.value)}
                                placeholder="Dhaka Hackathon 2026"
                                className="w-full bg-[#071f1e] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-300 mb-1.5">Description *</label>
                            <textarea
                                required
                                rows={5}
                                value={form.description}
                                onChange={(e) => set("description", e.target.value)}
                                placeholder="Describe your event..."
                                className="w-full bg-[#071f1e] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-1.5">Event Date *</label>
                            <input
                                type="datetime-local"
                                required
                                value={form.date}
                                onChange={(e) => set("date", e.target.value)}
                                className="w-full bg-[#071f1e] border border-[#0d3330] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4eca8b] transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-1.5">Registration Deadline *</label>
                            <input
                                type="datetime-local"
                                required
                                value={form.registrationDeadline}
                                onChange={(e) => set("registrationDeadline", e.target.value)}
                                className="w-full bg-[#071f1e] border border-[#0d3330] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4eca8b] transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-1.5">Location *</label>
                            <input
                                type="text"
                                required
                                value={form.location}
                                onChange={(e) => set("location", e.target.value)}
                                placeholder="Dhaka, Bangladesh"
                                className="w-full bg-[#071f1e] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-1.5">Category *</label>
                            <select
                                value={form.category}
                                onChange={(e) => set("category", e.target.value)}
                                className="w-full bg-[#071f1e] border border-[#0d3330] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4eca8b] transition"
                            >
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-1.5">Max Volunteer Capacity *</label>
                            <input
                                type="number"
                                min={1}
                                required
                                value={form.maxCapacity}
                                onChange={(e) => set("maxCapacity", parseInt(e.target.value))}
                                className="w-full bg-[#071f1e] border border-[#0d3330] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4eca8b] transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-1.5">Required Skills (comma separated)</label>
                            <input
                                type="text"
                                value={form.requiredSkills}
                                onChange={(e) => set("requiredSkills", e.target.value)}
                                placeholder="React, Node.js, Communication"
                                className="w-full bg-[#071f1e] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">
                            {error}
                        </p>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, "draft")}
                            disabled={submitting}
                            className="flex-1 py-3 rounded-lg border border-[#0d3330] text-gray-300 hover:border-[#4eca8b] transition disabled:opacity-60"
                        >
                            Save as Draft
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, "published")}
                            disabled={submitting}
                            className="flex-1 py-3 rounded-lg bg-[#4eca8b] text-[#051817] font-semibold hover:bg-[#3db87a] transition disabled:opacity-60"
                        >
                            {submitting ? "Publishing…" : "Publish Event →"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
