"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  MessageSquare,
  Sparkles,
  User,
  Send,
  Video,
  Mic,
  Volume2,
  Monitor,
} from "lucide-react";

export const MatchingEngine: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      sender: "AI Teacher (Ms. Anaya)",
      text: "Hello! Today we are looking at light reflection on concave mirrors. Can you tell me what happens when an object is placed at the center of curvature (C)?",
      time: "10:14 AM",
    },
    {
      sender: "Student (You)",
      text: "The image is formed at C, it is real, inverted, and the exact same size as the object!",
      time: "10:16 AM",
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
    <section id="teacher" className="py-28 px-6 sm:px-12 max-w-7xl mx-auto space-y-16 relative">
      {/* Background Ambient Radial Backlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/15 blur-[150px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>NEURAL REAL-TIME ENGINE</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tighter text-white leading-tight">
          2-Way Real-Time Video Generation & Interaction.
        </h2>

        <p className="text-slate-400 text-base sm:text-lg">
          Zero buffering. Zero recorded delay. Talk to your AI teacher naturally via voice or video.
        </p>
      </div>

      {/* Feature Pills Stack */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="p-6 rounded-2xl bg-[#151C2C]/70 border border-slate-800 space-y-3 backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Video className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">1. Real-Time Neural Lip-Sync</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The AI teacher avatar renders dynamic facial expressions, gaze tracking, and lip-sync
            with sub-100ms latency.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#151C2C]/70 border border-slate-800 space-y-3 backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Monitor className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">2. Live Blackboard Sync</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            As the AI teacher speaks, diagrams, 3D models, and equations are rendered directly onto
            the 3D blackboard.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#151C2C]/70 border border-slate-800 space-y-3 backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Mic className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">3. Voice Recall Evaluation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The AI evaluates your verbal responses, assesses conceptual mastery, and adapts the
            lesson difficulty in real-time.
          </p>
        </div>
      </div>

      {/* Floating Application Window Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl border border-slate-800 glass-panel overflow-hidden shadow-2xl backdrop-blur-xl"
      >
        {/* Titlebar */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-700" />
            <span className="w-3 h-3 rounded-full bg-blue-500/80" />
            <span className="w-3 h-3 rounded-full bg-indigo-500/80" />
            <span className="ml-2 text-xs font-mono text-slate-400">
              OPED 3D Realtime Stream v3.1
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] font-mono text-blue-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              LATENCY: 42ms
            </span>
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {/* Left Column: AI Teacher Live Stream Video Screen */}
          <div className="lg:col-span-5 p-6 sm:p-8 space-y-6">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md">
                    AI
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      Ms. Anaya
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    </h4>
                    <p className="text-xs font-mono text-slate-400">
                      NCERT Physics Educator Avatar
                    </p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono flex items-center gap-1">
                  <Volume2 className="w-3 h-3 animate-pulse" /> SPEAKING
                </span>
              </div>

              {/* Simulated 3D Video Viewport */}
              <div className="h-44 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.25)_0%,transparent_70%)]" />
                <div className="w-16 h-16 rounded-full border-2 border-blue-400/60 flex items-center justify-center animate-pulse relative z-10">
                  <Video className="w-8 h-8 text-blue-400" />
                </div>
                <span className="mt-2 text-[10px] font-mono text-slate-300 z-10">
                  2-WAY VIDEO GENERATION ENGINE
                </span>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">CONCEPT MASTERY SCORE</span>
                <span className="text-blue-400 font-bold">96.4%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">STREAM QUALITY</span>
                <span className="text-white font-bold">1080p @ 60 FPS</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Realtime Q&A */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-slate-950/40 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span className="text-white font-semibold">Real-Time Voice & Chat Interaction</span>
              </div>
              <span className="text-slate-400">Class 10 Science — Light</span>
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
                      <Sparkles className="w-3 h-3 text-blue-400" />
                    )}
                    <span>{msg.sender}</span>
                    <span>• {msg.time}</span>
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl text-xs max-w-md leading-relaxed ${
                      msg.sender.includes("You")
                        ? "bg-blue-600/20 border border-blue-500/40 text-blue-100 rounded-tr-none"
                        : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask your AI teacher a question or reply..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
              />
              <button
                type="submit"
                className="p-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-md"
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
