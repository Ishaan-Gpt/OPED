import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { RULES, resolveQuery, suggestions, type NcertModule } from "@/config/rules";
import { motionTokens } from "@/styles/designSystem";
import { AlertIcon, EnterIcon, SearchIcon } from "@/components/icons";

export const BOARD_LAYOUT_ID = "lesson-surface";

interface Props {
  onLaunch: (module: NcertModule, query: string) => void;
}

/** Clean initial screen: centered chat-like search that morphs into the blackboard. */
export function SearchMorph({ onLaunch }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const result = resolveQuery(value);
    if (result.ok && result.module) {
      setError(null);
      onLaunch(result.module, value);
    } else {
      setError(result.message ?? RULES.guidance);
    }
  };

  return (
    <div className="relative flex min-h-[100svh] flex-col">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(15,107,95,0.07),transparent_70%)]" />

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-10 landscape:pb-4">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: motionTokens.durations.base }}
          className="mb-5 text-center font-[family-name:var(--font-display)] text-[clamp(1.6rem,3.4vw,2.6rem)] leading-tight text-ink"
        >
          What shall we master today?
        </motion.p>

        <motion.form
          onSubmit={submit}
          layoutId={BOARD_LAYOUT_ID}
          transition={motionTokens.spring}
          className="tactile-card w-full max-w-2xl rounded-[26px] bg-white px-3 py-2.5"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-earth/8 text-earth">
              <SearchIcon size={19} />
            </span>
            <input
              autoFocus
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError(null);
              }}
              placeholder={RULES.placeholder}
              aria-label="Search an NCERT chapter"
              className="min-w-0 flex-1 bg-transparent py-2 text-[0.98rem] text-ink outline-none placeholder:text-ink/35"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-teal px-4 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.03] active:scale-95"
            >
              <EnterIcon size={17} />
              <span className="hidden sm:inline">Enter class</span>
            </button>
          </div>
        </motion.form>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-4 flex max-w-2xl items-start gap-2.5 rounded-2xl border border-royal/25 bg-royal/6 px-4 py-3 text-sm text-royal"
            >
              <AlertIcon size={18} />
              <span>
                {error}
                <span className="mt-0.5 block text-royal/70">{RULES.guidanceExample}</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setValue(s);
                setError(null);
                const result = resolveQuery(s);
                if (result.ok && result.module) onLaunch(result.module, s);
              }}
              className="rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-xs text-ink/65 transition-colors hover:border-teal/40 hover:text-teal"
            >

              {s}
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-xs tracking-wide text-ink/40">
          Classes 4–10 · Science · Mathematics · Social Studies · Outcome-based recall
        </p>
      </main>
    </div>
  );
}

export default SearchMorph;
