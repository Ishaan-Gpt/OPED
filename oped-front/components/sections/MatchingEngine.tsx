"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, MessageSquare, Box, Sparkles, User, Send, Video, Zap } from "lucide-react";

export const MatchingEngine: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      sender: "AI Teacher (Anaya)",
      text: "Welcome to NCERT Science Class 10! Today we're exploring Convex vs Concave Mirrors in 3D. Are you ready to trace the light rays?",
      time: "10:14 AM",
    },
    {
      sender: "Student (You)",
      text: "Yes! Can you show where the principal focus point forms on the concave mirror?",
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
    <section className="py-28 px-6 sm:px-12 max-w-7xl mx-auto space-y-16 relative bg-white">
      {/* Background Ambient Radial Backlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-100/40 blur-[150px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono text-blue-700 tracking-wider uppercase font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>REAL-TIME 2-WAY AI TEACHER INTERACTION</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Ask anything. Get instant 3D visual explanations.
        </h2>

        <p className="text-slate-600 text-base sm:text-lg">
          No passive reading. Bidirectional voice, text, and 3D mesh interaction built directly into
          your virtual classroom.
        </p>
      </div>

      {/* Feature Pills Stack */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left relative z-10">
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600">
            <Box className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">1. Spatial 3D Classroom</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Walk around your virtual classroom, inspect 3D models from any angle, and control the
            whiteboard.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Video className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">2. 2-Way Realtime Video</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The AI Teacher talks, points, and gestures dynamically in sync with generated audio
            streams.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">3. Adaptive NCERT AI</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Socratic questioning loops that verify student understanding before advancing to complex
            topics.
          </p>
        </div>
      </div>

      {/* Light Glassmorphism Application Window Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-2xl relative z-10"
      >
        {/* Titlebar */}
        <div className="px-6 py-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-2 text-xs font-mono text-slate-600 font-semibold">
              OPED 3D Virtual Classroom Suite v3.2
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 border border-blue-200 text-[10px] font-mono text-blue-700 flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              STREAM LATENCY: 38ms
            </span>
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Left Column: 3D Teacher & Status Card */}
          <div className="lg:col-span-5 p-6 sm:p-8 space-y-6 bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-blue-500/20">
                AI
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  Anaya (AI Teacher)
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </h4>
                <p className="text-xs font-mono text-slate-500 font-medium">
                  NCERT Class 10 Science & Physics
                </p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                <span className="text-slate-500">CURRENT LESSON</span>
                <span className="text-blue-600 font-bold">Light: Reflection & Refraction</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                <span className="text-slate-500">3D WHITEBOARD MESH</span>
                <span className="text-slate-900 font-bold">Prism & Ray Diagrams</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                <span className="text-slate-500">RECITATION STATUS</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> MASTERED (94%)
                </span>
              </div>
            </div>

            {/* Active Modules */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">
                ACTIVE 3D MODELS
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  "Convex Mirror",
                  "Ray Tracer",
                  "Focus Point",
                  "Glass Prism",
                  "Refractive Index",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[10px] font-mono text-slate-700 font-semibold shadow-2xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Realtime Chat */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 text-xs font-mono">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="text-slate-900 font-bold">Live AI Classroom Chat</span>
              </div>
              <span className="text-slate-500 font-medium">2-Way Audio Stream Active</span>
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
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 font-medium">
                    {msg.sender.includes("You") ? (
                      <User className="w-3 h-3 text-slate-600" />
                    ) : (
                      <Box className="w-3 h-3 text-blue-600" />
                    )}
                    <span>{msg.sender}</span>
                    <span>• {msg.time}</span>
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl text-xs max-w-md leading-relaxed ${
                      msg.sender.includes("You")
                        ? "bg-blue-600 text-white rounded-tr-none shadow-md"
                        : "bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-none font-medium"
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
                placeholder="Ask your AI Teacher a question..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
              />
              <button
                type="submit"
                className="p-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md"
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
