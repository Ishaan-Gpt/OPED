"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, MessageSquare, Box, Sparkles, User, Send, Video, Mic } from "lucide-react";

export const MatchingEngine: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      sender: "AI Teacher (Anaya)",
      text: "Welcome to today's Class 10 Science module on Reflection and Refraction! Can you recall what happens when light passes through a convex lens?",
      time: "10:14 AM",
    },
    {
      sender: "Student (You)",
      text: "The light rays converge at the focal point on the principal axis.",
      time: "10:15 AM",
    },
    {
      sender: "AI Teacher (Anaya)",
      text: "Excellent recall! Let's render the 3D ray diagram on the blackboard right now.",
      time: "10:15 AM",
    },
  ]);
  const [inputVal, setInputVal] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setMessages((prev) => [...prev, { sender: "Student (You)", text: inputVal, time: "Just now" }]);
    setInputVal("");

    // Simulate AI response after 600ms
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "AI Teacher (Anaya)",
          text: "Analyzing response... Perfect understanding! Let us proceed to ray diagram calculation.",
          time: "Just now",
        },
      ]);
    }, 600);
  };

  return (
    <section className="py-28 px-6 sm:px-12 max-w-7xl mx-auto space-y-16 relative">
      {/* Executive Background Radial Backlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/10 blur-[160px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>REAL-TIME INTERACTION ENGINE</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tighter text-white leading-tight">
          2-Way live voice & video response in milliseconds.
        </h2>

        <p className="text-slate-400 text-base sm:text-lg">
          Ask questions naturally. The AI teacher evaluates your concept recall and dynamically
          updates the 3D blackboard.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="p-6 rounded-2xl bg-[#0D0F14] border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Mic className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">1. Instant Voice Input</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Speak your answer directly to the teacher. Automatic speech recognition evaluates
            conceptual understanding.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0D0F14] border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Video className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">2. Real-Time Video Teacher</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Teacher avatar speaks, gestures, and points toward target elements on the 3D blackboard
            in sync.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0D0F14] border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Box className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">3. 3D Spatial Blackboard</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real-time rendering of mathematical formulas, 3D ray optics, and atomic structures as
            concepts are introduced.
          </p>
        </div>
      </div>

      {/* Sleek Floating Glass Application Window Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl border border-slate-800 glass-panel overflow-hidden shadow-2xl backdrop-blur-xl"
      >
        {/* Titlebar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-700" />
            <span className="w-3 h-3 rounded-full bg-slate-700" />
            <span className="w-3 h-3 rounded-full bg-slate-700" />
            <span className="ml-2 text-xs font-mono text-slate-400">
              OPED 3D Classroom Simulator v2.4
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] font-mono text-blue-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              LATENCY: 140ms
            </span>
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {/* Left Column: 3D Classroom Telemetry */}
          <div className="lg:col-span-5 p-6 sm:p-8 space-y-6 bg-slate-950/40">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-xl text-white shadow-lg">
                OP
              </div>
              <div>
                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                  Class 10 — Physics
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                </h4>
                <p className="text-xs font-mono text-slate-400">Light Reflection & Refraction</p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">TEACHER RIG</span>
                <span className="text-blue-400 font-bold">2D Vector + 3D Bone</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">AUDIO STREAM</span>
                <span className="text-white font-bold">NCERT Preloaded HLS</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">RECALL ACCURACY</span>
                <span className="text-blue-400 font-bold">98.4% (Mastery)</span>
              </div>
            </div>

            {/* Verified Tech Badges */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                ACTIVE MODULES
              </span>
              <div className="flex flex-wrap gap-2">
                {["Convex Lens", "Principal Axis", "Ray Tracing", "Focal Point", "Refraction"].map(
                  (tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300"
                    >
                      {tech}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Live Chat & Interaction Console */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-slate-950/20 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span className="text-white font-semibold">2-Way Live Dialogue</span>
              </div>
              <span className="text-slate-500">Interactive Student Session</span>
            </div>

            {/* Message History */}
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col space-y-1 ${
                    msg.sender.includes("Student") ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    {msg.sender.includes("Student") ? (
                      <User className="w-3 h-3 text-slate-400" />
                    ) : (
                      <Video className="w-3 h-3 text-blue-400" />
                    )}
                    <span>{msg.sender}</span>
                    <span>• {msg.time}</span>
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl text-xs max-w-md leading-relaxed ${
                      msg.sender.includes("Student")
                        ? "bg-blue-600/20 border border-blue-500/30 text-blue-100 rounded-tr-none"
                        : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
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
                placeholder="Type your response to AI Teacher..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
              />
              <button
                type="submit"
                className="p-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-colors"
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
