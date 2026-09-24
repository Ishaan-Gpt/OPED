import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Buttery smooth scrolling (client-only, cleaned up on unmount). */
export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    let raf = 0;
    let instance: { raf: (t: number) => void; destroy: () => void; on: (e: string, cb: any) => void } | null = null;
    let cancelled = false;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({ duration: 1.1, smoothWheel: true, touchMultiplier: 1.4 });
      instance = lenis as unknown as { raf: (t: number) => void; destroy: () => void; on: (e: string, cb: any) => void };
      
      // SYNC WITH GSAP SCROLLTRIGGER!
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      instance?.destroy();
    };
  }, [enabled]);
}

export default useLenis;
