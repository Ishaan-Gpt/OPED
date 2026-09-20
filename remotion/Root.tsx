import { Composition } from "remotion";
import { ExplainerClip } from "./compositions/ExplainerClip";
import { FPS, MAX_VIDEO_FRAMES, clampFrames } from "./types";
import type { VideoBrief } from "./types";

const sampleProps: VideoBrief = {
  title: "Reflection: ∠i = ∠r",
  bullets: [
    "Incident ray, normal, and reflected ray lie in one plane.",
    "The angle of incidence always equals the angle of reflection.",
    "A concave mirror converges rays to a real focus.",
  ],
  accent: "#2f9d8b",
  targetSeconds: 10,
};

export function RemotionRoot() {
  return (
    <Composition
      id="ExplainerClip"
      component={ExplainerClip}
      durationInFrames={MAX_VIDEO_FRAMES}
      fps={FPS}
      width={1280}
      height={720}
      defaultProps={sampleProps}
      calculateMetadata={async ({ props }) => ({
        durationInFrames: clampFrames(props.targetSeconds),
      })}
    />
  );
}

export default RemotionRoot;
