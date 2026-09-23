"use client";

import React, { useState, useEffect } from "react";
import { ProfessionalLoader } from "@/components/canvas/ProfessionalLoader";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { PainPoint } from "@/components/sections/PainPoint";
import { Tracks } from "@/components/sections/Tracks";
import { BentoProjects } from "@/components/sections/BentoProjects";
import { MatchingEngine } from "@/components/sections/MatchingEngine";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (!isUnlocked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isUnlocked]);

  const scrollToFooter = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-screen bg-[#030303] text-white relative font-sans selection:bg-emerald-500/30 selection:text-white">
      {/* High-Tech Professional System Preloader */}
      {!isUnlocked && <ProfessionalLoader onUnlock={() => setIsUnlocked(true)} />}

      {/* Main Stage */}
      <div
        className={`transition-opacity duration-1000 ${isUnlocked ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <Navbar onJoinBetaClick={scrollToFooter} />
        <Hero onJoinBetaClick={scrollToFooter} />
        <PainPoint />
        <Tracks />
        <BentoProjects />
        <MatchingEngine />
        <Footer />
      </div>
    </main>
  );
}
