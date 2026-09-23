"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, MessageSquare, Award, Calendar, Sparkles, Building2, User, Send } from "lucide-react";

export const MatchingEngine: React.FC = () => {
  const [messages, setMessages] = useState([
    { sender: "Recruiter (Vercel)", text: "Hi Alex! Your Zero verified AI rewrite project scored in the top 1% of applicants. We'd love to schedule your guaranteed final round interview.", time: "10:14 AM" },
    { sender: "Candidate (You)", text: "Thanks Sarah! I've linked my live demo and benchmark metrics. What time works best?", time: "10:16 AM" }
  ]);
  const [inputVal, setInputVal] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setMessages((prev) => [
      ...prev,
      { sender: "Candidate (You)", text: inputVal, time: "Just now" }
    ]);
    setInputVal("");
  };

  return (
    <section className="py-28 px-6 sm:px-12 max-w-7xl mx-auto space-y-16 relative">
      {/* Background Ambient Radial Backlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#2E5243]/20 blur-[150px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>ALL IN ONE APP</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tighter text-white leading-tight">
          From verified proof of work to a guaranteed offer.
        </h2>

        <p className="text-zinc-400 text-base sm:text-lg">
          No ghosting. No automated resume rejections. Direct connection to engineering directors.
        </p>
      </div>

      {/* Feature Pills Stack */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-white/5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">1. Verified Portfolio</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Build a live, interactive portfolio of completed production briefs reviewed by senior engineers.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-white/5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">2. Direct Partner Matching</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Hiring managers browse verified candidate scorecards, skipping initial phone screens completely.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-white/5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">3. Guaranteed Interview</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Every Zero Beta graduate receives a guaranteed interview offer with our hiring network.
          </p>
        </div>
      </div>

      {/* Sleek Floating Glassmorphism Application Window Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl border border-white/10 glass-panel overflow-hidden shadow-2xl backdrop-blur-xl"
      >
        {/* Application Window Titlebar */}
        <div className="px-6 py-4 bg-zinc-950/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-2 text-xs font-mono text-zinc-400">Zero Candidate Suite v2.4</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              MATCH SCORE: 98.6%
            </span>
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          {/* Left Column: Candidate Scorecard */}
          <div className="lg:col-span-5 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-bold text-xl text-white shadow-lg">
                AZ
              </div>
              <div>
                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                  Alex Zhang
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </h4>
                <p className="text-xs font-mono text-zinc-400">Applied AI Engineer Track</p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-black/60 border border-white/5 flex items-center justify-between">
                <span className="text-zinc-500">PROJECT COMPLETION</span>
                <span className="text-emerald-400 font-bold">100% (3/3 Briefs)</span>
              </div>
              <div className="p-3 rounded-xl bg-black/60 border border-white/5 flex items-center justify-between">
                <span className="text-zinc-500">CODE QUALITY INDEX</span>
                <span className="text-white font-bold">9.8 / 10</span>
              </div>
              <div className="p-3 rounded-xl bg-black/60 border border-white/5 flex items-center justify-between">
                <span className="text-zinc-500">INTERVIEW STATUS</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> GUARANTEED
                </span>
              </div>
            </div>

            {/* Verified Tech Badges */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">VERIFIED STACK</span>
              <div className="flex flex-wrap gap-2">
                {["Next.js", "PyTorch", "TypeScript", "FastAPI", "VectorDB", "Tailwind"].map((tech) => (
                  <span key={tech} className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Recruiter Chat */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-black/40 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span className="text-white font-semibold">Recruiter Direct Desk</span>
              </div>
              <span className="text-zinc-500">Vercel Hiring Team</span>
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
                  <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                    {msg.sender.includes("You") ? <User className="w-3 h-3" /> : <Building2 className="w-3 h-3 text-emerald-400" />}
                    <span>{msg.sender}</span>
                    <span>• {msg.time}</span>
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl text-xs max-w-md leading-relaxed ${
                      msg.sender.includes("You")
                        ? "bg-emerald-600/20 border border-emerald-500/40 text-emerald-100 rounded-tr-none"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Type a message to your recruiter..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
              />
              <button
                type="submit"
                className="p-2.5 rounded-full bg-emerald-500 text-black hover:bg-emerald-400 transition-colors"
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
