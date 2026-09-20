import { motion } from "framer-motion";
import { CheckSealIcon, EnterIcon } from "@/components/icons";
import type { NcertModule } from "@/config/rules";
import { Sparkles } from "lucide-react";

interface Props {
  module: NcertModule;
  onNewTopic: () => void;
}

export default function MasteryOutcome({ module, onNewTopic }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 p-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.2 }}
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-teal-soft/30 bg-[#0c1412] shadow-2xl"
      >
        <div className="relative p-8 text-center">
          {/* Background glow */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 opacity-30 blur-[60px]">
            <div className="h-40 w-64 rounded-full bg-teal-soft"></div>
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.4 }}
            className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-teal-soft text-[#0c1412]"
          >
            <CheckSealIcon size={40} />
          </motion.div>

          <h2 className="mb-2 font-[family-name:var(--font-display)] text-3xl text-chalk">
            100% Exam Ready!
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-chalk/70">
            You've successfully mastered <strong>{module.title}</strong>. Your recitation showed
            perfect alignment with the core NCERT concepts.
          </p>

          <div className="mb-8 rounded-2xl bg-black/40 p-4 text-left border border-white/5">
            <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-soft">
              <Sparkles size={14} /> Teacher's Note
            </h3>
            <p className="text-sm italic text-chalk/80">
              "Outstanding recall! You perfectly retained the relationships between the key
              components. Keep up this momentum for the exams."
            </p>
          </div>

          <button
            onClick={onNewTopic}
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-teal px-6 py-3.5 text-sm font-medium text-white transition-all hover:bg-teal-soft active:scale-95"
          >
            <EnterIcon size={18} className="transition-transform group-hover:translate-x-1" />
            Start Next Chapter
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
