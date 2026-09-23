"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Box, Sparkles, Video, Glasses } from "lucide-react";

interface NavbarProps {
  onJoinBetaClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onJoinBetaClick }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-40 backdrop-blur-2xl bg-[#07090e]/85 border-b border-white/10 px-6 py-4 flex items-center justify-between shadow-2xl"
    >
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <span className="text-xl sm:text-2xl font-black tracking-tight text-white select-none">
          OPED<span className="text-amber-400">.</span>
        </span>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-amber-300 uppercase border border-amber-500/20 bg-amber-500/10 px-3 py-1 rounded-full shadow-sm">
          <Box className="w-3 h-3 text-amber-400" />
          <span>SPATIAL 3D VR CLASSROOM</span>
        </span>
      </div>

      {/* Center Nav Links */}
      <div className="hidden lg:flex items-center gap-8 text-xs font-mono text-slate-300">
        <a
          href="#3d-classroom"
          className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
        >
          <Box className="w-3.5 h-3.5 text-amber-400" />
          <span>3D Environment</span>
        </a>
        <a
          href="#realtime-video"
          className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
        >
          <Video className="w-3.5 h-3.5 text-blue-400" />
          <span>2-Way Video Gen</span>
        </a>
        <a
          href="#vr-mode"
          className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
        >
          <Glasses className="w-3.5 h-3.5 text-purple-400" />
          <span>VR Spatial</span>
        </a>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Live System Indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
          <span className="hidden md:inline font-semibold text-slate-200">2-WAY VIDEO LIVE</span>
          <span className="md:hidden font-semibold text-slate-200">LIVE</span>
        </div>

        {/* CTA Button */}
        <button
          onClick={onJoinBetaClick}
          className="group relative flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-slate-950 text-xs font-extrabold px-5 py-2.5 rounded-full hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-amber-500/15"
        >
          <span>Launch 3D Classroom</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </motion.header>
  );
};
