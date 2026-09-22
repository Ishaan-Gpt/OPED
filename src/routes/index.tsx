import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { NcertModule } from "@/config/rules";
import useLenis from "@/hooks/useLenis";
import SearchMorph from "@/components/SearchMorph";
import BlackboardCanvas from "@/components/BlackboardCanvas";
import { BrandMark, ChalkIcon } from "@/components/icons";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "OPED — NCERT Classes 4–10, 100% Exam Readiness" },
      {
        name: "description",
        content:
          "An interactive NCERT classroom: chalk blackboard lessons, 3D experiences and a 2-way active recall recitation loop for Classes 4 to 10.",
      },
      { property: "og:title", content: "OPED — Interactive NCERT Classroom" },
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

type Phase = "search" | "board";

function Home() {
  useLenis();
  const [phase, setPhase] = useState<Phase>("search");
  const [module, setModule] = useState<NcertModule | null>(null);

  return (
    <div className="relative min-h-[100svh] overflow-x-hidden">
      {/* Layer 1: Textured Classroom Wall Backdrop */}
      <div className="wall-backdrop fixed inset-0 z-0 pointer-events-none" />

      {/* Layer 2: Clean White Search Overlay (dissolves out into textured classroom wall) */}
      <motion.div
        className="fixed inset-0 bg-white z-0 pointer-events-none"
        initial={false}
        animate={{ opacity: phase === "search" ? 1 : 0 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(15,107,95,0.07),transparent_70%)]" />
      </motion.div>

      {phase === "search" && (
        <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2.5">
            <BrandMark size={34} />
            <span className="text-left leading-tight">
              <span className="block font-[family-name:var(--font-display)] text-lg text-ink font-semibold">
                OPED
              </span>
              <span className="block text-[0.6rem] uppercase tracking-[0.2em] text-ink/45 font-medium">
                NCERT 4–10 · Outcome based
              </span>
            </span>
          </div>
        </header>
      )}

      <AnimatePresence initial={false}>
        {phase === "search" ? (
          <SearchMorph
            key="search-view"
            onLaunch={(m) => {
              setModule(m);
              setPhase("board");
            }}
          />
        ) : (
          module && (
            <BlackboardCanvas
              key="board-view"
              module={module}
              onExit={() => {
                setModule(null);
                setPhase("search");
              }}
            />
          )
        )}
      </AnimatePresence>
    </div>
  );
}
