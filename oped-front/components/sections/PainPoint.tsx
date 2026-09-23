"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AlertCircle, Box, Zap } from "lucide-react";

export const PainPoint: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const stage1Opacity = useTransform(scrollYProgress, [0.1, 0.25, 0.4], [0.3, 1, 0.5]);
  const stage2Opacity = useTransform(scrollYProgress, [0.3, 0.45, 0.6], [0.3, 1, 0.5]);
  const stage3Opacity = useTransform(scrollYProgress, [0.5, 0.65, 0.8], [0.3, 1, 0.5]);

  return (
    <section
      id="paradigm"
      ref={containerRef}
      className="relative min-h-[150vh] bg-[#0B0F17] py-28 px-6 sm:px-12 md:px-20 border-t border-b border-slate-800/80 flex flex-col justify-center"
    >
      {/* Background Micro Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-950/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-950/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full space-y-24">
        {/* Section Header */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-mono tracking-widest uppercase flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3 text-blue-400" />
            <span>THE EDUCATION PARADIGM SHIFT</span>
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-800 to-transparent" />
        </div>

        {/* Narrative Cards */}
        <div className="space-y-16 sm:space-y-24 pl-2 sm:pl-8 border-l border-slate-800">
          {/* Stage 1 */}
          <motion.div
            style={{ opacity: stage1Opacity }}
            className="space-y-3 transition-opacity duration-300"
          >
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              PHASE 01 — THE OLD WAY
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-slate-300">
              Boring 2D Lectures.
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-xl font-normal">
              Staring passively at recorded videos where you cannot ask questions, interact, or
              touch concepts in 3D.
            </p>
          </motion.div>

          {/* Stage 2 */}
          <motion.div
            style={{ opacity: stage2Opacity }}
            className="space-y-3 transition-opacity duration-300"
          >
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              PHASE 02 — NO INTERACTION
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-slate-400">
              Zero Voice Feedback.
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-xl font-normal">
              No real-time teacher to check your speech recall, correct your mistakes, or write
              dynamically on a live blackboard.
            </p>
          </motion.div>

          {/* Stage 3 */}
          <motion.div
            style={{ opacity: stage3Opacity }}
            className="space-y-3 transition-opacity duration-300"
          >
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">
              PHASE 03 — THE OPED BREAKTHROUGH
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white">
              Step Into 3D VR Education.
            </h2>
            <p className="text-slate-300 text-base sm:text-lg max-w-xl font-normal">
              Touch subatomic particles, manipulate light rays in real-time, and learn with an AI
              teacher who sees and responds to you live.
            </p>
          </motion.div>
        </div>

        {/* Resolution Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#151C2C] via-[#0F172A] to-[#0B0F17] border border-blue-500/20 glow-sapphire overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Box className="w-48 h-48 text-blue-400" />
          </div>

          <div className="relative z-10 space-y-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono tracking-widest uppercase">
              <Zap className="w-3 h-3" />
              <span>THE OPED ADVANTAGE</span>
            </div>

            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tighter text-white leading-tight">
              As fast as AI.
              <br />
              <span className="text-blue-400">As smooth as YouTube.</span>
            </h3>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              OPED combines neural video generation with high-performance 3D WebGL environments,
              giving students the world&apos;s first truly interactive 2-way AI classroom.
            </p>

            <div className="pt-4 flex flex-wrap gap-8 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>2-Way Video & Voice AI</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>NCERT 3D Models</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>VR Headset Ready</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
