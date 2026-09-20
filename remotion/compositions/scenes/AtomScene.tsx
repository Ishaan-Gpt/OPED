import { useCurrentFrame, useVideoConfig } from "remotion";

const CHALK = "#f3f1e7";

/** Animated atom: nucleus with electrons orbiting on tilted rings. */
export function AtomScene({ accent }: { accent: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const rings = [
    { r: 90, tilt: 0, speed: 1.4, dotCount: 2 },
    { r: 90, tilt: 60, speed: -1.1, dotCount: 2 },
    { r: 90, tilt: -60, speed: 1.8, dotCount: 1 },
  ];

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      <g transform="translate(200,200)">
        <circle r="22" fill={accent} opacity="0.9" />
        {rings.map((ring, i) => (
          <g key={i} transform={`rotate(${ring.tilt})`}>
            <ellipse
              rx={ring.r}
              ry={ring.r * 0.4}
              fill="none"
              stroke={CHALK}
              strokeWidth="1.5"
              opacity="0.35"
            />
            {Array.from({ length: ring.dotCount }, (_, d) => {
              const angle = t * ring.speed * 360 + d * (360 / ring.dotCount);
              const rad = (angle * Math.PI) / 180;
              const ex = Math.cos(rad) * ring.r;
              const ey = Math.sin(rad) * ring.r * 0.4;
              return <circle key={d} cx={ex} cy={ey} r="7" fill={CHALK} />;
            })}
          </g>
        ))}
      </g>
    </svg>
  );
}
