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

function crossfadeAt(frame: number, start: number, end: number, fade: number) {
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
      {Array.from({ length: 10 }, (_, i) => {
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
              opacity: 0.1,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
}

/** Expanding ring that pulses once at the start of a beat, to draw the eye to what's changing. */
function SignalPulse({ localFrame, accent }: { localFrame: number; accent: string }) {
  const scale = interpolate(localFrame, [0, 22], [0.5, 1.7], { extrapolateRight: "clamp" });
  const opacity = interpolate(localFrame, [0, 4, 22], [0, 0.55, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (opacity <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        margin: "auto",
        width: "70%",
        aspectRatio: "1",
        borderRadius: "50%",
        border: `2px solid ${accent}`,
        transform: `scale(${scale})`,
        opacity,
      }}
    />
  );
}

/**
 * Cinematic explainer driven by the teacher's video brief: a title hook, then one continuous
 * animated illustration paced into short beats (one per bullet) — each beat gets its own caption
 * placed right at the illustration, a signaling pulse, and a small camera punch/pan, instead of
 * dumping all bullets on screen at once.
 */
export function ExplainerClip({
  title,
  bullets,
  accent = TEAL,
  visualKind = "generic",
}: VideoBrief) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const Scene = SCENES[visualKind] ?? SCENES.generic;

  const introEnd = Math.min(40, Math.round(durationInFrames * 0.24));
  const introOpacity = crossfadeAt(frame, 0, introEnd, 10);
  const introScale = spring({ frame, fps, config: { damping: 14 } });

  const visualStart = introEnd - 8;
  const visualOpacity = crossfadeAt(frame, visualStart, durationInFrames, 10);
  const settleIn = interpolate(frame, [visualStart, visualStart + 15], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const beats = (bullets.length ? bullets : [title]).slice(0, 4);
  const beatSpan = Math.max(1, durationInFrames - visualStart);
  const beatLen = Math.floor(beatSpan / beats.length);

  const beatIndex = Math.min(beats.length - 1, Math.floor((frame - visualStart) / beatLen));
  const beatStart = visualStart + beatIndex * beatLen;
  const beatLocalFrame = frame - beatStart;
  const beatEnd = beatIndex === beats.length - 1 ? durationInFrames : beatStart + beatLen;

  // Quick punch-in at the start of each beat, settling back — simulates a camera cut.
  const punch = interpolate(beatLocalFrame, [0, 6, 18], [1, 1.05, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Alternating pan per beat gives each one a slightly different framing.
  const pan = interpolate(beatLocalFrame, [0, 16], [beatIndex % 2 === 0 ? -14 : 14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const captionOpacity = crossfadeAt(frame, beatStart, beatEnd, Math.min(10, beatLen / 3));
  const captionY = interpolate(beatLocalFrame, [0, 10], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BOARD, fontFamily: '"Outfit", system-ui, sans-serif' }}>
      <Backdrop accent={accent} />

      {/* Hook: title */}
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

      {/* Continuous illustration, paced into beats */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: visualOpacity,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "58%",
            maxWidth: 440,
            transform: `scale(${settleIn * punch}) translateX(${pan}px)`,
            filter: `drop-shadow(0 0 30px ${accent}44)`,
          }}
        >
          <SignalPulse localFrame={beatLocalFrame} accent={accent} />
          <Scene accent={accent} />
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "14%",
            fontSize: 30,
            fontWeight: 600,
            color: CHALK,
            opacity: captionOpacity,
            transform: `translateY(${captionY}px)`,
            textAlign: "center",
            padding: "0 10%",
            textShadow: "0 2px 12px rgba(0,0,0,0.5)",
          }}
        >
          {beats[beatIndex]}
        </div>

        {/* Beat progress dots — shows the student how many points remain, like chapter markers */}
        <div
          style={{
            position: "absolute",
            bottom: "7%",
            display: "flex",
            gap: 8,
          }}
        >
          {beats.map((_, i) => (
            <div
              key={i}
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: i === beatIndex ? accent : "rgba(243,241,231,0.25)",
                transition: "background 0.2s",
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

export default ExplainerClip;
