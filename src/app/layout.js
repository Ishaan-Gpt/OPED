import { Outfit, Caveat } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"]
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["400", "600", "700"]
});

export const metadata = {
  title: "OPED - Outcome-Based Dynamic Immersive NCERT Classroom",
  description: "Guarantee 100% exam readiness for NCERT Classes 4-10 with 2-way dynamic speech recitation and interactive 3D blackboard visualizers.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAFBFD] text-gray-900 font-sans">
        {children}
      </body>
    </html>
  );
}
