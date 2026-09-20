import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoBrief } from "../types";

const BOARD = "#22312d";
const CHALK = "#f3f1e7";
const TEAL = "#2f9d8b";

/** Short board-styled explainer, driven entirely by the teacher's video brief. */
export function ExplainerClip({ title, bullets, accent = TEAL }: VideoBrief) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 16 } });
  const titleY = interpolate(titleIn, [0, 1], [24, 0]);
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const perBullet = 22;
  const bulletsStart = 20;

  return (
    <AbsoluteFill style={{ backgroundColor: BOARD, fontFamily: '"Outfit", system-ui, sans-serif' }}>
      <AbsoluteFill
        style={{
          border: `10px solid rgba(243,241,231,0.06)`,
          margin: 18,
          borderRadius: 24,
        }}
      />
      <AbsoluteFill style={{ padding: "8% 9%" }}>
        <div
          style={{
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: 58,
            color: CHALK,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            borderBottom: `3px solid ${accent}`,
            paddingBottom: 18,
            marginBottom: 36,
          }}
        >
          {title}
        </div>

        {bullets.slice(0, 4).map((bullet, i) => {
          const start = bulletsStart + i * perBullet;
          const localFrame = frame - start;
          const opacity = interpolate(localFrame, [0, 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const x = interpolate(localFrame, [0, 12], [-30, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 18,
                alignItems: "flex-start",
                opacity,
                transform: `translateX(${x}px)`,
                marginBottom: 22,
              }}
            >
              <span style={{ color: accent, fontSize: 34, lineHeight: "1.4" }}>◦</span>
              <span style={{ color: "rgba(243,241,231,0.92)", fontSize: 34, lineHeight: 1.4 }}>
                {bullet}
              </span>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

export default ExplainerClip;
