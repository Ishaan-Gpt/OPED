"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  MessageSquare,
  Award,
  Calendar,
  Sparkles,
  User,
  Send,
  Video,
  Box,
  Mic,
} from "lucide-react";

export const MatchingEngine: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      sender: "AI Teacher (Anaya)",
      text: "Great recall on Rutherford's experiment! Can you explain why alpha particles were deflected at large angles?",
      time: "10:14 AM",
    },
    {
      sender: "Student (You)",
      text: "Because the positive charge of the atom is concentrated in a tiny nucleus rather than spread out uniformly!",
      time: "10:15 AM",
    },
    {
      sender: "AI Teacher (Anaya)",
      text: "Spot on! Generating a 3D simulation of the nucleus on your spatial board now...",
      time: "10:15 AM",
    },
  ]);
  const [inputVal, setInputVal] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setMessages((prev) => [...prev, { sender: "Student (You)", text: inputVal, time: "Just now" }]);
    setInputVal("");
  };

  return (
    <section className="py-28 px-6 sm:px-12 max-w-7xl mx-auto space-y-16 relative">
      {/* Background Ambient Radial Backlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-amber-500/10 blur-[160px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111520] border border-amber-500/30 text-amber-300 text-xs font-mono tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>2-WAY GENERATIVE VIDEO INTERACTION</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tighter text-white leading-tight">
          Talk naturally. Learn visually in 3D.
        </h2>

        <p className="text-slate-400 text-base sm:text-lg">
          Zero delay. Instant 2-way video generation that adapts lesson depth based on your voice
          responses.
        </p>
      </div>

      {/* Feature Pills Stack */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="p-6 rounded-2xl bg-[#0b0e14] border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Video className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">1. Real-time Video Stream</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI teacher facial kinematics and voice synthesized live at 60 FPS with &lt; 80ms
            latency.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0b0e14] border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Box className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">2. Spatial 3D Blackboard</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The teacher points and draws diagrams on an interactive spatial board in real-time.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0b0e14] border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">3. Automated Mastery Score</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Verifies your conceptual mastery per NCERT chapter with automated evaluation reports.
          </p>
        </div>
      </div>

      {/* Sleek Floating Glassmorphism Workspace Window Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl border border-white/10 glass-panel overflow-hidden shadow-2xl backdrop-blur-xl"
      >
        {/* Titlebar */}
        <div className="px-6 py-4 bg-[#07090e]/90 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-xs font-mono text-slate-400">
              OPED Spatial Interaction Console v2.4
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono text-amber-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              2-WAY VIDEO LATENCY: 68ms
            </span>
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          {/* Left Column: Student Scorecard */}
          <div className="lg:col-span-5 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-xl text-slate-950 shadow-lg">
                OP
              </div>
              <div>
                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                  Student Console
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                </h4>
                <p className="text-xs font-mono text-slate-400">
                  NCERT Class 9 Science • Atom Module
                </p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#07090e] border border-white/10 flex items-center justify-between">
                <span className="text-slate-400">CONCEPT RECALL ACCURACY</span>
                <span className="text-amber-400 font-bold">96.8%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#07090e] border border-white/10 flex items-center justify-between">
                <span className="text-slate-400">3D MODEL INTERACTION</span>
                <span className="text-white font-bold">COMPLETED (3/3)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#07090e] border border-white/10 flex items-center justify-between">
                <span className="text-slate-400">2-WAY STREAM FPS</span>
                <span className="text-blue-400 font-bold flex items-center gap-1">
                  <Video className="w-3 h-3" /> 60 FPS HD
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Video Dialogue Stream */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-[#07090e]/60 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span className="text-white font-semibold">Live 2-Way Generative Dialogue</span>
              </div>
              <span className="text-slate-400">AI Teacher Anaya</span>
            </div>

            {/* Message History */}
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col space-y-1 ${
                    msg.sender.includes("You") ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    {msg.sender.includes("You") ? (
                      <User className="w-3 h-3" />
                    ) : (
                      <Video className="w-3 h-3 text-amber-400" />
                    )}
                    <span>{msg.sender}</span>
                    <span>• {msg.time}</span>
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl text-xs max-w-md leading-relaxed ${
                      msg.sender.includes("You")
                        ? "bg-amber-500/20 border border-amber-500/40 text-amber-100 rounded-tr-none"
                        : "bg-[#111520] border border-slate-700 text-slate-200 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask your AI teacher a question..."
                className="flex-1 bg-[#111520] border border-slate-700 rounded-full px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
              <button
                type="submit"
                className="p-2.5 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
