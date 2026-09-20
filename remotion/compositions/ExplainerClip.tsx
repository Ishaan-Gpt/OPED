import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { noise2D } from "@remotion/noise";
import { CameraMotionBlur } from "@remotion/motion-blur";
import type { VideoBrief, VisualKind } from "../types";
import { SCENE_THEMES } from "./theme";
import { Environment } from "./Environment";
import { LightLeakOverlay } from "./LightLeakOverlay";
import { ReactionScene } from "./scenes/ReactionScene";
import { RayScene } from "./scenes/RayScene";
import { AtomScene } from "./scenes/AtomScene";
import { PhotosynthesisScene } from "./scenes/PhotosynthesisScene";
import { GraphScene } from "./scenes/GraphScene";
import { GenericScene } from "./scenes/GenericScene";

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

const HUE_SHIFTS: Record<VisualKind, number> = {
  reaction: 20,
  ray: 200,
  atom: 235,
  photosynthesis: 110,
  graph: 20,
  generic: 260,
};

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
 * clip with real motion blur and a light-leak sweep, instead of a static slide with text.
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

  // Organic handheld camera: Perlin noise instead of perfect sine waves, so drift never
  // repeats in an obviously mechanical way. Small amplitude — a real camera operator's hand,
  // not a shake-cam.
  const t = frame / fps;
  const handheldX = noise2D("cam-x", t * 0.35, 0) * 6;
  const handheldY = noise2D("cam-y", t * 0.35, 50) * 4;
  const handheldRotate = noise2D("cam-rot", t * 0.25, 100) * 0.6;
  const tiltX = noise2D("cam-tilt-x", t * 0.2, 200) * 3;
  const tiltY = noise2D("cam-tilt-y", t * 0.2, 300) * 4;

  // Slow continuous dolly-in across the whole clip, on top of the handheld drift.
  const dolly = interpolate(frame, [0, durationInFrames], [1, 1.1]);

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

  // Smooth reframe at the start of each beat (eased, not a snap punch) — a camera operator
  // gently repositioning, not a jump cut.
  const reframe = spring({
    frame: beatLocalFrame,
    fps,
    config: { damping: 20, stiffness: 90 },
  });
  const punch = interpolate(reframe, [0, 1], [1, 1.04]);
  const pan = interpolate(reframe, [0, 1], [beatIndex % 2 === 0 ? -16 : 16, 0]);

  const captionOpacity = crossfadeAt(frame, beatStart, beatEnd, Math.min(10, beatLen / 3));
  const captionY = interpolate(beatLocalFrame, [0, 10], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ fontFamily: '"Outfit", system-ui, sans-serif' }}>
      <CameraMotionBlur shutterAngle={160} samples={6}>
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
            <Environment theme={theme} />
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
              <Scene accent={accent} />
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

          <LightLeakOverlay
            seed={beatIndex + 1}
            hueShift={HUE_SHIFTS[visualKind] ?? HUE_SHIFTS.generic}
          />
        </AbsoluteFill>
      </CameraMotionBlur>
    </AbsoluteFill>
  );
}

export default ExplainerClip;
