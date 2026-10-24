"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import GridLines from "@/components/shared/GridLines/GridLines";

export default function NotFound() {
    const router = useRouter();

    return (
        <main className="relative min-h-screen bg-[#051817] bg-[image:radial-gradient(ellipse_at_50%_30%,#0a2a28_0%,transparent_65%)] text-white flex items-center justify-center px-4">
            <GridLines />

            <div className="relative z-10 w-full max-w-xl text-center">
                {/* Big 404 */}
                <div
                    aria-hidden
                    className="select-none text-[8rem] sm:text-[11rem] font-extrabold leading-none tracking-tighter text-transparent"
                    style={{ WebkitTextStroke: "2px rgba(78,202,139,0.55)" }}
                >
                    404
                </div>

                <div className="-mt-6 sm:-mt-10 rounded-3xl border border-[#0d3330] bg-[#071f1e]/90 backdrop-blur px-6 sm:px-10 py-8">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        We can&apos;t find this page
                    </h1>
                    <p className="mt-3 text-gray-400 text-[15px] leading-relaxed max-w-md mx-auto">
                        The link may be broken, or the page may have moved. Head back home or
                        browse upcoming events.
                    </p>

                    <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/"
                            className="px-6 py-2.5 rounded-xl bg-[#4eca8b] text-[#051817] text-sm font-semibold hover:bg-[#3db87a] transition"
                        >
                            Go to home
                        </Link>
                        <Link
                            href="/events"
                            className="px-6 py-2.5 rounded-xl border border-[#0d3330] text-gray-200 text-sm hover:border-[#4eca8b] transition"
                        >
                            Browse events
                        </Link>
                    </div>

                    <button
                        onClick={() => router.back()}
                        className="mt-5 text-sm text-gray-500 hover:text-[#4eca8b] transition"
                    >
                        Go back to the previous page
                    </button>
                </div>
            </div>
        </main>
    );
}