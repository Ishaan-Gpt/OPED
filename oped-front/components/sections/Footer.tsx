"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, X, Glasses, Box, Video } from "lucide-react";

export const Footer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsModalOpen(false);
      setEmail("");
    }, 2500);
  };

  return (
    <footer className="relative bg-[#07090e] pt-32 pb-16 border-t border-white/10 overflow-hidden">
      {/* Ambient Ring Backlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-amber-500/10 blur-[200px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 space-y-24 relative z-10 text-center">
        {/* Giant Hero Banner */}
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="inline-block text-xs font-mono tracking-widest text-amber-300 uppercase border border-amber-500/30 px-4 py-1.5 rounded-full bg-amber-500/10 shadow-lg">
              SPATIAL 3D VR BETA ACCESS
            </span>

            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white leading-none">
              Step into the future of learning.
            </h2>

            <p className="text-slate-300 text-lg sm:text-xl max-w-xl mx-auto font-normal">
              Secure early access to 2-way generative video teachers, 3D spatial VR classrooms, and
              automated NCERT evaluation.
            </p>

            {/* Primary Action Button */}
            <div className="pt-4 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-200 opacity-60 blur group-hover:opacity-100 transition duration-500" />
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="relative flex items-center gap-3 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 text-slate-950 font-extrabold text-base px-10 py-5 rounded-full hover:brightness-110 transition-all active:scale-95 shadow-2xl"
                >
                  <span>Experience OPED 3D</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Divider & Links */}
        <div className="pt-16 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span className="text-lg font-black text-white tracking-tight">OPED.</span>
            <span>© OPED Education Platform. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="mailto:team@oped.ai" className="hover:text-amber-300 transition-colors">
              team@oped.ai
            </a>
            <a href="#privacy" className="hover:text-amber-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-amber-300 transition-colors">
              Terms of Service
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-300 transition-colors"
            >
              X (Twitter)
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-300 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Beta Registration Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#0b0e14] border border-amber-500/30 rounded-3xl p-8 space-y-6 text-left shadow-2xl"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {!submitted ? (
                <>
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                      LIMITED EARLY BETA ACCESS
                    </span>
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      Access OPED 3D VR Classroom
                    </h3>
                    <p className="text-xs text-slate-400 font-normal">
                      Enter your email to unlock instant access to 2-way generative video lessons
                      and 3D VR models.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@school.edu"
                      className="w-full px-4 py-3.5 rounded-xl bg-[#111520] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                    />
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 text-slate-950 font-extrabold text-sm hover:brightness-110 transition-all active:scale-98 shadow-lg"
                    >
                      Submit Application
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
                  <h3 className="text-xl font-bold text-white">Application Received!</h3>
                  <p className="text-xs text-slate-400">
                    We have reserved your 3D VR Beta Phase 2 spot. Check your inbox shortly for
                    setup instructions.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
};
