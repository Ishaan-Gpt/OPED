import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoBrief, VisualKind } from "../types";
import { ReactionScene } from "./scenes/ReactionScene";
import { RayScene } from "./scenes/RayScene";
import { AtomScene } from "./scenes/AtomScene";
import { PhotosynthesisScene } from "./scenes/PhotosynthesisScene";
import { GraphScene } from "./scenes/GraphScene";
import { GenericScene } from "./scenes/GenericScene";

const BOARD = "#1a2624";
const CHALK = "#f3f1e7";
const TEAL = "#2f9d8b";

const SCENES: Record<VisualKind, (props: { accent: string }) => JSX.Element> = {
  reaction: ReactionScene,
  ray: RayScene,
  atom: AtomScene,
  photosynthesis: PhotosynthesisScene,
  graph: GraphScene,
  generic: GenericScene,
};

/** Fades a child in/out around [start, end] with a soft crossfade window. */
function useCrossfade(start: number, end: number, fade = 10) {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + fade, end - fade, end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function Backdrop({ accent }: { accent: string }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const kenBurns = interpolate(frame, [0, durationInFrames], [1, 1.08]);
  const drift = interpolate(frame, [0, durationInFrames], [-10, 10]);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 40%, ${accent}33 0%, ${BOARD} 70%)`,
        transform: `scale(${kenBurns}) translateX(${drift}px)`,
      }}
    >
      {Array.from({ length: 14 }, (_, i) => {
        const seed = i * 53;
        const x = (seed % 100) + Math.sin((frame + seed) / 40) * 3;
        const y = ((seed * 7) % 100) + Math.cos((frame + seed) / 50) * 3;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: 3 + (i % 3),
              height: 3 + (i % 3),
              borderRadius: "50%",
              background: CHALK,
              opacity: 0.12,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
}

/** Cinematic multi-scene explainer, driven entirely by the teacher's video brief. */
export function ExplainerClip({
  title,
  bullets,
  accent = TEAL,
  visualKind = "generic",
}: VideoBrief) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const introEnd = Math.min(45, Math.round(durationInFrames * 0.28));
  const outroStart = durationInFrames - Math.min(55, Math.round(durationInFrames * 0.32));
  const Scene = SCENES[visualKind] ?? SCENES.generic;

  const introOpacity = useCrossfade(0, introEnd);
  const introScale = spring({ frame, fps, config: { damping: 14 } });

  const visualOpacity = useCrossfade(introEnd - 10, outroStart + 10);
  const visualScale = interpolate(frame, [introEnd, outroStart], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const outroOpacity = useCrossfade(outroStart, durationInFrames);

  return (
    <AbsoluteFill style={{ backgroundColor: BOARD, fontFamily: '"Outfit", system-ui, sans-serif' }}>
      <Backdrop accent={accent} />

      {/* Scene 1: title */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: introOpacity,
          padding: "0 10%",
        }}
      >
        <div
          style={{
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: 54,
            textAlign: "center",
            color: CHALK,
            transform: `scale(${0.8 + introScale * 0.2})`,
            textShadow: `0 0 40px ${accent}55`,
          }}
        >
          {title}
        </div>
      </AbsoluteFill>

      {/* Scene 2: animated illustration */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: visualOpacity,
          transform: `scale(${visualScale})`,
        }}
      >
        <div style={{ width: "56%", maxWidth: 420, filter: `drop-shadow(0 0 30px ${accent}44)` }}>
          <Scene accent={accent} />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            fontSize: 30,
            color: CHALK,
            opacity: 0.9,
            textAlign: "center",
            padding: "0 12%",
          }}
        >
          {bullets[0]}
        </div>
      </AbsoluteFill>

      {/* Scene 3: recap */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          opacity: outroOpacity,
          padding: "0 12%",
        }}
      >
        {bullets.slice(0, 4).map((bullet, i) => {
          const localStart = outroStart + i * 8;
          const localFrame = frame - localStart;
          const itemOpacity = interpolate(localFrame, [0, 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const x = interpolate(localFrame, [0, 10], [-24, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                opacity: itemOpacity,
                transform: `translateX(${x}px)`,
                marginBottom: 18,
              }}
            >
              <span style={{ color: accent, fontSize: 28 }}>●</span>
              <span style={{ color: CHALK, fontSize: 28, lineHeight: 1.4 }}>{bullet}</span>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

export default ExplainerClip;
