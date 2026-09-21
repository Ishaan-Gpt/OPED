import { motion } from "framer-motion";
import { CheckSealIcon, EnterIcon } from "@/components/icons";
import type { NcertModule } from "@/config/rules";
import type { StudentMasteryState } from "@/lib/teacher/agentOrchestrator";
import { Sparkles, Award, CheckCircle2, BookOpen, Brain, Target, RotateCcw } from "lucide-react";

interface Props {
  module: NcertModule;
  masteryState?: StudentMasteryState;
  onNewTopic: () => void;
  onRetryChapter?: () => void;
}

export default function MasteryOutcome({ module, masteryState, onNewTopic, onRetryChapter }: Props) {
  const score = masteryState?.overallMasteryScore ?? 100;
  const rating = masteryState?.examReadinessRating ?? "Exam-Ready Mastery";
  const recitationScore = masteryState?.recitationScore ?? 100;
  const practiceScore = masteryState?.practiceScore ?? 100;

  const isHighMastery = score >= 75;

  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/75 p-4 sm:p-6 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.1 }}
        className="w-full max-w-xl overflow-hidden rounded-3xl border border-teal-soft/30 bg-[#0c1412]/95 shadow-2xl my-auto text-chalk"
      >
        <div className="relative p-6 sm:p-8 text-center flex flex-col gap-5">
          {/* Background glow */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 opacity-30 blur-[60px] pointer-events-none">
            <div className={`h-40 w-72 rounded-full ${isHighMastery ? "bg-teal-soft" : "bg-amber-500"}`}></div>
          </div>

          {/* Badge Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.3 }}
            className={`mx-auto flex size-20 items-center justify-center rounded-full ${
              isHighMastery ? "bg-teal-soft text-[#0c1412]" : "bg-amber-400 text-slate-950"
            }`}
          >
            <CheckSealIcon size={42} />
          </motion.div>

          {/* Heading and Outcome Rating */}
          <div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-teal-soft/10 text-teal-soft border border-teal-soft/30 mb-2">
              {rating}
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-chalk">
              {isHighMastery ? "Certified Exam Readiness!" : "Outcome Review Complete"}
            </h2>
            <p className="text-xs sm:text-sm text-chalk/70 mt-1 max-w-md mx-auto">
              NCERT Class {module.grade} {module.subject} · <strong>{module.title}</strong>
            </p>
          </div>

          {/* Real-time Telemetry Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-left">
            <div className="p-3 sm:p-3.5 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-teal-soft text-xs font-medium">
                <Brain className="w-3.5 h-3.5" />
                <span>Recitation</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1.5">
                {recitationScore}%
              </div>
              <span className="text-[10px] text-chalk/50">Active Recall</span>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                <Target className="w-3.5 h-3.5" />
                <span>Practice</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1.5">
                {practiceScore}%
              </div>
              <span className="text-[10px] text-chalk/50">NCERT Questions</span>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-sky-400 text-xs font-medium">
                <Award className="w-3.5 h-3.5" />
                <span>Mastery</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1.5">
                {score}%
              </div>
              <span className="text-[10px] text-chalk/50">Composite Index</span>
            </div>
          </div>

          {/* Teacher Agent Feedback Note */}
          <div className="rounded-2xl bg-black/50 p-4 text-left border border-white/10 flex flex-col gap-1.5">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-soft">
              <Sparkles size={14} /> AI Teacher's Evaluation
            </h3>
            <p className="text-xs sm:text-sm italic text-chalk/85 leading-relaxed">
              {isHighMastery
                ? `"Outstanding work! You demonstrated sharp recall of mandatory NCERT formulas and solved the back-of-the-chapter exercises with high accuracy."`
                : `"You grasped the foundational concepts, but review the weak keywords and formulas before your exam. Consistent practice builds permanent memory."`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            {onRetryChapter && (
              <button
                type="button"
                onClick={onRetryChapter}
                className="flex-1 flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs sm:text-sm font-medium text-white transition-all hover:bg-white/10 active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Review Chapter
              </button>
            )}
            <button
              type="button"
              onClick={onNewTopic}
              className="flex-1 flex items-center justify-center gap-2 rounded-full bg-teal px-6 py-3 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-teal-soft active:scale-95 cursor-pointer shadow-lg shadow-teal/30"
            >
              <EnterIcon size={16} />
              Start Next Chapter
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
