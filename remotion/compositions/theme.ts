import type { VisualKind } from "../types";

export type EnvironmentType = "lab" | "night" | "space" | "sky" | "blueprint" | "nebula";

export interface SceneTheme {
  environment: EnvironmentType;
  /** deep base color behind everything */
  base: string;
  /** secondary gradient color, usually near the accent family */
  glow: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((c) => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, "0")).join("")}`;
}

/** Blends two hex colors, t=0 -> a, t=1 -> b. Used to tint a fixed environment's palette
 * toward this specific video's own accent, so background never looks identical across videos
 * that happen to share a visualKind/environment. */
export function mixHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex([ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t]);
}

export const SCENE_THEMES: Record<VisualKind, SceneTheme> = {
  reaction: { environment: "lab", base: "#151d1b", glow: "#e07a5f" },
  ray: { environment: "night", base: "#0f1a22", glow: "#2f9d8b" },
  concaveMirror: { environment: "night", base: "#0f1a22", glow: "#2f9d8b" },
  convexMirror: { environment: "night", base: "#0f1a22", glow: "#2f9d8b" },
  prism: { environment: "night", base: "#12141f", glow: "#8b5cf6" },
  refraction: { environment: "night", base: "#0f1a22", glow: "#2f9d8b" },
  atom: { environment: "space", base: "#0c1220", glow: "#7c9cff" },
  rutherfordAtom: { environment: "space", base: "#0c1220", glow: "#7c9cff" },
  photosynthesis: { environment: "sky", base: "#0e2420", glow: "#6fbf73" },
  graph: { environment: "blueprint", base: "#0d1b2a", glow: "#e07a5f" },
  cell: { environment: "sky", base: "#12241f", glow: "#8dd6a8" },
  circuit: { environment: "blueprint", base: "#0d1b2a", glow: "#f2c94c" },
  map: { environment: "blueprint", base: "#12211c", glow: "#e0a458" },
  equation: { environment: "night", base: "#10161f", glow: "#7c9cff" },
  generic: { environment: "nebula", base: "#15121f", glow: "#2f9d8b" },
};
