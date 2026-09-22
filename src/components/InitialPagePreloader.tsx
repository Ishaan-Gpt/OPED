"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandMark } from "@/components/icons";

interface InitialPagePreloaderProps {
  onComplete?: () => void;
}

const PRELOAD_TAGLINES = [
  "LEARN IT. PROVE IT.",
  "NCERT CLASSES 4—10",
  "THE BLACKBOARD IS THE CANVAS",
  "OPED / INTERACTIVE CLASSROOM",
];

export default function InitialPagePreloader({ onComplete }: InitialPagePreloaderProps) {
  const [count, setCount] = useState(0);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1800; // 1.8s crisp Awwwards preloader

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentCount = Math.min(100, Math.floor((elapsed / duration) * 100));
      setCount(currentCount);

      if (currentCount > 75) setTaglineIndex(3);
      else if (currentCount > 50) setTaglineIndex(2);
      else if (currentCount > 25) setTaglineIndex(1);

      if (currentCount >= 100) {
        clearInterval(timer);
        setIsFinished(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 600);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="initial-preloader-shell"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#08090a] text-white p-6 sm:p-12 select-none overflow-hidden"
        >
          {/* TOP BAR: BRAND MARK & YEAR */}
          <div className="flex items-center justify-between w-full font-mono text-xs text-zinc-400 tracking-wider">
            <div className="flex items-center gap-2">
              <BrandMark size={22} variant="white" />
              <span className="font-bold text-white tracking-widest">OPED</span>
            </div>
            <span>[ INITIALIZING PLATFORM ]</span>
            <span>2026 / EDITION</span>
          </div>

          {/* CENTER DISPLAY: HOLOGRAPHIC VR IRIS LOGO & GIANT PERCENTAGE COUNT */}
          <div className="my-auto flex flex-col items-center justify-center text-center relative">
            {/* Ambient Cyan Aura */}
            <div className="absolute size-96 rounded-full bg-[var(--cyan)]/15 blur-[120px] pointer-events-none animate-pulse" />

            {/* VR Iris Orbit Rings */}
            <div className="relative size-32 sm:size-40 flex items-center justify-center my-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-[var(--cyan)]/40"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute inset-3 rounded-full border border-zinc-700/60"
              />
              <motion.div
                animate={{ scale: [0.9, 1.4], opacity: [0.5, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border-2 border-[var(--cyan)]"
              />
              <div className="relative size-20 sm:size-24 rounded-2xl bg-black/80 border border-[var(--cyan)]/60 text-[var(--cyan)] flex items-center justify-center shadow-[0_0_40px_rgba(4,189,189,0.35)] backdrop-blur-md">
                <BrandMark size={48} variant="white" />
              </div>
            </div>

            {/* Giant Calligraphic Percentage Display */}
            <div className="font-serif text-7xl sm:text-9xl text-white tracking-tight leading-none my-2 font-light">
              {String(count).padStart(2, "0")}
              <span className="script-word text-[var(--cyan)] text-6xl sm:text-8xl">%</span>
            </div>

            {/* Tagline Cycler */}
            <div className="h-6 overflow-hidden mt-2 font-mono text-xs text-zinc-400 tracking-widest uppercase">
              <AnimatePresence mode="wait">
                <motion.div
                  key={taglineIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  {PRELOAD_TAGLINES[taglineIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* BOTTOM PROGRESS TRACK */}
          <div className="w-full space-y-3">
            <div className="relative w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
              <motion.div
                style={{ width: `${count}%` }}
                className="h-full bg-[var(--cyan)] rounded-full shadow-[0_0_15px_#04bdbd]"
              />
            </div>
            <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 tracking-widest">
              <span>DESIGN THAT RESPONDS</span>
              <span>100% NCERT SYLLABUS</span>
            </div>
          </div>

          {/* TOP & BOTTOM SPLIT CURTAIN SHUTTERS FOR REVEAL */}
          <motion.div
            initial={{ scaleY: 1 }}
            animate={{ scaleY: isFinished ? 0 : 1 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 bg-[#08090a] origin-top z-[-1]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
