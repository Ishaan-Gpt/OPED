import { interpolate } from "remotion";
import type { SceneProps } from "../ExplainerClip";

const CHALK = "#f3f1e7";

const LOOP = "M100 100 H300 V300 H100 Z";

/** A circuit that actually does what each beat describes: wire draws, switch closes, current flows, bulb lights. */
export function CircuitScene({ accent, beatIndex, beatLocalFrame }: SceneProps) {
  const phase = beatIndex % 4;
  const enter = interpolate(beatLocalFrame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const drawProgress =
    phase === 0 ? interpolate(beatLocalFrame, [0, 35], [0, 1], { extrapolateRight: "clamp" }) : 1;

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      <path
        d={LOOP}
        fill="none"
        stroke={CHALK}
        strokeWidth="4"
        opacity={0.7}
        strokeDasharray="800"
        strokeDashoffset={800 - drawProgress * 800}
      />

      {/* Battery symbol, always present once the loop exists */}
      <g transform="translate(100,200)" opacity={phase >= 0 ? 1 : 0}>
        <line x1="-6" y1="-18" x2="-6" y2="18" stroke={CHALK} strokeWidth="4" />
        <line x1="6" y1="-10" x2="6" y2="10" stroke={CHALK} strokeWidth="2" />
      </g>

      {/* Beat 1: the switch closes */}
      <g transform="translate(300,100)">
        <circle cx="-20" cy="0" r="4" fill={CHALK} />
        <circle cx="20" cy="0" r="4" fill={CHALK} />
        <line
          x1="-20"
          y1="0"
          x2={phase >= 1 ? 20 : 10}
          y2={phase >= 1 ? 0 : -14}
          stroke={accent}
          strokeWidth="3"
          opacity={phase === 1 ? enter : phase > 1 ? 1 : 0.4}
        />
      </g>

      {/* Beat 2: current flows as pulses travelling the loop */}
      {phase >= 2 &&
        [0, 1, 2].map((i) => {
          const t = (beatLocalFrame + i * 25) % 75;
          const p = t / 75;
          // Walk the four edges of the square loop by parametric fraction p (0-1).
          let x = 100;
          let y = 100;
          if (p < 0.25) {
            x = 100 + (p / 0.25) * 200;
            y = 100;
          } else if (p < 0.5) {
            x = 300;
            y = 100 + ((p - 0.25) / 0.25) * 200;
          } else if (p < 0.75) {
            x = 300 - ((p - 0.5) / 0.25) * 200;
            y = 300;
          } else {
            x = 100;
            y = 300 - ((p - 0.75) / 0.25) * 200;
          }
          return <circle key={i} cx={x} cy={y} r="5" fill={accent} />;
        })}

      {/* Beat 3: the bulb lights up */}
      <g transform="translate(300,300)">
        <circle
          r="24"
          fill={phase === 3 ? accent : "none"}
          stroke={CHALK}
          strokeWidth="3"
          opacity={
            phase === 3
              ? interpolate(beatLocalFrame, [0, 20], [0.3, 1], { extrapolateRight: "clamp" })
              : 0.5
          }
        />
        {phase === 3 && (
          <circle
            r={interpolate(beatLocalFrame, [0, 25], [24, 50], { extrapolateRight: "clamp" })}
            fill="none"
            stroke={accent}
            strokeWidth="1.5"
            opacity={interpolate(beatLocalFrame, [0, 25], [0.6, 0], { extrapolateRight: "clamp" })}
          />
        )}
      </g>
    </svg>
  );
}
