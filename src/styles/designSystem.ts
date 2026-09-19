/**
 * Global design system tokens.
 * Single source of truth for palette, typography, motion and elevation.
 * Colors mirror the CSS variables declared in src/styles.css.
 */

export const palette = {
  white: "#ffffff",
  paper: "#fbfaf7",
  ink: "#1b1917",
  /** Royal Red — alerts, errors, key memorization cues */
  royalRed: "#9e1b32",
  royalRedSoft: "#c8465c",
  /** Teal Green — success, verified recall, progress */
  tealGreen: "#0f6b5f",
  tealGreenSoft: "#2f9d8b",
  /** Warm Earth Brown — wooden frame, tactile trim */
  earthBrown: "#6b4228",
  earthBrownLight: "#9a6b41",
  earthBrownDark: "#3f2a19",
  /** Blackboard surface */
  board: "#22312d",
  boardDeep: "#18231f",
  chalk: "#f3f1e7",
  chalkDim: "rgba(243, 241, 231, 0.62)",
} as const;

export const typography = {
  display: '"Fraunces", Georgia, serif',
  body: '"Outfit", system-ui, sans-serif',
  chalk: '"Caveat", "Comic Sans MS", cursive',
} as const;

export const radii = {
  sm: "8px",
  md: "14px",
  lg: "22px",
  xl: "32px",
  pill: "999px",
} as const;

export const elevation = {
  soft: "0 1px 2px rgba(27,25,23,0.06), 0 8px 24px -12px rgba(27,25,23,0.18)",
  lifted: "0 2px 4px rgba(27,25,23,0.08), 0 28px 60px -24px rgba(27,25,23,0.35)",
  frame:
    "0 30px 70px -30px rgba(31,20,10,0.65), inset 0 2px 0 rgba(255,255,255,0.22), inset 0 -3px 8px rgba(0,0,0,0.35)",
} as const;

export const motionTokens = {
  spring: { type: "spring" as const, stiffness: 180, damping: 24, mass: 0.9 },
  springSoft: { type: "spring" as const, stiffness: 120, damping: 20 },
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  durations: { fast: 0.18, base: 0.36, slow: 0.7, morph: 0.9 },
} as const;

export const layout = {
  /** Optimized for desktop + mobile landscape */
  maxStageWidth: 1180,
  headerHeight: 68,
} as const;

export const designSystem = {
  palette,
  typography,
  radii,
  elevation,
  motionTokens,
  layout,
} as const;

export default designSystem;
