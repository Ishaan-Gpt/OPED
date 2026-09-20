import type { VisualKind } from "../types";

export type EnvironmentType = "lab" | "night" | "space" | "sky" | "blueprint" | "nebula";

export interface SceneTheme {
  environment: EnvironmentType;
  /** deep base color behind everything */
  base: string;
  /** secondary gradient color, usually near the accent family */
  glow: string;
}

export const SCENE_THEMES: Record<VisualKind, SceneTheme> = {
  reaction: { environment: "lab", base: "#151d1b", glow: "#e07a5f" },
  ray: { environment: "night", base: "#0f1a22", glow: "#2f9d8b" },
  concaveMirror: { environment: "night", base: "#0f1a22", glow: "#2f9d8b" },
  convexMirror: { environment: "night", base: "#0f1a22", glow: "#2f9d8b" },
  atom: { environment: "space", base: "#0c1220", glow: "#7c9cff" },
  photosynthesis: { environment: "sky", base: "#0e2420", glow: "#6fbf73" },
  graph: { environment: "blueprint", base: "#0d1b2a", glow: "#e07a5f" },
  cell: { environment: "sky", base: "#12241f", glow: "#8dd6a8" },
  circuit: { environment: "blueprint", base: "#0d1b2a", glow: "#f2c94c" },
  map: { environment: "blueprint", base: "#12211c", glow: "#e0a458" },
  equation: { environment: "night", base: "#10161f", glow: "#7c9cff" },
  generic: { environment: "nebula", base: "#15121f", glow: "#2f9d8b" },
};
