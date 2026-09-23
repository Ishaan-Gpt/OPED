"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, ArrowRight, Play, Box } from "lucide-react";

const TRACKS = [
  {
    id: "c10-light",
    title: "Class 10 Physics — Light: Reflection & Refraction",
    grade: "Class 10",
    subject: "Physics",
    duration: "45 Mins",
    modules: ["Spherical Mirrors", "Ray Diagrams", "Lens Formula", "Refractive Index"],
    description:
      "Master concave and convex optics with interactive 3D ray tracing and real-time blackboard calculation.",
  },
  {
    id: "c9-atom",
    title: "Class 9 Chemistry — Structure of the Atom",
    grade: "Class 9",
    subject: "Chemistry",
    duration: "40 Mins",
    modules: ["Rutherford Model", "Alpha Scattering", "Bohr Atomic Shells", "Valency"],
    description:
      "Step inside a 3D atomic model and observe electron orbits and nuclear scattering live in VR.",
  },
  {
    id: "c8-optics",
    title: "Class 8 Physics — Light & Prism Dispersion",
    grade: "Class 8",
    subject: "Physics",
    duration: "35 Mins",
    modules: ["Glass Prism", "Spectrum Colors", "Human Eye Anatomy", "Multiple Reflection"],
    description:
      "Dissect a 3D glass prism and split white light into spectral wavelengths with real-time controls.",
  },
  {
    id: "c7-bio",
    title: "Class 7 Biology — Nutrition in Plants",
    grade: "Class 7",
    subject: "Biology",
    duration: "30 Mins",
    modules: ["Photosynthesis", "Stomata Mechanism", "Chloroplast 3D", "Autotrophic"],
    description:
      "Explore microscopic plant cells and stomatal opening/closing animations in interactive 3D space.",
  },
];

export const Tracks: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState(TRACKS[0]);

  return (
    <section className="py-28 px-6 sm:px-12 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>NCERT 3D CURRICULUM</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tighter text-white leading-tight">
          Explore interactive NCERT STEM modules.
        </h2>

        <p className="text-slate-400 text-base sm:text-lg">
          From Class 4 through Class 10 Science & Math, powered by dynamic 3D scenes and AI teacher
          recitation.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Track Selection List */}
        <div className="lg:col-span-5 space-y-3">
          {TRACKS.map((track) => (
            <div
              key={track.id}
              onClick={() => setActiveTrack(track)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                activeTrack.id === track.id
                  ? "bg-slate-900 border-blue-500/50 shadow-xl shadow-blue-950/20"
                  : "bg-[#0D0F14] border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-blue-400 font-bold">{track.grade}</span>
                <span className="text-slate-500">{track.duration}</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1 leading-snug">{track.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{track.description}</p>
            </div>
          ))}
        </div>

        {/* Selected Track Detail Card */}
        <motion.div
          key={activeTrack.id}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-7 p-8 rounded-3xl bg-[#0D0F14] border border-slate-800 space-y-6 shadow-2xl"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono">
            <span className="text-blue-400 font-bold flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> {activeTrack.subject} MODULE
            </span>
            <span className="text-slate-500">READY TO RECITATE</span>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-extrabold text-white">{activeTrack.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{activeTrack.description}</p>
          </div>

          {/* Module Pills */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              KEY CONCEPTS IN 3D
            </span>
            <div className="flex flex-wrap gap-2">
              {activeTrack.modules.map((m) => (
                <span
                  key={m}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-1.5"
                >
                  <Box className="w-3 h-3 text-blue-400" /> {m}
                </span>
              ))}
            </div>
          </div>

          {/* Launch Button */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs font-mono text-slate-400">
              <span>Interactive Evaluation Included</span>
            </div>
            <button
              onClick={() => (window.location.href = "/showcase")}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all active:scale-95 shadow-lg shadow-blue-600/20"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Enter Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
