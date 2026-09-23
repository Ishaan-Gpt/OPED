"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles, Video, Box, Zap } from "lucide-react";
import { CampusWireframe } from "@/components/canvas/CampusWireframe";

interface HeroProps {
  onJoinBetaClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onJoinBetaClick }) => {
  const scrollToNextSection = () => {
    const el = document.getElementById("paradigm");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({
        top: window.innerHeight * 0.9,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative pt-32 pb-20 overflow-hidden"
    >
      {/* Background Radial Glow Backlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/15 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono text-blue-400 tracking-wider mb-8 shadow-lg shadow-blue-950/40"
      >
        <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
        <span>NEXT-GENERATION 3D VR EDUCATION PLATFORM</span>
      </motion.div>

      {/* Hero Headline Stack */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="flex flex-col items-center justify-center space-y-2 select-none max-w-5xl"
      >
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white leading-none">
          Learn in{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white">
            3D
          </span>
          .
        </h1>
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-slate-400 leading-none">
          Interact in <span className="text-blue-400">Real-Time</span>.
        </h1>
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white leading-none">
          Master Anything<span className="text-indigo-400">.</span>
        </h1>
      </motion.div>

      {/* Subtitle / Value Proposition */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25 }}
        className="mt-8 text-base sm:text-2xl text-slate-300 max-w-3xl font-normal leading-relaxed px-4"
      >
        <span className="text-white font-semibold">
          2-Way Real-Time Video Generation & Instant AI Teacher.
        </span>
        <br className="hidden sm:inline" />
        As fast as AI, as smooth as YouTube.
      </motion.p>

      {/* Action CTA Group */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        className="mt-10 flex flex-col sm:flex-row items-center gap-4 z-10"
      >
        <div className="relative group">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 opacity-70 blur group-hover:opacity-100 transition duration-500 animate-pulse" />
          <button
            onClick={onJoinBetaClick}
            className="relative flex items-center gap-3 bg-white text-slate-950 text-sm font-extrabold px-9 py-4 rounded-full hover:bg-slate-100 transition-all active:scale-95 shadow-2xl"
          >
            <span>Explore 3D VR Classroom</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-blue-600" />
          </button>
        </div>
      </motion.div>

      {/* Key Metric Highlights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400"
      >
        <span className="flex items-center gap-1.5">
          <Box className="w-3.5 h-3.5 text-blue-400" /> 3D Interactive Environments
        </span>
        <span className="flex items-center gap-1.5">
          <Video className="w-3.5 h-3.5 text-blue-400" /> 2-Way Realtime Video Generation
        </span>
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-blue-400" /> Zero Buffer Streaming
        </span>
      </motion.div>

      {/* 3D Campus Wireframe Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.55 }}
        className="w-full max-w-5xl mt-14 z-10 px-2 sm:px-6"
      >
        <CampusWireframe />
      </motion.div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={scrollToNextSection}
        className="mt-16 flex flex-col items-center gap-2 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors group cursor-pointer"
      >
        <span>Discover OPED Engine</span>
        <ChevronDown className="w-4 h-4 animate-bounce group-hover:text-blue-400" />
      </motion.button>
    </section>
  );
};
