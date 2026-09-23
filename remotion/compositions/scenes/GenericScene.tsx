import { interpolate } from "remotion";
import type { SceneProps } from "../ExplainerClip";

const CHALK = "#f3f1e7";

/** Deterministic hash so the same clip always picks the same variant, but different clips vary. */
function seedFrom(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}

/** Orbiting nodes — a small "system" building up, one node per beat. */
function OrbitVariant({ accent, beatIndex, beatLocalFrame }: SceneProps) {
  const shapeCount = beatIndex + 1;
  const t = beatLocalFrame / 30;
  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      <g transform="translate(200,200)">
        <circle
          r={interpolate(beatLocalFrame, [0, 20], [18, 26], { extrapolateRight: "clamp" })}
          fill={accent}
          opacity="0.9"
        />
        {Array.from({ length: shapeCount }, (_, i) => {
          const angle = t * (0.6 + i * 0.15) * 360 + i * 72;
          const rad = (angle * Math.PI) / 180;
          const r = 70 + i * 18;
          const x = Math.cos(rad) * r;
          const y = Math.sin(rad) * r * 0.6;
          const enter = interpolate(beatLocalFrame, [i * 5, i * 5 + 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={10 - i}
              fill={i % 2 === 0 ? accent : CHALK}
              opacity={(0.85 - i * 0.1) * enter}
            />
          );
        })}
      </g>
    </svg>
  );
}

/** Rising bars — one grows per beat, like a step/progress build-up. */
function BuildVariant({ accent, beatIndex, beatCount, beatLocalFrame }: SceneProps) {
  const bars = Math.max(beatCount, 4);
  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      <g transform="translate(80,320)">
        {Array.from({ length: bars }, (_, i) => {
          const active = i <= beatIndex;
          const growFrame = i === beatIndex ? beatLocalFrame : active ? 40 : 0;
          const h = interpolate(growFrame, [0, 30], [0, 60 + i * 34], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <rect
              key={i}
              x={i * 60}
              y={-h}
              width="36"
              height={h}
              rx="6"
              fill={active ? accent : "rgba(243,241,231,0.15)"}
              opacity={active ? 0.9 : 1}
            />
          );
        })}
        <line x1="-10" y1="0" x2={bars * 60} y2="0" stroke="rgba(243,241,231,0.35)" strokeWidth="2" />
      </g>
    </svg>
  );
}

/** Concentric pulse rings — one extra ring fires per beat, like a signal strengthening. */
function PulseVariant({ accent, beatIndex, beatLocalFrame }: SceneProps) {
  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      <g transform="translate(200,200)">
        <circle r="16" fill={accent} />
        {Array.from({ length: beatIndex + 1 }, (_, i) => {
          const local = (beatLocalFrame + i * 12) % 90;
          const scale = interpolate(local, [0, 90], [0.3, 2.4]);
          const opacity = interpolate(local, [0, 10, 70, 90], [0, 0.6, 0.3, 0]);
          return (
            <circle
              key={i}
              r={40}
              fill="none"
              stroke={i % 2 === 0 ? accent : CHALK}
              strokeWidth="2"
              transform={`scale(${scale})`}
              opacity={opacity}
            />
          );
        })}
      </g>
    </svg>
  );
}

const VARIANTS = [OrbitVariant, BuildVariant, PulseVariant];

/**
 * Fallback for concepts without a dedicated illustration. Rather than one fixed animation for
 * every "generic" topic (which made unrelated videos look identical), pick one of a few distinct
 * abstract patterns per clip, keyed off the title — still reacts per beat either way.
 */
export function GenericScene(props: SceneProps) {
  const Variant = VARIANTS[seedFrom(props.title) % VARIANTS.length];
  return <Variant {...props} />;
}
