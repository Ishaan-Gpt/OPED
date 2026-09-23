"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldCheck, ArrowRight, Zap, CheckCircle2, Box } from "lucide-react";

interface ProfessionalLoaderProps {
  onUnlock: () => void;
}

const BOOT_LOGS = [
  "INITIALIZING 3D SPATIAL CANVAS...",
  "CONNECTING 2-WAY REAL-TIME VOICE & VIDEO PIPELINE...",
  "LOADING INTERACTIVE BLACKBOARD & STEM MODELS...",
  "OPTIMIZING LOW-LATENCY STREAMING MATRIX...",
  "OPED 3D CLASSROOM READY.",
];

export const ProfessionalLoader: React.FC<ProfessionalLoaderProps> = ({ onUnlock }) => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  // Play subtle web audio chime on completion
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
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.35); // A5

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Fallback if AudioContext is blocked
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const step = Math.floor(Math.random() * 9) + 4;
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
          }, 600);
        }
        return next;
      });
    }, 60);

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
          exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#08090C] text-slate-100 select-none overflow-hidden px-4"
        >
          {/* Multi-layered Executive Royal Blue Backlights */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.12)_0%,transparent_60%)] pointer-events-none" />
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

          {/* Noise overlay */}
          <div className="absolute inset-0 bg-noise opacity-15 pointer-events-none" />

          {/* Central Loader Container */}
          <div className="relative z-10 max-w-md w-full flex flex-col items-center space-y-8 text-center">
            {/* Spinning Spatial Ring */}
            <div className="relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44">
              <div className="absolute inset-0 rounded-full border border-dashed border-blue-500/30 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-3 rounded-full border border-indigo-500/20 animate-[spin_12s_linear_infinite_reverse]" />

              {/* Central Core Badge */}
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-blue-500/30 flex flex-col items-center justify-center shadow-[0_0_40px_-5px_rgba(37,99,235,0.25)]"
              >
                <Box className="w-7 h-7 text-blue-400 mb-1 animate-pulse" />
                <span className="text-xl sm:text-2xl font-black font-mono tracking-tighter text-white">
                  {progress}
                  <span className="text-xs text-blue-400 font-normal">%</span>
                </span>
              </motion.div>
            </div>

            {/* Title & Brand Tag */}
            <div className="space-y-3 w-full">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/20 text-blue-400 text-xs font-mono tracking-widest uppercase shadow-lg shadow-blue-950/20"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                <span>OPED 3D SPATIAL ENGINE</span>
              </motion.div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Loading 3D VR Classroom<span className="text-blue-500">.</span>
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
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                    <span>{BOOT_LOGS[logIndex]}</span>
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Glowing Laser Progress Bar */}
            <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-2 overflow-hidden relative p-0.5">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.6)]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>

            {/* Features Quick Badge Row */}
            <div className="flex items-center justify-center gap-6 pt-2 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> 3D Spatial Canvas
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> 2-Way Voice & Video
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-400" /> YouTube Speed
              </span>
            </div>
          </div>

          {/* Enter App Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={handleSkip}
            className="absolute bottom-8 right-8 z-30 flex items-center gap-2 px-4 py-2 text-xs font-mono text-slate-400 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-full transition-all duration-200 active:scale-95 shadow-lg"
          >
            <span>Launch Experience</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
