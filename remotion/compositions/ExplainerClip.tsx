import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { noise2D } from "@remotion/noise";
import type { VideoBrief, VisualKind } from "../types";
import { SCENE_THEMES } from "./theme";
import { Environment } from "./Environment";
import { ReactionScene } from "./scenes/ReactionScene";
import { RayScene } from "./scenes/RayScene";
import { ConcaveMirrorScene } from "./scenes/ConcaveMirrorScene";
import { ConvexMirrorScene } from "./scenes/ConvexMirrorScene";
import { PrismScene } from "./scenes/PrismScene";
import { RefractionScene } from "./scenes/RefractionScene";
import { AtomScene } from "./scenes/AtomScene";
import { RutherfordAtomScene } from "./scenes/RutherfordAtomScene";
import { PhotosynthesisScene } from "./scenes/PhotosynthesisScene";
import { GraphScene } from "./scenes/GraphScene";
import { CellScene } from "./scenes/CellScene";
import { CircuitScene } from "./scenes/CircuitScene";
import { MapScene } from "./scenes/MapScene";
import { EquationScene } from "./scenes/EquationScene";
import { GenericScene } from "./scenes/GenericScene";

const CHALK = "#f3f1e7";
const TEAL = "#2f9d8b";

export interface SceneProps {
  accent: string;
  /** which beat (0-based) the narration is currently on */
  beatIndex: number;
  /** total number of beats in this clip */
  beatCount: number;
  /** frame relative to the start of the current beat */
  beatLocalFrame: number;
  /** clip title — only used by GenericScene to pick a visual variant per topic */
  title: string;
}

const SCENES: Record<VisualKind, (props: SceneProps) => JSX.Element> = {
  reaction: ReactionScene,
  ray: RayScene,
  concaveMirror: ConcaveMirrorScene,
  convexMirror: ConvexMirrorScene,
  prism: PrismScene,
  refraction: RefractionScene,
  atom: AtomScene,
  rutherfordAtom: RutherfordAtomScene,
  photosynthesis: PhotosynthesisScene,
  graph: GraphScene,
  cell: CellScene,
  circuit: CircuitScene,
  map: MapScene,
  equation: EquationScene,
  generic: GenericScene,
};

/** Deterministic small hash so each video gets its own camera "personality" instead of a fixed template. */
function seedFrom(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}

function crossfadeAt(frame: number, start: number, end: number, fade: number) {
  return interpolate(frame, [start, start + fade, end - fade, end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
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
 * animated illustration in a themed 3D "set", paced into beats — one per bullet. A single
 * handheld-style camera (Perlin-noise drift, not robotic sine waves) drifts through the whole
 * clip, instead of a static slide with text.
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
  const theme = SCENE_THEMES[visualKind] ?? SCENE_THEMES.generic;

  // Every video gets its own camera "personality" derived from its title, instead of the exact
  // same drift/zoom/pan pattern every time — noise seed offset, dolly target, tilt strength and
  // pan direction all vary per clip so different topics don't feel like the same template reused.
  const seed = seedFrom(title);
  const seedOffset = seed % 1000;
  const dollyTarget = 1.06 + ((seed >> 3) % 10) / 100; // 1.06–1.15
  const tiltStrength = 0.6 + ((seed >> 6) % 8) / 10; // 0.6–1.3x
  const panSign = seed % 2 === 0 ? 1 : -1;

  // Organic handheld camera: Perlin noise instead of perfect sine waves, so drift never
  // repeats in an obviously mechanical way. Small amplitude — a real camera operator's hand,
  // not a shake-cam.
  const t = frame / fps;
  const handheldX = noise2D("cam-x", t * 0.35, seedOffset) * 6;
  const handheldY = noise2D("cam-y", t * 0.35, seedOffset + 50) * 4;
  const handheldRotate = noise2D("cam-rot", t * 0.25, seedOffset + 100) * 0.6;
  const tiltX = noise2D("cam-tilt-x", t * 0.2, seedOffset + 200) * 3 * tiltStrength;
  const tiltY = noise2D("cam-tilt-y", t * 0.2, seedOffset + 300) * 4 * tiltStrength;

  // Slow continuous dolly-in across the whole clip, on top of the handheld drift.
  const dolly = interpolate(frame, [0, durationInFrames], [1, dollyTarget]);

  const introEnd = Math.min(40, Math.round(durationInFrames * 0.24));
  const introOpacity = crossfadeAt(frame, 0, introEnd, 10);
  const introScale = spring({ frame, fps, config: { damping: 14 } });

  const visualStart = introEnd - 8;
  const visualOpacity = crossfadeAt(frame, visualStart, durationInFrames, 10);
  const settleIn = interpolate(frame, [visualStart, visualStart + 15], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Beats need enough time to actually be read and understood — cramming 4 beats into a short
  // clip makes each one flash by. Prefer fewer, longer beats over more, rushed ones.
  const beatSpan = Math.max(1, durationInFrames - visualStart);
  const MIN_BEAT_FRAMES = 75; // 2.5s @ 30fps
  const maxBeats = Math.max(1, Math.min(4, Math.floor(beatSpan / MIN_BEAT_FRAMES)));
  const beats = (bullets.length ? bullets : [title]).slice(0, maxBeats);
  const beatLen = Math.floor(beatSpan / beats.length);

  const beatIndex = Math.min(beats.length - 1, Math.floor((frame - visualStart) / beatLen));
  const beatStart = visualStart + beatIndex * beatLen;
  const beatLocalFrame = frame - beatStart;
  const beatEnd = beatIndex === beats.length - 1 ? durationInFrames : beatStart + beatLen;

  // Smooth reframe at the start of each beat (eased, not a snap punch) — a camera operator
  // gently repositioning, not a jump cut.
  const reframe = spring({
    frame: beatLocalFrame,
    fps,
    config: { damping: 20, stiffness: 90 },
  });
  const punch = interpolate(reframe, [0, 1], [1, 1.04]);
  const panDir = beatIndex % 2 === 0 ? panSign : -panSign;
  const pan = interpolate(reframe, [0, 1], [panDir * 16, 0]);

  const captionOpacity = crossfadeAt(frame, beatStart, beatEnd, Math.min(10, beatLen / 3));
  const captionY = interpolate(beatLocalFrame, [0, 10], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ fontFamily: '"Outfit", system-ui, sans-serif' }}>
      <AbsoluteFill
        style={{
          perspective: 900,
          transform: `translate(${handheldX}px, ${handheldY}px) rotate(${handheldRotate}deg) scale(${dolly})`,
        }}
      >
        <AbsoluteFill
          style={{
            transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <Environment theme={theme} accent={accent} />
        </AbsoluteFill>

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
              filter: `drop-shadow(0 0 34px ${accent}55)`,
            }}
          >
            <SignalPulse localFrame={beatLocalFrame} accent={accent} />
            <Scene
              accent={accent}
              beatIndex={beatIndex}
              beatCount={beats.length}
              beatLocalFrame={beatLocalFrame}
              title={title}
            />
          </div>

          {/* Lower-third broadcast-style caption, anchored to the frame rather than floating text */}
          <div
            style={{
              position: "absolute",
              left: "8%",
              right: "8%",
              bottom: "9%",
              opacity: captionOpacity,
              transform: `translateY(${captionY}px)`,
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 20px",
              borderRadius: 14,
              background: "linear-gradient(90deg, rgba(10,14,13,0.78), rgba(10,14,13,0.35))",
              backdropFilter: "blur(6px)",
              borderLeft: `3px solid ${accent}`,
            }}
          >
            <span
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: CHALK,
                lineHeight: 1.35,
                textShadow: "0 2px 10px rgba(0,0,0,0.4)",
              }}
            >
              {beats[beatIndex]}
            </span>
          </div>

          {/* Beat progress dots — shows the student how many points remain, like chapter markers */}
          <div
            style={{
              position: "absolute",
              bottom: "3.5%",
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
    </AbsoluteFill>
  );
}

export default ExplainerClip;
