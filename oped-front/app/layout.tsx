import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OPED — World's Most Advanced 3D VR AI Education Platform",
  description:
    "Experience 2-way real-time video generation, interactive 3D VR classrooms, and instant voice AI teaching. As fast as AI, as smooth as YouTube.",
  keywords: [
    "OPED",
    "3D VR Classroom",
    "AI Education Platform",
    "Realtime Video Generation",
    "NCERT 3D Models",
    "Interactive AI Teacher",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark bg-[#0B0F17] text-[#F8FAFC] selection:bg-blue-600/30 selection:text-white"
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0B0F17] text-[#F8FAFC] min-h-screen relative font-sans`}
      >
        {/* Global SVG Noise Overlay */}
        <div className="pointer-events-none opacity-15 fixed inset-0 z-50 bg-noise" />

        {children}
      </body>
    </html>
  );
}
