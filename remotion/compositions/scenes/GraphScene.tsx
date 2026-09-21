import { interpolate } from "remotion";
import type { SceneProps } from "../ExplainerClip";

const CHALK = "#f3f1e7";

const POINTS: [number, number][] = [
  [30, 300],
  [110, 220],
  [180, 260],
  [250, 120],
  [320, 160],
  [370, 60],
];

/** A graph that actually does what each beat describes: axes draw, points plot, line connects, trend highlighted. */
export function GraphScene({ accent, beatIndex, beatLocalFrame }: SceneProps) {
  const phase = beatIndex % 4;
  const axisIn = interpolate(beatLocalFrame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const pointsVisible =
    phase === 0
      ? 0
      : phase === 1
        ? Math.min(POINTS.length, Math.floor(beatLocalFrame / 8) + 1)
        : POINTS.length;
  const visiblePoints = POINTS.slice(0, pointsVisible);

  const drawProgress =
    phase >= 2 ? interpolate(beatLocalFrame, [0, 30], [0, 1], { extrapolateRight: "clamp" }) : 0;
  const drawnCount =
    phase === 2 ? Math.max(1, Math.round(drawProgress * (POINTS.length - 1)) + 1) : POINTS.length;
  const path = POINTS.slice(0, drawnCount)
    .map((p, i) => `${i === 0 ? "M" : "L"}${p[0]} ${p[1]}`)
    .join(" ");

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      <line
        x1="20"
        y1="330"
        x2="380"
        y2="330"
        stroke={CHALK}
        strokeWidth="2"
        opacity={0.4 * axisIn}
      />
      <line
        x1="30"
        y1="20"
        x2="30"
        y2="340"
        stroke={CHALK}
        strokeWidth="2"
        opacity={0.4 * axisIn}
      />

      {phase >= 1 &&
        visiblePoints.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill={accent} />)}

      {phase >= 2 && (
        <path
          d={path}
          fill="none"
          stroke={accent}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* Beat 3: highlight the steepest rise as the key trend */}
      {phase === 3 && (
        <g
          opacity={interpolate(beatLocalFrame, [5, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        >
          <line
            x1="180"
            y1="260"
            x2="250"
            y2="120"
            stroke={CHALK}
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.5"
          />
          <text x="255" y="110" fill={CHALK} fontSize="16">
            steepest rise
          </text>
        </g>
      )}
    </svg>
  );
}
