"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Box, Video, Brain, Sparkles, CheckCircle2, Cpu } from "lucide-react";

interface TrackCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  description: string;
  badgeColor: string;
}

const tracks: TrackCategory[] = [
  {
    id: "3d-vr",
    name: "3D VR Classrooms",
    icon: Box,
    description:
      "Immersive 3D environments with dynamic camera motion, spatial audio, and interactive meshes.",
    features: [
      "Classroom Environment Engine",
      "Interactive 3D Whiteboard",
      "Spatial Audio & Reverb",
      "Dynamic Camera Tracking",
    ],
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "video-ai",
    name: "2-Way Realtime Video",
    icon: Video,
    description:
      "Bidirectional video and audio generation that reacts instantly to student speech and gestures.",
    features: [
      "Real-time Video Synthesis",
      "Low-Latency Audio Stream",
      "Gesture & Lip Sync Rig",
      "Dynamic Expression Controller",
    ],
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    id: "ncert",
    name: "NCERT AI Curriculum",
    icon: Brain,
    description:
      "Comprehensive Class 4–10 Science, Math, and Physics modules structured for high engagement.",
    features: [
      "Class 4-10 Science Modules",
      "Automated Step Evaluation",
      "Socratic Question Generator",
      "Mastery Outcome Tracking",
    ],
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "eval",
    name: "Adaptive AI Teacher",
    icon: Cpu,
    description:
      "Autonomous AI Teacher character that evaluates responses, provides hints, and adapts pace.",
    features: [
      "Recitation Evaluation Engine",
      "Multi-Modal Gaze & Pointing",
      "Automated Feedback Loops",
      "Personalized Learning Path",
    ],
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
  },
];

export const Tracks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredTracks = activeTab === "all" ? tracks : tracks.filter((t) => t.id === activeTab);

  return (
    <section className="py-28 px-6 sm:px-12 max-w-7xl mx-auto space-y-16 bg-white">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 tracking-wider uppercase font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>[ CORE PLATFORM ENGINES ]</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Engineered for the next decade of AI education.
        </h2>

        <p className="text-slate-600 text-base sm:text-lg font-normal">
          Combining spatial computing, generative video AI, and cognitive learning science in one
          seamless platform.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-full text-xs font-mono transition-all font-semibold ${
            activeTab === "all"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
          }`}
        >
          All Modules
        </button>
        {tracks.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-full text-xs font-mono transition-all font-semibold ${
              activeTab === t.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Tracks Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredTracks.map((track, idx) => {
          const Icon = track.icon;
          return (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative z-10 space-y-6">
                {/* Header Icon + Track Name */}
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-blue-600 group-hover:bg-blue-50 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${track.badgeColor} font-semibold uppercase`}
                  >
                    MODULE 0{idx + 1}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">{track.name}</h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed font-normal">
                    {track.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">
                    KEY CAPABILITIES
                  </span>
                  <ul className="space-y-2">
                    {track.features.map((feat, fIdx) => (
                      <li
                        key={fIdx}
                        className="flex items-center gap-2 text-xs text-slate-700 font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Badge */}
              <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500 group-hover:text-blue-600 transition-colors font-semibold">
                <span>EXPLORE CAPABILITIES</span>
                <span>→</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
