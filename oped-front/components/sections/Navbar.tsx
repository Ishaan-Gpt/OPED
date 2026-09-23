"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

interface NavbarProps {
  onJoinBetaClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onJoinBetaClick }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-40 backdrop-blur-xl bg-[#030303]/80 border-b border-white/10 px-6 py-4 flex items-center justify-between shadow-2xl"
    >
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <span className="text-xl sm:text-2xl font-black tracking-tight text-white select-none">
          ZERO<span className="text-emerald-400">.</span>
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono tracking-widest text-emerald-400/90 uppercase border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>BUNQ LABS</span>
        </span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Live Beta Status */}
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="hidden md:inline font-semibold text-zinc-300">BETA PHASE 2 OPEN</span>
          <span className="md:hidden font-semibold text-zinc-300">PHASE 2</span>
        </div>

        {/* CTA Button */}
        <button
          onClick={onJoinBetaClick}
          className="group relative flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-extrabold px-5 py-2.5 rounded-full hover:from-emerald-400 hover:to-teal-300 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
        >
          <span>Join Beta</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </motion.header>
  );
};
