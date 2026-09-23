"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Box, Video, Sparkles } from "lucide-react";

interface NavbarProps {
  onJoinBetaClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onJoinBetaClick }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-40 backdrop-blur-xl bg-[#0B0F17]/85 border-b border-slate-800/80 px-6 py-4 flex items-center justify-between shadow-2xl"
    >
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md">
          <Box className="w-4 h-4 text-white" />
        </div>
        <span className="text-xl sm:text-2xl font-black tracking-tight text-white select-none">
          OPED<span className="text-blue-500">.</span>3D
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono tracking-widest text-blue-400 uppercase border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 rounded-full">
          <Sparkles className="w-3 h-3 text-blue-400" />
          <span>AI VR EDUCATION</span>
        </span>
      </div>

      {/* Center Nav Links */}
      <nav className="hidden lg:flex items-center gap-8 text-xs font-medium text-slate-300">
        <a href="#hero" className="hover:text-white transition-colors">
          3D Classrooms
        </a>
        <a href="#teacher" className="hover:text-white transition-colors flex items-center gap-1.5">
          <Video className="w-3.5 h-3.5 text-blue-400" />
          <span>Realtime Video AI</span>
        </a>
        <a href="#curriculum" className="hover:text-white transition-colors">
          NCERT 3D Models
        </a>
        <a href="#platform" className="hover:text-white transition-colors">
          Platform Engine
        </a>
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Live Status Badge */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
          <span className="hidden md:inline font-semibold text-slate-300">REALTIME 3D ACTIVE</span>
          <span className="md:hidden font-semibold text-slate-300">3D LIVE</span>
        </div>

        {/* CTA Button */}
        <button
          onClick={onJoinBetaClick}
          className="group relative flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-extrabold px-5 py-2.5 rounded-full hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-95 shadow-lg shadow-blue-600/25"
        >
          <span>Launch 3D Classroom</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </motion.header>
  );
};
