"use client";

import { Suspense } from "react";
import ProfileContent from "./ProfileContent";

export default function ProfilePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#051817] flex items-center justify-center">
                <div className="text-[#4eca8b] animate-pulse">Loading…</div>
            </div>
        }>
            <ProfileContent />
        </Suspense>
    );
}
