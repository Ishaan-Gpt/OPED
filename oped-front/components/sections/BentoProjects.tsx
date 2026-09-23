"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Box, Sparkles, Play, CheckCircle, Compass, Atom, Sun } from "lucide-react";

export const BentoProjects: React.FC = () => {
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    ref: React.RefObject<HTMLDivElement | null>,
  ) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ref.current.style.setProperty("--mouse-x", `${x}px`);
    ref.current.style.setProperty("--mouse-y", `${y}px`);
  };

  // Card 1: Simulated typewriter speech output for AI Teacher explanation of Rutherford Atom
  const [typedText, setTypedText] = useState("");
  const fullText =
    "Look closely at the nucleus. Rutherford discovered that most of the atom's mass and positive charge is concentrated in a tiny central volume.";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index));
      index = (index + 1) % (fullText.length + 15);
    }, 40);
    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <section id="platform" className="max-w-7xl mx-auto px-6 py-28 space-y-16">
      {/* Title */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>3D INTERACTIVE ENGINE</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tighter text-white leading-tight">
          Touch and manipulate 3D models in real-time.
        </h2>

        <p className="text-slate-400 text-base sm:text-lg">
          No more flat textbook diagrams. Experience concepts in full 3D WebGL space guided by
          real-time voice and video AI teaching.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD 1 - Rutherford 3D Atom Model */}
        <div
          ref={card1Ref}
          onMouseMove={(e) => handleMouseMove(e, card1Ref)}
          className="group relative bg-[#151C2C]/80 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl"
          style={{
            backgroundImage:
              "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(37, 99, 235, 0.12), transparent 45%)",
          }}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Atom className="w-4 h-4 text-blue-400" />
                <span className="uppercase tracking-wider font-semibold text-white">
                  CHEMISTRY & ATOM 3D
                </span>
              </div>
              <span className="text-[10px] text-slate-500">MODULE 01</span>
            </div>

            <h3 className="text-xl font-bold text-white leading-snug">
              Interactive Rutherford & Bohr 3D Atomic Orbital Visualizer
            </h3>

            {/* Interactive Preview */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/80" />
                </div>
                <span>AI Teacher Voice Explanation</span>
              </div>

              <div className="space-y-2 text-slate-300">
                <div className="text-[10px] text-slate-500">
                  Topic: NCERT Class 9 — Structure of the Atom
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-blue-500/30 text-blue-200 text-[11px] leading-relaxed min-h-[70px]">
                  {typedText}
                  <span className="inline-block w-1.5 h-3 bg-blue-400 ml-1 animate-pulse" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px] text-blue-400">
                <span className="flex items-center gap-1">
                  <Play className="w-3 h-3 fill-blue-400" /> 3D Orbits Active
                </span>
                <span className="text-slate-400">Electron Shell: K, L, M</span>
              </div>
            </div>
          </div>

          {/* Tech Pills */}
          <div className="mt-8 pt-4 border-t border-slate-800 flex flex-wrap gap-2">
            {["Three.js", "WebGL", "Framer Motion", "NCERT Class 9", "AI Lipsync"].map((pill) => (
              <span
                key={pill}
                className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* CARD 2 - Ray Optics 3D Visualizer */}
        <div
          ref={card2Ref}
          onMouseMove={(e) => handleMouseMove(e, card2Ref)}
          className="group relative bg-[#151C2C]/80 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl"
          style={{
            backgroundImage:
              "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99, 102, 241, 0.12), transparent 45%)",
          }}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-400" />
                <span className="uppercase tracking-wider font-semibold text-white">
                  PHYSICS OPTICS 3D
                </span>
              </div>
              <span className="text-[10px] text-slate-500">MODULE 02</span>
            </div>

            <h3 className="text-xl font-bold text-white leading-snug">
              Concave & Convex Mirror Focal Length Ray Tracing
            </h3>

            {/* Interactive Preview */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px] text-slate-400">
                <span>Real-Time Optics Math</span>
                <span className="text-indigo-400 font-bold">f = -15 cm</span>
              </div>

              {/* Conversion bar visualization */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Object Distance (u)</span>
                    <span>-30 cm</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[60%]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Real & Inverted Image Distance (v)</span>
                    <span>-30 cm</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[60%]" />
                  </div>
                </div>
              </div>

              <div className="p-2 rounded bg-slate-900 text-[10px] text-slate-300 flex items-center justify-between">
                <span>Magnification (m = -1) Verified</span>
                <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Tech Pills */}
          <div className="mt-8 pt-4 border-t border-slate-800 flex flex-wrap gap-2">
            {["Ray Tracing", "Mirror Formula", "NCERT Class 10", "Interactive Optics"].map(
              (pill) => (
                <span
                  key={pill}
                  className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300"
                >
                  {pill}
                </span>
              ),
            )}
          </div>
        </div>

        {/* CARD 3 - Photosynthesis 3D Simulation */}
        <div
          ref={card3Ref}
          onMouseMove={(e) => handleMouseMove(e, card3Ref)}
          className="group relative bg-[#151C2C]/80 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl"
          style={{
            backgroundImage:
              "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(245, 158, 11, 0.12), transparent 45%)",
          }}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="uppercase tracking-wider font-semibold text-white">
                  BIOLOGY 3D
                </span>
              </div>
              <span className="text-[10px] text-slate-500">MODULE 03</span>
            </div>

            <h3 className="text-xl font-bold text-white leading-snug">
              Plant Photosynthesis & Chloroplast Molecular Simulation
            </h3>

            {/* Interactive Preview */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Chemical Reaction Equation</span>
                <span className="text-amber-400 font-bold">6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂</span>
              </div>

              <svg className="w-full h-24 overflow-visible" viewBox="0 0 200 80">
                <line x1="0" y1="20" x2="200" y2="20" stroke="#334155" strokeDasharray="3 3" />
                <line x1="0" y1="50" x2="200" y2="50" stroke="#334155" strokeDasharray="3 3" />

                <motion.path
                  d="M 10 70 Q 50 20, 100 50 T 190 15"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />

                <path
                  d="M 10 65 Q 60 10, 110 40 T 190 25"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
              </svg>

              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Light Energy Absorbed
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Glucose Output
                </span>
              </div>
            </div>
          </div>

          {/* Tech Pills */}
          <div className="mt-8 pt-4 border-t border-slate-800 flex flex-wrap gap-2">
            {["Plant Cells", "Chloroplast 3D", "NCERT Class 7", "Molecular Dynamics"].map(
              (pill) => (
                <span
                  key={pill}
                  className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300"
                >
                  {pill}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
