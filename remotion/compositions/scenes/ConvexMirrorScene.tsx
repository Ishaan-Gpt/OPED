import { interpolate } from "remotion";
import type { SceneProps } from "../ExplainerClip";

const CHALK = "#f3f1e7";
const P = { x: 280, y: 200 }; // pole (mirror vertex)
const F_BEHIND = { x: 330, y: 200 }; // virtual focus, behind the mirror
const OBJ_X = 90;

/** A convex mirror that actually does what each beat describes: rays diverge outward, tracing back to a virtual focus, forming a virtual upright image. */
export function ConvexMirrorScene({ accent, beatIndex, beatLocalFrame }: SceneProps) {
  const phase = beatIndex % 4;
  const enter = interpolate(beatLocalFrame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const drawIn =
    phase === 0 ? interpolate(beatLocalFrame, [0, 25], [0, 1], { extrapolateRight: "clamp" }) : 1;

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      {/* Persistent set-up: curved reflecting surface bulging toward the object + axis */}
      <path
        d="M280 100 Q310 200 280 300"
        fill="none"
        stroke={CHALK}
        strokeWidth="4"
        opacity="0.85"
      />
      <line
        x1="40"
        y1="200"
        x2="360"
        y2="200"
        stroke={CHALK}
        strokeWidth="1.5"
        strokeDasharray="4 6"
        opacity="0.35"
      />
      <circle cx={F_BEHIND.x} cy={F_BEHIND.y} r="4" fill={accent} opacity={0.7 * drawIn} />
      {phase === 0 && (
        <text x={F_BEHIND.x - 6} y={F_BEHIND.y + 22} fill={accent} fontSize="13" opacity="0.85">
          F (virtual)
        </text>
      )}

      {/* Object: an upright arrow */}
      <line
        x1={OBJ_X}
        y1="200"
        x2={OBJ_X}
        y2="140"
        stroke={CHALK}
        strokeWidth="3"
        opacity={drawIn}
      />
      <path
        d={`M${OBJ_X - 5} 148 L${OBJ_X} 138 L${OBJ_X + 5} 148 Z`}
        fill={CHALK}
        opacity={drawIn}
      />

      {/* Beat 1: a ray parallel to the axis travels toward the mirror */}
      {phase >= 1 && (
        <line
          x1={OBJ_X}
          y1="140"
          x2={
            phase === 1
              ? interpolate(beatLocalFrame, [0, 30], [OBJ_X, 273], { extrapolateRight: "clamp" })
              : 273
          }
          y2="140"
          stroke={accent}
          strokeWidth="3"
          opacity={phase === 1 ? enter : 1}
        />
      )}

      {/* Beat 2: it reflects outward, diverging — dashed line traces back to the virtual focus */}
      {phase >= 2 && (
        <g opacity={phase === 2 ? enter : 1}>
          <line x1="273" y1="140" x2="355" y2="95" stroke={accent} strokeWidth="3" />
          <line
            x1="273"
            y1="140"
            x2={F_BEHIND.x}
            y2={F_BEHIND.y}
            stroke={accent}
            strokeWidth="1.5"
            strokeDasharray="3 5"
            opacity="0.6"
          />
        </g>
      )}

      {/* Beat 3: the virtual, upright, diminished image forms behind the mirror */}
      {phase === 3 && (
        <g opacity={enter}>
          <line
            x1="300"
            y1="200"
            x2="300"
            y2="172"
            stroke={accent}
            strokeWidth="2.5"
            strokeDasharray="3 4"
          />
          <path d="M296 176 L300 168 L304 176 Z" fill={accent} opacity="0.85" />
          <text x="200" y="250" fill={CHALK} fontSize="12" textAnchor="middle">
            virtual, upright, smaller image
          </text>
        </g>
      )}
    </svg>
  );
}
