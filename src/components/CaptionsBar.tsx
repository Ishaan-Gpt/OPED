import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SoundIcon, TeacherIcon } from "@/components/icons";
import { Mic, User } from "lucide-react";

interface Props {
  caption: string;
  speaking: boolean;
  label?: string;
  isStudent?: boolean;
}

/** Synchronized real-time live captions with word-by-word typewriter effect. */
export function CaptionsBar({ caption, speaking, label = "Dr. Rao", isStudent = false }: Props) {
  const [displayedWordsCount, setDisplayedWordsCount] = useState(0);

  const words = caption ? caption.split(" ") : [];

  useEffect(() => {
    if (!caption) {
      setDisplayedWordsCount(0);
      return;
    }

    if (!speaking || isStudent) {
      setDisplayedWordsCount(words.length);
      return;
    }

    // Reset and stream words one by one for teacher voiceover
    setDisplayedWordsCount(1);
    const intervalMs = Math.max(70, Math.min(180, 3200 / words.length));

    const interval = setInterval(() => {
      setDisplayedWordsCount((prev) => {
        if (prev >= words.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [caption, speaking, isStudent, words.length]);

  return (
    <div
      className={`flex items-center gap-3.5 rounded-2xl border px-5 py-3.5 backdrop-blur-md shadow-lg transition-colors ${
        isStudent
          ? "border-sky-500/40 bg-slate-900/80 shadow-sky-500/10"
          : "border-teal-soft/25 bg-black/40"
      }`}
    >
      <span
        className={`relative grid size-9 shrink-0 place-items-center rounded-full border ${
          isStudent
            ? "bg-sky-500/20 text-sky-400 border-sky-500/40"
            : "bg-teal/20 text-teal-soft border-teal-soft/40"
        }`}
      >
        {isStudent ? <Mic size={18} className="animate-pulse" /> : <TeacherIcon size={18} />}
        {speaking && (
          <motion.span
            className={`absolute inset-0 rounded-full border ${isStudent ? "border-sky-400" : "border-teal-soft"}`}
            animate={{ scale: [1, 1.35, 1], opacity: [0.9, 0, 0.9] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.2em] font-medium text-chalk/50">
          {isStudent ? <Mic size={12} className="text-sky-400" /> : <SoundIcon size={12} className="text-teal-soft" />}
          <span className={isStudent ? "text-sky-400 font-bold" : "text-teal-soft font-semibold"}>
            {label}
          </span>
          <span className="w-1 h-1 rounded-full bg-chalk/30" />
          <span>{isStudent ? "Student speaking" : speaking ? "Speaking live" : "Active"}</span>
        </div>

        <p className="mt-1 font-[family-name:var(--font-chalk)] text-[1.15rem] sm:text-[1.25rem] leading-relaxed text-chalk tracking-wide min-h-[1.75rem]">
          {words.slice(0, displayedWordsCount).map((word, idx) => (
            <motion.span
              key={`${idx}-${word}`}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="inline-block mr-1.5"
            >
              {word}
            </motion.span>
          ))}
          {speaking && displayedWordsCount < words.length && (
            <span
              className={`inline-block w-1.5 h-4 ml-0.5 align-middle animate-pulse ${
                isStudent ? "bg-sky-400" : "bg-teal-soft"
              }`}
            />
          )}
        </p>
      </div>
    </div>
  );
}

export default CaptionsBar;
