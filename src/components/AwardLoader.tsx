import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandMark } from "@/components/icons";
import { Sparkles, Cpu, BookOpen, Mic, CheckCircle2, ShieldCheck } from "lucide-react";

interface AwardLoaderProps {
  topic: string;
  onComplete?: () => void;
}

const FORMULA_PARTICLES = [
  "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
  "E = mc²",
  "F = m · a",
  "ATP ⇄ ADP + Pᵢ",
  "sin²(θ) + cos²(θ) = 1",
  "NCERT CLASS 10",
  "P = V · I",
  "v = u + a·t",
  "λ = h / p",
  "2H₂ + O₂ → 2H₂O",
];

const STAGES = [
  { id: "01", label: "NCERT SYLLABUS", title: "Scanning chapter index...", icon: BookOpen },
  { id: "02", label: "3D BLACKBOARD", title: "Constructing interactive canvas...", icon: Cpu },
  { id: "03", label: "VOICE SYNTHESIS", title: "Synthesizing AI Educator voiceover...", icon: Mic },
  { id: "04", label: "CLASSROOM READY", title: "Opening 3D AI VR Classroom...", icon: CheckCircle2 },
];

export default function AwardLoader({ topic, onComplete }: AwardLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2100; // 2.1s smooth stage transition

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const raw = Math.min(1, elapsed / duration);
      
      // Smooth non-linear acceleration curve
      const easedProgress = Math.floor(Math.pow(raw, 0.85) * 100);
      setProgress(easedProgress);

      if (easedProgress < 25) setStageIndex(0);
      else if (easedProgress < 55) setStageIndex(1);
      else if (easedProgress < 85) setStageIndex(2);
      else setStageIndex(3);

      if (easedProgress >= 100) {
        clearInterval(interval);
        if (onComplete) setTimeout(onComplete, 180);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [onComplete]);

  const currentStage = STAGES[stageIndex] || STAGES[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: "blur(12px)" }}
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-3xl text-white overflow-hidden select-none"
    >
      {/* FLOATING EQUATION PARTICLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {FORMULA_PARTICLES.map((formula, i) => (
          <motion.div
            key={formula + i}
            initial={{
              x: `${(i * 10 + 5) % 92}vw`,
              y: "105vh",
              opacity: 0,
              scale: 0.85,
            }}
            animate={{
              y: "-15vh",
              opacity: [0, 0.8, 0.8, 0],
              scale: [0.85, 1, 1, 0.9],
            }}
            transition={{
              duration: 6 + (i % 4) * 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "linear",
            }}
            className="absolute font-mono text-xs text-[var(--cyan)] tracking-widest whitespace-nowrap"
          >
            {formula}
          </motion.div>
        ))}
      </div>

      {/* AMBIENT GLOW AURORA */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-[var(--cyan)]/12 blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[380px] rounded-full bg-cyan-500/10 blur-[110px] pointer-events-none" />

      {/* MAIN GLASS LOADER CARD */}
      <motion.div
        initial={{ scale: 0.9, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: "spring", stiffness: 150, damping: 22 }}
        className="relative w-full max-w-lg mx-4 rounded-3xl bg-zinc-950/85 border border-[var(--cyan)]/35 p-8 sm:p-10 shadow-[0_0_90px_rgba(4,189,189,0.22)] backdrop-blur-3xl flex flex-col items-center gap-7 overflow-hidden"
      >
        {/* Top Decorative Laser Line & Card Header */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--cyan)] to-transparent opacity-90" />
        <div className="w-full flex items-center justify-between text-[10px] font-mono text-zinc-400 tracking-widest uppercase">
          <div className="flex items-center gap-1.5 text-[var(--cyan)] font-semibold">
            <ShieldCheck size={14} />
            <span>OPED VERIFIED AI ENGINE</span>
          </div>
          <span className="text-zinc-500">v3.4 HIGH-PRECISION</span>
        </div>

        {/* CENTRAL HOLOGRAM BRAND EMBLEM */}
        <div className="relative size-24 flex items-center justify-center my-1">
          {/* Counter-Rotating Rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-[var(--cyan)]/50"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border border-zinc-700/70"
          />

          {/* Shockwave Pulse */}
          <motion.div
            animate={{ scale: [0.95, 1.4], opacity: [0.7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border-2 border-[var(--cyan)]"
          />

          {/* Inner Logo Badge */}
          <div className="relative size-16 rounded-2xl bg-black/85 border border-[var(--cyan)]/70 text-[var(--cyan)] flex items-center justify-center shadow-[0_0_35px_rgba(4,189,189,0.4)] backdrop-blur-md">
            <BrandMark size={40} variant="white" />
          </div>
        </div>

        {/* TOPIC & STAGE HEADER */}
        <div className="text-center space-y-2 max-w-sm">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--cyan)]/15 border border-[var(--cyan)]/40 text-[11px] font-mono text-[var(--cyan)] tracking-wider">
            <Sparkles size={13} className="animate-spin" />
            <span className="uppercase font-semibold">NCERT CHAPTER: {topic || "Photosynthesis"}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-tight leading-tight">
            Preparing your <span className="script-word text-[var(--cyan)]">Classroom.</span>
          </h2>
        </div>

        {/* PIPELINE STAGE INDICATOR */}
        <div className="w-full bg-zinc-900/90 rounded-2xl border border-zinc-800/90 p-4 flex items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className="size-10 rounded-xl bg-[var(--cyan)]/15 border border-[var(--cyan)]/40 text-[var(--cyan)] flex items-center justify-center shrink-0">
              <currentStage.icon size={20} />
            </div>
            <div className="text-left leading-snug">
              <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                STAGE {currentStage.id} — {currentStage.label}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStage.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs font-medium text-white"
                >
                  {currentStage.title}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <span className="font-mono text-xs font-bold text-[var(--cyan)] px-2.5 py-1 rounded-lg bg-[var(--cyan)]/10 border border-[var(--cyan)]/20">
            {stageIndex + 1}/4
          </span>
        </div>

        {/* PROGRESS BAR WITH DUAL SHIMMER TRACK */}
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400 font-medium">BUILDING 3D CANVAS & RIG</span>
            <span className="text-white font-bold text-sm tracking-wider font-mono">{progress}%</span>
          </div>

          <div className="relative w-full h-3 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden p-0.5">
            <motion.div
              style={{ width: `${progress}%` }}
              className="h-full rounded-full bg-[var(--cyan)] shadow-[0_0_20px_#04bdbd] relative transition-all duration-75"
            >
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/90 blur-[2px] rounded-full shadow-[0_0_12px_#ffffff]" />
            </motion.div>
          </div>
        </div>

        {/* FOOTER CAPTION */}
        <div className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
          OPED / ACTIVE RECALL & 3D VECTOR RIGS
        </div>
      </motion.div>
    </motion.div>
  );
}

