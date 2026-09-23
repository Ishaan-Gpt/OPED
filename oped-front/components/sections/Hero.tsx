"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles, ShieldCheck, Zap } from "lucide-react";
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
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative pt-32 pb-20 overflow-hidden">
      {/* Background Radial Glow Backlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/15 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 tracking-wider mb-8 shadow-lg shadow-emerald-950/40"
      >
        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span>REDEFINING HIGHER EDUCATION FOR THE AI ERA</span>
      </motion.div>

      {/* Hero Headline Stack */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="flex flex-col items-center justify-center space-y-1 select-none max-w-5xl"
      >
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-white leading-none">
          Learn<span className="text-emerald-400">.</span>
        </h1>
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-zinc-500 leading-none">
          Build<span className="text-cyan-400">.</span>
        </h1>
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-white leading-none">
          Get hired<span className="text-emerald-400">.</span>
        </h1>
      </motion.div>

      {/* Subtitle / Value Proposition */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25 }}
        className="mt-8 text-lg sm:text-2xl text-zinc-300 max-w-2xl font-normal leading-relaxed px-4"
      >
        Beta members get a{" "}
        <span className="text-white font-semibold underline decoration-emerald-500/50 underline-offset-4">
          guaranteed interview
        </span>
        . All in one app.
      </motion.p>

      {/* Action CTA Group */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        className="mt-10 flex flex-col sm:flex-row items-center gap-4 z-10"
      >
        <div className="relative group">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 opacity-70 blur group-hover:opacity-100 transition duration-500 animate-pulse" />
          <button
            onClick={onJoinBetaClick}
            className="relative flex items-center gap-3 bg-white text-black text-sm font-extrabold px-9 py-4 rounded-full hover:bg-zinc-100 transition-all active:scale-95 shadow-2xl"
          >
            <span>Join Beta Phase 2</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </motion.div>

      {/* Key Metric Highlights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-zinc-400"
      >
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-emerald-400" /> 100% Upfront Tuition Waiver
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Work-Verified Scorecards
        </span>
      </motion.div>

      {/* 3D Campus Wireframe Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.55 }}
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
        <span>Scroll to explore paradigm</span>
        <ChevronDown className="w-4 h-4 animate-bounce group-hover:text-emerald-400" />
      </motion.button>
    </section>
  );
};
