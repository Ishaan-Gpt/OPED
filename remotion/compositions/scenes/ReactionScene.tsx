import { interpolate } from "remotion";
import type { SceneProps } from "../ExplainerClip";

const CHALK = "#f3f1e7";

const TUBE_OUTLINE = "M20 0 L20 140 L0 200 Q0 230 40 230 L60 230 Q100 230 100 200 L80 140 L80 0";
const TUBE_CLIP = "M22 5 L22 140 L2 200 Q2 227 40 227 L60 227 Q98 227 98 200 L78 140 L78 5 Z";

/** A test tube that actually does what each beat describes: pour, mix, fizz, settle. */
export function ReactionScene({ accent, beatIndex, beatLocalFrame }: SceneProps) {
  const phase = beatIndex % 4;
  const enter = interpolate(beatLocalFrame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  // Fill level grows a bit at each phase so the tube visibly progresses across the clip.
  const baseFill = 15 + phase * 22;

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      <g transform="translate(150,60)">
        <path d={TUBE_OUTLINE} fill="none" stroke="rgba(243,241,231,0.5)" strokeWidth="4" />
        <clipPath id="tube-clip-2">
          <path d={TUBE_CLIP} />
        </clipPath>
        <g clipPath="url(#tube-clip-2)">
          <rect
            x="0"
            y={230 - baseFill * 2}
            width="100"
            height="260"
            fill={accent}
            opacity="0.75"
          />
        </g>
      </g>

      {/* Beat 0: reagent being poured in from above */}
      {phase === 0 && (
        <g opacity={enter}>
          <rect
            x="205"
            y="0"
            width="10"
            height={interpolate(beatLocalFrame, [0, 40], [0, 90], { extrapolateRight: "clamp" })}
            fill={accent}
            opacity="0.8"
            rx="4"
          />
          <ellipse
            cx="210"
            cy="20"
            rx="20"
            ry="10"
            fill={accent}
            opacity="0.5"
            transform="rotate(-15 210 20)"
          />
        </g>
      )}

      {/* Beat 1: swirling mix */}
      {phase === 1 && (
        <g opacity={enter} transform="translate(200,180)">
          {[0, 1, 2].map((i) => {
            const angle = (beatLocalFrame * 4 + i * 120) % 360;
            const rad = (angle * Math.PI) / 180;
            return (
              <circle
                key={i}
                cx={Math.cos(rad) * 22}
                cy={Math.sin(rad) * 12}
                r="6"
                fill={CHALK}
                opacity="0.7"
              />
            );
          })}
        </g>
      )}

      {/* Beat 2: fizzing bubbles */}
      {phase === 2 && (
        <g opacity={enter}>
          {[0, 7, 14, 3, 20, 11, 25, 17].map((seed, i) => {
            const t = (beatLocalFrame + seed * 6) % 60;
            const y = interpolate(t, [0, 60], [270, 90]);
            const op = interpolate(t, [0, 10, 50, 60], [0, 0.9, 0.9, 0]);
            const x = 170 + ((seed * 37) % 60);
            return <circle key={i} cx={x} cy={y} r={4 + (seed % 3)} fill={CHALK} opacity={op} />;
          })}
        </g>
      )}

      {/* Beat 3: settled — glow ring confirms the reaction is complete */}
      {phase === 3 && (
        <g opacity={enter}>
          <circle
            cx="200"
            cy="180"
            r={interpolate(beatLocalFrame, [0, 30], [10, 70], { extrapolateRight: "clamp" })}
            fill="none"
            stroke={accent}
            strokeWidth="2"
            opacity={interpolate(beatLocalFrame, [0, 15, 30], [0.8, 0.3, 0], {
              extrapolateRight: "clamp",
            })}
          />
        </g>
      )}
    </svg>
  );
}
