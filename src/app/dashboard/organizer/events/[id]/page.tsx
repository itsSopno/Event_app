"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Volunteer {
    _id: string;
    status: "registered" | "confirmed" | "attended" | "cancelled";
    createdAt: string;
    selectedSkill?: string;
    volunteer: { name: string; email: string };
}

const STATUSES = ["registered", "confirmed", "attended", "cancelled"] as const;

export default function EventVolunteersPage() {
    const { id } = useParams<{ id: string }>();
    const { user, loading } = useAuth();
    const router = useRouter();
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [eventTitle, setEventTitle] = useState("");
    const [fetching, setFetching] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        if (loading) return;
        if (!user || user.role !== "organizer") { router.replace("/login"); return; }

        const fetchData = async () => {
            try {
                const [evRes, volRes] = await Promise.all([
                    api.get<{ data: { title: string } }>(`/api/events/${id}`),
                    api.get<{ data: Volunteer[] }>(`/api/registrations/event/${id}`),
                ]);
                setEventTitle(evRes.data.title);
                setVolunteers(volRes.data);
            } catch {
                setVolunteers([]);
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, [user, loading, router, id]);

    const handleStatusUpdate = async (regId: string, status: string) => {
        setUpdating(regId);
        try {
            await api.put(`/api/registrations/${regId}/status`, { status });
            setVolunteers((prev) =>
                prev.map((v) => (v._id === regId ? { ...v, status: status as Volunteer["status"] } : v))
            );
        } catch (err) {
            alert(err instanceof Error ? err.message : "Update failed");
        } finally {
            setUpdating(null);
        }
    };

    const statusColor: Record<string, string> = {
        registered: "bg-blue-900/30 text-blue-400",
        confirmed: "bg-green-900/30 text-green-400",
        attended: "bg-purple-900/30 text-purple-400",
        cancelled: "bg-red-900/30 text-red-400",
    };

    return (
        <div className="min-h-screen bg-[#051817] text-white">
            <div className="max-w-5xl mx-auto px-4 py-10">
                <button onClick={() => router.back()} className="text-gray-400 hover:text-[#4eca8b] mb-6 flex items-center gap-1 transition">
                    ← Back
                </button>
                <p className="text-[#4eca8b] font-mono text-sm mb-1"><span className="opacity-60">//</span> Volunteers</p>
                <h1 className="text-2xl font-bold mb-2">{eventTitle}</h1>
                <p className="text-gray-400 text-sm mb-8">{volunteers.length} volunteer{volunteers.length !== 1 ? "s" : ""} registered</p>

                {fetching ? (
                    <div className="text-[#4eca8b] animate-pulse">Loading…</div>
                ) : volunteers.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-4">👤</p>
                        <p className="text-gray-400">No volunteers registered yet.</p>
                    </div>
                ) : (
                    <div className="bg-[#071f1e] border border-[#0d3330] rounded-xl overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[#0d3330]">
                                    <th className="text-left px-5 py-3 text-gray-400 font-medium">Name</th>
                                    <th className="text-left px-5 py-3 text-gray-400 font-medium hidden md:table-cell">Email</th>
                                    <th className="text-left px-5 py-3 text-gray-400 font-medium hidden md:table-cell">Date</th>
                                    <th className="text-left px-5 py-3 text-gray-400 font-medium hidden md:table-cell">Skill</th>
                                    <th className="text-left px-5 py-3 text-gray-400 font-medium">Status</th>
                                    <th className="text-left px-5 py-3 text-gray-400 font-medium">Update</th>
                                </tr>
                            </thead>
                            <tbody>
                                {volunteers.map((v) => (
                                    <tr key={v._id} className="border-b border-[#0a2a27] last:border-0 hover:bg-[#0a2a27] transition">
                                        <td className="px-5 py-3 font-medium text-white">{v.volunteer?.name}</td>
                                        <td className="px-5 py-3 text-gray-400 hidden md:table-cell">{v.volunteer?.email}</td>
                                        <td className="px-5 py-3 text-gray-400 hidden md:table-cell">
                                            {new Date(v.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-5 py-3 text-gray-400 hidden md:table-cell">{v.selectedSkill || "—"}</td>
                                        <td className="px-5 py-3">
                                            <span className={`text-xs px-2 py-1 rounded-full ${statusColor[v.status]}`}>
                                                {v.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <select
                                                value={v.status}
                                                disabled={updating === v._id}
                                                onChange={(e) => handleStatusUpdate(v._id, e.target.value)}
                                                className="bg-[#0a2a27] border border-[#0d3330] rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#4eca8b] disabled:opacity-60 transition"
                                            >
                                                {STATUSES.map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
