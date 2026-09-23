"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Video, Box, Play, Sparkles, Layers } from "lucide-react";

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

  // Card 1: Simulated speech transcription & teacher response stream
  const [typedText, setTypedText] = useState("");
  const fullText =
    "Let us examine Rutherford's alpha particle scattering experiment. Notice how most particles pass straight through the gold foil, proving that the atom is mostly empty space.";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index));
      index = (index + 1) % (fullText.length + 15);
    }, 40);
    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-28 space-y-16">
      {/* Section Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>IMMERSIVE ARCHITECTURE</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tighter text-white leading-tight">
          Engineered for 3D spatial clarity & instant interaction.
        </h2>

        <p className="text-slate-400 text-base sm:text-lg">
          Combining 2-way real-time video generation, interactive 3D spatial models, and
          YouTube-speed adaptive streaming.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD 1 - 2-Way Real-Time AI Teacher */}
        <div
          ref={card1Ref}
          onMouseMove={(e) => handleMouseMove(e, card1Ref)}
          className="group relative bg-[#0D0F14] border border-slate-800/80 hover:border-blue-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-2xl"
          style={{
            backgroundImage:
              "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(37, 99, 235, 0.12), transparent 50%)",
          }}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-400" />
                <span className="uppercase tracking-wider font-semibold text-white">
                  2-WAY REAL-TIME VIDEO
                </span>
              </div>
              <span className="text-[10px] text-slate-500">&lt;200ms LATENCY</span>
            </div>

            <h3 className="text-xl font-bold text-white leading-snug">
              Interactive AI Teacher character with live vocal & facial synthesis.
            </h3>

            {/* Interactive Preview: Teacher Audio/Video Stream Box */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span>AI Teacher Stream — Active</span>
                </div>
                <span className="text-blue-400">60 FPS</span>
              </div>

              <div className="space-y-2 text-slate-300">
                <div className="text-[10px] text-slate-500">NCERT Class 9 — Structure of Atom</div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-blue-500/25 text-blue-300 text-[11px] leading-relaxed min-h-[75px]">
                  {typedText}
                  <span className="inline-block w-1.5 h-3 bg-blue-400 ml-1 animate-pulse" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px] text-blue-400">
                <span className="flex items-center gap-1.5">
                  <Play className="w-3 h-3 fill-blue-400" /> Real-time synthesis...
                </span>
                <span className="text-slate-500">99.8% Sync Score</span>
              </div>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap gap-2">
            {["Live Voice", "Facial Rig", "Natural Easing", "Vector SVG", "Gaze Tracking"].map(
              (pill) => (
                <span
                  key={pill}
                  className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400"
                >
                  {pill}
                </span>
              ),
            )}
          </div>
        </div>

        {/* CARD 2 - 3D VR Spatial Canvas */}
        <div
          ref={card2Ref}
          onMouseMove={(e) => handleMouseMove(e, card2Ref)}
          className="group relative bg-[#0D0F14] border border-slate-800/80 hover:border-indigo-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-2xl"
          style={{
            backgroundImage:
              "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(79, 70, 229, 0.12), transparent 50%)",
          }}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-indigo-400" />
                <span className="uppercase tracking-wider font-semibold text-white">
                  3D SPATIAL CANVAS
                </span>
              </div>
              <span className="text-[10px] text-slate-500">VR READY</span>
            </div>

            <h3 className="text-xl font-bold text-white leading-snug">
              Explore 3D STEM models in VR classrooms with instant spatial manipulation.
            </h3>

            {/* Interactive Preview: 3D Wireframe Mesh Simulation */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px] text-slate-400">
                <span>Rutherford Atom 3D Model</span>
                <span className="text-indigo-400 font-bold">Interactive</span>
              </div>

              {/* 3D Orbit Mesh Visualizer */}
              <div className="h-24 flex items-center justify-center relative overflow-hidden bg-slate-900/50 rounded-xl border border-slate-800">
                <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-400 flex items-center justify-center animate-pulse">
                  <div className="w-4 h-4 rounded-full bg-blue-400 shadow-[0_0_15px_#2563eb]" />
                </div>
                {/* Orbiting electrons */}
                <div className="absolute w-28 h-12 rounded-full border border-indigo-400/40 animate-[spin_6s_linear_infinite]" />
                <div className="absolute w-12 h-28 rounded-full border border-blue-400/40 animate-[spin_8s_linear_infinite_reverse]" />
              </div>

              <div className="p-2 rounded bg-slate-900 text-[10px] text-slate-300 flex items-center justify-between">
                <span>Rotatable 360° Viewport</span>
                <span className="text-indigo-400">WebXR / GLTF</span>
              </div>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap gap-2">
            {["Three.js", "WebGL", "Ray Diagrams", "Convex Optics", "Atoms"].map((pill) => (
              <span
                key={pill}
                className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* CARD 3 - Instant YouTube-Speed Delivery */}
        <div
          ref={card3Ref}
          onMouseMove={(e) => handleMouseMove(e, card3Ref)}
          className="group relative bg-[#0D0F14] border border-slate-800/80 hover:border-blue-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-2xl"
          style={{
            backgroundImage:
              "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 130, 246, 0.12), transparent 50%)",
          }}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <span className="uppercase tracking-wider font-semibold text-white">
                  YOUTUBE-SPEED DELIVERY
                </span>
              </div>
              <span className="text-[10px] text-slate-500">INSTANT</span>
            </div>

            <h3 className="text-xl font-bold text-white leading-snug">
              Multipurpose blackboard canvas with instant dynamic lesson streaming.
            </h3>

            {/* Interactive Preview: Adaptive Stream Waveform */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Adaptive HLS Stream Pipeline</span>
                <span className="text-blue-400">0ms Buffer</span>
              </div>

              <div className="h-20 bg-slate-900/60 rounded-xl p-3 flex flex-col justify-between border border-slate-800">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Audio & Video Chunk Delivery</span>
                  <span className="text-blue-400">4.8 MB/s</span>
                </div>
                <div className="flex items-end gap-1 h-8">
                  {[40, 65, 30, 80, 95, 70, 85, 45, 90, 60, 100, 75, 50, 85, 90, 60].map(
                    (h, idx) => (
                      <div
                        key={idx}
                        className="flex-1 bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t"
                        style={{ height: `${h}%` }}
                      />
                    ),
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Dynamic Math Slide Generation</span>
                <span className="text-blue-400 font-bold">Live Synced</span>
              </div>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap gap-2">
            {["HLS Streaming", "KaTeX Math", "Remotion", "Audio Map"].map((pill) => (
              <span
                key={pill}
                className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400"
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
