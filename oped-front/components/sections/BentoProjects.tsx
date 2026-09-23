"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Video, Box, LineChart, Play, CheckCircle, Sparkles, MessageSquare } from "lucide-react";

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

  // Card 1: Simulated speech transcription & 2-way AI response
  const [typedText, setTypedText] = useState("");
  const fullText =
    "Let's review refraction of light! When a light ray enters a glass prism, it bends toward the normal line due to the change in optical density.";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index));
      index = (index + 1) % (fullText.length + 15);
    }, 40);
    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-28 space-y-16 bg-slate-50 border-t border-b border-slate-200">
      {/* Title */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-mono tracking-wider uppercase font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>INTERACTIVE SHOWCASE</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Experience learning built for the AI era.
        </h2>

        <p className="text-slate-600 text-base sm:text-lg">
          Live 2-way video streams, interactive 3D spatial whiteboards, and instant automated
          student evaluation.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD 1 - 2-Way Real-Time Video */}
        <div
          ref={card1Ref}
          onMouseMove={(e) => handleMouseMove(e, card1Ref)}
          className="group relative bg-white border border-slate-200 hover:border-blue-300 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 font-semibold">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-600" />
                <span className="uppercase tracking-wider font-bold text-slate-900">
                  2-WAY REAL-TIME VIDEO
                </span>
              </div>
              <span className="text-[10px] text-slate-400">DEMO 01</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 leading-snug">
              Bidirectional video & audio streaming with instant lip-synced AI virtual teachers.
            </h3>

            {/* Interactive Preview: Video Stream */}
            <div className="rounded-2xl bg-slate-900 text-white border border-slate-800 p-4 space-y-3 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <span className="text-blue-400 font-bold">OPED Live Stream [30 FPS]</span>
              </div>

              <div className="space-y-2 text-slate-200">
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-blue-400" /> Teacher Explanation (NCERT
                  Class 10 Light):
                </div>
                <div className="p-3 rounded-xl bg-slate-800/90 border border-blue-500/30 text-blue-200 text-[11px] leading-relaxed min-h-[75px]">
                  {typedText}
                  <span className="inline-block w-1.5 h-3 bg-blue-400 ml-1 animate-pulse" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px] text-blue-400 font-semibold">
                <span className="flex items-center gap-1">
                  <Play className="w-3 h-3 fill-blue-400" /> Synthesizing audio & speech...
                </span>
                <span className="text-slate-400">42ms latency</span>
              </div>
            </div>
          </div>

          {/* Tech Pills */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
            {["WebRTC", "Framer Motion", "Three.js", "NCERT Science"].map((pill) => (
              <span
                key={pill}
                className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-700 font-medium"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* CARD 2 - 3D VR Classroom Mesh */}
        <div
          ref={card2Ref}
          onMouseMove={(e) => handleMouseMove(e, card2Ref)}
          className="group relative bg-white border border-slate-200 hover:border-blue-300 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 font-semibold">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-indigo-600" />
                <span className="uppercase tracking-wider font-bold text-slate-900">
                  3D VR BLACKBOARD MESH
                </span>
              </div>
              <span className="text-[10px] text-slate-400">DEMO 02</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 leading-snug">
              Multipurpose 3D whiteboard rendering animated atoms, rays, and circuit diagrams.
            </h3>

            {/* Interactive Preview: 3D Mesh Diagram */}
            <div className="rounded-2xl bg-slate-900 text-white border border-slate-800 p-4 space-y-3 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px] text-slate-400">
                <span>Atomic Structure (Rutherford Model)</span>
                <span className="text-indigo-400 font-bold">Interactive 3D Mesh</span>
              </div>

              {/* Wireframe Orbit Graphics */}
              <div className="relative h-24 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 overflow-hidden">
                <div className="w-12 h-12 rounded-full border border-dashed border-indigo-400 animate-[spin_8s_linear_infinite]" />
                <div className="absolute w-20 h-8 rounded-full border border-blue-400/60 rotate-45 animate-pulse" />
                <div className="absolute w-4 h-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800 text-[10px] text-slate-300 flex items-center justify-between">
                <span>Rays Bending Index: n = 1.52</span>
                <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Tech Pills */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
            {["R3F", "WebGL", "Spatial Camera", "GLTF"].map((pill) => (
              <span
                key={pill}
                className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-700 font-medium"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* CARD 3 - Student Evaluation */}
        <div
          ref={card3Ref}
          onMouseMove={(e) => handleMouseMove(e, card3Ref)}
          className="group relative bg-white border border-slate-200 hover:border-blue-300 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 font-semibold">
              <div className="flex items-center gap-2">
                <LineChart className="w-4 h-4 text-emerald-600" />
                <span className="uppercase tracking-wider font-bold text-slate-900">
                  STUDENT MASTERY ENGINE
                </span>
              </div>
              <span className="text-[10px] text-slate-400">DEMO 03</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 leading-snug">
              Real-time comprehension analytics and step-by-step recitation scoring.
            </h3>

            {/* Interactive Preview: Performance Graph */}
            <div className="rounded-2xl bg-slate-900 text-white border border-slate-800 p-4 space-y-3 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Student Retention Curve</span>
                <span className="text-emerald-400 font-bold">Score: 96.8%</span>
              </div>

              <svg className="w-full h-24 overflow-visible" viewBox="0 0 200 80">
                <line x1="0" y1="20" x2="200" y2="20" stroke="#334155" strokeDasharray="3 3" />
                <line x1="0" y1="50" x2="200" y2="50" stroke="#334155" strokeDasharray="3 3" />

                <motion.path
                  d="M 10 65 Q 50 55, 90 25 T 150 15 T 190 10"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
              </svg>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> 3D Class Active
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Target Comprehension
                </span>
              </div>
            </div>
          </div>

          {/* Tech Pills */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
            {["Adaptive AI", "Socratic Prompt", "Recitation HUD"].map((pill) => (
              <span
                key={pill}
                className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-700 font-medium"
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
