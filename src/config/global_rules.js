/**
 * OPED Global Architectural Rules & Pedagogical Invariants
 * 
 * Production Governance Specification
 */

export const GLOBAL_RULES = {
  PROJECT_NAME: "OPED - Outcome-Based Immersive Learning",
  VERSION: "1.0.0-production",

  // Pedagogical & Business Rules
  PEDAGOGY_RULES: {
    EXAM_READY_GUARANTEE: "Completion of all module checkpoints guarantees 100% exam readiness.",
    NCERT_STRICT_TERMINOLOGY: "Explanations must use concise exact NCERT vocabulary without dilution.",
    LEARNING_CYCLE: [
      "Phase A: Understanding (Teacher audio recitation + chalk captions, no student memorization required)",
      "Phase B: Recitation & Verification (Teacher asks student to recite exact target twice, AI evaluates accuracy)",
      "Phase C: Dynamic Adaptation (Teacher adjusts hints dynamically based on student voice/text response)"
    ]
  },

  // UI/UX Architectural Governance
  DESIGN_RULES: {
    COLOR_CONSTRAINTS: {
      PRIMARY_BASE: "Photorealistic Studio White / Soft Canvas (#F9FAFB, #FFFFFF)",
      ROYAL_RED: "Mandatory Exam Concepts, Errors, Re-attempts, High Priority Alerts (#8B0000, #A71D2A)",
      TEAL_GREEN: "Mastery, Correct Recitation, Active Waveform, Success Badges (#005F56, #0D7A70)",
      EARTHY_BROWN: "Classroom Slate Wood Frames, Chalkboard Borders, Structural Accents (#4A3525, #3D2B1F)",
      STRICT_USAGE: "No ad-hoc hex colors allowed outside the centralized design system tokens."
    },
    VIEWPORT: {
      TARGET_ORIENTATIONS: ["Desktop Widescreen (16:9 / 21:9)", "Mobile Landscape"],
      LAYOUT_PRIMITIVES: "Full screen canvas morphing with smooth CSS keyframes and hardware accelerated transforms."
    }
  },

  // 3D Engine Rules
  CANVAS_3D_RULES: {
    ENGINE: "Three.js WebGL Engine",
    INTERACTION: "Blur background on overlay trigger, zoom blackboard into full-screen viewport, provide clear exit toggle."
  }
};
