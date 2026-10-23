"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

async function uploadToImgBB(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
        { method: "POST", body: formData }
    );
    if (!res.ok) throw new Error("Image upload failed");
    const json = await res.json();
    return json.data.url as string;
}

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

interface AiResult {
    description: string;
    roles: string[];
    skills: string[];
    promotional: string;
}

const LIME = "#d6f53c";

const inputCls =
    "w-full bg-[#0a2523]/70 border border-[#6fe0c8]/15 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#d6f53c] transition";

function Section({ tag, hint, children }: { tag: string; hint: string; children: React.ReactNode }) {
    return (
        <section className="bg-[#14100f] border border-white/5 rounded-2xl p-6">
            <div className="mb-5 pb-4 border-b border-white/5">
                <p className="text-xs" style={{ color: LIME }}>
                    <span className="opacity-60">//</span> {tag}
                </p>
                <p className="text-gray-500 text-xs mt-1">{hint}</p>
            </div>
            {children}
        </section>
    );
}

function Field({ label, required, className = "", children }: { label: string; required?: boolean; className?: string; children: React.ReactNode }) {
    return (
        <label className={`block ${className}`}>
            <span className="block text-[11px] text-gray-400 mb-1.5">
                {label}
                {required && <span style={{ color: LIME }}> *</span>}
            </span>
            {children}
        </label>
    );
}

export default function CreateEventPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [form, setForm] = useState({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "workshop",
        maxCapacity: 20,
        requiredSkills: "",
        registrationDeadline: "",
    });
    const [imageUrl, setImageUrl] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [imageUploading, setImageUploading] = useState(false);
    const imageRef = useRef<HTMLInputElement>(null);
    const [aiIdea, setAiIdea] = useState("");
    const [aiResult, setAiResult] = useState<AiResult | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImagePreview(URL.createObjectURL(file));
        setImageUploading(true);
        setError("");
        try {
            const url = await uploadToImgBB(file);
            setImageUrl(url);
        } catch {
            setError("Image upload failed. Please try again.");
            setImagePreview("");
        } finally {
            setImageUploading(false);
        }
    };

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
            await api.post("/api/events", {
                ...form,
                requiredSkills: skills,
                status,
                image: imageUrl || undefined,
            });
            router.push("/dashboard/organizer/events");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to create event");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#051817] text-white font-mono">
            <div className="max-w-3xl mx-auto px-4 py-12 border-x border-dashed border-[#6fe0c8]/15">
                <button
                    onClick={() => router.back()}
                    className="text-xs text-gray-400 hover:text-[#6c7686] transition mb-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6c7686] rounded"
                >
                    ← Back
                </button>

                <p className="text-[11px] mb-3" style={{ color: LIME }}>
                    <span className="opacity-60">//</span> organizer
                </p>
                <h1 className="font-sans text-5xl md:text-6xl font-black leading-[0.95] tracking-tight bg-gradient-to-b from-[#9bb3b0] to-[#4a6664] bg-clip-text text-transparent mb-10">
                    Create
                    <br />
                    new event
                </h1>

                {/* AI Assistant */}
                <div className="relative bg-[#14100f] border border-[#d6f53c]/30 rounded-2xl p-6 mb-6">
                    <p className="text-xs mb-1" style={{ color: LIME }}>
                        <span className="opacity-60">//</span> ai_assistant
                    </p>
                    <h2 className="font-sans text-xl font-semibold mb-1">Draft with AI</h2>
                    <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                        Describe your idea in one line. We fill in the description and required skills, and write a promo message.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={aiIdea}
                            onChange={(e) => setAiIdea(e.target.value)}
                            placeholder="e.g. A coding bootcamp for beginners"
                            className={inputCls}
                        />
                        <button
                            type="button"
                            onClick={handleAI}
                            disabled={aiLoading || !aiIdea.trim()}
                            className="text-[#051817] font-bold px-5 py-3 rounded-lg transition disabled:opacity-50 text-xs whitespace-nowrap hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d6f53c]"
                            style={{ background: LIME }}
                        >
                            {aiLoading ? "Generating…" : "Generate draft"}
                        </button>
                    </div>

                    {aiResult && (
                        <div className="mt-6 space-y-3 text-xs">
                            <div className="rounded-lg p-4 border border-white/5 bg-[#0a2523]/50">
                                <p className="text-gray-500 mb-1.5">// description</p>
                                <p className="text-gray-200 leading-relaxed">{aiResult.description}</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="rounded-lg p-4 border border-white/5 bg-[#0a2523]/50">
                                    <p className="text-gray-500 mb-2">// suggested_roles</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {aiResult.roles?.map((r) => (
                                            <span key={r} className="px-2.5 py-1 rounded-full border border-[#6fe0c8]/20 text-gray-300">{r}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="rounded-lg p-4 border border-white/5 bg-[#0a2523]/50">
                                    <p className="text-gray-500 mb-2">// required_skills</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {aiResult.skills?.map((s) => (
                                            <span key={s} className="px-2.5 py-1 rounded-full border border-[#6fe0c8]/20 text-gray-300">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg p-4 border border-white/5 bg-[#0a2523]/50">
                                <p className="text-gray-500 mb-1.5">// promo_message</p>
                                <p className="text-gray-200 leading-relaxed">{aiResult.promotional}</p>
                            </div>
                            <p style={{ color: LIME }}>Description and skills are filled in below. Review them before you publish.</p>
                        </div>
                    )}
                </div>

                {/* Form */}
                <form className="space-y-6">
                    <Section tag="basics" hint="What the event is called and what it is about.">
                        <div className="grid grid-cols-1 gap-5">
                            <Field label="Event title" required>
                                <input
                                    type="text"
                                    required
                                    value={form.title}
                                    onChange={(e) => set("title", e.target.value)}
                                    placeholder="Dhaka Hackathon 2026"
                                    className={inputCls}
                                />
                            </Field>
                            <Field label="Description" required>
                                <textarea
                                    required
                                    rows={5}
                                    value={form.description}
                                    onChange={(e) => set("description", e.target.value)}
                                    placeholder="What will people do, learn or build?"
                                    className={`${inputCls} resize-none leading-relaxed`}
                                />
                            </Field>
                            <Field label="Category" required>
                                <select
                                    value={form.category}
                                    onChange={(e) => set("category", e.target.value)}
                                    className={inputCls}
                                >
                                    {CATEGORIES.map((c) => (
                                        <option key={c.value} value={c.value}>{c.label}</option>
                                    ))}
                                </select>
                            </Field>
                        </div>
                    </Section>

                    <Section tag="schedule" hint="When and where it happens.">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Field label="Event date" required>
                                <input
                                    type="datetime-local"
                                    required
                                    value={form.date}
                                    onChange={(e) => set("date", e.target.value)}
                                    className={`${inputCls} [color-scheme:dark]`}
                                />
                            </Field>
                            <Field label="Registration deadline" required>
                                <input
                                    type="datetime-local"
                                    required
                                    value={form.registrationDeadline}
                                    onChange={(e) => set("registrationDeadline", e.target.value)}
                                    className={`${inputCls} [color-scheme:dark]`}
                                />
                            </Field>
                            <Field label="Location" required className="md:col-span-2">
                                <input
                                    type="text"
                                    required
                                    value={form.location}
                                    onChange={(e) => set("location", e.target.value)}
                                    placeholder="Dhaka, Bangladesh"
                                    className={inputCls}
                                />
                            </Field>
                        </div>
                    </Section>

                    <Section tag="volunteers" hint="How many people you need and what they should know.">
                        <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-5">
                            <Field label="Max capacity" required>
                                <input
                                    type="number"
                                    min={1}
                                    required
                                    value={form.maxCapacity}
                                    onChange={(e) => set("maxCapacity", parseInt(e.target.value))}
                                    className={inputCls}
                                />
                            </Field>
                            <Field label="Required skills, separated by commas">
                                <input
                                    type="text"
                                    value={form.requiredSkills}
                                    onChange={(e) => set("requiredSkills", e.target.value)}
                                    placeholder="React, Node.js, Communication"
                                    className={inputCls}
                                />
                            </Field>
                        </div>
                    </Section>

                    <Section tag="banner" hint="Shown at the top of your event page.">
                        <button
                            type="button"
                            onClick={() => imageRef.current?.click()}
                            className={`relative w-full h-48 rounded-xl border border-dashed overflow-hidden flex items-center justify-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d6f53c] ${imagePreview ? "border-[#d6f53c]" : "border-[#6fe0c8]/25 hover:border-[#d6f53c]/70"
                                }`}
                            style={
                                imagePreview
                                    ? undefined
                                    : {
                                        backgroundColor: "#0a2523",
                                        backgroundImage:
                                            "linear-gradient(rgba(111,224,200,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(111,224,200,.1) 1px, transparent 1px)",
                                        backgroundSize: "28px 28px",
                                    }
                            }
                        >
                            {imagePreview ? (
                                <Image src={imagePreview} alt="Event banner preview" fill className="object-cover" />
                            ) : (
                                <div className="text-center">
                                    <span className="block text-sm text-gray-200">Upload a banner image</span>
                                    <span className="block text-[11px] text-gray-500 mt-1">PNG, JPG or WEBP, up to 10 MB</span>
                                </div>
                            )}
                            {imageUploading && (
                                <div className="absolute inset-0 bg-[#051817]/80 flex items-center justify-center">
                                    <span className="animate-pulse text-xs" style={{ color: LIME }}>Uploading…</span>
                                </div>
                            )}
                            {imagePreview && !imageUploading && (
                                <span
                                    className="absolute bottom-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded text-[#051817]"
                                    style={{ background: LIME }}
                                >
                                    Uploaded. Click to replace
                                </span>
                            )}
                        </button>
                        <input
                            ref={imageRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </Section>

                    {error && (
                        <p role="alert" className="text-red-300 text-xs bg-red-900/20 border border-red-800/60 rounded-lg px-4 py-3">
                            {error}
                        </p>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, "draft")}
                            disabled={submitting || imageUploading}
                            className="flex-1 py-3 rounded-full border border-[#6fe0c8]/25 text-xs text-gray-200 hover:border-[#6c7686] transition disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d6f53c]"
                        >
                            Save as draft
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, "published")}
                            disabled={submitting || imageUploading}
                            className="flex-1 py-3 rounded-full text-xs font-bold text-[#051817] hover:brightness-110 transition disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d6f53c]"
                            style={{ background: LIME }}
                        >
                            {submitting ? "Publishing…" : "Publish event"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}