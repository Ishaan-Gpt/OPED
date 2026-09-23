import { useEffect, useRef, useState } from "react";
import { motion, animate } from "framer-motion";
import { BrandMark } from "@/components/icons";

const STAGES = [
  "INITIALIZING AI NCERT RIG...",
  "INDEXING CHAPTER DATASETS...",
  "SYNTHESIZING VECTOR BLACKBOARD...",
  "CLASSROOM ENGINE READY",
];

export default function InitialPreloader({ onComplete }: { onComplete: () => void }) {
  const countRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [stageText, setStageText] = useState(STAGES[0]);

  useEffect(() => {
    // Check if user has already seen preloader in this tab session
    const hasVisited = sessionStorage.getItem("oped_preloader_seen");
    if (hasVisited) {
      onComplete();
      return;
    }

    // 1. Smooth counter progress (0 -> 100%) over 0.95s
    const counterControls = animate(0, 100, {
      duration: 0.95,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        const val = Math.floor(latest);
        if (countRef.current) {
          countRef.current.innerText = val.toString();
        }
        if (val < 30) setStageText(STAGES[0]);
        else if (val < 65) setStageText(STAGES[1]);
        else if (val < 90) setStageText(STAGES[2]);
        else setStageText(STAGES[3]);
      }
    });

    // 2. Exponential portal camera zoom straight into the "O"
    const zoomControls = animate(0, 1, {
      delay: 0.95,
      duration: 1.6,
      onUpdate: (p) => {
        if (!containerRef.current) return;
        
        // High-precision smooth step easing
        const t = Math.min(Math.max(p, 0), 1);
        const eased = t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(-2 * t + 2, 3) / 2;
        
        // Physical camera zoom effect passing through the logo center
        const startScale = 1;
        const endScale = 450;
        const scale = Math.exp(Math.log(startScale) + Math.log(endScale / startScale) * eased);
        
        // Smooth tilt roll peaking mid-zoom
        const smooth = (a: number, b: number, n: number) => {
          const clamped = Math.min(Math.max((n - a) / (b - a), 0), 1);
          return clamped * clamped * (3 - 2 * clamped);
        };
        const roll = -32 * smooth(0.0, 0.5, t) * (1 - smooth(0.6, 1.0, t));
        
        containerRef.current.style.transform = `scale(${scale}) rotate(${roll}deg)`;
        
        // Fade out backdrop softly as camera pierces through
        if (p > 0.8) {
          const opacity = 1 - ((p - 0.8) / 0.2);
          if (bgRef.current) {
            bgRef.current.style.opacity = Math.max(0, opacity).toString();
          }
        }
      },
      onComplete: () => {
        sessionStorage.setItem("oped_preloader_seen", "true");
        setTimeout(onComplete, 40);
      }
    });

    return () => {
      counterControls.stop();
      zoomControls.stop();
    };
  }, [onComplete]);

  return (
    <div
      ref={bgRef}
      className="fixed inset-0 z-[100] bg-white flex items-center justify-center overflow-hidden pointer-events-none transition-opacity duration-300"
    >
      {/* GLYPH PORTAL CONTAINER */}
      <div style={{ perspective: "1000px" }} className="flex items-center justify-center w-full h-full relative">
        {/* Subtle Ambient Laser Ring */}
        <div className="absolute size-[300px] rounded-full border border-[var(--cyan)]/20 animate-ping pointer-events-none" />
        
        <div
          ref={containerRef}
          className="flex items-center gap-6 origin-[42%_50%] will-change-transform select-none"
          style={{ transform: "scale(1) rotate(0deg)" }}
        >
          <div className="relative flex items-center justify-center">
            <BrandMark size={105} variant="black" />
            <div className="absolute inset-0 rounded-full bg-[var(--cyan)]/10 blur-xl -z-10" />
          </div>
          <h1 
            className="text-black flex items-center h-[100px] pb-4 tracking-tighter" 
            style={{ fontFamily: "var(--f-sans)", fontSize: "105px", fontWeight: 900, lineHeight: 1 }}
          >
            OPED<span className="text-[var(--cyan)]">.</span>
          </h1>
        </div>
      </div>

      {/* FOOTER COUNTER & STATUS HUD */}
      <div className="absolute bottom-10 inset-x-10 flex items-end justify-between pointer-events-none">
        <div className="space-y-1">
          <div className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--cyan)] animate-pulse" />
            <span>OPED / ENGINE PRELOADER</span>
          </div>
          <div className="text-xs font-mono font-medium text-zinc-900 tracking-wider">
            {stageText}
          </div>
        </div>

        <div className="flex items-baseline gap-1 text-zinc-900 font-mono font-light leading-none tracking-tighter text-7xl sm:text-8xl">
          <span ref={countRef}>0</span>
          <span className="text-2xl font-sans font-bold text-[var(--cyan)]">%</span>
        </div>
      </div>
    </div>
  );
}

