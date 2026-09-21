import { interpolate } from "remotion";
import type { SceneProps } from "../ExplainerClip";

const CHALK = "#f3f1e7";

/** A cell that actually does what each beat describes: membrane forms, nucleus appears, organelles fill in, all labelled. */
export function CellScene({ accent, beatIndex, beatLocalFrame }: SceneProps) {
  const phase = beatIndex % 4;
  const enter = interpolate(beatLocalFrame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const membraneR = interpolate(phase === 0 ? beatLocalFrame : 30, [0, 30], [10, 130], {
    extrapolateRight: "clamp",
  });

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      {/* Beat 0: the cell membrane forms */}
      <circle
        cx="200"
        cy="200"
        r={membraneR}
        fill="none"
        stroke={accent}
        strokeWidth="4"
        opacity={phase === 0 ? 1 : 0.6}
      />

      {/* Beat 1: the nucleus appears at the centre */}
      {phase >= 1 && (
        <circle
          cx="200"
          cy="200"
          r={
            phase === 1
              ? interpolate(beatLocalFrame, [0, 25], [4, 34], { extrapolateRight: "clamp" })
              : 34
          }
          fill={accent}
          opacity={phase === 1 ? enter : 0.9}
        />
      )}

      {/* Beat 2: organelles (mitochondria) populate the cytoplasm */}
      {phase >= 2 &&
        [
          [130, 140],
          [270, 150],
          [140, 260],
          [260, 270],
        ].map(([x, y], i) => {
          const localEnter =
            phase === 2
              ? interpolate(beatLocalFrame, [i * 6, i * 6 + 15], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : 1;
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="16"
              ry="9"
              fill={CHALK}
              opacity={0.75 * localEnter}
              transform={`rotate(${i * 40} ${x} ${y})`}
            />
          );
        })}

      {/* Beat 3: labelled recap */}
      {phase === 3 && (
        <text
          x="200"
          y="350"
          fill={CHALK}
          fontSize="16"
          textAnchor="middle"
          opacity={interpolate(beatLocalFrame, [10, 25], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        >
          membrane · nucleus · mitochondria
        </text>
      )}
    </svg>
  );
}
