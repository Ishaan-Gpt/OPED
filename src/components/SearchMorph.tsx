import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { RULES, resolveQuery, suggestions, type NcertModule } from "@/config/rules";
import { motionTokens } from "@/styles/designSystem";
import { AlertIcon, EnterIcon, SearchIcon } from "@/components/icons";
import { generateLessonModule } from "@/lib/teacher/generateModuleClient";

export const BOARD_LAYOUT_ID = "classroom-blackboard-frame";

interface Props {
  onLaunch: (module: NcertModule, query: string) => void;
}

/** Clean initial screen: centered chat-like search that physically morphs into the blackboard frame. */
export function SearchMorph({ onLaunch }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const runQuery = async (query: string) => {
    const result = resolveQuery(query);
    if (result.ok && result.module) {
      setError(null);
      setIsLaunching(true);
      onLaunch(result.module, query);
      return;
    }
    if (result.generatable) {
      setError(null);
      setIsGenerating(true);
      const generated = await generateLessonModule({ ...result.generatable, topic: query });
      setIsGenerating(false);
      if (generated) {
        setIsLaunching(true);
        onLaunch(generated, query);
        return;
      }
      setError("Couldn't prepare that chapter right now — try again in a moment.");
      return;
    }
    setError(result.message ?? RULES.guidance);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    void runQuery(value);
  };

  return (
    <div className="relative z-10 flex min-h-[100svh] flex-col">
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-10 landscape:pb-4">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: isLaunching ? 0 : 1, y: isLaunching ? -12 : 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: motionTokens.durations.base }}
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
              disabled={isGenerating}
              className="inline-flex items-center gap-2 rounded-full bg-teal px-4 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-60"
            >
              {isGenerating ? (
                <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <EnterIcon size={17} />
              )}
              <span className="hidden sm:inline">
                {isGenerating ? "Preparing chapter…" : "Enter class"}
              </span>
            </button>
          </div>
        </motion.form>

        <AnimatePresence>
          {isGenerating && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-center text-sm text-ink/50"
            >
              This chapter isn't pre-loaded yet — the AI teacher is writing it now, just a moment…
            </motion.p>
          )}
        </AnimatePresence>

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

        <motion.div
          animate={{ opacity: isLaunching ? 0 : 1, y: isLaunching ? 12 : 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: motionTokens.durations.base }}
          className="flex flex-col items-center"
        >
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setValue(s);
                  setError(null);
                  void runQuery(s);
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
        </motion.div>
      </main>
    </div>
  );
}

export default SearchMorph;
