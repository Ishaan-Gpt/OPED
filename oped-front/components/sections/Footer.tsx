"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, X, Box } from "lucide-react";

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
    <footer className="relative bg-[#08090C] pt-28 pb-16 border-t border-slate-800/80 overflow-hidden">
      {/* Executive Royal Blue Radial Backlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 space-y-24 relative z-10 text-center">
        {/* Giant Launch Banner */}
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest text-blue-400 uppercase border border-blue-500/20 px-3.5 py-1.5 rounded-full bg-blue-500/10">
              <Box className="w-3.5 h-3.5" /> OPED 3D SPATIAL CLASSROOM
            </span>

            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white leading-none">
              Step into the future of education.
            </h2>

            <p className="text-slate-400 text-lg sm:text-xl max-w-xl mx-auto font-normal">
              Experience 2-way real-time AI teacher generation in interactive 3D VR classrooms.
            </p>

            {/* Primary Action Button */}
            <div className="pt-4 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-75 blur group-hover:opacity-100 transition duration-500" />
                <button
                  onClick={() => (window.location.href = "/showcase")}
                  className="relative flex items-center gap-3 bg-white text-slate-950 font-extrabold text-base px-10 py-5 rounded-full hover:bg-slate-100 transition-all active:scale-95 shadow-2xl"
                >
                  <span>Launch 3D VR Classroom</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Divider & Links */}
        <div className="pt-16 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span className="text-lg font-black text-white tracking-tight">OPED.</span>
            <span>© OPED Education Technologies. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="mailto:team@oped.education" className="hover:text-white transition-colors">
              team@oped.education
            </a>
            <a href="#privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a
              href="https://github.com/Ishaan-Gpt/OPED"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Access Request Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#0D0F14] border border-slate-800 rounded-3xl p-8 space-y-6 text-left shadow-2xl"
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
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">
                      INSTANT ACCESS
                    </span>
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      Enter 3D VR Classroom
                    </h3>
                    <p className="text-xs text-slate-400 font-normal">
                      Enter your email to receive early access to upcoming 3D STEM chapters.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@school.edu"
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition-all active:scale-98 shadow-lg"
                    >
                      Launch Session
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-blue-400 mx-auto animate-bounce" />
                  <h3 className="text-xl font-bold text-white">Access Granted!</h3>
                  <p className="text-xs text-slate-400">
                    Launching your 3D VR AI classroom environment now.
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
