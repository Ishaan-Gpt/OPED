import { useEffect } from "react";

/** Buttery smooth scrolling (client-only, cleaned up on unmount). */
export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    let raf = 0;
    let instance: { raf: (t: number) => void; destroy: () => void } | null = null;
    let cancelled = false;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({ duration: 1.1, smoothWheel: true, touchMultiplier: 1.4 });
      instance = lenis as unknown as { raf: (t: number) => void; destroy: () => void };
      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      instance?.destroy();
    };
  }, [enabled]);
}

export default useLenis;
