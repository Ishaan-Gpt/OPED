import { interpolate } from "remotion";
import type { SceneProps } from "../ExplainerClip";

const CHALK = "#f3f1e7";
const INTERFACE_Y = 200;
const HIT_X = 200;

/** Light refracting between media — actually does what each beat describes: approach, bend at the boundary, angle labels, conclusion. */
export function RefractionScene({ accent, beatIndex, beatLocalFrame }: SceneProps) {
  const phase = beatIndex % 4;
  const enter = interpolate(beatLocalFrame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      {/* Two media: air above, denser medium (water/glass) below */}
      <rect x="20" y="100" width="360" height="100" fill={`${CHALK}05`} />
      <rect x="20" y={INTERFACE_Y} width="360" height="100" fill={`${accent}18`} />
      <line
        x1="20"
        y1={INTERFACE_Y}
        x2="380"
        y2={INTERFACE_Y}
        stroke={CHALK}
        strokeWidth="2"
        opacity="0.5"
      />
      {phase === 0 && (
        <>
          <text x="30" y="115" fill={CHALK} fontSize="12" opacity="0.6">
            air
          </text>
          <text x="30" y="290" fill={CHALK} fontSize="12" opacity="0.6">
            water / glass
          </text>
        </>
      )}

      {/* Beat 0: the ray travels through air toward the boundary */}
      {phase === 0 && (
        <line
          x1="60"
          y1="110"
          x2={interpolate(beatLocalFrame, [0, 30], [60, HIT_X], { extrapolateRight: "clamp" })}
          y2={interpolate(beatLocalFrame, [0, 30], [110, INTERFACE_Y], {
            extrapolateRight: "clamp",
          })}
          stroke={accent}
          strokeWidth="4"
          opacity={enter}
        />
      )}

      {/* Beat 1: it bends toward the normal as it enters the denser medium */}
      {phase >= 1 && (
        <line
          x1="60"
          y1="110"
          x2={HIT_X}
          y2={INTERFACE_Y}
          stroke={accent}
          strokeWidth="4"
          opacity="0.85"
        />
      )}
      {phase === 1 && (
        <line
          x1={HIT_X}
          y1={INTERFACE_Y}
          x2={interpolate(beatLocalFrame, [10, 35], [HIT_X, 260], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          y2={interpolate(beatLocalFrame, [10, 35], [INTERFACE_Y, 300], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          stroke={accent}
          strokeWidth="4"
          opacity={enter}
        />
      )}

      {/* Beat 2: normal line + both angles labelled */}
      {phase >= 2 && (
        <line
          x1={HIT_X}
          y1={INTERFACE_Y}
          x2="260"
          y2="300"
          stroke={accent}
          strokeWidth="4"
          opacity="0.85"
        />
      )}
      {phase === 2 && (
        <g opacity={enter}>
          <line
            x1={HIT_X}
            y1="120"
            x2={HIT_X}
            y2="280"
            stroke={CHALK}
            strokeWidth="1.5"
            strokeDasharray="4 6"
            opacity="0.5"
          />
          <text x={HIT_X + 10} y="150" fill={CHALK} fontSize="14">
            i
          </text>
          <text x={HIT_X + 10} y="250" fill={CHALK} fontSize="14">
            r (smaller)
          </text>
        </g>
      )}

      {/* Beat 3: conclusion — bends toward normal, slows down */}
      {phase === 3 && (
        <g opacity={enter}>
          <line
            x1={HIT_X}
            y1="120"
            x2={HIT_X}
            y2="280"
            stroke={CHALK}
            strokeWidth="1.5"
            strokeDasharray="4 6"
            opacity="0.4"
          />
          <line x1="60" y1="110" x2={HIT_X} y2={INTERFACE_Y} stroke={accent} strokeWidth="4" />
          <line x1={HIT_X} y1={INTERFACE_Y} x2="260" y2="300" stroke={accent} strokeWidth="4" />
          <text x="120" y="345" fill={CHALK} fontSize="13">
            slows down, bends toward normal
          </text>
        </g>
      )}
    </svg>
  );
}
