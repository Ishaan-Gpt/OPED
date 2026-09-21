import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { NcertModule } from "@/config/rules";
import useLenis from "@/hooks/useLenis";
import SearchMorph from "@/components/SearchMorph";
import BlackboardCanvas from "@/components/BlackboardCanvas";
import { BrandMark, ChalkIcon } from "@/components/icons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chalkroom — NCERT Classes 4–10, 100% Exam Readiness" },
      {
        name: "description",
        content:
          "An interactive NCERT classroom: chalk blackboard lessons, 3D experiences and a 2-way active recall recitation loop for Classes 4 to 10.",
      },
      { property: "og:title", content: "Chalkroom — Interactive NCERT Classroom" },
      {
        property: "og:description",
        content:
          "Search any NCERT chapter, learn on a live blackboard, then recite it back for verified exam readiness.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

type Phase = "search" | "preparing" | "board";

function Home() {
  useLenis();
  const [phase, setPhase] = useState<Phase>("search");
  const [module, setModule] = useState<NcertModule | null>(null);

  useEffect(() => {
    if (phase !== "preparing") return;
    const t = setTimeout(() => setPhase("board"), 1400);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div className="relative min-h-[100svh] overflow-x-hidden bg-white">
      {phase !== "board" && (
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4 sm:px-8">
        <button
          onClick={() => {
            setPhase("search");
            setModule(null);
          }}
          className="flex items-center gap-2.5"
        >
          <BrandMark size={34} />
          <span className="text-left leading-tight">
            <span
              className={`block font-[family-name:var(--font-display)] text-lg ${
                phase === "search" ? "text-ink" : "text-white"
              }`}
            >
              Chalkroom
            </span>
            <span
              className={`block text-[0.6rem] uppercase tracking-[0.2em] ${
                phase === "search" ? "text-ink/45" : "text-white/60"
              }`}
            >
              NCERT 4–10 · Outcome based
            </span>
          </span>
        </button>
      </header>
      )}

      <AnimatePresence>
        {phase === "search" && (
          <motion.div key="search" exit={{ opacity: 0 }}>
            <SearchMorph
              onLaunch={(m) => {
                setModule(m);
                setPhase("preparing");
              }}
            />
          </motion.div>
        )}

        {phase === "preparing" && module && (
          <motion.div
            key="prep"
            className="wall-backdrop flex min-h-[100svh] items-center justify-center px-5"
          >
            <motion.div layoutId="lesson-surface" className="board-frame w-full max-w-[1180px]">
              <div className="board-surface grid min-h-[58svh] place-items-center p-8">
                <div className="text-center">
                  <motion.span
                    className="inline-flex text-chalk/80"
                    animate={{ x: [-28, 28, -28], rotate: [-8, 6, -8] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ChalkIcon size={30} />
                  </motion.span>
                  <p className="chalk-title mt-4 text-2xl">{module.title}</p>
                  <p className="mt-2 font-[family-name:var(--font-chalk)] text-chalk/60">
                    Teacher is writing on the board…
                  </p>
                  <div className="mx-auto mt-5 h-1 w-56 overflow-hidden rounded-full bg-chalk/15">
                    <motion.div
                      className="h-full bg-teal-soft"
                      initial={{ width: "5%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.3, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {phase === "board" && module && (
          <motion.div key="board" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <BlackboardCanvas
              module={module}
              onExit={() => {
                setModule(null);
                setPhase("search");
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
