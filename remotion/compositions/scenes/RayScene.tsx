import { interpolate, useCurrentFrame } from "remotion";

const CHALK = "#f3f1e7";

/** Animated ray of light hitting a mirror and reflecting off at an equal angle. */
export function RayScene({ accent }: { accent: string }) {
  const frame = useCurrentFrame();
  // Loops the whole bounce every 75 frames so it keeps demonstrating on longer clips
  // instead of freezing after the first pass.
  const cycle = frame % 75;
  const t = interpolate(cycle, [0, 35], [0, 1], { extrapolateRight: "clamp" });
  const mirrorX = 260;
  const hitY = 200;
  const inX = interpolate(t, [0, 1], [40, mirrorX]);
  const inY = interpolate(t, [0, 1], [60, hitY]);
  const outT = interpolate(cycle, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outX = interpolate(outT, [0, 1], [mirrorX, 40]);
  const outY = interpolate(outT, [0, 1], [hitY, 340]);

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      <line
        x1={mirrorX}
        y1="40"
        x2={mirrorX}
        y2="360"
        stroke={CHALK}
        strokeWidth="4"
        opacity="0.4"
      />
      <line
        x1={mirrorX - 60}
        y1={hitY}
        x2={mirrorX + 60}
        y2={hitY}
        stroke={CHALK}
        strokeDasharray="4 6"
        opacity="0.3"
      />
      <line
        x1="40"
        y1="60"
        x2={inX}
        y2={inY}
        stroke={accent}
        strokeWidth="5"
        strokeLinecap="round"
      />
      {outT > 0 && (
        <line
          x1={mirrorX}
          y1={hitY}
          x2={outX}
          y2={outY}
          stroke={accent}
          strokeWidth="5"
          strokeLinecap="round"
        />
      )}
      <circle cx={mirrorX} cy={hitY} r="6" fill={CHALK} />
    </svg>
  );
}
