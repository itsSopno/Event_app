"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import GridLines from "@/components/shared/GridLines/GridLines";

interface FullUser {
    _id: string;
    name: string;
    email: string;
    role: "organizer" | "volunteer" | "public";
    bio?: string;
    skills?: string[];
    interests?: string[];
    avatar?: string;
    location?: string;
    phone?: string;
    profileCompleted: boolean;
    createdAt: string;
}

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

const ROLE_BADGE: Record<string, { label: string; color: string }> = {
    organizer: { label: "Organizer 🎯", color: "bg-purple-900/30 text-purple-400 border-purple-800" },
    volunteer: { label: "Volunteer 🙋", color: "bg-blue-900/30 text-blue-400 border-blue-800" },
    public: { label: "Public 👀", color: "bg-gray-800 text-gray-400 border-gray-700" },
};

export default function ProfileContent() {
    const router = useRouter();
    const { user: authUser, logout } = useAuth();

    const [profile, setProfile] = useState<FullUser | null>(null);
    const [fetching, setFetching] = useState(true);
    const [editing, setEditing] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    // Edit form state
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [skills, setSkills] = useState("");
    const [interests, setInterests] = useState("");
    const [location, setLocation] = useState("");
    const [phone, setPhone] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editError, setEditError] = useState("");
    const [editSuccess, setEditSuccess] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    // Password state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [pwLoading, setPwLoading] = useState(false);
    const [pwError, setPwError] = useState("");
    const [pwSuccess, setPwSuccess] = useState("");

    // Redirect if not logged in
    useEffect(() => {
        if (!authUser && !fetching) router.replace("/login");
    }, [authUser, fetching, router]);

    // Fetch full profile from /api/auth/me
    useEffect(() => {
        api.get<{ data: FullUser }>("/api/auth/me")
            .then((res) => {
                setProfile(res.data);
                setName(res.data.name);
                setBio(res.data.bio ?? "");
                setSkills(res.data.skills?.join(", ") ?? "");
                setInterests(res.data.interests?.join(", ") ?? "");
                setLocation(res.data.location ?? "");
                setPhone(res.data.phone ?? "");
                setAvatarUrl(res.data.avatar ?? "");
                setAvatarPreview(res.data.avatar ?? "");
            })
            .catch(() => router.replace("/login"))
            .finally(() => setFetching(false));
    }, [router]);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarPreview(URL.createObjectURL(file));
        setUploading(true);
        try {
            const url = await uploadToImgBB(file);
            setAvatarUrl(url);
        } catch {
            setEditError("Image upload failed.");
            setAvatarPreview(avatarUrl);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setEditError("");
        setEditSuccess("");
        try {
            const res = await api.put<{ data: FullUser }>("/api/auth/profile", {
                name,
                bio,
                skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
                interests: interests.split(",").map((s) => s.trim()).filter(Boolean),
                location,
                phone,
                avatar: avatarUrl,
            });
            setProfile(res.data);
            setEditSuccess("Profile updated successfully!");
            setEditing(false);
        } catch (err) {
            setEditError(err instanceof Error ? err.message : "Update failed");
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwLoading(true);
        setPwError("");
        setPwSuccess("");
        try {
            await api.put("/api/auth/change-password", { currentPassword, newPassword });
            setPwSuccess("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setChangingPassword(false);
        } catch (err) {
            setPwError(err instanceof Error ? err.message : "Failed to change password");
        } finally {
            setPwLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-[#051817] flex items-center justify-center">
                <div className="text-[#4eca8b] animate-pulse text-lg">Loading profile…</div>
            </div>
        );
    }

    if (!profile) return null;

    const badge = ROLE_BADGE[profile.role] ?? ROLE_BADGE.public;
    const initials = profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    const joinedDate = new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });

    return (
        <main className="relative min-h-screen bg-[#051817] bg-[image:radial-gradient(ellipse_at_75%_30%,#0a2a28_0%,transparent_60%)] text-white">
            <GridLines />
            <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">

                {/* Back */}
                <button
                    onClick={() => router.back()}
                    className="text-gray-400 hover:text-[#4eca8b] transition mb-8 flex items-center gap-1 text-sm"
                >
                    ← Back
                </button>

                {/* Header card */}
                <div className="bg-[#071f1e] border border-[#0d3330] rounded-2xl p-6 md:p-8 mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            {profile.avatar ? (
                                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#4eca8b]/40 relative">
                                    <Image src={profile.avatar} alt={profile.name} fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-[#4eca8b] flex items-center justify-center text-[#051817] text-2xl font-bold border-2 border-[#4eca8b]/40">
                                    {initials}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold">{profile.name}</h1>
                                <span className={`text-xs px-2.5 py-1 rounded-full border ${badge.color}`}>
                                    {badge.label}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm">{profile.email}</p>
                            <p className="text-gray-600 text-xs mt-1">Member since {joinedDate}</p>
                            {profile.location && (
                                <p className="text-gray-400 text-sm mt-1">📍 {profile.location}</p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => { setEditing(true); setEditSuccess(""); setEditError(""); }}
                                className="px-4 py-2 rounded-lg bg-[#4eca8b] text-[#051817] text-sm font-semibold hover:bg-[#3db87a] transition"
                            >
                                Edit Profile
                            </button>
                            <button
                                onClick={logout}
                                className="px-4 py-2 rounded-lg border border-red-800 text-red-400 text-sm hover:bg-red-900/20 transition"
                            >
                                Log out
                            </button>
                        </div>
                    </div>

                    {/* Bio */}
                    {profile.bio && (
                        <div className="mt-5 pt-5 border-t border-[#0d3330]">
                            <p className="text-gray-300 text-sm leading-relaxed">{profile.bio}</p>
                        </div>
                    )}
                </div>

                {/* Success message */}
                {editSuccess && (
                    <div className="mb-4 text-green-400 text-sm bg-green-900/20 border border-green-800 rounded-lg px-4 py-3">
                        {editSuccess}
                    </div>
                )}
                {pwSuccess && (
                    <div className="mb-4 text-green-400 text-sm bg-green-900/20 border border-green-800 rounded-lg px-4 py-3">
                        {pwSuccess}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Skills */}
                    {profile.skills && profile.skills.length > 0 && (
                        <div className="bg-[#071f1e] border border-[#0d3330] rounded-2xl p-6">
                            <h2 className="text-sm font-semibold text-gray-300 mb-3">🛠️ Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map((s) => (
                                    <span key={s} className="text-xs bg-[#0a2a27] border border-[#0d3330] text-gray-300 px-3 py-1 rounded-lg">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Interests */}
                    {profile.interests && profile.interests.length > 0 && (
                        <div className="bg-[#071f1e] border border-[#0d3330] rounded-2xl p-6">
                            <h2 className="text-sm font-semibold text-gray-300 mb-3">💡 Interests</h2>
                            <div className="flex flex-wrap gap-2">
                                {profile.interests.map((s) => (
                                    <span key={s} className="text-xs bg-[#4eca8b]/10 border border-[#4eca8b]/20 text-[#4eca8b] px-3 py-1 rounded-lg">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Contact */}
                    {profile.phone && (
                        <div className="bg-[#071f1e] border border-[#0d3330] rounded-2xl p-6">
                            <h2 className="text-sm font-semibold text-gray-300 mb-3">📞 Contact</h2>
                            <p className="text-gray-400 text-sm">{profile.phone}</p>
                        </div>
                    )}

                    {/* Change Password */}
                    <div className="bg-[#071f1e] border border-[#0d3330] rounded-2xl p-6">
                        <h2 className="text-sm font-semibold text-gray-300 mb-3">🔐 Security</h2>
                        {!changingPassword ? (
                            <button
                                onClick={() => setChangingPassword(true)}
                                className="text-sm text-[#4eca8b] hover:underline"
                            >
                                Change password →
                            </button>
                        ) : (
                            <form onSubmit={handlePasswordChange} className="space-y-3">
                                <input
                                    type="password"
                                    required
                                    placeholder="Current password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full bg-[#051817] border border-[#0d3330] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition"
                                />
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    placeholder="New password (min 8 chars)"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-[#051817] border border-[#0d3330] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition"
                                />
                                {pwError && <p className="text-red-400 text-xs">{pwError}</p>}
                                <div className="flex gap-2">
                                    <button type="submit" disabled={pwLoading}
                                        className="flex-1 py-2 rounded-lg bg-[#4eca8b] text-[#051817] text-sm font-semibold disabled:opacity-60">
                                        {pwLoading ? "Saving…" : "Save"}
                                    </button>
                                    <button type="button" onClick={() => setChangingPassword(false)}
                                        className="flex-1 py-2 rounded-lg border border-[#0d3330] text-gray-400 text-sm">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* ── Edit Profile Modal ── */}
                {editing && (
                    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
                        <div className="bg-[#071f1e] border border-[#0d3330] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Edit Profile</h2>
                                <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-white transition text-2xl leading-none">×</button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-5">
                                {/* Avatar */}
                                <div className="flex flex-col items-center gap-3">
                                    <div
                                        onClick={() => fileRef.current?.click()}
                                        className="relative w-20 h-20 rounded-full border-2 border-dashed border-[#0d3330] hover:border-[#4eca8b] cursor-pointer overflow-hidden flex items-center justify-center bg-[#051817]"
                                    >
                                        {avatarPreview ? (
                                            <Image src={avatarPreview} alt="avatar" fill className="object-cover" />
                                        ) : (
                                            <span className="text-2xl">📷</span>
                                        )}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <span className="text-[#4eca8b] text-xs animate-pulse">Uploading…</span>
                                            </div>
                                        )}
                                    </div>
                                    <button type="button" onClick={() => fileRef.current?.click()} className="text-[#4eca8b] text-xs hover:underline">
                                        {avatarPreview ? "Change photo" : "Upload photo"}
                                    </button>
                                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1.5">Full Name</label>
                                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-[#051817] border border-[#0d3330] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4eca8b] transition" />
                                </div>

                                {/* Bio */}
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1.5">Bio</label>
                                    <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} maxLength={500}
                                        className="w-full bg-[#051817] border border-[#0d3330] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4eca8b] transition resize-none" />
                                    <p className="text-gray-600 text-xs text-right mt-1">{bio.length}/500</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Skills */}
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-1.5">Skills <span className="text-gray-600">(comma separated)</span></label>
                                        <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)}
                                            placeholder="React, Design, Communication"
                                            className="w-full bg-[#051817] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition" />
                                    </div>

                                    {/* Interests */}
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-1.5">Interests <span className="text-gray-600">(comma separated)</span></label>
                                        <input type="text" value={interests} onChange={(e) => setInterests(e.target.value)}
                                            placeholder="Technology, Art, Education"
                                            className="w-full bg-[#051817] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition" />
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-1.5">Location</label>
                                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                                            placeholder="Dhaka, Bangladesh"
                                            className="w-full bg-[#051817] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition" />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-1.5">Phone</label>
                                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+880 1xxx xxxxxx"
                                            className="w-full bg-[#051817] border border-[#0d3330] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] transition" />
                                    </div>
                                </div>

                                {editError && (
                                    <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">{editError}</p>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setEditing(false)}
                                        className="flex-1 py-3 rounded-lg border border-[#0d3330] text-gray-300 hover:border-[#4eca8b] transition text-sm">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={saving || uploading}
                                        className="flex-1 py-3 rounded-lg bg-[#4eca8b] text-[#051817] font-semibold hover:bg-[#3db87a] transition disabled:opacity-60 text-sm">
                                        {saving ? "Saving…" : "Save changes →"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
