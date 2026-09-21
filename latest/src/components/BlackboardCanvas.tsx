import { AnimatePresence, motion } from "framer-motion";
import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import type { NcertModule } from "@/config/rules";
import { RULES } from "@/config/rules";
import { motionTokens } from "@/styles/designSystem";
import { BOARD_LAYOUT_ID } from "@/components/SearchMorph";
import CaptionsBar from "@/components/CaptionsBar";
import ArtifactViewer from "@/components/ArtifactViewer";
import RecitationHUD from "@/components/RecitationHUD";
import { BrandMark, CheckSealIcon, CubeIcon, TeacherIcon } from "@/components/icons";

const ThreeDModal = lazy(() => import("@/components/ThreeDModal"));

type Stage = "understanding" | "artifact" | "recall";

interface Props {
  module: NcertModule;
  onExit: () => void;
}

/** The multi-purpose blackboard: narration, interactive artifacts, 3D and recall. */
export function BlackboardCanvas({ module, onExit }: Props) {
  const [stage, setStage] = useState<Stage>("understanding");
  const [lineIndex, setLineIndex] = useState(0);
  const [speaking, setSpeaking] = useState(true);
  const [show3DPrompt, setShow3DPrompt] = useState(false);
  const [open3D, setOpen3D] = useState(false);
  const [readiness, setReadiness] = useState(0);
  const [teacherRepeat, setTeacherRepeat] = useState(0);

  const lines = module.narration;
  const caption = useMemo(() => {
    if (stage === "recall")
      return teacherRepeat > 0
        ? `(${teacherRepeat} of ${RULES.teacherRepeats}) ${module.examConcept}`
        : "Listen twice, then recite it back to me.";
    return lines[Math.min(lineIndex, lines.length - 1)]?.text ?? "";
  }, [stage, lineIndex, lines, teacherRepeat, module.examConcept]);

  // Narration playback with synchronized captions
  useEffect(() => {
    if (stage !== "understanding") return;
    const current = lines[lineIndex];
    if (!current) {
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    const t = setTimeout(() => {
      if (lineIndex + 1 < lines.length) setLineIndex(lineIndex + 1);
      else {
        setSpeaking(false);
        setStage("artifact");
      }
    }, current.hold * 1000);
    return () => clearTimeout(t);
  }, [stage, lineIndex, lines]);

  const reciteTwice = useCallback(() => {
    setStage("recall");
    setTeacherRepeat(1);
    setSpeaking(true);
    const t1 = setTimeout(() => setTeacherRepeat(2), 3800);
    const t2 = setTimeout(() => {
      setTeacherRepeat(0);
      setSpeaking(false);
    }, 7600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (stage !== "artifact") return;
    const t = setTimeout(() => setShow3DPrompt(true), 900);
    return () => clearTimeout(t);
  }, [stage]);

  return (
    <div className="relative min-h-[100svh] wall-backdrop px-4 py-5 sm:px-8 landscape:py-4">
      <header className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3 pb-4">
        <div className="flex items-center gap-3">
          <BrandMark size={32} />
          <div>
          <p className="text-[0.62rem] uppercase tracking-[0.22em] text-white/60">
            NCERT · Class {module.grade} · {module.subject} · Chapter {module.chapter}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-xl text-white sm:text-2xl">
            {module.title}
          </h1>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-full bg-black/25 px-3.5 py-2 text-xs text-white/80 backdrop-blur">
            <span className={readiness >= 100 ? "text-teal-soft" : "text-white/50"}>
              <CheckSealIcon size={16} />
            </span>
            Exam readiness
            <span className={readiness >= 100 ? "text-teal-soft" : "text-royal-soft"}>{readiness}%</span>
          </div>
          <button
            onClick={onExit}
            className="rounded-full border border-white/25 px-3.5 py-2 text-xs text-white/80 hover:border-white/60"
          >
            New topic
          </button>
        </div>
      </header>

      <motion.div
        layoutId={BOARD_LAYOUT_ID}
        transition={motionTokens.spring}
        className="board-frame relative mx-auto w-full max-w-[1180px]"
      >
        <motion.div
          animate={{ filter: show3DPrompt && !open3D ? "blur(2px)" : "blur(0px)" }}
          transition={{ duration: 0.5 }}
          className="board-surface relative grid gap-4 p-5 sm:p-7 lg:grid-cols-[1.15fr_1fr]"
        >
          <section className="min-w-0">
            <h2 className="chalk-title text-[clamp(1.3rem,2.6vw,1.9rem)]">{module.boardHeading}</h2>
            <ul className="mt-4 space-y-2.5">
              {module.notes.map((n, i) => (
                <motion.li
                  key={n}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.35, duration: 0.5 }}
                  className="flex gap-2.5 font-[family-name:var(--font-chalk)] text-[1.05rem] leading-snug text-chalk/90"
                >
                  <span className="mt-1 text-teal-soft">◦</span>
                  {n}
                </motion.li>
              ))}
            </ul>

            <div className="mt-5">
              <CaptionsBar caption={caption} speaking={speaking} />
            </div>

            {stage === "recall" && teacherRepeat === 0 && (
              <div className="mt-4">
                <RecitationHUD module={module} onReplay={reciteTwice} onReadiness={setReadiness} />
              </div>
            )}

            {stage !== "recall" && (
              <button
                onClick={reciteTwice}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-chalk px-4 py-2.5 text-sm font-medium text-[#22312d] transition-transform hover:scale-[1.02] active:scale-95"
              >
                <TeacherIcon size={17} /> I'm ready — start the recall test
              </button>
            )}
          </section>

          <aside className="min-w-0 space-y-4">
            <ArtifactViewer kind={module.artifact} title={module.artifactTitle} />
            <button
              onClick={() => setOpen3D(true)}
              className="flex w-full items-center justify-between gap-3 rounded-2xl border border-chalk/16 bg-black/20 px-4 py-3.5 text-left transition-colors hover:border-teal-soft/60"
            >
              <span>
                <span className="block text-[0.62rem] uppercase tracking-[0.2em] text-chalk/45">
                  3D Experience
                </span>
                <span className="font-[family-name:var(--font-display)] text-base text-chalk">
                  {module.threeDTitle}
                </span>
              </span>
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-teal text-white">
                <CubeIcon size={19} />
              </span>
            </button>
          </aside>

        </motion.div>
        <AnimatePresence>
          {show3DPrompt && !open3D && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              onClick={() => setOpen3D(true)}
              onPointerEnter={() => setShow3DPrompt(true)}
              className="absolute inset-x-0 bottom-5 mx-auto flex w-max items-center gap-2.5 rounded-full bg-chalk/95 px-5 py-3 text-sm font-medium text-[#22312d] shadow-2xl"
            >
              <CubeIcon size={18} /> Enter 3D Experience
              <span
                className="ml-1 text-xs text-[#22312d]/50"
                onClick={(e) => {
                e.stopPropagation();
                setShow3DPrompt(false);
                }}
              >
                dismiss
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {open3D && (
          <Suspense fallback={null}>
            <ThreeDModal kind={module.threeD} title={module.threeDTitle} onClose={() => setOpen3D(false)} />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BlackboardCanvas;
