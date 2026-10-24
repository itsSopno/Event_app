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

const ROLE_BADGE: Record<string, { label: string; dot: string; text: string }> = {
    organizer: { label: "Organizer", dot: "bg-purple-400", text: "text-purple-300" },
    volunteer: { label: "Volunteer", dot: "bg-sky-400", text: "text-sky-300" },
    public: { label: "Community member", dot: "bg-gray-400", text: "text-gray-300" },
};

const inputCls =
    "w-full bg-[#051817] border border-[#0d3330] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#4eca8b] focus:ring-1 focus:ring-[#4eca8b]/40 transition";

/* ---------- small icons (inline, no dependency) ---------- */
const Icon = {
    mail: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
        </svg>
    ),
    phone: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
        </svg>
    ),
    pin: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
            <circle cx="12" cy="10" r="2.5" />
        </svg>
    ),
    calendar: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
    ),
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

    // Close the edit drawer with Escape
    useEffect(() => {
        if (!editing) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setEditing(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [editing]);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarPreview(URL.createObjectURL(file));
        setUploading(true);
        try {
            const url = await uploadToImgBB(file);
            setAvatarUrl(url);
        } catch {
            setEditError("Image upload failed. Try a smaller image.");
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
            setEditSuccess("Profile saved.");
            setEditing(false);
        } catch (err) {
            setEditError(err instanceof Error ? err.message : "Could not save your profile.");
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
            setPwSuccess("Password changed.");
            setCurrentPassword("");
            setNewPassword("");
            setChangingPassword(false);
        } catch (err) {
            setPwError(err instanceof Error ? err.message : "Could not change your password.");
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

    const openEdit = () => {
        setEditing(true);
        setEditSuccess("");
        setEditError("");
    };

    const details = [
        { icon: Icon.mail, label: "Email", value: profile.email },
        { icon: Icon.phone, label: "Phone", value: profile.phone },
        { icon: Icon.pin, label: "Location", value: profile.location },
        { icon: Icon.calendar, label: "Joined", value: joinedDate },
    ];

    return (
        <main className="relative min-h-screen bg-[#051817] bg-[image:radial-gradient(ellipse_at_75%_0%,#0a2a28_0%,transparent_60%)] text-white">
            <GridLines />

            <div className="relative z-10 max-w-5xl mx-auto px-4 pt-8 pb-16">
                <button
                    onClick={() => router.back()}
                    className="text-gray-400 hover:text-[#4eca8b] transition mb-5 text-sm"
                >
                    ← Back
                </button>

                {/* ───────── Cover + identity ───────── */}
                <section className="rounded-3xl border border-[#0d3330] bg-[#071f1e] overflow-hidden">
                    {/* Cover */}
                    <div className="relative h-36 sm:h-44 bg-[linear-gradient(120deg,#0b3a35_0%,#0a2a28_45%,#12503f_100%)]">
                        <div
                            aria-hidden
                            className="absolute inset-0 opacity-30"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle at 1px 1px, rgba(78,202,139,.55) 1px, transparent 0)",
                                backgroundSize: "22px 22px",
                            }}
                        />
                        <div aria-hidden className="absolute -right-10 -top-16 w-64 h-64 rounded-full bg-[#4eca8b]/15 blur-3xl" />
                    </div>

                    <div className="px-5 sm:px-8 pb-7">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 sm:-mt-16">
                            {/* Avatar */}
                            <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden border-4 border-[#071f1e] bg-[#4eca8b] shadow-xl shadow-black/40">
                                {profile.avatar ? (
                                    <Image src={profile.avatar} alt={profile.name} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#051817] text-3xl font-bold">
                                        {initials}
                                    </div>
                                )}
                            </div>

                            {/* Name + role */}
                            <div className="flex-1 min-w-0 sm:pb-1">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">{profile.name}</h1>
                                <div className={`mt-1.5 inline-flex items-center gap-2 text-sm ${badge.text}`}>
                                    <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                                    {badge.label}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 sm:pb-1">
                                <button
                                    onClick={openEdit}
                                    className="px-5 py-2.5 rounded-xl bg-[#4eca8b] text-[#051817] text-sm font-semibold hover:bg-[#3db87a] transition"
                                >
                                    Edit profile
                                </button>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2.5 rounded-xl border border-[#0d3330] text-gray-300 text-sm hover:border-red-800 hover:text-red-400 transition"
                                >
                                    Log out
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Status messages */}
                {(editSuccess || pwSuccess) && (
                    <div
                        role="status"
                        className="mt-4 text-[#4eca8b] text-sm bg-[#4eca8b]/10 border border-[#4eca8b]/25 rounded-xl px-4 py-3"
                    >
                        {editSuccess || pwSuccess}
                    </div>
                )}

                {/* ───────── Body ───────── */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Left column: details + security */}
                    <aside className="space-y-6">
                        <div className="rounded-2xl border border-[#0d3330] bg-[#071f1e] p-6">
                            <h2 className="text-base font-semibold mb-4">Details</h2>
                            <dl className="space-y-4">
                                {details.map((d) => (
                                    <div key={d.label} className="flex items-start gap-3">
                                        <span className="mt-0.5 text-[#4eca8b]">{d.icon}</span>
                                        <div className="min-w-0">
                                            <dt className="text-xs text-gray-500">{d.label}</dt>
                                            <dd className="text-sm text-gray-200 break-words">
                                                {d.value || (
                                                    <button onClick={openEdit} className="text-gray-500 hover:text-[#4eca8b] transition">
                                                        Add {d.label.toLowerCase()}
                                                    </button>
                                                )}
                                            </dd>
                                        </div>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        <div className="rounded-2xl border border-[#0d3330] bg-[#071f1e] p-6">
                            <h2 className="text-base font-semibold mb-1">Password</h2>
                            {!changingPassword ? (
                                <>
                                    <p className="text-sm text-gray-500 mb-4">Use at least 8 characters.</p>
                                    <button
                                        onClick={() => {
                                            setChangingPassword(true);
                                            setPwSuccess("");
                                        }}
                                        className="w-full py-2.5 rounded-xl border border-[#0d3330] text-sm text-gray-200 hover:border-[#4eca8b] transition"
                                    >
                                        Change password
                                    </button>
                                </>
                            ) : (
                                <form onSubmit={handlePasswordChange} className="space-y-3 mt-3">
                                    <input
                                        type="password"
                                        required
                                        placeholder="Current password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className={inputCls}
                                    />
                                    <input
                                        type="password"
                                        required
                                        minLength={8}
                                        placeholder="New password (min 8 characters)"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className={inputCls}
                                    />
                                    {pwError && <p className="text-red-400 text-xs">{pwError}</p>}
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            disabled={pwLoading}
                                            className="flex-1 py-2.5 rounded-xl bg-[#4eca8b] text-[#051817] text-sm font-semibold disabled:opacity-60"
                                        >
                                            {pwLoading ? "Saving…" : "Save password"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setChangingPassword(false);
                                                setPwError("");
                                            }}
                                            className="flex-1 py-2.5 rounded-xl border border-[#0d3330] text-gray-400 text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </aside>

                    {/* Right column: about, skills, interests */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-2xl border border-[#0d3330] bg-[#071f1e] p-6 md:p-7">
                            <h2 className="text-base font-semibold mb-3">About</h2>
                            {profile.bio ? (
                                <p className="text-gray-300 text-[15px] leading-relaxed whitespace-pre-line max-w-prose">
                                    {profile.bio}
                                </p>
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    Tell people who you are and why you get involved.{" "}
                                    <button onClick={openEdit} className="text-[#4eca8b] hover:underline">
                                        Write your bio
                                    </button>
                                </p>
                            )}
                        </div>

                        <div className="rounded-2xl border border-[#0d3330] bg-[#071f1e] p-6 md:p-7">
                            <h2 className="text-base font-semibold mb-3">Skills</h2>
                            {profile.skills && profile.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.map((s) => (
                                        <span
                                            key={s}
                                            className="text-sm bg-[#0a2a27] border border-[#0d3330] text-gray-200 px-3 py-1.5 rounded-full"
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    Add skills so organizers can match you to events.{" "}
                                    <button onClick={openEdit} className="text-[#4eca8b] hover:underline">
                                        Add skills
                                    </button>
                                </p>
                            )}
                        </div>

                        <div className="rounded-2xl border border-[#0d3330] bg-[#071f1e] p-6 md:p-7">
                            <h2 className="text-base font-semibold mb-3">Interests</h2>
                            {profile.interests && profile.interests.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {profile.interests.map((s) => (
                                        <span
                                            key={s}
                                            className="text-sm bg-[#4eca8b]/10 border border-[#4eca8b]/25 text-[#4eca8b] px-3 py-1.5 rounded-full"
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    Share the causes you care about.{" "}
                                    <button onClick={openEdit} className="text-[#4eca8b] hover:underline">
                                        Add interests
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ───────── Edit drawer ───────── */}
            {editing && (
                <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Edit profile">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditing(false)} />

                    <form
                        onSubmit={handleSave}
                        className="relative w-full max-w-md h-full bg-[#071f1e] border-l border-[#0d3330] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#0d3330]">
                            <h2 className="text-lg font-semibold">Edit profile</h2>
                            <button
                                type="button"
                                onClick={() => setEditing(false)}
                                aria-label="Close"
                                className="text-gray-400 hover:text-white transition text-2xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        {/* Scrollable fields */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                            {/* Avatar */}
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => fileRef.current?.click()}
                                    aria-label="Change photo"
                                    className="relative w-20 h-20 shrink-0 rounded-2xl border-2 border-dashed border-[#0d3330] hover:border-[#4eca8b] overflow-hidden flex items-center justify-center bg-[#051817] transition"
                                >
                                    {avatarPreview ? (
                                        <Image src={avatarPreview} alt="Avatar preview" fill unoptimized className="object-cover" />
                                    ) : (
                                        <span className="text-xs text-gray-500">Photo</span>
                                    )}
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="text-[#4eca8b] text-xs animate-pulse">Uploading…</span>
                                        </div>
                                    )}
                                </button>
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => fileRef.current?.click()}
                                        className="text-sm text-[#4eca8b] hover:underline"
                                    >
                                        {avatarPreview ? "Change photo" : "Upload photo"}
                                    </button>
                                    <p className="text-xs text-gray-500 mt-0.5">JPG or PNG</p>
                                </div>
                                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                            </div>

                            <div>
                                <label htmlFor="pf-name" className="block text-sm text-gray-300 mb-1.5">Full name</label>
                                <input id="pf-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
                            </div>

                            <div>
                                <label htmlFor="pf-bio" className="block text-sm text-gray-300 mb-1.5">Bio</label>
                                <textarea
                                    id="pf-bio"
                                    rows={4}
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    maxLength={500}
                                    className={`${inputCls} resize-none`}
                                />
                                <p className="text-gray-600 text-xs text-right mt-1">{bio.length}/500</p>
                            </div>

                            <div>
                                <label htmlFor="pf-skills" className="block text-sm text-gray-300 mb-1.5">
                                    Skills <span className="text-gray-600">(separate with commas)</span>
                                </label>
                                <input id="pf-skills" type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Design, Communication" className={inputCls} />
                            </div>

                            <div>
                                <label htmlFor="pf-interests" className="block text-sm text-gray-300 mb-1.5">
                                    Interests <span className="text-gray-600">(separate with commas)</span>
                                </label>
                                <input id="pf-interests" type="text" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="Technology, Art, Education" className={inputCls} />
                            </div>

                            <div>
                                <label htmlFor="pf-location" className="block text-sm text-gray-300 mb-1.5">Location</label>
                                <input id="pf-location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Dhaka, Bangladesh" className={inputCls} />
                            </div>

                            <div>
                                <label htmlFor="pf-phone" className="block text-sm text-gray-300 mb-1.5">Phone</label>
                                <input id="pf-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+880 1xxx xxxxxx" className={inputCls} />
                            </div>

                            {editError && (
                                <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">
                                    {editError}
                                </p>
                            )}
                        </div>

                        {/* Sticky footer */}
                        <div className="flex gap-3 px-6 py-4 border-t border-[#0d3330] bg-[#071f1e]">
                            <button
                                type="button"
                                onClick={() => setEditing(false)}
                                className="flex-1 py-2.5 rounded-xl border border-[#0d3330] text-gray-300 hover:border-[#4eca8b] transition text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving || uploading}
                                className="flex-1 py-2.5 rounded-xl bg-[#4eca8b] text-[#051817] font-semibold hover:bg-[#3db87a] transition disabled:opacity-60 text-sm"
                            >
                                {saving ? "Saving…" : "Save changes"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </main>
    );
}