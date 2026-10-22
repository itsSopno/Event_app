"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES = [
    { label: "Hackathon", value: "hackathon" },
    { label: "Workshop", value: "workshop" },
    { label: "Meetup", value: "meetup" },
    { label: "Webinar", value: "webinar" },
    { label: "Conference", value: "conference" },
    { label: "Bootcamp", value: "bootcamp" },
    { label: "Competition", value: "competition" },
    { label: "Volunteering", value: "volunteering" },
    { label: "Environment", value: "environment" },
    { label: "Education", value: "education" },
    { label: "Health", value: "health" },
    { label: "Community", value: "community" },
    { label: "Sports", value: "sports" },
    { label: "Arts", value: "arts" },
    { label: "Food", value: "food" },
    { label: "Technology", value: "technology" },
    { label: "Other", value: "other" },
];

interface EventData {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    category: string;
    maxCapacity: number;
    requiredSkills: string[];
    registrationDeadline: string;
    status: string;
}

export default function EditEventPage() {
    const { id } = useParams<{ id: string }>();
    const { user, loading } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({
        title: "", description: "", date: "", location: "",
        category: "workshop", maxCapacity: 20, requiredSkills: "", registrationDeadline: "",
    });
    const [fetching, setFetching] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (loading) return;
        if (!user || user.role !== "organizer") { router.replace("/login"); return; }
        api
            .get<{ data: EventData }>(`/api/events/${id}`)
            .then((res) => {
                const ev = res.data;
                setForm({
                    title: ev.title,
                    description: ev.description,
                    date: ev.date ? new Date(ev.date).toISOString().slice(0, 16) : "",
                    location: ev.location,
                    category: ev.category,
                    maxCapacity: ev.maxCapacity,
                    requiredSkills: Array.isArray(ev.requiredSkills) ? ev.requiredSkills.join(", ") : "",
                    registrationDeadline: ev.registrationDeadline
                        ? new Date(ev.registrationDeadline).toISOString().slice(0, 16)
                        : "",
                });
            })
            .catch(() => router.push("/dashboard/organizer/events"))
            .finally(() => setFetching(false));
    }, [user, loading, router, id]);

    const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
        setForm((prev) => ({ ...prev, [k]: v }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            const skills = form.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean);
            await api.put(`/api/events/${id}`, { ...form, requiredSkills: skills });
            router.push("/dashboard/organizer/events");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Update failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-[#051817] flex items-center justify-center">
                <div className="text-[#4eca8b] animate-pulse">Loading event…</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#051817] text-white">
            <div className="max-w-3xl mx-auto px-4 py-10">
                <button onClick={() => router.back()} className="text-gray-400 hover:text-[#4eca8b] mb-6 flex items-center gap-1 transition">← Back</button>
                <p className="text-[#4eca8b] font-mono text-sm mb-1"><span className="opacity-60">//</span> Organizer</p>
                <h1 className="text-3xl font-bold mb-8">Edit Event</h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-300 mb-1.5">Event Title *</label>
                            <input type="text" required value={form.title} onChange={(e) => set("title", e.target.value)}
                                className="w-full bg-[#071f1e] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-300 mb-1.5">Description *</label>
                            <textarea required rows={5} value={form.description} onChange={(e) => set("description", e.target.value)}
                                className="w-full bg-[#071f1e] border border-[#0d3330] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4eca8b] transition resize-none" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300 mb-1.5">Event Date *</label>
                            <input type="datetime-local" required value={form.date} onChange={(e) => set("date", e.target.value)}
                                className="w-full bg-[#071f1e] border border-[#0d3330] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4eca8b] transition" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300 mb-1.5">Registration Deadline *</label>
                            <input type="datetime-local" required value={form.registrationDeadline} onChange={(e) => set("registrationDeadline", e.target.value)}
                                className="w-full bg-[#071f1e] border border-[#0d3330] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4eca8b] transition" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300 mb-1.5">Location *</label>
                            <input type="text" required value={form.location} onChange={(e) => set("location", e.target.value)}
                                className="w-full bg-[#071f1e] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300 mb-1.5">Category *</label>
                            <select value={form.category} onChange={(e) => set("category", e.target.value)}
                                className="w-full bg-[#071f1e] border border-[#0d3330] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4eca8b] transition">
                                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300 mb-1.5">Max Capacity *</label>
                            <input type="number" min={1} required value={form.maxCapacity} onChange={(e) => set("maxCapacity", parseInt(e.target.value))}
                                className="w-full bg-[#071f1e] border border-[#0d3330] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4eca8b] transition" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300 mb-1.5">Required Skills (comma separated)</label>
                            <input type="text" value={form.requiredSkills} onChange={(e) => set("requiredSkills", e.target.value)}
                                placeholder="React, Node.js, Communication"
                                className="w-full bg-[#071f1e] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition" />
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">{error}</p>
                    )}

                    <div className="flex gap-3">
                        <button type="button" onClick={() => router.back()}
                            className="flex-1 py-3 rounded-lg border border-[#0d3330] text-gray-300 hover:border-[#4eca8b] transition">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting}
                            className="flex-1 py-3 rounded-lg bg-[#4eca8b] text-[#051817] font-semibold hover:bg-[#3db87a] transition disabled:opacity-60">
                            {submitting ? "Saving…" : "Save Changes →"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
