"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
    const [isVisible, setIsVisible] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        const fadeTimer = setTimeout(() => setIsFadingOut(true), 2200);
        const removeTimer = setTimeout(() => setIsVisible(false), 2900);
        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#051817",
                backgroundImage:
                    "radial-gradient(ellipse at 70% 30%, #0a2a28 0%, transparent 60%)",
                transition: "opacity 0.7s ease",
                opacity: isFadingOut ? 0 : 1,
                pointerEvents: isFadingOut ? "none" : "all",
            }}
        >
            {/* Gear-like spinner matching the app logo style */}
            <div
                style={{
                    position: "relative",
                    width: "120px",
                    height: "120px",
                    animation: "gear-spin 2s linear infinite",
                    filter: "drop-shadow(0 0 18px rgba(16,185,129,0.55))",
                }}
            >
                <svg
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    width="120"
                    height="120"
                >
                    {/*
            8 curved arc "teeth" arranged in a circle,
            each arc is a thick rounded stroke segment.
            They rotate together to form a gear / cog spinner.
          */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                        const rad = (angle * Math.PI) / 180;
                        const r = 44; // radius of arc center
                        const cx = 60 + r * Math.cos(rad);
                        const cy = 60 + r * Math.sin(rad);
                        const arcR = 16;

                        // start/end angles for each mini arc (30° sweep)
                        const startRad = rad - Math.PI / 6;
                        const endRad = rad + Math.PI / 6;

                        const x1 = cx + arcR * Math.cos(startRad);
                        const y1 = cy + arcR * Math.sin(startRad);
                        const x2 = cx + arcR * Math.cos(endRad);
                        const y2 = cy + arcR * Math.sin(endRad);

                        // Alternate opacity/color for visual interest
                        const isAlt = i % 2 === 1;
                        return (
                            <path
                                key={angle}
                                d={`M ${x1} ${y1} A ${arcR} ${arcR} 0 0 1 ${x2} ${y2}`}
                                stroke={isAlt ? "#10b981" : "#34d399"}
                                strokeWidth="10"
                                strokeLinecap="round"
                                opacity={isAlt ? 0.6 : 1}
                            />
                        );
                    })}

                    {/* Center dot */}
                    <circle cx="60" cy="60" r="8" fill="#10b981" opacity="0.9" />
                    {/* Inner ring */}
                    <circle
                        cx="60"
                        cy="60"
                        r="20"
                        stroke="rgba(16,185,129,0.2)"
                        strokeWidth="1.5"
                        fill="none"
                    />
                </svg>
            </div>

            <style>{`
        @keyframes gear-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
