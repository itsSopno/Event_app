"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardRedirect() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;
        if (!user) { router.replace("/login"); return; }
        if (user.role === "organizer") router.replace("/dashboard/organizer");
        else router.replace("/dashboard/volunteer");
    }, [user, loading, router]);

    return (
        <div className="min-h-screen bg-[#051817] flex items-center justify-center">
            <div className="text-[#4eca8b] animate-pulse">Redirecting…</div>
        </div>
    );
}
