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
  title: "Zero University | Learn. Build. Get Hired.",
  description: "BUNQ LABS Zero University. Get hired into the world's most in-demand AI-native roles. Beta members get a guaranteed interview.",
  keywords: ["Zero University", "AI Education", "Software Engineering", "AI Engineer", "Product Design", "BUNQ LABS"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-black text-white selection:bg-[#2E5243] selection:text-white">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen relative font-sans`}
      >
        {/* Global SVG Noise Overlay */}
        <div className="pointer-events-none opacity-20 fixed inset-0 z-50 bg-noise" />
        
        {children}
      </body>
    </html>
  );
}

