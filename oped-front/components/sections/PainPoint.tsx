"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AlertCircle, ShieldCheck, Zap } from "lucide-react";

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
      className="relative min-h-[160vh] bg-black py-28 px-6 sm:px-12 md:px-20 border-t border-b border-white/5 flex flex-col justify-center"
    >
      {/* Background Micro Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-red-950/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#2E5243]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full space-y-24">
        {/* Editorial Section Header Tag */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono tracking-widest uppercase flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3" />
            <span>THE HIGHER ED PARADIGM SHIFT</span>
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
        </div>

        {/* Staggered Narrative Cards */}
        <div className="space-y-16 sm:space-y-24 pl-2 sm:pl-8 border-l border-zinc-800/80">
          {/* Stage 1 */}
          <motion.div
            style={{ opacity: stage1Opacity }}
            className="space-y-3 transition-opacity duration-300"
          >
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
              PHASE 01
            </span>
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-zinc-400">
              4 years.
            </h2>
            <p className="text-zinc-500 text-base sm:text-lg max-w-xl font-normal">
              Spent memorizing outdated theory in lectures that haven&apos;t changed in decades.
            </p>
          </motion.div>

          {/* Stage 2 */}
          <motion.div
            style={{ opacity: stage2Opacity }}
            className="space-y-3 transition-opacity duration-300"
          >
            <span className="text-xs font-mono text-red-500/80 uppercase tracking-widest">
              PHASE 02
            </span>
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-red-500/90 drop-shadow-[0_0_25px_rgba(239,68,68,0.2)]">
              In debt.
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg max-w-xl font-normal">
              Saddled with tens of thousands in student loans before your first real paycheck.
            </p>
          </motion.div>

          {/* Stage 3 */}
          <motion.div
            style={{ opacity: stage3Opacity }}
            className="space-y-3 transition-opacity duration-300"
          >
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
              PHASE 03
            </span>
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-zinc-600 line-through decoration-red-500/80 decoration-4">
              And still no job.
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg max-w-xl font-normal">
              Sending 500 automated resume PDFs into black-hole applicant tracking systems.
            </p>
          </motion.div>
        </div>

        {/* Resolution Banner: Resumes are dead */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0c0c0c] via-[#080808] to-black border border-emerald-500/20 glow-emerald overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <ShieldCheck className="w-48 h-48 text-emerald-400" />
          </div>

          <div className="relative z-10 space-y-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono tracking-widest uppercase">
              <Zap className="w-3 h-3" />
              <span>THE ZERO GUARANTEE</span>
            </div>

            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tighter text-white leading-tight">
              Resumes are dead.
              <br />
              <span className="text-emerald-400">And it costs you nothing...</span> we charge
              recruiters.
            </h3>

            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed font-normal">
              Traditional credentials no longer prove potential in an AI-driven workforce. Zero
              replaces passive lectures with intense, real-world micro-simulations, proving your
              skills to hiring managers directly.
            </p>

            <div className="pt-4 flex flex-wrap gap-8 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>$0 Tuition Upfront</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Guaranteed Interview</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>100% Work-Verified Portfolio</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
