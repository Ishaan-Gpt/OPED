"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  AlertCircle,
  ShieldCheck,
  Zap,
  Video,
  Glasses,
  Sparkles,
  CheckCircle2,
  Play,
} from "lucide-react";

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
      ref={containerRef}
      id="3d-classroom"
      className="relative min-h-[160vh] bg-[#07090e] py-32 px-6 sm:px-12 md:px-20 border-t border-b border-white/5 flex flex-col justify-center"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-950/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full space-y-24">
        {/* Editorial Section Header Tag */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] font-mono tracking-widest uppercase flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>PASSIVE vs REAL-TIME GENERATIVE VIDEO</span>
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-800 to-transparent" />
        </div>

        {/* Staggered Narrative Cards */}
        <div className="space-y-16 sm:space-y-24 pl-2 sm:pl-8 border-l border-slate-800">
          {/* Stage 1 */}
          <motion.div
            style={{ opacity: stage1Opacity }}
            className="space-y-3 transition-opacity duration-300"
          >
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              THE YOUTUBE LIMITATION
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-slate-300">
              1-Way Passive Watching.
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
              Watching static video tutorials without feedback leads to passive watching. When you
              get stuck, YouTube can&apos;t answer your question or evaluate your understanding.
            </p>
          </motion.div>

          {/* Stage 2 */}
          <motion.div
            style={{ opacity: stage2Opacity }}
            className="space-y-3 transition-opacity duration-300"
          >
            <span className="text-xs font-mono text-amber-400/90 uppercase tracking-widest">
              THE OPED BREAKTHROUGH
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-gradient-gold">
              2-Way Real-time Generative Video.
            </h2>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
              Your AI teacher generates real-time video and speech in under 80ms. Speak naturally,
              ask questions mid-lesson, and receive instant 1-on-1 visual explanations.
            </p>
          </motion.div>

          {/* Stage 3 */}
          <motion.div
            style={{ opacity: stage3Opacity }}
            className="space-y-3 transition-opacity duration-300"
          >
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">
              SPATIAL IMMERSION
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-slate-200">
              3D VR Spatial Classrooms.
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
              Step inside a fully rendered 3D spatial classroom with interactive blackboards,
              spatial audio, 3D physics models, and VR headset support.
            </p>
          </motion.div>
        </div>

        {/* Resolution Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#111520] via-[#0b0e14] to-[#07090e] border border-amber-500/20 shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Glasses className="w-56 h-56 text-amber-400" />
          </div>

          <div className="relative z-10 space-y-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono tracking-widest uppercase">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>THE SPATIAL EDUCATION STANDARD</span>
            </div>

            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tighter text-white leading-tight">
              Learning as fast as AI.
              <br />
              <span className="text-amber-400">As interactive as real life.</span>
            </h3>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              OPED replaces flat text and pre-recorded videos with live generative video teachers
              and spatial 3D interactive whiteboards. Practice NCERT concepts, manipulate 3D models,
              and get evaluated in real-time.
            </p>

            <div className="pt-4 flex flex-wrap gap-8 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>2-Way Generative Video (&lt; 80ms)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>3D Spatial VR Environment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Live Interactive Physics Models</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
