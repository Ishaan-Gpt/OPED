import { interpolate } from "remotion";
import type { SceneProps } from "../ExplainerClip";

const CHALK = "#f3f1e7";
const MIRROR_X = 260;
const HIT_Y = 200;

/** A ray that actually does what each beat describes: approach, reflect, angle out, confirm equal. */
export function RayScene({ accent, beatIndex, beatLocalFrame }: SceneProps) {
  const phase = beatIndex % 4;
  const enter = interpolate(beatLocalFrame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      <line
        x1={MIRROR_X}
        y1="40"
        x2={MIRROR_X}
        y2="360"
        stroke={CHALK}
        strokeWidth="4"
        opacity="0.4"
      />

      {/* Beat 0: incident ray travels toward the mirror */}
      {phase === 0 && (
        <g opacity={enter}>
          <line
            x1="40"
            y1="60"
            x2={interpolate(beatLocalFrame, [0, 40], [40, MIRROR_X], { extrapolateRight: "clamp" })}
            y2={interpolate(beatLocalFrame, [0, 40], [60, HIT_Y], { extrapolateRight: "clamp" })}
            stroke={accent}
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* Beat 1: reflection off the mirror */}
      {phase === 1 && (
        <g opacity={enter}>
          <line
            x1="40"
            y1="60"
            x2={MIRROR_X}
            y2={HIT_Y}
            stroke={accent}
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.5"
          />
          <line
            x1={MIRROR_X}
            y1={HIT_Y}
            x2={interpolate(beatLocalFrame, [0, 40], [MIRROR_X, 40], { extrapolateRight: "clamp" })}
            y2={interpolate(beatLocalFrame, [0, 40], [HIT_Y, 340], { extrapolateRight: "clamp" })}
            stroke={accent}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx={MIRROR_X} cy={HIT_Y} r="6" fill={CHALK} />
        </g>
      )}

      {/* Beat 2: the normal line and both angles are drawn */}
      {phase === 2 && (
        <g opacity={enter}>
          <line
            x1="40"
            y1="60"
            x2={MIRROR_X}
            y2={HIT_Y}
            stroke={accent}
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.85"
          />
          <line
            x1={MIRROR_X}
            y1={HIT_Y}
            x2="40"
            y2="340"
            stroke={accent}
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.85"
          />
          <line
            x1={MIRROR_X - 60}
            y1={HIT_Y}
            x2={MIRROR_X + 60}
            y2={HIT_Y}
            stroke={CHALK}
            strokeDasharray="4 6"
            opacity={interpolate(beatLocalFrame, [0, 20], [0, 0.6], { extrapolateRight: "clamp" })}
          />
          <text
            x={MIRROR_X - 55}
            y={HIT_Y - 55}
            fill={CHALK}
            fontSize="16"
            opacity={interpolate(beatLocalFrame, [15, 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          >
            i
          </text>
          <text
            x={MIRROR_X - 55}
            y={HIT_Y + 70}
            fill={CHALK}
            fontSize="16"
            opacity={interpolate(beatLocalFrame, [20, 35], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          >
            r
          </text>
          <circle cx={MIRROR_X} cy={HIT_Y} r="6" fill={CHALK} />
        </g>
      )}

      {/* Beat 3: confirmed — angle of incidence equals angle of reflection */}
      {phase === 3 && (
        <g opacity={enter}>
          <line
            x1="40"
            y1="60"
            x2={MIRROR_X}
            y2={HIT_Y}
            stroke={accent}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1={MIRROR_X}
            y1={HIT_Y}
            x2="40"
            y2="340"
            stroke={accent}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx={MIRROR_X} cy={HIT_Y} r="6" fill={CHALK} />
          <text
            x={MIRROR_X - 40}
            y={HIT_Y}
            fill={CHALK}
            fontSize="20"
            fontWeight="700"
            opacity={interpolate(beatLocalFrame, [10, 25], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          >
            i = r
          </text>
        </g>
      )}
    </svg>
  );
}
