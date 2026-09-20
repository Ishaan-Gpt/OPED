import { useCurrentFrame, useVideoConfig } from "remotion";

/** Fallback: gently orbiting abstract shapes, for concepts without a dedicated illustration. */
export function GenericScene({ accent }: { accent: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const shapes = [0, 1, 2, 3, 4];

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      <g transform="translate(200,200)">
        {shapes.map((i) => {
          const angle = t * (0.6 + i * 0.15) * 360 + i * 72;
          const rad = (angle * Math.PI) / 180;
          const r = 70 + i * 18;
          const x = Math.cos(rad) * r;
          const y = Math.sin(rad) * r * 0.6;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={10 - i}
              fill={i % 2 === 0 ? accent : "#f3f1e7"}
              opacity={0.85 - i * 0.1}
            />
          );
        })}
        <circle r="26" fill={accent} opacity="0.9" />
      </g>
    </svg>
  );
}
