import { interpolate } from "remotion";
import type { SceneProps } from "../ExplainerClip";

const CHALK = "#f3f1e7";
const VIBGYOR = ["#8b5cf6", "#4f46e5", "#2563eb", "#16a34a", "#eab308", "#f97316", "#dc2626"];
const PRISM_X = 210;

/** A prism that actually does what each beat describes: white light travels in, enters and refracts, spectrum fans out, violet/red compared. */
export function PrismScene({ accent, beatIndex, beatLocalFrame }: SceneProps) {
  const phase = beatIndex % 4;
  const enter = interpolate(beatLocalFrame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      <path
        d={`M${PRISM_X} 130 L${PRISM_X + 60} 260 L${PRISM_X - 60} 260 Z`}
        fill="rgba(243,241,231,0.08)"
        stroke={accent}
        strokeWidth="2"
        opacity="0.8"
      />

      {/* Beat 0: a beam of white light travels toward the prism */}
      {phase === 0 && (
        <line
          x1="30"
          y1="200"
          x2={interpolate(beatLocalFrame, [0, 30], [30, PRISM_X - 30], {
            extrapolateRight: "clamp",
          })}
          y2="200"
          stroke={CHALK}
          strokeWidth="4"
          opacity={enter}
        />
      )}

      {/* Beat 1: it enters the prism and refracts, bending toward the base */}
      {phase >= 1 && (
        <line
          x1="30"
          y1="200"
          x2={PRISM_X - 30}
          y2="200"
          stroke={CHALK}
          strokeWidth="4"
          opacity="0.85"
        />
      )}
      {phase === 1 && (
        <line
          x1={PRISM_X - 30}
          y1="200"
          x2={interpolate(beatLocalFrame, [10, 35], [PRISM_X - 30, PRISM_X + 15], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          y2={interpolate(beatLocalFrame, [10, 35], [200, 215], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          stroke={CHALK}
          strokeWidth="4"
          opacity={enter}
        />
      )}

      {/* Beat 2: the spectrum fans out on exit — VIBGYOR */}
      {phase >= 2 && (
        <line
          x1={PRISM_X - 30}
          y1="200"
          x2={PRISM_X + 15}
          y2="215"
          stroke={CHALK}
          strokeWidth="4"
          opacity="0.85"
        />
      )}
      {phase >= 2 &&
        VIBGYOR.map((c, i) => {
          const localEnter =
            phase === 2
              ? interpolate(beatLocalFrame, [i * 3, i * 3 + 14], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : 1;
          const spread = phase === 3 && (i === 0 || i === 6) ? 1.3 : 1;
          return (
            <line
              key={c}
              x1={PRISM_X + 15}
              y1="215"
              x2={PRISM_X + 15 + (150 + i * 9 * spread)}
              y2={215 + (i - 3) * 7 * spread}
              stroke={c}
              strokeWidth="3"
              opacity={localEnter}
            />
          );
        })}

      {/* Beat 3: compare violet (bends most) vs red (bends least) */}
      {phase === 3 && (
        <g
          opacity={interpolate(beatLocalFrame, [15, 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        >
          <text x="240" y="150" fill={VIBGYOR[0]} fontSize="13">
            violet — bends most
          </text>
          <text x="240" y="290" fill={VIBGYOR[6]} fontSize="13">
            red — bends least
          </text>
        </g>
      )}
    </svg>
  );
}
