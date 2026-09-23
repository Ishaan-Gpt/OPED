"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles, Box, Video, Zap, Play } from "lucide-react";
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
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative pt-32 pb-20 overflow-hidden bg-[#08090C]">
      {/* Executive Royal Blue & Deep Indigo Backlight Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-blue-600/12 blur-[170px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400 tracking-wider mb-8 shadow-lg shadow-blue-950/30"
      >
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        <span>NEXT-GENERATION 3D & REAL-TIME AI EDUCATION PLATFORM</span>
      </motion.div>

      {/* Hero Headline Stack */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="flex flex-col items-center justify-center space-y-2 select-none max-w-5xl"
      >
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white leading-tight">
          Education Reimagined in <span className="text-gradient-royal">3D & Real-Time AI</span>
        </h1>
      </motion.div>

      {/* Subtitle / Value Proposition */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25 }}
        className="mt-8 text-lg sm:text-2xl text-slate-300 max-w-3xl font-normal leading-relaxed px-4"
      >
        Step inside interactive 3D VR classrooms powered by{" "}
        <span className="text-white font-semibold underline decoration-blue-500/40 underline-offset-4">
          2-way real-time AI teacher generation
        </span>
        —as seamless as YouTube, as fast as AI.
      </motion.p>

      {/* Action CTA Group */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        className="mt-10 flex flex-col sm:flex-row items-center gap-4 z-10"
      >
        <div className="relative group">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 opacity-70 blur group-hover:opacity-100 transition duration-500" />
          <button
            onClick={() => {
              if (onJoinBetaClick) {
                onJoinBetaClick();
              } else {
                window.location.href = "/showcase";
              }
            }}
            className="relative flex items-center gap-3 bg-white text-slate-950 text-sm font-extrabold px-9 py-4 rounded-full hover:bg-slate-100 transition-all active:scale-95 shadow-2xl"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Launch 3D VR Classroom</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </motion.div>

      {/* Key Architectural Pillars Badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400"
      >
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <Box className="w-4 h-4 text-blue-400" /> 3D VR Spatial Canvas
        </span>
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <Video className="w-4 h-4 text-blue-400" /> 2-Way Real-Time Video
        </span>
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <Zap className="w-4 h-4 text-blue-400" /> YouTube Speed & Zero Latency
        </span>
      </motion.div>

      {/* 3D Classroom Wireframe Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.55 }}
        className="w-full max-w-5xl mt-16 z-10 px-2 sm:px-6"
      >
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/60 p-2 shadow-2xl backdrop-blur-md">
          <CampusWireframe />
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={scrollToNextSection}
        className="mt-16 flex flex-col items-center gap-2 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors group cursor-pointer"
      >
        <span>Explore 3D platform capabilities</span>
        <ChevronDown className="w-4 h-4 animate-bounce group-hover:text-blue-400" />
      </motion.button>
    </section>
  );
};
