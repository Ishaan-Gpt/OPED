import { interpolate } from "remotion";
import type { SceneProps } from "../ExplainerClip";

const CHALK = "#f3f1e7";

/** A map that actually does what each beat describes: outline draws, compass appears, a route traces, a pin drops. */
export function MapScene({ accent, beatIndex, beatLocalFrame }: SceneProps) {
  const phase = beatIndex % 4;
  const enter = interpolate(beatLocalFrame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  const regionPath =
    "M90 120 Q140 80 220 100 Q300 90 310 160 Q320 240 250 280 Q170 320 110 260 Q70 200 90 120 Z";
  const regionLength = 700;
  const regionProgress =
    phase === 0 ? interpolate(beatLocalFrame, [0, 35], [0, 1], { extrapolateRight: "clamp" }) : 1;

  const routePath = "M140 220 Q200 160 260 140";
  const routeLength = 180;
  const routeProgress =
    phase === 2
      ? interpolate(beatLocalFrame, [0, 35], [0, 1], { extrapolateRight: "clamp" })
      : phase > 2
        ? 1
        : 0;

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      {/* Beat 0: the region outline draws itself */}
      <path
        d={regionPath}
        fill={`${accent}22`}
        stroke={accent}
        strokeWidth="3"
        strokeDasharray={regionLength}
        strokeDashoffset={regionLength - regionProgress * regionLength}
      />

      {/* Beat 1: compass rose appears */}
      {phase >= 1 && (
        <g transform="translate(330,60)" opacity={phase === 1 ? enter : 1}>
          <line x1="0" y1="-22" x2="0" y2="22" stroke={CHALK} strokeWidth="2" />
          <line x1="-22" y1="0" x2="22" y2="0" stroke={CHALK} strokeWidth="2" />
          <text x="0" y="-28" fill={CHALK} fontSize="14" textAnchor="middle">
            N
          </text>
          <text x="0" y="38" fill={CHALK} fontSize="12" textAnchor="middle" opacity="0.6">
            S
          </text>
          <text x="30" y="4" fill={CHALK} fontSize="12" opacity="0.6">
            E
          </text>
          <text x="-34" y="4" fill={CHALK} fontSize="12" opacity="0.6">
            W
          </text>
        </g>
      )}

      {/* Beat 2: a route traces across the map */}
      {phase >= 2 && (
        <path
          d={routePath}
          fill="none"
          stroke={CHALK}
          strokeWidth="3"
          strokeDasharray={`8 6`}
          strokeDashoffset={routeLength - routeProgress * routeLength}
          opacity="0.9"
        />
      )}

      {/* Beat 3: a location pin drops */}
      {phase === 3 && (
        <g
          transform={`translate(260, ${
            140 + interpolate(beatLocalFrame, [0, 18], [-60, 0], { extrapolateRight: "clamp" })
          })`}
        >
          <path
            d="M0 -20 C12 -20 20 -10 20 0 C20 14 0 30 0 30 C0 30 -20 14 -20 0 C-20 -10 -12 -20 0 -20 Z"
            fill={accent}
          />
          <circle cx="0" cy="0" r="6" fill={CHALK} />
        </g>
      )}
    </svg>
  );
}
