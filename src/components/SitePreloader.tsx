"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandMark } from "@/components/icons";

interface SitePreloaderProps {
  onComplete?: () => void;
}

export default function SitePreloader({ onComplete }: SitePreloaderProps) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"counting" | "slantedZoom" | "fadeThrough">("counting");

  useEffect(() => {
    const duration = 1600; // 1.6s counting phase
    const startTime = Date.now();

    // 1. Smooth Count-Up Phase 0 -> 100
    const counterInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const current = Math.min(100, Math.floor((elapsed / duration) * 100));
      setCount(current);

      if (current >= 100) {
        clearInterval(counterInterval);

        // 2. Slanted 3D Zoom Phase (Camera flies into the letter "O")
        setTimeout(() => {
          setPhase("slantedZoom");
        }, 100);

        // 3. Fade Through & Reveal Landing Page
        setTimeout(() => {
          setPhase("fadeThrough");
        }, 1100);

        // 4. Complete preloader
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 1600);
      }
    }, 25);

    return () => clearInterval(counterInterval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "fadeThrough" && (
        <motion.div
          key="site-preloader-container"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed inset-0 z-[100] bg-white text-black flex items-center justify-center overflow-hidden select-none"
          style={{ perspective: "1200px" }}
        >
          {/* BOTTOM-LEFT COUNTER */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: phase === "slantedZoom" ? 0 : 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-10 left-10 sm:bottom-14 sm:left-14 flex items-baseline gap-1.5 font-mono text-3xl sm:text-5xl font-bold tracking-tighter text-zinc-900"
          >
            <span>{String(count).padStart(2, "0")}</span>
            <span className="text-xs text-zinc-400 font-normal">%</span>
          </motion.div>

          {/* BOTTOM-RIGHT BRAND SUBTITLE */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "slantedZoom" ? 0 : 0.6 }}
            className="absolute bottom-10 right-10 sm:bottom-14 sm:right-14 font-mono text-[10px] sm:text-xs tracking-widest text-zinc-500 uppercase"
          >
            OPED / NCERT CLASSROOM 3.0
          </motion.div>

          {/* CENTER BRAND TEXT "OPED" + LOGO WITH 3D PERSPECTIVE SLANT & ZOOM INTO "O" */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={
              phase === "slantedZoom"
                ? {
                    scale: 35,
                    x: "34%", // Zoom directly into the center of letter "O"
                    y: "4%",
                    rotateX: 42,
                    rotateY: -28,
                    rotateZ: 8,
                    opacity: [1, 1, 0],
                  }
                : {
                    scale: 1,
                    opacity: 1,
                    x: "0%",
                    y: "0%",
                    rotateX: 0,
                    rotateY: 0,
                    rotateZ: 0,
                  }
            }
            transition={
              phase === "slantedZoom"
                ? {
                    duration: 1.1,
                    ease: [0.7, 0, 0.84, 0], // Fast accelerating camera flight into the O
                  }
                : { duration: 0.5 }
            }
            className="flex items-center gap-6 sm:gap-10 origin-center will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* "OPED" Typography */}
            <div className="flex items-baseline font-black tracking-tighter text-7xl sm:text-9xl md:text-[13vw] leading-none text-zinc-950">
              <span className="inline-block hover:text-[var(--cyan)] transition-colors">
                O
              </span>
              <span>P</span>
              <span>E</span>
              <span>D</span>
            </div>

            {/* VR IRIS LOGO (SAME SIZE AS TEXT) */}
            <div className="flex items-center justify-center shrink-0">
              <BrandMark size={110} variant="black" className="w-16 h-16 sm:w-28 sm:h-28 md:w-[11vw] md:h-[11vw]" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
