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
    window.scrollTo({
      top: window.innerHeight * 0.9,
      behavior: "smooth",
    });
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Background Radial Glow Backlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-100/50 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-indigo-100/40 blur-[130px] rounded-full pointer-events-none" />

      {/* Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono text-blue-700 font-semibold tracking-wide mb-8 shadow-xs"
      >
        <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
        <span>NEXT-GEN AI EDUCATION & 3D VR CLASSROOMS</span>
      </motion.div>

      {/* Hero Headline Stack */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="flex flex-col items-center justify-center space-y-2 select-none max-w-5xl"
      >
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-slate-900 leading-none">
          Learn in{" "}
          <span className="text-blue-600 underline decoration-blue-300 underline-offset-8">
            3D VR
          </span>{" "}
          Classrooms<span className="text-blue-600">.</span>
        </h1>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-600 leading-tight">
          As Fast as AI<span className="text-blue-600">.</span> As Good as YouTube
          <span className="text-indigo-600">.</span>
        </h1>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-800 leading-snug">
          2-Way Real-Time Video & Interaction<span className="text-blue-600">.</span>
        </h1>
      </motion.div>

      {/* Subtitle / Value Proposition */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25 }}
        className="mt-8 text-base sm:text-xl text-slate-600 max-w-3xl font-normal leading-relaxed px-4"
      >
        Step into an immersive virtual classroom where an AI Teacher uses 3D whiteboards, real-time
        video generation, and adaptive NCERT curriculum to teach Class 4–10 concepts dynamically.
      </motion.p>

      {/* Action CTA Group */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        className="mt-10 flex flex-col sm:flex-row items-center gap-4 z-10"
      >
        <button
          onClick={onJoinBetaClick}
          className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-9 py-4 rounded-full transition-all active:scale-95 shadow-xl shadow-blue-500/20"
        >
          <Box className="w-4 h-4 text-blue-100" />
          <span>Launch 3D VR Classroom</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
        </button>

        <a
          href="/showcase"
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-sm font-bold px-8 py-4 rounded-full transition-all active:scale-95 shadow-xs"
        >
          <Video className="w-4 h-4 text-blue-600" />
          <span>Watch 2-Way Video Demo</span>
        </a>
      </motion.div>

      {/* Key Metric Highlights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-600 font-semibold"
      >
        <span className="flex items-center gap-1.5">
          <Box className="w-3.5 h-3.5 text-blue-600" /> 3D Spatial Audio & Models
        </span>
        <span className="flex items-center gap-1.5">
          <Video className="w-3.5 h-3.5 text-blue-600" /> 2-Way Bidirectional Video
        </span>
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-blue-600" /> Instant Adaptive NCERT AI
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
        className="mt-16 flex flex-col items-center gap-2 text-xs font-mono text-slate-500 hover:text-slate-800 transition-colors group cursor-pointer font-semibold"
      >
        <span>Scroll to explore 3D VR features</span>
        <ChevronDown className="w-4 h-4 animate-bounce group-hover:text-blue-600" />
      </motion.button>
    </section>
  );
};
