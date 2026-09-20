import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { RULES, resolveQuery, suggestions, type NcertModule } from "@/config/rules";
import { motionTokens } from "@/styles/designSystem";
import { AlertIcon, EnterIcon, SearchIcon, TeacherIcon } from "@/components/icons";
import { AnimatedTeacher } from "@/character/AnimatedTeacher";
import type {
  CharacterState,
  ExpressionType,
  GestureType,
  GazeTarget,
  PointTarget,
  PositionPreset,
} from "@/character/types";
import { DemoControls } from "@/demo/DemoControls";
import { generateLessonModule } from "@/lib/teacher/generateModuleClient";

export const BOARD_LAYOUT_ID = "classroom-blackboard-frame";

interface Props {
  onLaunch: (module: NcertModule, query: string) => void;
}

/** Clean initial screen: centered chat-like search with integrated 3D AI Teacher. */
export function SearchMorph({ onLaunch }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // 3D Character Controls & Interactivity
  const [isTeacherActive, setIsTeacherActive] = useState(true);
  const [showStudioControls, setShowStudioControls] = useState(false);
  const [customState, setCustomState] = useState<CharacterState | null>(null);
  const [customExpression, setCustomExpression] = useState<ExpressionType | null>(null);
  const [customGesture, setCustomGesture] = useState<GestureType | null>(null);
  const [customGaze, setCustomGaze] = useState<GazeTarget | null>(null);
  const [customPoint, setCustomPoint] = useState<PointTarget | null>(null);
  const [customPosition, setCustomPosition] = useState<PositionPreset>('bottom-right');
  const [greetingText, setGreetingText] = useState<string | null>(
    "Welcome to Chalkroom! Search any topic from NCERT Class 4–10 or click a suggestion to start!"
  );

  const runQuery = async (query: string) => {
    const result = resolveQuery(query);
    if (result.ok && result.module) {
      setError(null);
      setIsLaunching(true);
      setCustomState('celebrate');
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
        setCustomState('celebrate');
        onLaunch(generated, query);
        return;
      }
      setError("Couldn't prepare that chapter right now — try again in a moment.");
      setCustomState('thinking');
      return;
    }
    setError(result.message ?? RULES.guidance);
    setCustomState('thinking');
    setGreetingText("Try searching 'photosynthesis', 'triangles', or 'light'!");
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    void runQuery(value);
  };

  const currentTeacherState: CharacterState = customState || (value ? 'pointing' : error ? 'thinking' : 'wave');
  const currentTeacherExpression: ExpressionType = customExpression || (value ? 'explaining' : error ? 'confused' : 'happy');
  const currentTeacherGesture: GestureType = customGesture || (value ? 'pointLeft' : error ? 'thinking' : 'wave');
  const currentPointTarget: PointTarget = customPoint || { target: 'input' };

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
                setGreetingText(null);
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

      {/* 3D Pixar AI Teacher Floating Character */}
      <AnimatePresence>
        {isTeacherActive ? (
          <div className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-2">
            <button
              onClick={() => setShowStudioControls((v) => !v)}
              className="flex items-center gap-1.5 rounded-full border border-teal-soft/40 bg-[#18231f]/90 px-3 py-1 text-[11px] font-medium text-teal-soft shadow-lg backdrop-blur-md transition-all hover:border-teal-soft hover:bg-[#18231f]"
            >
              <span>✨ 3D Character Studio</span>
            </button>
            <AnimatedTeacher
              key="ai-teacher-search"
              state={currentTeacherState}
              expression={currentTeacherExpression}
              gesture={currentTeacherGesture}
              position={customPosition}
              scale={0.92}
              gazeTarget={customGaze || 'student'}
              pointTarget={currentPointTarget}
              speakingText={greetingText || undefined}
              isAudioSpeaking={!!greetingText}
              onClick={() => {
                setGreetingText("I'm Dr. Rao! Pick any NCERT chapter above to begin!");
                setCustomState('eureka');
                setTimeout(() => setCustomState(null), 3000);
              }}
              className="cursor-pointer select-none"
            />
          </div>
        ) : (
          <motion.button
            key="summon-teacher-btn-search"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setIsTeacherActive(true)}
            className="fixed bottom-4 right-4 z-30 flex items-center gap-2 rounded-full bg-[#18231f]/95 border border-teal-soft/40 px-3.5 py-2 text-xs text-chalk shadow-2xl backdrop-blur-md hover:border-teal-soft"
          >
            <span className="relative flex size-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-soft opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2.5 bg-teal"></span>
            </span>
            <TeacherIcon size={15} className="text-teal-soft" />
            <span>Summon AI Teacher</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 3D Character Studio Drawer Controls */}
      <DemoControls
        isOpen={showStudioControls}
        onClose={() => setShowStudioControls(false)}
        currentState={currentTeacherState}
        currentExpression={currentTeacherExpression}
        currentGesture={currentTeacherGesture}
        currentPosition={customPosition}
        onPlayState={(st) => {
          setCustomState(st);
          setCustomExpression(null);
          setCustomGesture(null);
        }}
        onSetExpression={(exp) => setCustomExpression(exp)}
        onSetGesture={(gst) => setCustomGesture(gst)}
        onMoveTo={(pos) => setCustomPosition(pos)}
        onLookAt={(gz) => setCustomGaze(gz)}
        onPointAt={(pt) => setCustomPoint(pt)}
      />
    </div>
  );
}

export default SearchMorph;
