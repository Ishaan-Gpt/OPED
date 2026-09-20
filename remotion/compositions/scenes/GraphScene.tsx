import { interpolate, useCurrentFrame } from "remotion";

const CHALK = "#f3f1e7";

/** Animated line graph drawing itself across the frame. */
export function GraphScene({ accent }: { accent: string }) {
  const frame = useCurrentFrame();
  const points = [
    [30, 300],
    [110, 220],
    [180, 260],
    [250, 120],
    [320, 160],
    [370, 60],
  ];
  const progress = interpolate(frame, [0, 45], [0, points.length - 1], {
    extrapolateRight: "clamp",
  });

  const visiblePoints = points.filter((_, i) => i <= progress);
  const path = visiblePoints.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]} ${p[1]}`).join(" ");

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      <line x1="20" y1="330" x2="380" y2="330" stroke={CHALK} strokeWidth="2" opacity="0.4" />
      <line x1="30" y1="20" x2="30" y2="340" stroke={CHALK} strokeWidth="2" opacity="0.4" />
      <path
        d={path}
        fill="none"
        stroke={accent}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {visiblePoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill={accent} />
      ))}
    </svg>
  );
}
