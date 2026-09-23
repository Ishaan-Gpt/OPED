"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Zap,
  CheckCircle2,
  Box,
  Video,
  Glasses,
} from "lucide-react";

interface ProfessionalLoaderProps {
  onUnlock: () => void;
}

const BOOT_LOGS = [
  "INITIALIZING SPATIAL 3D GRAPHICS ENGINE...",
  "CONNECTING REAL-TIME 2-WAY VIDEO GENERATOR...",
  "OPTIMIZING VR ULTRA-LOW LATENCY STREAM...",
  "LOADING AI TEACHER VOICE & KINEMATICS MATRIX...",
  "SPATIAL CLASSROOM READY.",
];

export const ProfessionalLoader: React.FC<ProfessionalLoaderProps> = ({ onUnlock }) => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const playCompletionChime = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // AudioContext fallback
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const step = Math.floor(Math.random() * 9) + 5;
        const next = Math.min(100, prev + step);

        const logStage = Math.min(
          BOOT_LOGS.length - 1,
          Math.floor((next / 100) * BOOT_LOGS.length),
        );
        setLogIndex(logStage);

        if (next === 100) {
          setIsDone(true);
          playCompletionChime();
          setTimeout(() => {
            onUnlock();
          }, 500);
        }
        return next;
      });
    }, 55);

    return () => clearInterval(timer);
  }, [onUnlock, playCompletionChime]);

  const handleSkip = () => {
    playCompletionChime();
    setIsDone(true);
    onUnlock();
  };

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.01, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07090e] text-slate-100 select-none overflow-hidden px-4"
        >
          {/* Subtle Ambient Backlights (Champagne & Midnight Blue) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_60%)] pointer-events-none" />
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-slate-800/20 rounded-full blur-[150px] pointer-events-none" />

          {/* Noise overlay */}
          <div className="absolute inset-0 bg-noise opacity-15 pointer-events-none" />

          {/* Central Loader Container */}
          <div className="relative z-10 max-w-md w-full flex flex-col items-center space-y-8 text-center">
            {/* Spinning Holographic Ring */}
            <div className="relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44">
              {/* Outer Ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-amber-500/20 animate-[spin_24s_linear_infinite]" />

              {/* Inner Reverse Ring */}
              <div className="absolute inset-3 rounded-full border border-slate-700/40 animate-[spin_16s_linear_infinite_reverse]" />

              {/* Central Glowing Badge */}
              <motion.div
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#111520] to-[#0b0e14] border border-amber-500/30 flex flex-col items-center justify-center shadow-[0_10px_30px_-5px_rgba(0,0,0,0.8)]"
              >
                <Box className="w-6 h-6 text-amber-400 mb-1" />
                <span className="text-xl sm:text-2xl font-black font-mono tracking-tighter text-white">
                  {progress}
                  <span className="text-xs text-amber-400 font-normal">%</span>
                </span>
              </motion.div>
            </div>

            {/* Title & Brand Tag */}
            <div className="space-y-3 w-full">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111520] border border-amber-500/20 text-amber-300 text-xs font-mono tracking-widest uppercase shadow-lg"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>OPED SPATIAL CLASSROOM V2.4</span>
              </motion.div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Initializing 3D VR Experience<span className="text-amber-400">.</span>
              </h2>

              {/* Live Boot Diagnostics Log */}
              <div className="h-6 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={logIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs font-mono text-slate-400 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span>{BOOT_LOGS[logIndex]}</span>
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Laser Progress Bar */}
            <div className="w-full bg-[#111520] border border-slate-800 rounded-full h-2 overflow-hidden relative shadow-inner p-0.5">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 rounded-full shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>

            {/* Features Quick Badge Row */}
            <div className="flex items-center justify-center gap-6 pt-2 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-amber-400" /> 2-Way Generative Video
              </span>
              <span className="flex items-center gap-1.5">
                <Glasses className="w-3.5 h-3.5 text-amber-400" /> VR Spatial 3D
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Real-time Interaction
              </span>
            </div>
          </div>

          {/* Quick Enter Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={handleSkip}
            className="absolute bottom-8 right-8 z-30 flex items-center gap-2 px-4 py-2 text-xs font-mono text-slate-400 hover:text-white bg-[#111520] hover:bg-slate-800 border border-slate-700/60 rounded-full transition-all duration-200 active:scale-95 shadow-xl"
          >
            <span>Launch Classroom</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
