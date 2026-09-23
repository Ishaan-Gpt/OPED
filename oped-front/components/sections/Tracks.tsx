"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Brain, BarChart3, Palette, ShieldCheck, CheckCircle2 } from "lucide-react";

interface TrackCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
  description: string;
  accent: string;
}

const tracks: TrackCategory[] = [
  {
    id: "swe",
    name: "Software Engineering",
    icon: Code2,
    description:
      "Architect high-throughput AI backends, full-stack Next.js apps, and agentic microservices.",
    roles: [
      "Applied AI Engineer",
      "Backend Engineer",
      "Full Stack Developer",
      "Frontend Developer",
    ],
    accent: "from-emerald-500/20 to-teal-500/5",
  },
  {
    id: "ai",
    name: "AI & Data Science",
    icon: Brain,
    description:
      "Fine-tune LLMs, deploy PyTorch inference pipelines, and construct scalable vector databases.",
    roles: ["AI Engineer", "Machine Learning Engineer", "Data Scientist", "BI Analyst"],
    accent: "from-blue-500/20 to-indigo-500/5",
  },
  {
    id: "biz",
    name: "Business & Ops",
    icon: BarChart3,
    description:
      "Analyze market expansion, automate enterprise workflows, and partner with executive leadership.",
    roles: ["Management Consultant", "Financial Analyst", "Operations Associate", "Chief of Staff"],
    accent: "from-amber-500/20 to-orange-500/5",
  },
  {
    id: "prod",
    name: "Product & Design",
    icon: Palette,
    description:
      "Design pixel-perfect interfaces, craft AI product specs, and drive end-to-end user growth.",
    roles: ["Product Manager", "UX/Design Engineer", "Systems Designer", "Product Marketer"],
    accent: "from-purple-500/20 to-pink-500/5",
  },
  {
    id: "sec",
    name: "Security & Sales",
    icon: ShieldCheck,
    description:
      "Protect AI models against adversarial prompts and pitch enterprise AI solutions to Fortune 500s.",
    roles: ["AI Security Analyst", "SOC Analyst", "Account Executive", "Solutions Consultant"],
    accent: "from-red-500/20 to-rose-500/5",
  },
];

export const Tracks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredTracks = activeTab === "all" ? tracks : tracks.filter((t) => t.id === activeTab);

  return (
    <section className="py-28 px-6 sm:px-12 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 tracking-widest uppercase">
          <span>[ ROLES & CURRICULUM ]</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tighter text-white leading-tight">
          Get hired into the world&apos;s most in-demand AI-native roles.
        </h2>

        <p className="text-zinc-400 text-base sm:text-lg font-normal">
          Master real-world production stacks used by top tech companies and high-growth startups.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-white/5">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-full text-xs font-mono transition-all ${
            activeTab === "all"
              ? "bg-white text-black font-semibold"
              : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white"
          }`}
        >
          All Tracks
        </button>
        {tracks.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-full text-xs font-mono transition-all ${
              activeTab === t.id
                ? "bg-white text-black font-semibold"
                : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Tracks Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTracks.map((track, idx) => {
          const Icon = track.icon;
          return (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative bg-[#0c0c0c] border border-white/5 hover:border-zinc-700 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Card Ambient Gradient */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${track.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
              />

              <div className="relative z-10 space-y-6">
                {/* Header Icon + Track Name */}
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white group-hover:border-zinc-600 transition-colors">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    TRACK 0{idx + 1}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{track.name}</h3>
                  <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-normal">
                    {track.description}
                  </p>
                </div>

                {/* Verified Roles List */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    VERIFIED POSITIONS
                  </span>
                  <ul className="space-y-2">
                    {track.roles.map((role, rIdx) => (
                      <li key={rIdx} className="flex items-center gap-2 text-xs text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Badge */}
              <div className="relative z-10 mt-6 pt-4 flex items-center justify-between text-[11px] font-mono text-zinc-500 group-hover:text-emerald-400 transition-colors">
                <span>GUARANTEED INTERVIEW</span>
                <span>→</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
