"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface NavbarProps {
  onJoinBetaClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onJoinBetaClick }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-black/60 border-b border-white/5 px-6 py-4 flex items-center justify-between"
    >
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <span className="text-xl sm:text-2xl font-black tracking-tight text-white select-none">
          ZERO<span className="text-emerald-400">.</span>
        </span>
        <span className="hidden sm:inline-block text-[10px] font-mono tracking-widest text-zinc-500 uppercase border border-zinc-800 px-2 py-0.5 rounded-full">
          BUNQ LABS
        </span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Live Beta Status */}
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="hidden md:inline">BETA PHASE 2 OPEN</span>
          <span className="md:hidden">PHASE 2</span>
        </div>

        {/* CTA Button */}
        <button
          onClick={onJoinBetaClick}
          className="group flex items-center gap-1.5 bg-white text-black text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-white/5"
        >
          <span>Join Beta</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </motion.header>
  );
};
