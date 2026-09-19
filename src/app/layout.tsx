import type { Metadata } from "next";
import { SmoothScroller } from "@/components/ui/SmoothScroller";
import "./globals.css";

export const metadata: Metadata = {
  title: "OPED - Professional Photorealistic Design",
  description: "A very professional, photorealistic web application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-white text-black">
          {children}
      </body>
    </html>
  );
}
