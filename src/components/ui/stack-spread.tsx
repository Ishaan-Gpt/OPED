"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export interface StackSpreadCard {
  id: string;
  content: ReactNode;
  target: {
    x: number;
    y: number;
    rotate: number;
    w: number;
    h: number;
  };
  targetSm?: { x: number; y: number };
  stackRotate?: number;
  stackOffset?: { x: number; y: number };
  z?: number;
}

// ---------------------------------------------------------------------------
// OPED ZERO-COST CARDS DEFINITION
// ---------------------------------------------------------------------------
const OPED_CARDS: StackSpreadCard[] = [
  // 01: Blackboard Light + Water
  {
    id: "fc-1",
    content: (
      <div className="float-card h-full w-full flex flex-col justify-between p-4 rounded-xl border border-zinc-200/80 bg-white/90 shadow-xl backdrop-blur-md">
        <div className="float-bar border-b border-zinc-200/80 pb-2 flex justify-between font-mono text-[10px] text-zinc-500">
          <span>OPED / BLACKBOARD</span> <span>01</span>
        </div>
        <div className="float-visual text-3xl font-serif text-center my-2 text-zinc-900">
          ☀ <span className="text-xs text-[var(--cyan)]">→</span> ♧
        </div>
        <small className="font-mono text-[10px] text-zinc-500">LIGHT + WATER + CO₂ → FOOD</small>
      </div>
    ),
    stackOffset: { x: -8, y: -10 },
    stackRotate: -18,
    target: { x: -28, y: -28, rotate: -6, w: 18, h: 22 },
    targetSm: { x: -22, y: -40 },
    z: 2,
  },

  // 02: Active Recall Waveform
  {
    id: "fc-2",
    content: (
      <div className="float-card h-full w-full flex flex-col justify-between p-4 rounded-xl border border-zinc-200/80 bg-white/90 shadow-xl backdrop-blur-md">
        <div className="float-bar border-b border-zinc-200/80 pb-2 flex justify-between font-mono text-[10px] text-zinc-500">
          <span>ACTIVE RECALL</span> <span>02</span>
        </div>
        <div className="mini-wave text-center font-mono text-xs tracking-widest text-[var(--cyan)] my-2">
          ▂▅▇▄▂▆█▅▃▇▄
        </div>
        <small className="font-mono text-[10px] text-zinc-500">YOUR VOICE. YOUR WORDS.</small>
      </div>
    ),
    stackOffset: { x: 14, y: -10 },
    stackRotate: 20,
    target: { x: 28, y: -26, rotate: 5, w: 19, h: 22 },
    targetSm: { x: 22, y: -40 },
    z: 3,
  },

  // 03: Concept Check
  {
    id: "fc-3",
    content: (
      <div className="float-card h-full w-full flex flex-col justify-between p-4 rounded-xl border border-zinc-200/80 bg-white/90 shadow-xl backdrop-blur-md">
        <div className="float-bar border-b border-zinc-200/80 pb-2 flex justify-between font-mono text-[10px] text-zinc-500">
          <span>CONCEPT CHECK</span> <span>03</span>
        </div>
        <div className="float-check text-4xl text-emerald-600 text-center font-serif my-1">
          ✓
        </div>
        <small className="font-mono text-[10px] text-zinc-500">THE IDEA CAME THROUGH.</small>
      </div>
    ),
    stackOffset: { x: -16, y: 0 },
    stackRotate: -4,
    target: { x: -32, y: 4, rotate: -3, w: 17, h: 22 },
    targetSm: { x: -22, y: -19 },
    z: 4,
  },

  // 04: Chapter Readiness 82%
  {
    id: "fc-4",
    content: (
      <div className="float-card h-full w-full flex flex-col justify-between p-4 rounded-xl border border-zinc-200/80 bg-white/90 shadow-xl backdrop-blur-md">
        <div className="float-bar border-b border-zinc-200/80 pb-2 flex justify-between font-mono text-[10px] text-zinc-500">
          <span>CHAPTER READINESS</span> <span>04</span>
        </div>
        <div className="float-number text-4xl font-serif text-center my-1 text-zinc-900">
          82<span className="text-lg text-[var(--cyan)]">%</span>
        </div>
        <small className="font-mono text-[10px] text-zinc-500">PROGRESS THAT MEANS SOMETHING.</small>
      </div>
    ),
    stackOffset: { x: 1, y: -10 },
    stackRotate: -2,
    target: { x: 32, y: 6, rotate: 6, w: 18, h: 22 },
    targetSm: { x: 22, y: -19 },
    z: 5,
  },

  // 05: NCERT Class 10 Life Processes
  {
    id: "fc-5",
    content: (
      <div className="float-card h-full w-full flex flex-col justify-between p-4 rounded-xl border border-zinc-200/80 bg-white/90 shadow-xl backdrop-blur-md">
        <div className="float-bar border-b border-zinc-200/80 pb-2 flex justify-between font-mono text-[10px] text-zinc-500">
          <span>NCERT / CLASS 10</span> <span>05</span>
        </div>
        <div className="float-lines flex flex-col gap-1.5 my-2">
          <div className="h-1 bg-zinc-300 rounded w-full" />
          <div className="h-1 bg-zinc-300 rounded w-3/4" />
          <div className="h-1 bg-[var(--cyan)] rounded w-5/6" />
        </div>
        <small className="font-mono text-[10px] text-zinc-500">CHAPTER 01 / LIFE PROCESSES</small>
      </div>
    ),
    stackOffset: { x: -6, y: 10 },
    stackRotate: 6,
    target: { x: -22, y: 30, rotate: 4, w: 18, h: 22 },
    targetSm: { x: -22, y: 20 },
    z: 6,
  },

  // 06: Adaptive Teaching
  {
    id: "fc-6",
    content: (
      <div className="float-card h-full w-full flex flex-col justify-between p-4 rounded-xl border border-zinc-200/80 bg-white/90 shadow-xl backdrop-blur-md">
        <div className="float-bar border-b border-zinc-200/80 pb-2 flex justify-between font-mono text-[10px] text-zinc-500">
          <span>ADAPTIVE TEACHING</span> <span>06</span>
        </div>
        <div className="float-branch text-2xl font-serif text-center tracking-widest my-1 text-zinc-900">
          ↗ &nbsp; ↘ &nbsp; ↗
        </div>
        <small className="font-mono text-[10px] text-zinc-500">ANOTHER WAY TO UNDERSTAND.</small>
      </div>
    ),
    stackOffset: { x: 20, y: 12 },
    stackRotate: -7,
    target: { x: 24, y: 32, rotate: -5, w: 18, h: 22 },
    targetSm: { x: 22, y: 20 },
    z: 7,
  },
];

// ---------------------------------------------------------------------------
// Scroll & Parallax Constants
// ---------------------------------------------------------------------------
const SCATTER_START = 0.12;
const SCATTER_END = 0.88;

const PARALLAX_X = 2.6;
const PARALLAX_Y = 2.2;
const PARALLAX_SPRING = { stiffness: 90, damping: 22, mass: 0.6 };
const parallaxDepth = (i: number, total: number) =>
  total <= 1 ? 1 : 0.55 + (i / (total - 1)) * 0.75;

const RESPONSIVE = {
  desktop: {
    scale: null as number | null,
    small: false,
    colX: null as number | null,
    card: null as { w: number; h: number } | null,
  },
  small: {
    scale: 0.72,
    small: true,
    colX: 22,
    card: { w: 40, h: 20 },
  },
};

function useResponsive() {
  const [r, setR] = useState(RESPONSIVE.desktop);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const read = () => setR(mq.matches ? RESPONSIVE.small : RESPONSIVE.desktop);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);
  return r;
}

function usePointerParallax(active: boolean, enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, PARALLAX_SPRING);
  const y = useSpring(rawY, PARALLAX_SPRING);

  useEffect(() => {
    if (!enabled) return;

    if (!active) {
      rawX.set(0);
      rawY.set(0);
      return;
    }

    const onMove = (event: PointerEvent) => {
      rawX.set((event.clientX / window.innerWidth) * 2 - 1);
      rawY.set((event.clientY / window.innerHeight) * 2 - 1);
    };
    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [active, enabled, rawX, rawY]);

  return { x, y };
}

function Card({
  card,
  progress,
  reduce,
  clusterRotation,
  scaleMul,
  isSmall,
  colX,
  fixedCard,
  stackScale,
  pointer,
  depth,
}: {
  card: StackSpreadCard;
  progress: MotionValue<number>;
  reduce: boolean | null;
  clusterRotation: boolean;
  scaleMul: number | null;
  isSmall: boolean;
  colX: number | null;
  fixedCard: { w: number; h: number } | null;
  stackScale: number;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  depth: number;
}) {
  const { target } = card;

  const flat = reduce === true;
  const stackRotate = flat ? 0 : clusterRotation ? card.stackRotate ?? 0 : 0;
  const stackOffset = card.stackOffset ?? { x: 0, y: 0 };
  const restScale = scaleMul ?? 1;

  const sm = isSmall && card.targetSm ? card.targetSm : null;
  const endX = sm
    ? colX != null
      ? Math.sign(sm.x) * colX
      : sm.x
    : target.x;
  const endY = sm ? sm.y : target.y;
  const endRotate = flat || isSmall ? 0 : target.rotate;

  const translate = useTransform(
    [progress, pointer.x, pointer.y],
    (values: number[]) => {
      const p = values[0] ?? 0;
      const px = values[1] ?? 0;
      const py = values[2] ?? 0;
      const tx = stackOffset.x + (endX - stackOffset.x) * p;
      const ty = stackOffset.y + (endY - stackOffset.y) * p;
      const drift = depth * p;
      const dx = tx - px * PARALLAX_X * drift;
      const dy = ty - py * PARALLAX_Y * drift;
      return `calc(-50% + ${dx}vw) calc(-50% + ${dy}vh)`;
    },
  );
  const rotate = useTransform(progress, [0, 1], [stackRotate, endRotate]);
  const scale = useTransform(progress, [0, 1], [stackScale, restScale]);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 will-change-transform pointer-events-auto"
      style={{
        width: `${fixedCard ? fixedCard.w : target.w}vw`,
        height: `${fixedCard ? fixedCard.h : target.h}vh`,
        zIndex: card.z ?? 1,
        translate,
        rotate,
        scale,
      }}
    >
      {card.content}
    </motion.div>
  );
}

export interface StackSpreadProps {
  scrollLength?: number;
  bgColor?: string;
  clusterRotation?: boolean;
  stackScale?: number;
  textColor?: string;
  textFadeStart?: number;
  showScrollHint?: boolean;
  progressOverride?: MotionValue<number>;
}

export default function StackSpread({
  scrollLength = 280,
  bgColor = "#ffffff",
  clusterRotation = true,
  stackScale = 0.82,
  textColor = "#09090b",
  textFadeStart = 0.25,
  showScrollHint = true,
  progressOverride,
}: StackSpreadProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scale: scaleMul, small: isSmall, colX, card: fixedCard } = useResponsive();

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  const activeProgress = progressOverride || scrollYProgress;

  const progress = useTransform(
    activeProgress,
    [0, SCATTER_START, SCATTER_END, 1],
    [0, 0, 1, 1],
  );

  const [spread, setSpread] = useState(false);
  useMotionValueEvent(progress, "change", (p) => {
    setSpread((was) => (was ? p > 0.985 : p >= 0.999));
  });

  const parallaxEnabled = reduce !== true && !isSmall;
  const pointer = usePointerParallax(spread, parallaxEnabled);

  const copyOpacity = useTransform(progress, [textFadeStart, textFadeStart + 0.35], [0, 1]);
  const copyScale = useTransform(progress, [textFadeStart, 0.9], [0.85, 1]);
  const hintOpacity = useTransform(progress, [0, SCATTER_START], [1, 0]);

  return (
    <section
      ref={wrapRef}
      className="relative w-full overflow-visible"
      style={{ height: `${scrollLength}vh`, backgroundColor: bgColor }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* CENTER OPED ZERO COST TEXT */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-[5] flex flex-col items-center justify-center px-6 text-center"
          style={{
            opacity: copyOpacity,
            scale: reduce === true ? 1 : copyScale,
          }}
        >
          <p className="font-serif text-2xl sm:text-4xl text-zinc-500 mb-1">
            and for students it costs...
          </p>
          <h2
            className="font-serif text-7xl sm:text-9xl tracking-tight leading-none text-zinc-900"
            style={{ color: textColor }}
          >
            zero<span className="script-word text-[var(--cyan)]">.</span>
          </h2>
          <div className="free-doodle font-hand text-2xl text-[#71717a] mt-4 flex items-center gap-2">
            <span>we charge schools</span>
            <svg viewBox="0 0 80 42" fill="none" className="w-16 h-8 stroke-[#71717a]">
              <path d="M4 4c5 33 48 5 66 27m-11-1 11 1-5 9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </motion.div>

        {/* SCATTERING FLOAT CARDS */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {OPED_CARDS.map((card, i) => (
            <Card
              key={card.id}
              card={card}
              progress={progress}
              reduce={reduce}
              clusterRotation={clusterRotation}
              scaleMul={scaleMul}
              isSmall={isSmall}
              colX={colX}
              fixedCard={fixedCard}
              stackScale={stackScale}
              pointer={pointer}
              depth={parallaxEnabled ? parallaxDepth(i, OPED_CARDS.length) : 0}
            />
          ))}
        </div>

        {/* SCROLL HINT */}
        {showScrollHint && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
            style={{ opacity: hintOpacity }}
          >
            <span>Scroll to spread</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-bounce"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </motion.div>
        )}
      </div>
    </section>
  );
}
