import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandMark } from "@/components/icons";
import { Sparkles, Cpu, BookOpen, Mic, CheckCircle2 } from "lucide-react";

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
];

const STAGES = [
  { id: "01", label: "NCERT SYLLABUS", title: "Scanning chapter index...", icon: BookOpen },
  { id: "02", label: "3D BLACKBOARD", title: "Constructing interactive canvas...", icon: Cpu },
  { id: "03", label: "VOICE SYNTHESIS", title: "Synthesizing Dr. Rao's voiceover...", icon: Mic },
  { id: "04", label: "CLASSROOM READY", title: "Opening 3D AI VR Classroom...", icon: CheckCircle2 },
];

export default function AwardLoader({ topic, onComplete }: AwardLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2200; // 2.2s total smooth loading experience

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(rawProgress);

      if (rawProgress < 25) setStageIndex(0);
      else if (rawProgress < 55) setStageIndex(1);
      else if (rawProgress < 85) setStageIndex(2);
      else setStageIndex(3);

      if (rawProgress >= 100) {
        clearInterval(interval);
        if (onComplete) setTimeout(onComplete, 200);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  const currentStage = STAGES[stageIndex]!;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl text-white overflow-hidden select-none"
    >
      {/* BACKGROUND FLOATING FORMULA PARTICLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
        {FORMULA_PARTICLES.map((formula, i) => (
          <motion.div
            key={formula + i}
            initial={{
              x: `${(i * 12 + 8) % 90}vw`,
              y: "110vh",
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              y: "-10vh",
              opacity: [0, 0.7, 0.7, 0],
              scale: [0.8, 1, 1, 0.9],
            }}
            transition={{
              duration: 7 + (i % 3) * 2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "linear",
            }}
            className="absolute font-mono text-xs text-[var(--cyan)] tracking-wider whitespace-nowrap"
          >
            {formula}
          </motion.div>
        ))}
      </div>

      {/* AMBIENT AURORA GLOWHALOS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-[var(--cyan)]/10 blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[350px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

      {/* MAIN AWARDS LOADING CARD */}
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 20 }}
        className="relative w-full max-w-lg mx-4 rounded-3xl bg-zinc-950/90 border border-[var(--cyan)]/30 p-8 sm:p-10 shadow-[0_0_80px_rgba(4,189,189,0.18)] backdrop-blur-3xl flex flex-col items-center gap-8 overflow-hidden"
      >
        {/* Top Decorative Grid Line & Paper Curl Notch */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--cyan)] to-transparent opacity-80" />
        <div className="absolute top-3 right-4 font-mono text-[9px] text-zinc-400 tracking-widest uppercase">
          OPED / AI ENGINE 3.0
        </div>

        {/* CENTRAL HOLOGRAM VR IRIS BRAND MARK */}
        <div className="relative size-24 flex items-center justify-center my-2">
          {/* Counter-Rotating Orbit Rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-[var(--cyan)]/40"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border border-zinc-700/60"
          />

          {/* Shockwave Pulse Ring */}
          <motion.div
            animate={{ scale: [0.9, 1.35], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border-2 border-[var(--cyan)]"
          />

          {/* Central Logo Container */}
          <div className="relative size-16 rounded-2xl bg-black/80 border border-[var(--cyan)]/60 text-[var(--cyan)] flex items-center justify-center shadow-[0_0_30px_rgba(4,189,189,0.35)] backdrop-blur-md">
            <BrandMark size={38} variant="white" />
          </div>
        </div>

        {/* TOPIC & STAGE HEADER */}
        <div className="text-center space-y-2 max-w-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--cyan)]/10 border border-[var(--cyan)]/30 text-[11px] font-mono text-[var(--cyan)] tracking-wider">
            <Sparkles size={13} className="animate-spin" />
            <span className="uppercase">NCERT Chapter: {topic || "Photosynthesis"}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-tight leading-tight">
            Preparing your <span className="script-word text-[var(--cyan)]">Classroom.</span>
          </h2>
        </div>

        {/* PIPELINE STAGE INDICATOR */}
        <div className="w-full bg-zinc-900/90 rounded-2xl border border-zinc-800 p-3.5 flex items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-[var(--cyan)]/15 border border-[var(--cyan)]/40 text-[var(--cyan)] flex items-center justify-center shrink-0">
              <currentStage.icon size={18} />
            </div>
            <div className="text-left leading-snug">
              <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                STAGE {currentStage.id} — {currentStage.label}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStage.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-xs font-medium text-white"
                >
                  {currentStage.title}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <span className="font-mono text-xs font-bold text-[var(--cyan)]">
            {stageIndex + 1}/4
          </span>
        </div>

        {/* PROGRESS BAR WITH DUAL SHIMMER TRACK */}
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">BUILDING 3D CANVAS</span>
            <span className="text-white font-bold text-sm tracking-wider">{progress}%</span>
          </div>

          <div className="relative w-full h-3 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden p-0.5">
            <motion.div
              style={{ width: `${progress}%` }}
              className="h-full rounded-full bg-[var(--cyan)] shadow-[0_0_18px_#04bdbd] relative transition-all duration-75"
            >
              {/* Traveling Shimmer Spark */}
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/80 blur-[2px] rounded-full shadow-[0_0_10px_#ffffff]" />
            </motion.div>
          </div>
        </div>

        {/* FOOTER NOTE */}
        <div className="font-mono text-[10px] text-zinc-400 tracking-wider uppercase">
          OPED / LEARN IT. PROVE IT.
        </div>
      </motion.div>
    </motion.div>
  );
}
