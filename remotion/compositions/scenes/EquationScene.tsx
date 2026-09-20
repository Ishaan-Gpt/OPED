import { interpolate } from "remotion";
import type { SceneProps } from "../ExplainerClip";

const CHALK = "#f3f1e7";

/** An equation that actually does what each beat describes: appears, a step is applied, another step, the answer is isolated. */
export function EquationScene({ accent, beatIndex, beatLocalFrame }: SceneProps) {
  const phase = beatIndex % 4;
  const enter = interpolate(beatLocalFrame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  const lines = ["2x + 3 = 7", "2x = 7 − 3", "2x = 4", "x = 2"];
  const visibleLine = lines[Math.min(phase, lines.length - 1)];

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      <g transform="translate(200,200)">
        {/* Each step replaces the previous, styled like chalk being rewritten on a board */}
        <text
          x="0"
          y="0"
          fill={phase === 3 ? accent : CHALK}
          fontSize="42"
          fontWeight="700"
          textAnchor="middle"
          opacity={enter}
          fontFamily='"Fraunces", Georgia, serif'
        >
          {visibleLine}
        </text>

        {/* Beat 1/2: underline the term being operated on */}
        {(phase === 1 || phase === 2) && (
          <line
            x1="-60"
            y1="16"
            x2="60"
            y2="16"
            stroke={accent}
            strokeWidth="3"
            opacity={interpolate(beatLocalFrame, [10, 25], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          />
        )}

        {/* Beat 3: a box highlights the final answer */}
        {phase === 3 && (
          <rect
            x="-50"
            y="-34"
            width="100"
            height="50"
            rx="10"
            fill="none"
            stroke={accent}
            strokeWidth="2.5"
            opacity={interpolate(beatLocalFrame, [10, 25], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          />
        )}
      </g>
    </svg>
  );
}
