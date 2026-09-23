import { useEffect, useRef } from "react";
import { motion, animate } from "framer-motion";
import { BrandMark } from "@/components/icons";

export default function InitialPreloader({ onComplete }: { onComplete: () => void }) {
  const countRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Counter loads to 100 quickly (0.8s)
    const counterControls = animate(0, 100, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (latest) => {
        if (countRef.current) {
          countRef.current.innerText = Math.floor(latest).toString();
        }
      }
    });

    // 2. Zoom animation inspired by GlyphPortal math (starts after counter)
    const zoomControls = animate(0, 1, {
      delay: 0.85,
      duration: 1.8,
      onUpdate: (p) => {
        if (!containerRef.current) return;
        
        // Custom cubic bezier easing from GlyphPortal
        const t = Math.min(Math.max(p, 0), 1);
        const eased = t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(-2 * t + 2, 3) / 2;
        
        // Exponential scale for a physical camera zoom feel
        const startScale = 1;
        const endScale = 400; // Massive scale to pass through the 'O'
        const scale = Math.exp(Math.log(startScale) + Math.log(endScale / startScale) * eased);
        
        // Smooth interpolation function
        const smooth = (a: number, b: number, n: number) => {
          const clamped = Math.min(Math.max((n - a) / (b - a), 0), 1);
          return clamped * clamped * (3 - 2 * clamped);
        };

        // Barrel roll (x-y plane rotation) peaking at ~38 degrees and straightening out
        const roll = -38 * smooth(0.0, 0.5, t) * (1 - smooth(0.6, 1.0, t)); 
        
        // Apply transforms directly for 0-latency rendering
        containerRef.current.style.transform = `scale(${scale}) rotate(${roll}deg)`;
        
        // At the very end when the 'O' is massive, fade out the white background to reveal the landing page seamlessly
        if (p > 0.85) {
           const opacity = 1 - ((p - 0.85) / 0.15);
           if (bgRef.current) {
             bgRef.current.style.opacity = Math.max(0, opacity).toString();
           }
        }
      },
      onComplete: () => {
        setTimeout(onComplete, 50);
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
      className="fixed inset-0 z-[100] bg-white flex items-center justify-center overflow-hidden pointer-events-none"
    >
      <div style={{ perspective: "1000px" }} className="flex items-center justify-center w-full h-full">
          <div
            ref={containerRef}
            // Transform origin carefully placed exactly in the center of the "O"
            className="flex items-center gap-6 origin-[42%_50%]"
            style={{ transform: "scale(1) rotate(0deg)" }}
          >
            <BrandMark size={100} variant="black" />
            <h1 
              className="text-black flex items-center h-[100px] pb-4" 
              style={{ fontFamily: "var(--f-sans)", fontSize: "100px", fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1 }}
            >
              OPED<span style={{ color: "var(--cyan)" }}>.</span>
            </h1>
          </div>
      </div>

      <div className="absolute bottom-12 left-12">
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1, y: [20, 0] }}
           transition={{ duration: 0.5, ease: "easeOut" }}
           className="text-zinc-900 text-[12vw] font-thin leading-none tracking-tighter"
           style={{ transform: "scaleY(1.4)", transformOrigin: "bottom left", fontVariantNumeric: "tabular-nums" }}
         >
           <span ref={countRef}>0</span>
         </motion.div>
      </div>
    </div>
  );
}
