import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layout/public/Navbar/navbar";
import Footer from "../components/layout/public/Footer/footer";
import { AuthProvider } from "@/context/AuthContext";
import LenisProvider from "@/components/providers/LenisProvider";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sinners_Code | Community Event & Volunteer Platform",
  description:
    "Discover programming events, hackathons, and workshops. Join as an organizer or volunteer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#051817] bg-[image:radial-gradient(ellipse_at_75%_30%,#0a2a28_0%,transparent_60%)]">
        <LenisProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
