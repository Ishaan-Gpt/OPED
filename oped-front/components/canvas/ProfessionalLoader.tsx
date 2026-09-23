"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldCheck, ArrowRight, Zap, CheckCircle2, Box } from "lucide-react";

interface ProfessionalLoaderProps {
  onUnlock: () => void;
}

const BOOT_LOGS = [
  "INITIALIZING 3D VR CLASSROOM MATRIX...",
  "LOADING 2-WAY REAL-TIME VIDEO ENGINE...",
  "CONNECTING ADAPTIVE NCERT AI TEACHER...",
  "PREPARING HIGH-DEFINITION 3D ENVIRONMENT...",
  "SYSTEM READY.",
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
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.3);

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
        const step = Math.floor(Math.random() * 8) + 5;
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
          exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F8FAFC] text-slate-900 select-none overflow-hidden px-4"
        >
          {/* Subtle Ambient Radial Sky Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.06)_0%,transparent_65%)] pointer-events-none" />
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[140px] pointer-events-none" />

          {/* Central Porcelain Loader Container */}
          <div className="relative z-10 max-w-md w-full flex flex-col items-center space-y-8 text-center bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50">
            {/* Spinning Ring */}
            <div className="relative flex items-center justify-center w-36 h-36">
              <div className="absolute inset-0 rounded-full border border-dashed border-blue-300 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-2.5 rounded-full border border-indigo-200 animate-[spin_14s_linear_infinite_reverse]" />

              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/80 border border-blue-200/80 flex flex-col items-center justify-center shadow-lg shadow-blue-500/5"
              >
                <Box className="w-7 h-7 text-blue-600 mb-1 animate-pulse" />
                <span className="text-2xl font-black font-mono tracking-tighter text-slate-900">
                  {progress}
                  <span className="text-xs text-blue-600 font-normal">%</span>
                </span>
              </motion.div>
            </div>

            {/* Title & Brand Tag */}
            <div className="space-y-3 w-full">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono tracking-wider uppercase font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                <span>OPED AI EDUCATION ENGINE</span>
              </motion.div>

              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Loading 3D VR Classroom<span className="text-blue-600">.</span>
              </h2>

              {/* Live Boot Diagnostics Log */}
              <div className="h-6 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={logIndex}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs font-mono text-slate-500 flex items-center gap-2 font-medium"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    <span>{BOOT_LOGS[logIndex]}</span>
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Glowing Laser Progress Bar */}
            <div className="w-full bg-slate-100 border border-slate-200 rounded-full h-2.5 overflow-hidden relative p-0.5">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 rounded-full shadow-md"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>

            {/* Features Quick Badge Row */}
            <div className="flex items-center justify-center gap-5 pt-2 text-[11px] font-mono text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> 3D VR Classroom
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> 2-Way AI Video
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-600" /> Instant Adaptive
              </span>
            </div>
          </div>

          {/* Quick Skip Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={handleSkip}
            className="absolute bottom-8 right-8 z-30 flex items-center gap-2 px-4 py-2.5 text-xs font-mono text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-full transition-all duration-200 active:scale-95 shadow-md font-semibold"
          >
            <span>Enter App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
