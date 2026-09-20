import { lightLeak } from "@remotion/effects/light-leak";
import { AbsoluteFill, Solid, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

/** A single cinematic light sweep across the whole clip — evolves in, retracts out. */
export function LightLeakOverlay({ seed = 0, hueShift = 0 }: { seed?: number; hueShift?: number }) {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.55 }}>
      <Solid
        width={width}
        height={height}
        effects={[
          lightLeak({
            seed,
            hueShift,
            progress: interpolate(frame, [0, durationInFrames - 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }),
        ]}
      />
    </AbsoluteFill>
  );
}
