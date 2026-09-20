import { interpolate } from "remotion";
import type { SceneProps } from "../ExplainerClip";

const CHALK = "#f3f1e7";

/** An atom that actually does what each beat describes: nucleus forms, shells fill in order. */
export function AtomScene({ accent, beatIndex, beatLocalFrame }: SceneProps) {
  const phase = beatIndex % 4;
  const t = beatLocalFrame / 30;
  const nucleusScale =
    phase === 0 ? interpolate(beatLocalFrame, [0, 30], [0.3, 1], { extrapolateRight: "clamp" }) : 1;

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      <g transform="translate(200,200)">
        {/* Beat 0: the nucleus assembles from separate protons/neutrons */}
        {phase === 0 ? (
          [0, 1, 2, 3, 4].map((i) => {
            const angle = (i / 5) * Math.PI * 2;
            const startR = 60;
            const r = interpolate(beatLocalFrame, [0, 30], [startR, 4], {
              extrapolateRight: "clamp",
            });
            return (
              <circle
                key={i}
                cx={Math.cos(angle + i) * r}
                cy={Math.sin(angle + i) * r}
                r="8"
                fill={i % 2 === 0 ? accent : CHALK}
                opacity="0.9"
              />
            );
          })
        ) : (
          <circle r="22" fill={accent} opacity="0.9" transform={`scale(${nucleusScale})`} />
        )}

        {/* Beat 1: first shell appears and its electrons orbit in */}
        {phase >= 1 && (
          <g
            opacity={
              phase === 1
                ? interpolate(beatLocalFrame, [0, 20], [0, 1], { extrapolateRight: "clamp" })
                : 1
            }
          >
            <ellipse rx="90" ry="36" fill="none" stroke={CHALK} strokeWidth="1.5" opacity="0.35" />
            {[0, 1].map((i) => {
              const angle = t * 1.4 * 360 + i * 180;
              const rad = (angle * Math.PI) / 180;
              return (
                <circle
                  key={i}
                  cx={Math.cos(rad) * 90}
                  cy={Math.sin(rad) * 36}
                  r="7"
                  fill={CHALK}
                />
              );
            })}
          </g>
        )}

        {/* Beat 2: second shell appears and fills */}
        {phase >= 2 && (
          <g
            transform="rotate(60)"
            opacity={
              phase === 2
                ? interpolate(beatLocalFrame, [0, 20], [0, 1], { extrapolateRight: "clamp" })
                : 1
            }
          >
            <ellipse rx="90" ry="36" fill="none" stroke={CHALK} strokeWidth="1.5" opacity="0.35" />
            {[0, 1, 2, 3].map((i) => {
              const angle = t * -1.1 * 360 + i * 90;
              const rad = (angle * Math.PI) / 180;
              return (
                <circle
                  key={i}
                  cx={Math.cos(rad) * 90}
                  cy={Math.sin(rad) * 36}
                  r="6"
                  fill={CHALK}
                />
              );
            })}
          </g>
        )}

        {/* Beat 3: labelled recap — shell electron counts */}
        {phase === 3 && (
          <text
            x="0"
            y="130"
            fill={CHALK}
            fontSize="16"
            textAnchor="middle"
            opacity={interpolate(beatLocalFrame, [10, 25], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          >
            K = 2, L = 4
          </text>
        )}
      </g>
    </svg>
  );
}
