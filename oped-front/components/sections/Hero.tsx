"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Sparkles,
  Box,
  Video,
  Glasses,
  Zap,
  Play,
  Mic,
  ShieldCheck,
} from "lucide-react";
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
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative pt-36 pb-20 overflow-hidden">
      {/* Background Radial Glow Backlights (Warm Gold & Midnight Blue) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111520] border border-amber-500/30 text-xs font-mono text-amber-300 tracking-wider mb-8 shadow-xl"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>NEXT-GEN EDUCATION: 3D SPATIAL CLASSROOM & 2-WAY VIDEO</span>
      </motion.div>

      {/* Hero Headline Stack */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="flex flex-col items-center justify-center space-y-2 select-none max-w-5xl"
      >
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white leading-none">
          Spatial 3D VR<span className="text-amber-400">.</span>
        </h1>
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-gradient-silver leading-none">
          2-Way Real-time Video<span className="text-amber-400">.</span>
        </h1>
      </motion.div>

      {/* Subtitle / Value Proposition */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25 }}
        className="mt-8 text-lg sm:text-2xl text-slate-300 max-w-3xl font-normal leading-relaxed px-4"
      >
        <span className="text-white font-semibold">As fast as AI. As engaging as YouTube.</span>{" "}
        Step into 3D spatial classrooms where hyper-realistic AI teachers teach, evaluate, and
        converse with 2-way real-time video generation.
      </motion.p>

      {/* Key Metric Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono text-slate-300"
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111520] border border-white/10">
          <Video className="w-4 h-4 text-blue-400" />
          <span>&lt; 80ms 2-Way Video Gen</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111520] border border-white/10">
          <Glasses className="w-4 h-4 text-amber-400" />
          <span>VR & Spatial 3D Ready</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111520] border border-white/10">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>NCERT Interactive Physics</span>
        </div>
      </motion.div>

      {/* Action CTA Group */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.38 }}
        className="mt-10 flex flex-col sm:flex-row items-center gap-4 z-10"
      >
        <div className="relative group">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-200 opacity-60 blur group-hover:opacity-100 transition duration-500" />
          <button
            onClick={onJoinBetaClick}
            className="relative flex items-center gap-3 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 text-slate-950 font-extrabold text-sm px-9 py-4.5 rounded-full hover:brightness-110 transition-all active:scale-95 shadow-2xl"
          >
            <span>Experience 3D Classroom</span>
            <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </motion.div>

      {/* 3D Campus & Real-Time Classroom Simulation Showcase Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="w-full max-w-5xl mt-16 z-10 px-2 sm:px-6 relative"
      >
        {/* Floating Live Stream Hud Overlay */}
        <div className="absolute top-4 left-6 sm:left-12 z-20 flex items-center gap-3 bg-[#07090e]/90 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md text-xs font-mono text-slate-200">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-bold">REAL-TIME 2-WAY VIDEO STREAM</span>
          <span className="text-slate-500">• 60 FPS</span>
        </div>

        <div className="absolute top-4 right-6 sm:right-12 z-20 hidden sm:flex items-center gap-2 bg-[#07090e]/90 border border-amber-500/30 px-4 py-2 rounded-full backdrop-blur-md text-xs font-mono text-amber-300">
          <Glasses className="w-3.5 h-3.5 text-amber-400" />
          <span>VR HEADSET DETECTED</span>
        </div>

        <CampusWireframe />
      </motion.div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={scrollToNextSection}
        className="mt-16 flex flex-col items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors group cursor-pointer"
      >
        <span>Explore 3D Spatial Technology</span>
        <ChevronDown className="w-4 h-4 animate-bounce group-hover:text-amber-400" />
      </motion.button>
    </section>
  );
};
