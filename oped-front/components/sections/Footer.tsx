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
    <footer className="relative bg-slate-50 pt-28 pb-16 border-t border-slate-200 overflow-hidden">
      {/* Ambient Radial Backlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-100/40 blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 space-y-24 relative z-10 text-center">
        {/* Giant Hero Beta Banner */}
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="inline-block text-xs font-mono tracking-wider text-blue-700 uppercase border border-blue-200 px-3.5 py-1.5 rounded-full bg-blue-50 font-semibold">
              OPED 3D CLASSROOM BETA
            </span>

            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-slate-900 leading-none">
              Start learning in 3D VR today.
            </h2>

            <p className="text-slate-600 text-lg sm:text-xl max-w-xl mx-auto font-normal">
              Join early access for 2-way AI Video virtual classrooms and adaptive NCERT learning
              modules.
            </p>

            {/* Primary Action Button */}
            <div className="pt-4 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-60 blur group-hover:opacity-100 transition duration-500 animate-pulse" />
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="relative flex items-center gap-3 bg-blue-600 text-white font-extrabold text-base px-10 py-5 rounded-full hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-500/20"
                >
                  <Box className="w-5 h-5 text-blue-100" />
                  <span>Request 3D VR Beta Access</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Divider & Links */}
        <div className="pt-16 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 font-mono font-medium">
          <div className="flex items-center gap-3">
            <span className="text-lg font-black text-slate-900 tracking-tight">OPED.</span>
            <span>© OPED AI Education. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="mailto:support@oped.ai" className="hover:text-slate-900 transition-colors">
              support@oped.ai
            </a>
            <a href="#privacy" className="hover:text-slate-900 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-slate-900 transition-colors">
              Terms of Service
            </a>
            <a
              href="/showcase"
              className="hover:text-slate-900 transition-colors font-bold text-blue-600"
            >
              3D Classroom Showcase
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 space-y-6 text-left shadow-2xl"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {!submitted ? (
                <>
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-blue-700 uppercase tracking-widest font-semibold">
                      EARLY CLASSROOM ACCESS
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Request 3D VR Beta
                    </h3>
                    <p className="text-xs text-slate-500 font-normal">
                      Enter your email to receive an instant invitation link to the 2-way AI video
                      classroom.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@school.edu"
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-mono"
                    />
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all active:scale-98 shadow-md shadow-blue-500/20"
                    >
                      Submit Beta Application
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-blue-600 mx-auto animate-bounce" />
                  <h3 className="text-xl font-bold text-slate-900">Application Received!</h3>
                  <p className="text-xs text-slate-500">
                    We have reserved your 3D VR Classroom Beta spot. Check your inbox for setup
                    instructions.
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
