import { interpolate } from "remotion";
import type { SceneProps } from "../ExplainerClip";

const CHALK = "#f3f1e7";
const FOIL_X = 220;

/** Rutherford's gold foil experiment — the actual evidence for a small, dense, positive nucleus. */
export function RutherfordAtomScene({ accent, beatIndex, beatLocalFrame }: SceneProps) {
  const phase = beatIndex % 4;
  const enter = interpolate(beatLocalFrame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  // A thin foil of atoms — mostly empty space, each with a tiny dense nucleus.
  const nuclei = [140, 190, 240, 290].map((y) => ({ x: FOIL_X, y }));

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      <rect
        x={FOIL_X - 6}
        y="100"
        width="12"
        height="220"
        fill={`${CHALK}0d`}
        stroke={CHALK}
        strokeWidth="1.5"
        opacity="0.5"
      />
      {nuclei.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r="4" fill={accent} opacity="0.9" />
      ))}
      {phase === 0 && (
        <text x={FOIL_X - 40} y="90" fill={CHALK} fontSize="12" opacity={enter}>
          gold foil — mostly empty space
        </text>
      )}

      {/* Beat 0/1: a beam of alpha particles fired at the foil, most pass straight through */}
      {phase <= 1 &&
        [80, 130, 165, 230, 275, 320].map((y, i) => {
          const localT = (beatLocalFrame + i * 6) % 45;
          const x = interpolate(localT, [0, 45], [30, 370]);
          const op = interpolate(localT, [0, 6, 38, 45], [0, 1, 1, 0]);
          return <circle key={i} cx={x} cy={y} r="3.5" fill={CHALK} opacity={op} />;
        })}

      {/* Beat 2: a rare particle heading straight at a nucleus deflects sharply back */}
      {phase >= 2 && (
        <g opacity={phase === 2 ? enter : 1}>
          <line
            x1="30"
            y1="190"
            x2={FOIL_X}
            y2="190"
            stroke={accent}
            strokeWidth="3"
            strokeDasharray={phase === 2 ? "300" : "0"}
            strokeDashoffset={
              phase === 2
                ? interpolate(beatLocalFrame, [0, 20], [300, 0], { extrapolateRight: "clamp" })
                : 0
            }
          />
          <line
            x1={FOIL_X}
            y1="190"
            x2={
              phase === 2
                ? interpolate(beatLocalFrame, [20, 40], [FOIL_X, 60], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })
                : 60
            }
            y2={
              phase === 2
                ? interpolate(beatLocalFrame, [20, 40], [190, 90], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })
                : 90
            }
            stroke={accent}
            strokeWidth="3"
          />
        </g>
      )}

      {/* Beat 3: conclusion — mass is concentrated in a tiny, dense, positive nucleus */}
      {phase === 3 && (
        <g opacity={enter}>
          <circle cx={FOIL_X} cy="190" r="10" fill={accent} />
          <circle
            cx={FOIL_X}
            cy="190"
            r={interpolate(beatLocalFrame, [0, 25], [10, 40], { extrapolateRight: "clamp" })}
            fill="none"
            stroke={accent}
            strokeWidth="1.5"
            opacity={interpolate(beatLocalFrame, [0, 25], [0.7, 0], { extrapolateRight: "clamp" })}
          />
          <text x="140" y="330" fill={CHALK} fontSize="13">
            nucleus: tiny, dense, positive
          </text>
        </g>
      )}
    </svg>
  );
}
