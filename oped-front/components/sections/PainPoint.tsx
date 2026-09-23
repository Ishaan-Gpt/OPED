"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AlertCircle, Zap, Box, Video } from "lucide-react";

export const PainPoint: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const stage1Opacity = useTransform(scrollYProgress, [0.1, 0.25, 0.4], [0.4, 1, 0.6]);
  const stage2Opacity = useTransform(scrollYProgress, [0.3, 0.45, 0.6], [0.4, 1, 0.6]);
  const stage3Opacity = useTransform(scrollYProgress, [0.5, 0.65, 0.8], [0.4, 1, 0.6]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[150vh] bg-slate-50 py-28 px-6 sm:px-12 md:px-20 border-t border-b border-slate-200 flex flex-col justify-center"
    >
      {/* Background Micro Glow */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-blue-100/50 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-indigo-100/50 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full space-y-24 relative z-10">
        {/* Editorial Section Header Tag */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-[10px] font-mono tracking-widest uppercase flex items-center gap-1.5 font-semibold">
            <AlertCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>THE EDUCATION PARADIGM SHIFT</span>
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
        </div>

        {/* Staggered Narrative Cards */}
        <div className="space-y-16 sm:space-y-24 pl-4 sm:pl-8 border-l-2 border-slate-200">
          {/* Stage 1 */}
          <motion.div
            style={{ opacity: stage1Opacity }}
            className="space-y-3 transition-opacity duration-300"
          >
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest font-semibold">
              PHASE 01 — TRADITIONAL LECTURES
            </span>
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-slate-400">
              Passive videos.
            </h2>
            <p className="text-slate-600 text-base sm:text-xl max-w-xl font-normal leading-relaxed">
              Students watch 1-way recorded videos with zero real-time interaction, feedback, or
              adaptation.
            </p>
          </motion.div>

          {/* Stage 2 */}
          <motion.div
            style={{ opacity: stage2Opacity }}
            className="space-y-3 transition-opacity duration-300"
          >
            <span className="text-xs font-mono text-blue-600 uppercase tracking-widest font-semibold">
              PHASE 02 — THE GAP
            </span>
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-slate-900">
              No 2-Way response.
            </h2>
            <p className="text-slate-600 text-base sm:text-xl max-w-xl font-normal leading-relaxed">
              When a student is confused, passive video players cannot explain concepts differently
              or write on a 3D board.
            </p>
          </motion.div>

          {/* Stage 3 */}
          <motion.div
            style={{ opacity: stage3Opacity }}
            className="space-y-3 transition-opacity duration-300"
          >
            <span className="text-xs font-mono text-indigo-600 uppercase tracking-widest font-semibold">
              PHASE 03 — THE OPED REVOLUTION
            </span>
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-blue-600">
              Interactive 3D VR.
            </h2>
            <p className="text-slate-600 text-base sm:text-xl max-w-xl font-normal leading-relaxed">
              2-Way real-time video & audio generation with an AI Teacher inside an interactive 3D
              classroom environment.
            </p>
          </motion.div>
        </div>

        {/* Resolution Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative mt-20 p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Box className="w-56 h-56 text-blue-600" />
          </div>

          <div className="relative z-10 space-y-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-mono tracking-widest uppercase font-semibold">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>THE OPED LEARNING GUARANTEE</span>
            </div>

            <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              As fast as AI.
              <br />
              <span className="text-blue-600">As engaging as YouTube.</span>
            </h3>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
              OPED replaces static online courses with real-time generated 2-way video, 3D
              interactive whiteboards, and instant step-by-step recitation evaluations tailored to
              Class 4–10 NCERT standards.
            </p>

            <div className="pt-4 flex flex-wrap gap-8 text-xs font-mono text-slate-700 font-semibold">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-blue-600" />
                <span>3D Spatial Classrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-600" />
                <span>2-Way Realtime Video</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span>NCERT AI Teacher</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
