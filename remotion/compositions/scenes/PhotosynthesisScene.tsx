import { interpolate, useCurrentFrame } from "remotion";

/** Animated sun rays hitting a leaf, producing glucose particles. */
export function PhotosynthesisScene({ accent }: { accent: string }) {
  const frame = useCurrentFrame();
  const rayCount = 5;

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      <circle cx="330" cy="70" r="34" fill="#f2c94c" opacity="0.9" />
      {Array.from({ length: rayCount }, (_, i) => {
        const t = (frame + i * 8) % 40;
        const opacity = interpolate(t, [0, 8, 32, 40], [0, 0.8, 0.8, 0]);
        const x1 = 300 - i * 8;
        const y1 = 95 + i * 10;
        const x2 = interpolate(t, [0, 40], [x1, 210]);
        const y2 = interpolate(t, [0, 40], [y1, 200]);
        return <circle key={i} cx={x2} cy={y2} r="4" fill="#f2c94c" opacity={opacity} />;
      })}
      <path
        d="M210 260 C140 260 90 210 90 150 C160 150 210 190 210 260 Z"
        fill={accent}
        opacity="0.85"
      />
      <path
        d="M210 260 C210 190 160 150 90 150"
        fill="none"
        stroke="#f3f1e7"
        strokeWidth="2"
        opacity="0.4"
      />
      {Array.from({ length: 4 }, (_, i) => {
        const t = (frame + i * 12) % 48;
        const opacity = interpolate(t, [0, 8, 36, 48], [0, 1, 1, 0]);
        const x = interpolate(t, [0, 48], [170, 260 + i * 20]);
        const y = interpolate(t, [0, 48], [220, 320]);
        return <circle key={i} cx={x} cy={y} r="6" fill="#f3f1e7" opacity={opacity} />;
      })}
    </svg>
  );
}
