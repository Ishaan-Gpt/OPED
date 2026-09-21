import { interpolate } from "remotion";
import type { SceneProps } from "../ExplainerClip";

const CHALK = "#f3f1e7";
const P = { x: 280, y: 200 }; // pole (mirror vertex)
const F = { x: 220, y: 200 }; // principal focus
const C = { x: 160, y: 200 }; // centre of curvature
const OBJ_X = 90;

/** A concave mirror that actually does what each beat describes: rays travel in, converge through F, form a real inverted image. */
export function ConcaveMirrorScene({ accent, beatIndex, beatLocalFrame }: SceneProps) {
  const phase = beatIndex % 4;
  const enter = interpolate(beatLocalFrame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const drawIn =
    phase === 0 ? interpolate(beatLocalFrame, [0, 25], [0, 1], { extrapolateRight: "clamp" }) : 1;

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      {/* Persistent set-up: curved reflecting surface + principal axis, always visible */}
      <path
        d="M280 100 Q250 200 280 300"
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
      <circle cx={F.x} cy={F.y} r="4" fill={accent} opacity={0.8 * drawIn} />
      <circle cx={C.x} cy={C.y} r="4" fill={CHALK} opacity={0.6 * drawIn} />
      {phase === 0 && (
        <>
          <text x={F.x - 6} y={F.y + 22} fill={accent} fontSize="13">
            F
          </text>
          <text x={C.x - 6} y={C.y + 22} fill={CHALK} fontSize="13" opacity="0.7">
            C
          </text>
        </>
      )}

      {/* Object: an upright arrow beyond C */}
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

      {/* Beat 1: a ray parallel to the axis travels in and reflects through F */}
      {phase >= 1 && (
        <g opacity={phase === 1 ? enter : 1}>
          <line
            x1={OBJ_X}
            y1="140"
            x2={
              phase === 1
                ? interpolate(beatLocalFrame, [0, 25], [OBJ_X, 265], { extrapolateRight: "clamp" })
                : 265
            }
            y2="140"
            stroke={accent}
            strokeWidth="3"
          />
          {phase >= 1 && (
            <line
              x1="265"
              y1="140"
              x2={
                phase === 1
                  ? interpolate(beatLocalFrame, [25, 45], [265, 190], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    })
                  : 190
              }
              y2={
                phase === 1
                  ? interpolate(beatLocalFrame, [25, 45], [140, 232], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    })
                  : 232
              }
              stroke={accent}
              strokeWidth="3"
            />
          )}
        </g>
      )}

      {/* Beat 2: a second ray through the pole reflects symmetrically, both converge */}
      {phase >= 2 && (
        <g opacity={phase === 2 ? enter : 1}>
          <line
            x1={OBJ_X}
            y1="140"
            x2={P.x}
            y2={P.y}
            stroke={CHALK}
            strokeWidth="2"
            opacity="0.6"
          />
          <line x1={P.x} y1={P.y} x2="190" y2="232" stroke={CHALK} strokeWidth="2" opacity="0.6" />
        </g>
      )}

      {/* Beat 3: the real, inverted image forms where the rays cross */}
      {phase === 3 && (
        <g opacity={enter}>
          <line x1="190" y1="200" x2="190" y2="232" stroke={accent} strokeWidth="3" />
          <path d="M185 228 L190 238 L195 228 Z" fill={accent} />
          <text x="140" y="270" fill={CHALK} fontSize="13">
            real, inverted image
          </text>
        </g>
      )}
    </svg>
  );
}
