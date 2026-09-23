"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, X } from "lucide-react";

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
    <footer className="relative bg-black pt-28 pb-16 border-t border-white/5 overflow-hidden">
      {/* Ambient Ring Backlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#2E5243]/20 blur-[180px] rounded-full pointer-events-none" />

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
            <span className="inline-block text-xs font-mono tracking-widest text-emerald-400 uppercase border border-emerald-500/20 px-3.5 py-1.5 rounded-full bg-emerald-500/10">
              BETA PHASE 2 ACCESS
            </span>

            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white leading-none">
              Join our beta phase 2, opening soon.
            </h2>

            <p className="text-zinc-400 text-lg sm:text-xl max-w-xl mx-auto font-normal">
              Secure your spot for guaranteed interview matching and early tuition waiver.
            </p>

            {/* Primary Action Button with Subtle Ambient Ring Pulse */}
            <div className="pt-4 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 opacity-75 blur group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="relative flex items-center gap-3 bg-white text-black font-extrabold text-base px-10 py-5 rounded-full hover:bg-zinc-200 transition-all active:scale-95 shadow-2xl"
                >
                  <span>Join Beta</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Divider & Links */}
        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-3">
            <span className="text-lg font-black text-white tracking-tight">ZERO.</span>
            <span>© Zero University. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="mailto:team@zero.university" className="hover:text-white transition-colors">
              team@zero.university
            </a>
            <a href="#privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              X (Twitter)
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#0c0c0c] border border-white/10 rounded-3xl p-8 space-y-6 text-left shadow-2xl"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {!submitted ? (
                <>
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                      LIMITED SPOTS REMAINING
                    </span>
                    <h3 className="text-2xl font-bold text-white tracking-tight">Request Beta Access</h3>
                    <p className="text-xs text-zinc-400 font-normal">
                      Enter your email to lock in guaranteed interview eligibility for Beta Phase 2.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-all active:scale-98 shadow-lg"
                    >
                      Submit Application
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <h3 className="text-xl font-bold text-white">Application Received!</h3>
                  <p className="text-xs text-zinc-400">
                    We have reserved your Beta Phase 2 spot. Check your inbox shortly for setup instructions.
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
