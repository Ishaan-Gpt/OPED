import { interpolate, useCurrentFrame } from "remotion";

const CHALK = "#f3f1e7";

/** Animated test-tube reaction: liquid rises, bubbles fizz, color shifts. */
export function ReactionScene({ accent }: { accent: string }) {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [0, 40], [10, 95], { extrapolateRight: "clamp" });
  const bubbleSeeds = [0, 7, 14, 3, 20, 11, 25, 17];

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      <g transform="translate(150,60)">
        <path
          d="M20 0 L20 140 L0 200 Q0 230 40 230 L60 230 Q100 230 100 200 L80 140 L80 0"
          fill="none"
          stroke="rgba(243,241,231,0.5)"
          strokeWidth="4"
        />
        <clipPath id="tube-clip">
          <path d="M22 5 L22 140 L2 200 Q2 227 40 227 L60 227 Q98 227 98 200 L78 140 L78 5 Z" />
        </clipPath>
        <g clipPath="url(#tube-clip)">
          <rect x="0" y={230 - fill * 2} width="100" height="260" fill={accent} opacity="0.75" />
          {bubbleSeeds.map((seed, i) => {
            const t = (frame + seed * 6) % 60;
            const y = interpolate(t, [0, 60], [220, 230 - fill * 2 - 10]);
            const op = interpolate(t, [0, 10, 50, 60], [0, 0.9, 0.9, 0]);
            const x = 20 + ((seed * 37) % 60);
            return <circle key={i} cx={x} cy={y} r={4 + (seed % 3)} fill={CHALK} opacity={op} />;
          })}
        </g>
      </g>
    </svg>
  );
}
