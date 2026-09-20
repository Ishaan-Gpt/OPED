import { interpolate } from "remotion";
import type { SceneProps } from "../ExplainerClip";

/** Fallback for concepts without a dedicated illustration — still reacts per beat, not just idle motion. */
export function GenericScene({ accent, beatIndex, beatLocalFrame }: SceneProps) {
  const shapeCount = beatIndex + 1;
  const t = beatLocalFrame / 30;

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      <g transform="translate(200,200)">
        <circle
          r={interpolate(beatLocalFrame, [0, 20], [18, 26], { extrapolateRight: "clamp" })}
          fill={accent}
          opacity="0.9"
        />
        {Array.from({ length: shapeCount }, (_, i) => {
          const angle = t * (0.6 + i * 0.15) * 360 + i * 72;
          const rad = (angle * Math.PI) / 180;
          const r = 70 + i * 18;
          const x = Math.cos(rad) * r;
          const y = Math.sin(rad) * r * 0.6;
          const enter = interpolate(beatLocalFrame, [i * 5, i * 5 + 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={10 - i}
              fill={i % 2 === 0 ? accent : "#f3f1e7"}
              opacity={(0.85 - i * 0.1) * enter}
            />
          );
        })}
      </g>
    </svg>
  );
}
