"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Box, Sparkles, Video, Brain } from "lucide-react";

interface NavbarProps {
  onJoinBetaClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onJoinBetaClick }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 px-4 sm:px-8 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto rounded-full glass-nav px-5 py-3 flex items-center justify-between shadow-xl shadow-slate-900/5">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <motion.a
            href="/"
            whileHover={{ scale: 1.02 }}
            className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 select-none flex items-center gap-1.5"
          >
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/20">
              O
            </span>
            <span>OPED</span>
            <span className="text-blue-600 font-extrabold">.</span>
          </motion.a>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-blue-700 uppercase border border-blue-200 bg-blue-50 px-2.5 py-0.5 rounded-full font-semibold">
            <Sparkles className="w-3 h-3 text-blue-600 animate-pulse" />
            <span>AI PLATFORM</span>
          </span>
        </div>

        {/* Center Quick Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
          <a
            href="#features"
            className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
          >
            <Box className="w-3.5 h-3.5 text-blue-600" />
            <span>3D VR Classroom</span>
          </a>
          <a
            href="#video-ai"
            className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
          >
            <Video className="w-3.5 h-3.5 text-blue-600" />
            <span>2-Way Video</span>
          </a>
          <a
            href="#ncert"
            className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
          >
            <Brain className="w-3.5 h-3.5 text-blue-600" />
            <span>NCERT AI Engine</span>
          </a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Live Status Badge */}
          <div className="flex items-center gap-2 text-xs text-slate-600 font-mono font-medium">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
            </span>
            <span className="hidden lg:inline font-semibold text-slate-700">3D VR LIVE</span>
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onJoinBetaClick}
            className="group relative flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            <Box className="w-3.5 h-3.5 text-blue-100" />
            <span>Enter 3D Classroom</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};
