"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal, LineChart, Database, Play, CheckCircle, Sparkles } from "lucide-react";

export const BentoProjects: React.FC = () => {
  // Mouse position tracking for radial spotlight hover effect
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ref.current.style.setProperty("--mouse-x", `${x}px`);
    ref.current.style.setProperty("--mouse-y", `${y}px`);
  };

  // Card 1: Simulated typewriter stream for Gmail AI completion
  const [typedText, setTypedText] = useState("");
  const fullText = "I have attached the Q3 sales report. Based on our preliminary LLM analysis, user retention increased by 34% after introducing auto-complete drafts.";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index));
      index = (index + 1) % (fullText.length + 15);
    }, 45);
    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-28 space-y-16">
      {/* Title */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PORTFOLIO PROOFS</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tighter text-white leading-tight">
          Build projects in immersive real-world environments.
        </h2>

        <p className="text-zinc-400 text-base sm:text-lg">
          Work on production briefs provided by leading tech partners, backed by automated evaluation.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD 1 - Software Engineer */}
        <div
          ref={card1Ref}
          onMouseMove={(e) => handleMouseMove(e, card1Ref)}
          className="group relative bg-[#0c0c0c] border border-white/5 hover:border-zinc-700 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl"
          style={{
            backgroundImage:
              "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(16, 185, 129, 0.12), transparent 45%)",
          }}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="uppercase tracking-wider font-semibold text-white">SOFTWARE ENGINEER</span>
              </div>
              <span className="text-[10px] text-zinc-600">PROJECT 01</span>
            </div>

            <h3 className="text-xl font-bold text-white leading-snug">
              Build an AI rewrite prototype in Gmail that helps users finish long email drafts.
            </h3>

            {/* Interactive Preview: Gmail / Terminal Snippet */}
            <div className="rounded-2xl bg-black border border-white/10 p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-[10px] text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span>Gmail AI Assistant</span>
              </div>

              <div className="space-y-2 text-zinc-300">
                <div className="text-[10px] text-zinc-500">Subject: Q3 Performance Overview</div>
                <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-emerald-500/30 text-emerald-300 text-[11px] leading-relaxed min-h-[70px]">
                  {typedText}
                  <span className="inline-block w-1.5 h-3 bg-emerald-400 ml-1 animate-pulse" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px] text-emerald-400">
                <span className="flex items-center gap-1">
                  <Play className="w-3 h-3 fill-emerald-400" /> Generating draft...
                </span>
                <span className="text-zinc-500">98.4% BLEU score</span>
              </div>
            </div>
          </div>

          {/* Tech Pills */}
          <div className="mt-8 pt-4 border-t border-white/5 flex flex-wrap gap-2">
            {["Cursor", "Next.js", "Vercel", "Supabase", "Gemini"].map((pill) => (
              <span
                key={pill}
                className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* CARD 2 - Business Analyst */}
        <div
          ref={card2Ref}
          onMouseMove={(e) => handleMouseMove(e, card2Ref)}
          className="group relative bg-[#0c0c0c] border border-white/5 hover:border-zinc-700 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl"
          style={{
            backgroundImage:
              "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 130, 246, 0.12), transparent 45%)",
          }}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <LineChart className="w-4 h-4 text-blue-400" />
                <span className="uppercase tracking-wider font-semibold text-white">BUSINESS ANALYST</span>
              </div>
              <span className="text-[10px] text-zinc-600">PROJECT 02</span>
            </div>

            <h3 className="text-xl font-bold text-white leading-snug">
              Identify why ChatGPT users aren&apos;t upgrading and propose a solution to improve conversion.
            </h3>

            {/* Interactive Preview: Metrics Dashboard */}
            <div className="rounded-2xl bg-black border border-white/10 p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-[10px] text-zinc-400">
                <span>Retention Cohort Analysis</span>
                <span className="text-blue-400 font-bold">+18.4% MoM</span>
              </div>

              {/* Conversion bar visualization */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>Free Tier Dropoff</span>
                    <span>68.2%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[68%]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>Plus Conversion (Post-Intervention)</span>
                    <span>31.8%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 w-[32%]" />
                  </div>
                </div>
              </div>

              <div className="p-2 rounded bg-zinc-900/80 text-[10px] text-zinc-300 flex items-center justify-between">
                <span>Proposed Frictionless Upgrade UX</span>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Tech Pills */}
          <div className="mt-8 pt-4 border-t border-white/5 flex flex-wrap gap-2">
            {["Codex", "Canva", "Google Sheets"].map((pill) => (
              <span
                key={pill}
                className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* CARD 3 - Data Scientist */}
        <div
          ref={card3Ref}
          onMouseMove={(e) => handleMouseMove(e, card3Ref)}
          className="group relative bg-[#0c0c0c] border border-white/5 hover:border-zinc-700 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl"
          style={{
            backgroundImage:
              "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(168, 85, 247, 0.12), transparent 45%)",
          }}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                <span className="uppercase tracking-wider font-semibold text-white">DATA SCIENTIST</span>
              </div>
              <span className="text-[10px] text-zinc-600">PROJECT 03</span>
            </div>

            <h3 className="text-xl font-bold text-white leading-snug">
              Build a demand forecasting model that predicts weekly sales for the Nike Zoom launch.
            </h3>

            {/* Interactive Preview: Loss Curve SVG */}
            <div className="rounded-2xl bg-black border border-white/10 p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[10px] text-zinc-400">
                <span>Model Validation Loss (Epochs)</span>
                <span className="text-purple-400">RMSE: 0.042</span>
              </div>

              <svg className="w-full h-24 overflow-visible" viewBox="0 0 200 80">
                {/* Gridlines */}
                <line x1="0" y1="20" x2="200" y2="20" stroke="#18181b" strokeDasharray="3 3" />
                <line x1="0" y1="50" x2="200" y2="50" stroke="#18181b" strokeDasharray="3 3" />
                
                {/* Loss Curve */}
                <motion.path
                  d="M 10 70 Q 40 60, 70 30 T 130 20 T 190 12"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
                
                {/* Target line */}
                <path
                  d="M 10 75 Q 50 68, 90 40 T 150 25 T 190 18"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
              </svg>

              <div className="flex items-center justify-between text-[10px] text-zinc-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-400" /> Training
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Test Prediction
                </span>
              </div>
            </div>
          </div>

          {/* Tech Pills */}
          <div className="mt-8 pt-4 border-t border-white/5 flex flex-wrap gap-2">
            {["Cursor", "Pandas", "Jupyter", "Python"].map((pill) => (
              <span
                key={pill}
                className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
