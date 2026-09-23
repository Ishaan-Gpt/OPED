"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Box, Video, Glasses, Play, CheckCircle2, Sparkles, Activity, Layers } from "lucide-react";

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

  // Simulated 2-Way Video Dialogue stream
  const [typedDialogue, setTypedDialogue] = useState("");
  const fullDialogue =
    "Student: 'Why do alpha particles bounce backward?' Teacher: 'Because the positive nucleus concentrates almost all atomic mass in a tiny dense volume!'";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedDialogue(fullDialogue.slice(0, index));
      index = (index + 1) % (fullDialogue.length + 20);
    }, 40);
    return () => clearInterval(interval);
  }, [fullDialogue]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-28 space-y-16">
      {/* Title */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111520] border border-amber-500/30 text-amber-300 text-xs font-mono tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>SPATIAL INTERACTIVE EXPERIENCES</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tighter text-white leading-tight">
          3D Physics Models & Live Generative Video.
        </h2>

        <p className="text-slate-400 text-base sm:text-lg">
          Manipulate atomic structures in 3D spatial view while your AI teacher stream responds to
          your voice instantly.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD 1 - Rutherford 3D Atom */}
        <div
          ref={card1Ref}
          onMouseMove={(e) => handleMouseMove(e, card1Ref)}
          className="group relative bg-[#0b0e14] border border-white/10 hover:border-amber-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-xl"
          style={{
            backgroundImage:
              "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 175, 55, 0.08), transparent 50%)",
          }}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-amber-400" />
                <span className="uppercase tracking-wider font-semibold text-white">
                  3D SPATIAL MODEL
                </span>
              </div>
              <span className="text-[10px] text-slate-400">NCERT CLASS 9</span>
            </div>

            <h3 className="text-xl font-bold text-white leading-snug">
              Rutherford Gold Foil Alpha Particle Scattering Model.
            </h3>

            {/* Interactive Preview: Atom Simulation */}
            <div className="rounded-2xl bg-[#07090e] border border-white/10 p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px] text-slate-400">
                <span>Atomic Nucleus Simulation</span>
                <span className="text-amber-400">Real-Time WebGL</span>
              </div>

              <div className="space-y-2 text-slate-300">
                <div className="p-3 rounded-lg bg-[#111520] border border-amber-500/30 text-amber-300 text-[11px] leading-relaxed min-h-[70px]">
                  {typedDialogue}
                  <span className="inline-block w-1.5 h-3 bg-amber-400 ml-1 animate-pulse" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px] text-amber-400">
                <span className="flex items-center gap-1">
                  <Play className="w-3 h-3 fill-amber-400" /> 2-Way Video Stream Active
                </span>
                <span className="text-slate-400">Latency: 64ms</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 flex flex-wrap gap-2">
            {["Three.js", "WebGL", "Spatial Audio", "Voice AI", "60 FPS"].map((pill) => (
              <span
                key={pill}
                className="px-2.5 py-1 rounded-full bg-[#111520] border border-slate-800 text-[10px] font-mono text-slate-300"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* CARD 2 - Ray Optics & Convex Mirror */}
        <div
          ref={card2Ref}
          onMouseMove={(e) => handleMouseMove(e, card2Ref)}
          className="group relative bg-[#0b0e14] border border-white/10 hover:border-blue-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-xl"
          style={{
            backgroundImage:
              "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(37, 99, 235, 0.08), transparent 50%)",
          }}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <span className="uppercase tracking-wider font-semibold text-white">
                  RAY OPTICS LAB
                </span>
              </div>
              <span className="text-[10px] text-slate-400">NCERT CLASS 10</span>
            </div>

            <h3 className="text-xl font-bold text-white leading-snug">
              Interactive Ray Tracing for Concave & Convex Mirrors.
            </h3>

            {/* Interactive Preview: Ray Diagram */}
            <div className="rounded-2xl bg-[#07090e] border border-white/10 p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px] text-slate-400">
                <span>Focal Point & Center of Curvature</span>
                <span className="text-blue-400 font-bold">F = 15cm</span>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-[#111520] border border-blue-500/30 text-slate-200 text-[11px]">
                  Real, inverted image formed at focal plane with dynamic ray angle calculation.
                </div>
              </div>

              <div className="p-2 rounded bg-[#111520] text-[10px] text-slate-300 flex items-center justify-between">
                <span>Live Mirror Equation Solver</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 flex flex-wrap gap-2">
            {["Ray Tracing", "Optics", "Class 10 Physics", "Mirror Formula"].map((pill) => (
              <span
                key={pill}
                className="px-2.5 py-1 rounded-full bg-[#111520] border border-slate-800 text-[10px] font-mono text-slate-300"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* CARD 3 - VR Classroom & Spatial Audio */}
        <div
          ref={card3Ref}
          onMouseMove={(e) => handleMouseMove(e, card3Ref)}
          className="group relative bg-[#0b0e14] border border-white/10 hover:border-purple-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-xl"
          style={{
            backgroundImage:
              "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(168, 85, 247, 0.08), transparent 50%)",
          }}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Glasses className="w-4 h-4 text-purple-400" />
                <span className="uppercase tracking-wider font-semibold text-white">
                  VR SPATIAL HUD
                </span>
              </div>
              <span className="text-[10px] text-slate-400">VR HEADSET</span>
            </div>

            <h3 className="text-xl font-bold text-white leading-snug">
              VR Headset Seated Classroom & Blackboard Mesh.
            </h3>

            {/* Interactive Preview: VR Waveform */}
            <div className="rounded-2xl bg-[#07090e] border border-white/10 p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Spatial Audio Directional Tracking</span>
                <span className="text-purple-400">360° Head Pose</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#111520] border border-purple-500/30 text-purple-300 text-[11px] flex items-center justify-between">
                <span>VR Camera Mesh locked to Seated Desk</span>
                <Activity className="w-4 h-4 animate-pulse text-purple-400" />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 flex flex-wrap gap-2">
            {["WebXR", "Spatial Audio", "Headsets", "Seated Pose"].map((pill) => (
              <span
                key={pill}
                className="px-2.5 py-1 rounded-full bg-[#111520] border border-slate-800 text-[10px] font-mono text-slate-300"
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
