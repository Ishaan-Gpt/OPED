"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Atom, Compass, Dna, Calculator, Cpu, CheckCircle2 } from "lucide-react";

interface SubjectTrack {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  modules: string[];
  description: string;
  accent: string;
}

const subjects: SubjectTrack[] = [
  {
    id: "physics",
    name: "Physics & Optics 3D",
    icon: Compass,
    description:
      "Manipulate light rays, mirrors, lenses, and electrical circuits in real-time 3D VR space.",
    modules: [
      "Concave & Convex Mirror Optics",
      "Prism Refraction & Dispersion",
      "Circuit & Ohm's Law Simulation",
      "Gravitation & Motion Mechanics",
    ],
    accent: "from-blue-600/20 to-indigo-600/5",
  },
  {
    id: "chemistry",
    name: "Chemistry & Atom 3D",
    icon: Atom,
    description:
      "Step inside Rutherford & Bohr atomic orbits, rotate molecular bonds, and trigger chemical reactions.",
    modules: [
      "Subatomic Particle Orbits",
      "Chemical Equation Balancer",
      "Periodic Table 3D Trends",
      "Acid-Base Neutralization",
    ],
    accent: "from-indigo-600/20 to-sky-600/5",
  },
  {
    id: "biology",
    name: "Biology & Life Sciences",
    icon: Dna,
    description:
      "Explore 3D cell organelles, watch plant photosynthesis at molecular levels, and inspect human organs.",
    modules: [
      "Plant Photosynthesis 3D",
      "Cell Structure & Organelles",
      "Human Heart Circulation",
      "Genetics & DNA Replication",
    ],
    accent: "from-amber-600/20 to-orange-600/5",
  },
  {
    id: "math",
    name: "Mathematics & Geometry",
    icon: Calculator,
    description:
      "Visualize 3D calculus surfaces, rotate coordinate geometries, and solve interactive linear algebra.",
    modules: [
      "3D Vector Surfaces",
      "Coordinate Geometry 3D",
      "Calculus Derivatives & Integrals",
      "Probability & Statistics",
    ],
    accent: "from-sky-600/20 to-blue-600/5",
  },
  {
    id: "cs",
    name: "Computer Science & AI",
    icon: Cpu,
    description:
      "Inspect 3D neural network layers, walk through data structure graphs, and build AI algorithms.",
    modules: [
      "3D Neural Network Matrix",
      "Algorithm Graph Traversal",
      "Python AI Code Runner",
      "Web Development Studio",
    ],
    accent: "from-violet-600/20 to-indigo-600/5",
  },
];

export const Tracks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredSubjects =
    activeTab === "all" ? subjects : subjects.filter((s) => s.id === activeTab);

  return (
    <section id="curriculum" className="py-28 px-6 sm:px-12 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 tracking-widest uppercase">
          <span>[ INTERACTIVE 3D CURRICULUM ]</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tighter text-white leading-tight">
          Explore Class 4–10 NCERT Subjects in Immersive 3D.
        </h2>

        <p className="text-slate-400 text-base sm:text-lg font-normal">
          Every concept is mapped to NCERT standards, backed by real-time AI teacher evaluations and
          3D VR visualizers.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-800">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-full text-xs font-mono transition-all ${
            activeTab === "all"
              ? "bg-white text-slate-950 font-semibold shadow-md"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
          }`}
        >
          All 3D Classrooms
        </button>
        {subjects.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveTab(s.id)}
            className={`px-4 py-2 rounded-full text-xs font-mono transition-all ${
              activeTab === s.id
                ? "bg-white text-slate-950 font-semibold shadow-md"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject, idx) => {
          const Icon = subject.icon;
          return (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative bg-[#151C2C]/70 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 backdrop-blur-md"
            >
              {/* Card Ambient Gradient */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${subject.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
              />

              <div className="relative z-10 space-y-6">
                {/* Header Icon + Subject Title */}
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-white group-hover:border-blue-500/40 transition-colors">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    CLASSROOM 0{idx + 1}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{subject.name}</h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed font-normal">
                    {subject.description}
                  </p>
                </div>

                {/* Verified Modules List */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    3D INTERACTIVE MODULES
                  </span>
                  <ul className="space-y-2">
                    {subject.modules.map((mod, mIdx) => (
                      <li key={mIdx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{mod}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Badge */}
              <div className="relative z-10 mt-6 pt-4 flex items-center justify-between text-[11px] font-mono text-slate-400 group-hover:text-blue-400 transition-colors">
                <span>LAUNCH 3D ENVIRONMENT</span>
                <span>→</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
