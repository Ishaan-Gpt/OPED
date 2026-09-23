"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { CampusWireframe } from "@/components/canvas/CampusWireframe";

interface HeroProps {
  onJoinBetaClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onJoinBetaClick }) => {
  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight * 0.9,
      behavior: "smooth",
    });
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative pt-28 pb-16 overflow-hidden">
      {/* Background Backlight Radial Gradient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2E5243]/20 blur-[140px] rounded-full pointer-events-none" />

      {/* Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 tracking-wider mb-8"
      >
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span>REDEFINING HIGHER EDUCATION FOR THE AI ERA</span>
      </motion.div>

      {/* Hero Headline Stack */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="flex flex-col items-center justify-center space-y-1 select-none"
      >
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tighter text-white leading-none">
          Learn<span className="text-emerald-400">.</span>
        </h1>
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tighter text-zinc-600 leading-none">
          Build<span className="text-zinc-700">.</span>
        </h1>
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tighter text-white leading-none">
          Get hired<span className="text-emerald-400">.</span>
        </h1>
      </motion.div>

      {/* Subtitle / Value Proposition */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25 }}
        className="mt-8 text-lg sm:text-2xl text-zinc-400 max-w-2xl font-normal leading-relaxed px-4"
      >
        Beta members get a guaranteed interview. All in one app.
      </motion.p>

      {/* Action CTA Group */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        className="mt-8 flex flex-col sm:flex-row items-center gap-4 z-10"
      >
        <button
          onClick={onJoinBetaClick}
          className="group flex items-center gap-3 bg-white text-black text-sm font-semibold px-8 py-4 rounded-full hover:bg-zinc-200 transition-all active:scale-95 shadow-xl shadow-white/10"
        >
          <span>Join Beta</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
        </button>
      </motion.div>

      {/* 3D Campus Wireframe Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.45 }}
        className="w-full max-w-5xl mt-16 z-10 px-2 sm:px-6"
      >
        <CampusWireframe />
      </motion.div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={scrollToNextSection}
        className="mt-16 flex flex-col items-center gap-2 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors group cursor-pointer"
      >
        <span>Scroll to explore</span>
        <ChevronDown className="w-4 h-4 animate-bounce group-hover:text-emerald-400" />
      </motion.button>
    </section>
  );
};
