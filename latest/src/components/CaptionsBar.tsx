import { AnimatePresence, motion } from "framer-motion";
import { SoundIcon, TeacherIcon } from "@/components/icons";

interface Props {
  caption: string;
  speaking: boolean;
  label?: string;
}

/** Synchronized live captions for the teacher narration. */
export function CaptionsBar({ caption, speaking, label = "Teacher" }: Props) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-chalk/12 bg-black/25 px-4 py-3 backdrop-blur-sm">
      <span className="relative mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-chalk/10 text-chalk/80">
        <TeacherIcon size={18} />
        {speaking && (
          <motion.span
            className="absolute inset-0 rounded-full border border-teal-soft/70"
            animate={{ scale: [1, 1.28, 1], opacity: [0.9, 0, 0.9] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.18em] text-chalk/45">
          <SoundIcon size={13} />
          {label}
          {speaking ? " · narrating" : " · paused"}
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={caption}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
            className="mt-1 font-[family-name:var(--font-chalk)] text-[1.15rem] leading-snug text-chalk"
          >
            {caption}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default CaptionsBar;
