"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth, ProfileData } from "@/context/AuthContext";

type Role = "public" | "volunteer" | "organizer";

const ROLES: { value: Role; emoji: string; label: string; desc: string }[] = [
    {
        value: "public",
        emoji: "👀",
        label: "Public",
        desc: "Browse and discover events without commitment",
    },
    {
        value: "volunteer",
        emoji: "🙋",
        label: "Volunteer",
        desc: "Join events and contribute your time & skills",
    },
    {
        value: "organizer",
        emoji: "🎯",
        label: "Organizer",
        desc: "Create and manage community events",
    },
];

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

export default function SetupProfileContent() {
    const router = useRouter();
    const { user, completeProfile, loading } = useAuth();

    const [role, setRole] = useState<Role>("public");
    const [bio, setBio] = useState("");
    const [skills, setSkills] = useState("");
    const [interests, setInterests] = useState("");
    const [location, setLocation] = useState("");
    const [phone, setPhone] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    // If already profile completed, redirect
    if (!loading && user?.profileCompleted) {
        router.replace("/dashboard");
        return null;
    }

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarPreview(URL.createObjectURL(file));
        setUploading(true);
        setError("");
        try {
            const url = await uploadToImgBB(file);
            setAvatarUrl(url);
        } catch {
            setError("Image upload failed. Please try again.");
            setAvatarPreview("");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            const payload: ProfileData = {
                role,
                bio: bio.trim() || undefined,
                skills: skills.trim() || undefined,
                interests: interests.trim() || undefined,
                location: location.trim() || undefined,
                phone: phone.trim() || undefined,
                avatar: avatarUrl || undefined,
            };
            await completeProfile(payload);
            // Redirect based on role
            if (role === "organizer") router.push("/dashboard/organizer");
            else if (role === "volunteer") router.push("/dashboard");
            else router.push("/events");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to save profile");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#051817] text-white py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-10 text-center">
                    <p className="text-[#4eca8b] font-mono text-sm mb-2">
                        <span className="opacity-60">//</span> Step 2 of 2
                    </p>
                    <h1 className="text-3xl font-bold mb-2">Set up your profile</h1>
                    <p className="text-gray-400">
                        Tell us about yourself so we can personalise your experience.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-3">
                        <div
                            onClick={() => fileRef.current?.click()}
                            className="w-24 h-24 rounded-full border-2 border-dashed border-[#0d3330] hover:border-[#4eca8b] transition cursor-pointer overflow-hidden flex items-center justify-center bg-[#071f1e] relative"
                        >
                            {avatarPreview ? (
                                <Image src={avatarPreview} alt="avatar preview" fill className="object-cover" />
                            ) : (
                                <span className="text-3xl">📷</span>
                            )}
                            {uploading && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <span className="text-[#4eca8b] text-xs animate-pulse">Uploading…</span>
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="text-[#4eca8b] text-sm hover:underline"
                        >
                            {avatarPreview ? "Change photo" : "Upload profile photo"}
                        </button>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-3 font-medium">
                            How will you use the platform? *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {ROLES.map((r) => (
                                <button
                                    key={r.value}
                                    type="button"
                                    onClick={() => setRole(r.value)}
                                    className={`p-4 rounded-xl border text-left transition ${
                                        role === r.value
                                            ? "bg-[#4eca8b]/10 border-[#4eca8b] text-white"
                                            : "bg-[#071f1e] border-[#0d3330] text-gray-400 hover:border-[#4eca8b]/50"
                                    }`}
                                >
                                    <span className="text-2xl block mb-2">{r.emoji}</span>
                                    <span className="font-semibold text-sm block mb-1">{r.label}</span>
                                    <span className="text-xs opacity-70">{r.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-1.5">Bio</label>
                        <textarea
                            rows={3}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell others a little about yourself…"
                            maxLength={500}
                            className="w-full bg-[#071f1e] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition resize-none"
                        />
                        <p className="text-gray-600 text-xs mt-1 text-right">{bio.length}/500</p>
                    </div>

                    {/* Skills & Interests — shown for volunteer/organizer */}
                    {(role === "volunteer" || role === "organizer") && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm text-gray-300 mb-1.5">
                                    Skills <span className="text-gray-600">(comma separated)</span>
                                </label>
                                <input
                                    type="text"
                                    value={skills}
                                    onChange={(e) => setSkills(e.target.value)}
                                    placeholder="React, Design, Communication"
                                    className="w-full bg-[#071f1e] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-1.5">
                                    Interests <span className="text-gray-600">(comma separated)</span>
                                </label>
                                <input
                                    type="text"
                                    value={interests}
                                    onChange={(e) => setInterests(e.target.value)}
                                    placeholder="Technology, Art, Education"
                                    className="w-full bg-[#071f1e] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition"
                                />
                            </div>
                        </div>
                    )}

                    {/* Location & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm text-gray-300 mb-1.5">Location</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Dhaka, Bangladesh"
                                className="w-full bg-[#071f1e] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300 mb-1.5">Phone</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+880 1xxx xxxxxx"
                                className="w-full bg-[#071f1e] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting || uploading}
                        className="w-full bg-[#4eca8b] hover:bg-[#3db87a] text-[#051817] font-semibold py-3 rounded-lg transition disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {submitting ? "Saving profile…" : "Complete profile →"}
                    </button>

                    <p className="text-center text-gray-600 text-sm">
                        You can update these details anytime from your profile settings.
                    </p>
                </form>
            </div>
        </main>
    );
}
