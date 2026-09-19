/**
 * OPED Production Design System
 * Centralized color tokens, typography tokens, component styles & responsive breakpoints.
 */

export const DESIGN_SYSTEM = {
  colors: {
    // 1. Primary White-Themed Base
    base: {
      pureWhite: "#FFFFFF",
      canvasWhite: "#F9FAFB",
      studioBg: "#F3F4F6",
      panelBg: "#FFFFFF",
      slateGreen: "#14251D", // Photorealistic Blackboard slate
      slateDarkGreen: "#0C1712",
      chalkText: "#F5F7F6"
    },

    // 2. Royal Red Palette (Exam Mandatory Items, Mistakes, Re-attempts)
    royalRed: {
      primary: "#8B0000",
      accent: "#A71D2A",
      deep: "#680000",
      lightBg: "#FFF1F2",
      border: "#FDA4AF"
    },

    // 3. Teal Green Palette (Mastery, Correct Recitation, Active Waveforms)
    tealGreen: {
      primary: "#005F56",
      accent: "#0D7A70",
      bright: "#00A896",
      lightBg: "#F0FDF4",
      border: "#86EFAC"
    },

    // 4. Earthy Brown Palette (Wood Slate Frames, Classroom Borders)
    earthyBrown: {
      primary: "#4A3525",
      accent: "#6D4C41",
      darkWood: "#3D2B1F",
      lightBg: "#FEF3C7",
      border: "#D97706"
    }
  },

  typography: {
    fonts: {
      sans: "'Outfit', 'Inter', system-ui, sans-serif",
      chalk: "'Caveat', 'Architects Daughter', cursive",
      mono: "'Fira Code', monospace"
    }
  },

  shadows: {
    woodFrame: "0 20px 40px -15px rgba(61, 43, 31, 0.4), 0 0 0 12px #3D2B1F",
    blackboardGlow: "0 25px 50px -12px rgba(0, 95, 86, 0.15)",
    searchBarShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.08)",
    modalShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
  },

  transitions: {
    default: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    boardExpand: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
    zoom3D: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)"
  }
};
