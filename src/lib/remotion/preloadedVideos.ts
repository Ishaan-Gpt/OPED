import type { VisualKind } from "../../../remotion/types";

export interface PreloadedVideoInfo {
  url: string;
  title: string;
  durationSeconds: number;
}

/**
 * Static pre-rendered Remotion videos for the NCERT chapters.
 * Instant zero-latency playback (0ms loading time).
 */
export const PRELOADED_VIDEOS: Record<VisualKind | string, PreloadedVideoInfo> = {
  concaveMirror: {
    url: "/generated/2d44d3b3-6868-451c-a498-d42121d42439.mp4",
    title: "Concave Mirror — Real Focus & Image Formation",
    durationSeconds: 10,
  },
  ray: {
    url: "/generated/4b26c65a-4dca-4963-91b4-874819e423d0.mp4",
    title: "Laws of Reflection — Incident & Reflected Rays",
    durationSeconds: 10,
  },
  refraction: {
    url: "/generated/6b533130-965e-4bc3-8727-622e31f241eb.mp4",
    title: "Refraction of Light — Speed Change across Media",
    durationSeconds: 10,
  },
  prism: {
    url: "/generated/ae8ffb0b-6e81-4528-94e8-794204626747.mp4",
    title: "Dispersion of White Light — Glass Prism Spectrum",
    durationSeconds: 10,
  },
  atom: {
    url: "/generated/b483a072-f07d-46a9-93e8-34befcf23245.mp4",
    title: "Bohr Model — Discrete Shells K, L, M",
    durationSeconds: 10,
  },
  rutherfordAtom: {
    url: "/generated/ba327657-228c-44ed-aaa8-79ddf907caf9.mp4",
    title: "Rutherford Alpha Scattering — Discovery of Nucleus",
    durationSeconds: 10,
  },
  photosynthesis: {
    url: "/generated/d7522901-4505-44f1-bc56-bdd52fc8379e.mp4",
    title: "Photosynthesis — Stomata, Sunlight & Chloroplasts",
    durationSeconds: 10,
  },
  cell: {
    url: "/generated/ed799507-d272-4b31-8907-7cdd152e46e3.mp4",
    title: "Plant Cell & Chloroplast Architecture",
    durationSeconds: 10,
  },
  reaction: {
    url: "/generated/f4c588a2-0e86-4cac-bbe1-82c1faf91814.mp4",
    title: "Chemical Reaction & Gas Release",
    durationSeconds: 10,
  },
  convexMirror: {
    url: "/generated/2d44d3b3-6868-451c-a498-d42121d42439.mp4",
    title: "Convex Mirror — Diverging Rays",
    durationSeconds: 10,
  },
  generic: {
    url: "/generated/4b26c65a-4dca-4963-91b4-874819e423d0.mp4",
    title: "Visual Concept Explainer",
    durationSeconds: 10,
  },
};

/**
 * Returns the preloaded video for a visual kind if available.
 */
export function getPreloadedVideo(visualKind: VisualKind | string | undefined): PreloadedVideoInfo | null {
  if (!visualKind) return null;
  return PRELOADED_VIDEOS[visualKind] ?? null;
}
