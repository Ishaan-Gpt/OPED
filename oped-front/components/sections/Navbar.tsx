"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Box, Sparkles } from "lucide-react";

interface NavbarProps {
  onJoinBetaClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onJoinBetaClick }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-40 backdrop-blur-xl bg-white/80 border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-xs"
    >
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 select-none">
          OPED<span className="text-blue-600">.</span>
        </span>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-blue-700 uppercase border border-blue-200 bg-blue-50 px-2.5 py-0.5 rounded-full font-semibold">
          <Sparkles className="w-3 h-3 text-blue-600" />
          <span>AI EDUCATION PLATFORM</span>
        </span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Live Status */}
        <div className="flex items-center gap-2 text-xs text-slate-600 font-mono font-medium">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
          </span>
          <span className="hidden md:inline font-semibold text-slate-700">
            3D VR CLASSROOM LIVE
          </span>
          <span className="md:hidden font-semibold text-slate-700">3D VR LIVE</span>
        </div>

        {/* CTA Button */}
        <button
          onClick={onJoinBetaClick}
          className="group relative flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all active:scale-95 shadow-md shadow-blue-500/20"
        >
          <Box className="w-3.5 h-3.5 text-blue-100" />
          <span>Enter 3D Classroom</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </motion.header>
  );
};
