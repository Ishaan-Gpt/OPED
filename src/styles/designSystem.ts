/**
 * Global design system tokens — Monochrome Dark & White Tint Palette.
 * Single source of truth for palette, typography, motion and elevation.
 */

export const palette = {
  white: "#ffffff",
  paper: "#ffffff",
  ink: "#09090b",
  
  // Pure Monochrome Scale (White Major)
  gray50: "#ffffff",
  gray100: "#f4f4f5",
  gray200: "#e4e4e7",
  gray300: "#d4d4d8",
  gray400: "#a1a1aa",
  gray500: "#71717a",
  gray600: "#52525b",
  gray700: "#3f3f46",
  gray800: "#27272a",
  gray900: "#18181b",
  gray950: "#09090b",
  black: "#000000",

  // Semantic mappings (Strictly White Major Monochrome)
  royalRed: "#09090b",
  royalRedSoft: "#52525b",
  tealGreen: "#09090b",
  tealGreenSoft: "#3f3f46",
  earthBrown: "#ffffff",
  earthBrownLight: "#f4f4f5",
  earthBrownDark: "#e4e4e7",
  board: "#09090b",
  boardDeep: "#000000",
  chalk: "#ffffff",
  chalkDim: "rgba(255, 255, 255, 0.75)",
} as const;

export const typography = {
  display: '"Instrument Serif", "Fraunces", Georgia, serif',
  script: '"Pinyon Script", cursive',
  body: '"DM Sans", "Outfit", system-ui, sans-serif',
  chalk: '"Caveat", "Comic Sans MS", cursive',
  mono: '"Space Mono", monospace',
} as const;

export const radii = {
  sm: "8px",
  md: "14px",
  lg: "22px",
  xl: "32px",
  pill: "999px",
} as const;

export const elevation = {
  soft: "0 1px 2px rgba(0,0,0,0.2), 0 8px 24px -12px rgba(0,0,0,0.4)",
  lifted: "0 2px 4px rgba(0,0,0,0.3), 0 28px 60px -24px rgba(0,0,0,0.6)",
  frame: "0 30px 70px -30px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -3px 8px rgba(0,0,0,0.8)",
} as const;

export const motionTokens = {
  spring: { type: "spring" as const, stiffness: 180, damping: 24, mass: 0.9 },
  springSoft: { type: "spring" as const, stiffness: 120, damping: 20 },
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  durations: { fast: 0.18, base: 0.36, slow: 0.7, morph: 0.9 },
} as const;

export const layout = {
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
