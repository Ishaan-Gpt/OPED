import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BoneAngles, CharacterConfig, ExpressionType } from "./types";
import { EXPRESSION_PRESETS } from "./CharacterExpressions";
import { CharacterFace } from "./CharacterFace";

interface CharacterRigProps {
  boneAngles: BoneAngles;
  expression: ExpressionType;
  pupilOffset: { x: number; y: number };
  isBlinking: boolean;
  isNoPeekActive: boolean;
  config?: Partial<CharacterConfig>;
  className?: string;
  isSpeaking?: boolean;
}

const defaultConfig: CharacterConfig = {
  skinColor: "#FDE2D1",
  skinDarkColor: "#F5C2A5",
  hairColor: "#2C1D11",
  shirtColor: "#475569",
  vestColor: "#1E293B",
  accentColor: "#38BDF8",
  glasses: true,
};

export const CharacterRig: React.FC<CharacterRigProps> = ({
  boneAngles,
  expression,
  pupilOffset,
  isBlinking,
  isNoPeekActive,
  config: customConfig,
  className = "",
  isSpeaking = false,
}) => {
  const config = { ...defaultConfig, ...customConfig };
  const expr = EXPRESSION_PRESETS[expression] || EXPRESSION_PRESETS.idle;

  // 3D Volumetric Hand Renderer
  const render3DHand = (pose: BoneAngles["leftHandPose"], isRight: boolean) => {
    const flip = isRight ? 1 : -1;
    switch (pose) {
      case "pointing":
        return (
          <g transform={`scale(${flip}, 1)`}>
            <circle
              cx="0"
              cy="8"
              r="10"
              fill="url(#skin3DGrad)"
              stroke="#E2A988"
              strokeWidth="1.2"
            />
            <rect
              x="-4"
              y="-16"
              width="8"
              height="18"
              rx="4"
              fill="url(#skin3DGrad)"
              stroke="#E2A988"
              strokeWidth="1.2"
            />
            <circle cx="5" cy="6" r="4" fill="#D99B7A" />
            <circle cx="5" cy="12" r="4" fill="#D99B7A" />
          </g>
        );
      case "fingerGun":
        return (
          <g transform={`scale(${flip}, 1)`}>
            <circle
              cx="0"
              cy="8"
              r="10"
              fill="url(#skin3DGrad)"
              stroke="#E2A988"
              strokeWidth="1.2"
            />
            <rect
              x="-4"
              y="-18"
              width="8"
              height="20"
              rx="4"
              fill="url(#skin3DGrad)"
              stroke="#E2A988"
              strokeWidth="1.2"
            />
            <rect
              x="-12"
              y="2"
              width="14"
              height="7"
              rx="3.5"
              fill="url(#skin3DGrad)"
              stroke="#E2A988"
              strokeWidth="1.2"
            />
          </g>
        );
      case "thumbsUp":
        return (
          <g transform={`scale(${flip}, 1)`}>
            <circle
              cx="0"
              cy="6"
              r="9"
              fill="url(#skin3DGrad)"
              stroke="#E2A988"
              strokeWidth="1.2"
            />
            <rect
              x="-3.5"
              y="-15"
              width="7"
              height="15"
              rx="3.5"
              fill="url(#skin3DGrad)"
              stroke="#E2A988"
              strokeWidth="1.2"
            />
          </g>
        );
      case "peace":
        return (
          <g transform={`scale(${flip}, 1)`}>
            <circle
              cx="0"
              cy="8"
              r="9"
              fill="url(#skin3DGrad)"
              stroke="#E2A988"
              strokeWidth="1.2"
            />
            <rect
              x="-6"
              y="-15"
              width="5.5"
              height="16"
              rx="2.8"
              transform="rotate(-10 -3 -7)"
              fill="url(#skin3DGrad)"
              stroke="#E2A988"
              strokeWidth="1"
            />
            <rect
              x="0.5"
              y="-15"
              width="5.5"
              height="16"
              rx="2.8"
              transform="rotate(10 3 -7)"
              fill="url(#skin3DGrad)"
              stroke="#E2A988"
              strokeWidth="1"
            />
          </g>
        );
      case "heart":
        return (
          <g transform={`scale(${flip}, 1)`}>
            <path
              d="M 0 0 C -6 -8 -12 -2 0 8 C 12 -2 6 -8 0 0 Z"
              fill="url(#heart3DGrad)"
              stroke="#E11D48"
              strokeWidth="1"
            />
          </g>
        );
      case "salute":
      case "adjustGlasses":
        return (
          <g transform={`scale(${flip}, 1)`}>
            <rect
              x="-8"
              y="-4"
              width="16"
              height="8"
              rx="3"
              fill="url(#skin3DGrad)"
              stroke="#E2A988"
              strokeWidth="1.2"
            />
          </g>
        );
      case "highFive":
      case "facepalm":
        return (
          <g transform={`scale(${flip}, 1)`}>
            <circle
              cx="0"
              cy="4"
              r="11"
              fill="url(#skin3DGrad)"
              stroke="#E2A988"
              strokeWidth="1.2"
            />
            <rect x="-9" y="-11" width="4.5" height="13" rx="2.2" fill="url(#skin3DGrad)" />
            <rect x="-3.5" y="-14" width="4.5" height="15" rx="2.2" fill="url(#skin3DGrad)" />
            <rect x="2" y="-13" width="4.5" height="14" rx="2.2" fill="url(#skin3DGrad)" />
            <rect x="7.5" y="-9" width="4" height="11" rx="2" fill="url(#skin3DGrad)" />
          </g>
        );
      case "book":
        return (
          <g transform={`scale(${flip}, 1)`}>
            <rect
              x="-12"
              y="-8"
              width="24"
              height="18"
              rx="2"
              fill="url(#book3DGrad)"
              stroke="#1D4ED8"
              strokeWidth="1.2"
            />
            <line x1="0" y1="-8" x2="0" y2="10" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>
        );
      case "cupped":
        return (
          <g transform={`scale(${flip}, 1)`}>
            <path
              d="M -10 -4 C -12 6 0 12 10 4 C 8 -4 -6 -6 -10 -4 Z"
              fill="url(#skin3DGrad)"
              stroke="#E2A988"
              strokeWidth="1.2"
            />
          </g>
        );
      case "wave":
        return (
          <g transform={`scale(${flip}, 1)`}>
            <circle
              cx="0"
              cy="5"
              r="9"
              fill="url(#skin3DGrad)"
              stroke="#E2A988"
              strokeWidth="1.2"
            />
            <rect x="-9" y="-11" width="4.5" height="13" rx="2.2" fill="url(#skin3DGrad)" />
            <rect x="-3.5" y="-14" width="4.5" height="15" rx="2.2" fill="url(#skin3DGrad)" />
            <rect x="2" y="-13" width="4.5" height="14" rx="2.2" fill="url(#skin3DGrad)" />
            <rect x="7.5" y="-9" width="4" height="11" rx="2" fill="url(#skin3DGrad)" />
          </g>
        );
      case "flat":
      default:
        return (
          <g transform={`scale(${flip}, 1)`}>
            <circle
              cx="0"
              cy="3"
              r="10"
              fill="url(#skin3DGrad)"
              stroke="#E2A988"
              strokeWidth="1.2"
            />
            <rect x="-6" y="-7" width="12" height="9" rx="3" fill="url(#skin3DGrad)" />
          </g>
        );
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center select-none overflow-visible ${className}`}
      style={{ perspective: "1000px" }}
    >
      <svg
        viewBox="0 0 320 400"
        className="w-full h-full filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.45)] overflow-visible"
        style={{ maxHeight: "100%", maxWidth: "100%" }}
      >
        <defs>
          {/* 3D SPHERICAL GRADIENTS FOR SKIN & BODY */}
          <radialGradient id="headSkin3D" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF4ED" />
            <stop offset="60%" stopColor="#FDE2D1" />
            <stop offset="90%" stopColor="#F7C4A5" />
            <stop offset="100%" stopColor="#E5A784" />
          </radialGradient>

          <radialGradient id="skin3DGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF1E6" />
            <stop offset="70%" stopColor="#FDE2D1" />
            <stop offset="100%" stopColor="#E2A988" />
          </radialGradient>

          {/* 3D PIXAR HAIR GRADIENTS */}
          <linearGradient id="hair3DGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#242129" />
            <stop offset="45%" stopColor="#18161D" />
            <stop offset="100%" stopColor="#0D0C10" />
          </linearGradient>
          <linearGradient id="hairSheenGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4F4A5E" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#18161D" stopOpacity="0" />
          </linearGradient>

          {/* 3D VEST & SHIRT GRADIENTS */}
          <linearGradient id="blackTShirtGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2A2A2E" />
            <stop offset="50%" stopColor="#18181B" />
            <stop offset="100%" stopColor="#09090B" />
          </linearGradient>

          <linearGradient id="creamPantsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FAFAFA" />
            <stop offset="60%" stopColor="#F4F4F5" />
            <stop offset="100%" stopColor="#E4E4E7" />
          </linearGradient>

          <radialGradient id="pearlGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </radialGradient>

          {/* 3D EYE GRADIENTS */}
          <radialGradient id="eyeball3DGrad" cx="40%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="85%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </radialGradient>

          <radialGradient id="eyeSocketGrad" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </radialGradient>

          <radialGradient id="iris3DGrad" cx="40%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="35%" stopColor="#8B5CF6" />
            <stop offset="75%" stopColor="#6D28D9" />
            <stop offset="100%" stopColor="#4C1D95" />
          </radialGradient>

          {/* MOUTH & ACCENT GRADIENTS */}
          <linearGradient id="mouthInnerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#991B1B" />
            <stop offset="100%" stopColor="#450A0A" />
          </linearGradient>

          <linearGradient id="tongueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>

          <radialGradient id="heart3DGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FF758F" />
            <stop offset="100%" stopColor="#E11D48" />
          </radialGradient>

          <linearGradient id="book3DGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.35)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          <radialGradient id="lightbulbGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="rgba(245,158,11,0)" />
          </radialGradient>
        </defs>

        {/* Dynamic 3D Ground Shadow */}
        <motion.ellipse
          cx="160"
          cy="385"
          rx="74"
          ry="12"
          fill="url(#shadowGrad)"
          animate={{
            scaleX: [1, 1.06, 1],
            opacity: [0.8, 0.95, 0.8],
          }}
          transition={{
            repeat: Infinity,
            duration: 3.6,
            ease: "easeInOut",
          }}
        />

        {/* EUREKA GLOWING LIGHTBULB */}
        {expression === "eureka" && (
          <motion.g
            initial={{ scale: 0, y: -20 }}
            animate={{ scale: 1.25, y: -38 }}
            className="z-50"
          >
            <circle cx="160" cy="28" r="22" fill="url(#lightbulbGlow)" />
            <circle cx="160" cy="28" r="13" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.5" />
            <path d="M 154 38 L 166 38 L 163 43 L 157 43 Z" fill="#64748B" />
            <line
              x1="160"
              y1="9"
              x2="160"
              y2="3"
              stroke="#FBBF24"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="144"
              y1="18"
              x2="138"
              y2="13"
              stroke="#FBBF24"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="176"
              y1="18"
              x2="182"
              y2="13"
              stroke="#FBBF24"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </motion.g>
        )}

        {/* 3D ALIVE RIGGED CARTOON CHARACTER CONTAINER */}
        <motion.g
          animate={{
            y: [0, -4.5, 0],
            rotate: [0, 0.7, -0.7, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 3.6,
            ease: "easeInOut",
          }}
        >
          {/* LEGS & HIGH-WAISTED CREAM TROUSERS */}
          <rect x="134" y="320" width="22" height="58" rx="7" fill="url(#creamPantsGrad)" />
          <rect x="164" y="320" width="22" height="58" rx="7" fill="url(#creamPantsGrad)" />
          <ellipse cx="145" cy="378" rx="14" ry="5.5" fill="#E4E4E7" />
          <ellipse cx="175" cy="378" rx="14" ry="5.5" fill="#E4E4E7" />

          {/* 3D BACK HAIR CASCADING PAST SHOULDERS */}
          <path
            d="M 102 110 C 58 135, 42 220, 58 310 C 72 350, 95 330, 96 260 C 97 200, 106 145, 115 125 Z"
            fill="url(#hair3DGrad)"
          />
          <path
            d="M 218 110 C 262 135, 278 220, 262 310 C 248 350, 225 330, 224 260 C 223 200, 214 145, 205 125 Z"
            fill="url(#hair3DGrad)"
          />

          {/* 3D VOLUMETRIC TORSO */}
          <motion.g
            animate={{
              scaleY: [1, 1.018, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.6,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "160px 325px" }}
          >
            {/* Black Crew Neck Fitted Shirt */}
            <path
              d="M 106 200 Q 160 190 214 200 L 220 282 Q 160 288 100 282 Z"
              fill="url(#blackTShirtGrad)"
            />
            {/* Crew Neckline */}
            <path d="M 138 200 Q 160 212 182 200" fill="none" stroke="#27272A" strokeWidth="3" />

            {/* High-Waisted Tailored Cream Trousers */}
            <path
              d="M 100 280 Q 160 286 220 280 L 224 330 Q 160 338 96 330 Z"
              fill="url(#creamPantsGrad)"
            />
            {/* Waistband Seam & Silver Button */}
            <line x1="100" y1="282" x2="220" y2="282" stroke="#D4D4D8" strokeWidth="2" />
            <line x1="160" y1="282" x2="160" y2="330" stroke="#E4E4E7" strokeWidth="1.5" />
            <circle cx="160" cy="292" r="3.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
          </motion.g>

          {/* LEFT ARM */}
          <motion.g
            animate={{
              rotate: boneAngles.leftUpperArm,
            }}
            transition={{ type: "spring", stiffness: 90, damping: 13 }}
            style={{ transformOrigin: "108px 208px" }}
          >
            <path
              d="M 108 204 L 78 258"
              stroke="url(#blackTShirtGrad)"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <motion.g
              animate={{ rotate: boneAngles.leftForearm }}
              transition={{ type: "spring", stiffness: 90, damping: 13 }}
              style={{ transformOrigin: "78px 258px" }}
            >
              <path
                d="M 78 258 L 54 304"
                stroke="url(#skin3DGrad)"
                strokeWidth="15"
                strokeLinecap="round"
              />
              <g transform="translate(54, 308)">
                {render3DHand(boneAngles.leftHandPose, false)}
              </g>
            </motion.g>
          </motion.g>

          {/* RIGHT ARM */}
          <motion.g
            animate={{
              rotate: boneAngles.rightUpperArm,
            }}
            transition={{ type: "spring", stiffness: 90, damping: 13 }}
            style={{ transformOrigin: "212px 208px" }}
          >
            <path
              d="M 212 204 L 242 258"
              stroke="url(#blackTShirtGrad)"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <motion.g
              animate={{ rotate: boneAngles.rightForearm }}
              transition={{ type: "spring", stiffness: 90, damping: 13 }}
              style={{ transformOrigin: "242px 258px" }}
            >
              <path
                d="M 242 258 L 266 304"
                stroke="url(#skin3DGrad)"
                strokeWidth="15"
                strokeLinecap="round"
              />
              <g transform="translate(266, 308)">{render3DHand(boneAngles.rightHandPose, true)}</g>
            </motion.g>
          </motion.g>

          {/* 3D NECK & AMBIENT SHADOW */}
          <rect x="147" y="174" width="26" height="30" rx="6" fill="#E2A988" />
          <path d="M 147 178 Q 160 186 173 178 Z" fill="#D99B7A" opacity="0.6" />

          {/* 3D HEAD & DYNAMIC FACIAL RIG */}
          <motion.g
            animate={{
              rotate: boneAngles.headRotate + boneAngles.headTilt,
              y: [0, -1, 0],
            }}
            transition={{ type: "spring", stiffness: 110, damping: 12 }}
            style={{ transformOrigin: "160px 180px" }}
          >
            <CharacterFace
              expression={expression}
              pupilOffset={pupilOffset}
              isBlinking={isBlinking}
              isSpeaking={isSpeaking}
              config={config}
            />
          </motion.g>
        </motion.g>
      </svg>

      {/* 3D CAMERA PALM EXTENSION */}
      <AnimatePresence>
        {isNoPeekActive && (
          <motion.div
            initial={{ scale: 0.2, opacity: 0, x: 100, y: 100 }}
            animate={{ scale: 4.6, opacity: 1, x: -60, y: -40 }}
            exit={{ scale: 0.2, opacity: 0, x: 100, y: 100 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-50 pointer-events-none drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)]"
            style={{ width: "180px", height: "180px", top: "15%", left: "15%" }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              <g>
                <path
                  d="M 90 90 L 50 50"
                  stroke="url(#skin3DGrad)"
                  strokeWidth="22"
                  strokeLinecap="round"
                />
                <ellipse
                  cx="45"
                  cy="45"
                  rx="26"
                  ry="24"
                  fill="url(#skin3DGrad)"
                  stroke="#E2A988"
                  strokeWidth="1.2"
                />
                <rect
                  x="20"
                  y="24"
                  width="7.5"
                  height="24"
                  rx="3.7"
                  transform="rotate(-28 24 36)"
                  fill="url(#skin3DGrad)"
                  stroke="#E2A988"
                  strokeWidth="1"
                />
                <rect
                  x="26"
                  y="11"
                  width="8"
                  height="28"
                  rx="4"
                  transform="rotate(-10 30 25)"
                  fill="url(#skin3DGrad)"
                  stroke="#E2A988"
                  strokeWidth="1"
                />
                <rect
                  x="39"
                  y="7"
                  width="8"
                  height="30"
                  rx="4"
                  fill="url(#skin3DGrad)"
                  stroke="#E2A988"
                  strokeWidth="1"
                />
                <rect
                  x="52"
                  y="11"
                  width="7.5"
                  height="27"
                  rx="3.7"
                  transform="rotate(10 56 24)"
                  fill="url(#skin3DGrad)"
                  stroke="#E2A988"
                  strokeWidth="1"
                />
                <rect
                  x="63"
                  y="22"
                  width="7"
                  height="22"
                  rx="3.5"
                  transform="rotate(26 67 33)"
                  fill="url(#skin3DGrad)"
                  stroke="#E2A988"
                  strokeWidth="1"
                />
                <rect x="24" y="42" width="42" height="13" rx="4" fill="#1E293B" opacity="0.95" />
                <text
                  x="45"
                  y="51"
                  textAnchor="middle"
                  fill="#38BDF8"
                  fontSize="6.5"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  NO PEEKING! 🙈
                </text>
              </g>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
