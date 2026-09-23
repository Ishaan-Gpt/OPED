"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Video, Glasses, Box, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

const TRACKS = [
  {
    id: "spatial-physics",
    title: "Class 9-10 NCERT Physics 3D",
    category: "3D SPATIAL CLASSROOM",
    description:
      "Explore Optics, Ray Diagrams, Rutherford Atomic Structure, and Electromagnetic Induction inside 3D spatial environments.",
    badge: "3D VR SIMULATION",
    modules: ["Ray Optics & Lenses", "Rutherford Model 3D", "Circuit Builder", "Refraction Rays"],
    icon: Box,
    accent: "border-amber-500/30 text-amber-400 bg-amber-500/10",
  },
  {
    id: "generative-video",
    title: "2-Way Real-time Generative Tutor",
    category: "REAL-TIME VIDEO STREAM",
    description:
      "Converse with a hyper-realistic AI teacher streamed in 60 FPS video. Ask questions by voice and receive live visual board draw responses.",
    badge: "< 80ms LATENCY STREAM",
    modules: [
      "Voice Natural Dialogue",
      "Dynamic Blackboard Draw",
      "Instant Concept Evaluation",
      "Speech Kinematics",
    ],
    icon: Video,
    accent: "border-blue-500/30 text-blue-400 bg-blue-500/10",
  },
  {
    id: "vr-immersive",
    title: "VR Headset Spatial Classroom",
    category: "VIRTUAL REALITY",
    description:
      "Put on your Meta Quest or Apple Vision Pro headset for 360° spatial audio, desk seating, and hands-on 3D manipulation.",
    badge: "VR HEADSET READY",
    modules: [
      "Spatial Audio Positioning",
      "Hand Gesture Tracking",
      "FPV Classroom Camera",
      "Seated Recitation",
    ],
    icon: Glasses,
    accent: "border-purple-500/30 text-purple-400 bg-purple-500/10",
  },
  {
    id: "ncert-mastery",
    title: "NCERT Class 7-10 Complete Science",
    category: "CURRICULUM ENGINE",
    description:
      "Comprehensive NCERT syllabus breakdown with automated mastery outcomes, voice recitation checks, and report scorecards.",
    badge: "FULL SYLLABUS",
    modules: [
      "Nutrition in Plants",
      "Light & Reflection",
      "Structure of Atom",
      "Chemical Reactions",
    ],
    icon: Zap,
    accent: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
  },
];

export const Tracks: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState(TRACKS[0].id);

  return (
    <section id="realtime-video" className="max-w-7xl mx-auto px-6 py-28 space-y-16">
      {/* Title */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111520] border border-amber-500/30 text-amber-300 text-xs font-mono tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>FOUR PILLARS OF SPATIAL LEARNING</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tighter text-white leading-tight">
          Immersive 3D Spatial Classrooms & Generative Video.
        </h2>

        <p className="text-slate-400 text-base sm:text-lg">
          Select a spatial learning domain to explore interactive 3D physics models and 2-way
          generative video streams.
        </p>
      </div>

      {/* Track Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TRACKS.map((track) => {
          const Icon = track.icon;
          const isActive = activeTrack === track.id;

          return (
            <motion.div
              key={track.id}
              onClick={() => setActiveTrack(track.id)}
              whileHover={{ y: -4 }}
              className={`cursor-pointer rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                isActive
                  ? "bg-[#111520] border-2 border-amber-500/50 shadow-2xl glow-gold"
                  : "bg-[#0b0e14] border border-white/10 hover:border-slate-700"
              }`}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${track.accent}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${track.accent}`}
                  >
                    {track.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    {track.category}
                  </span>
                  <h3 className="text-xl font-bold text-white leading-snug">{track.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{track.description}</p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  KEY MODULES
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {track.modules.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded-md bg-[#07090e] border border-slate-800 text-[10px] font-mono text-slate-300"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
