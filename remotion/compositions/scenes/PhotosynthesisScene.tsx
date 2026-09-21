import { interpolate } from "remotion";
import type { SceneProps } from "../ExplainerClip";

const CHALK = "#f3f1e7";
const CO2_GRAY = "#c9c9c9";
const WATER_BLUE = "#6ec3e0";
const SUN = "#f2c94c";

const LEAF_PATH = "M210 260 C140 260 90 210 90 150 C160 150 210 190 210 260 Z";

/** A leaf that actually does what each beat describes: CO2 in, water up, light absorbed, glucose+O2 out. */
export function PhotosynthesisScene({ accent, beatIndex, beatLocalFrame }: SceneProps) {
  const phase = beatIndex % 4;
  const enter = interpolate(beatLocalFrame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      {/* Persistent leaf + stem, the anchor every beat plays out on */}
      <path d="M210 260 L210 320" stroke="#4a7c59" strokeWidth="6" strokeLinecap="round" />
      <path d={LEAF_PATH} fill={accent} opacity="0.9" />
      <path
        d="M210 260 C210 190 160 150 90 150"
        fill="none"
        stroke={CHALK}
        strokeWidth="2"
        opacity="0.4"
      />

      {/* Beat 0: CO2 enters through a stoma on the leaf underside */}
      {phase === 0 && (
        <g opacity={enter}>
          <ellipse
            cx="140"
            cy="225"
            rx="14"
            ry="6"
            fill="#0e2420"
            stroke={CHALK}
            strokeWidth="1.5"
          />
          {[0, 1, 2].map((i) => {
            const t = (beatLocalFrame + i * 20) % 60;
            const x = interpolate(t, [0, 60], [40, 140]);
            const op = interpolate(t, [0, 10, 50, 60], [0, 1, 1, 0]);
            return (
              <circle
                key={i}
                cx={x}
                cy={225 + Math.sin(t / 5) * 4}
                r="5"
                fill={CO2_GRAY}
                opacity={op}
              />
            );
          })}
        </g>
      )}

      {/* Beat 1: water rises through the stem into the leaf */}
      {phase === 1 && (
        <g opacity={enter}>
          <rect
            x="204"
            y="260"
            width="12"
            height="60"
            fill="none"
            stroke={WATER_BLUE}
            strokeWidth="1.5"
            opacity="0.5"
          />
          {[0, 1, 2, 3].map((i) => {
            const t = (beatLocalFrame + i * 15) % 60;
            const y = interpolate(t, [0, 60], [318, 255]);
            const op = interpolate(t, [0, 10, 50, 60], [0, 1, 1, 0]);
            return <circle key={i} cx={210} cy={y} r="4" fill={WATER_BLUE} opacity={op} />;
          })}
        </g>
      )}

      {/* Beat 2: sunlight hits the leaf and is absorbed */}
      {phase === 2 && (
        <g opacity={enter}>
          <circle cx="330" cy="70" r="30" fill={SUN} opacity="0.9" />
          {[0, 1, 2, 3, 4].map((i) => {
            const t = (beatLocalFrame + i * 8) % 40;
            const op = interpolate(t, [0, 8, 32, 40], [0, 0.9, 0.9, 0]);
            const x1 = 305 - i * 6;
            const y1 = 95 + i * 8;
            const x2 = interpolate(t, [0, 40], [x1, 165]);
            const y2 = interpolate(t, [0, 40], [y1, 190]);
            return <circle key={i} cx={x2} cy={y2} r="3.5" fill={SUN} opacity={op} />;
          })}
          <path
            d={LEAF_PATH}
            fill={SUN}
            opacity={interpolate(Math.sin(beatLocalFrame / 8), [-1, 1], [0.05, 0.35])}
          />
        </g>
      )}

      {/* Beat 3: glucose and oxygen are produced and released */}
      {phase === 3 && (
        <g opacity={enter}>
          {[0, 1, 2].map((i) => {
            const t = (beatLocalFrame + i * 18) % 54;
            const op = interpolate(t, [0, 8, 40, 54], [0, 1, 1, 0]);
            const x = 150 + i * 20;
            const y = interpolate(t, [0, 54], [220, 90]);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="6"
                fill={CHALK}
                opacity={op}
                stroke="#4a7c59"
                strokeWidth="0.6"
              />
            );
          })}
          <g
            transform="translate(150,300)"
            opacity={interpolate(beatLocalFrame, [10, 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          >
            {Array.from({ length: 6 }, (_, i) => {
              const a = (i / 6) * Math.PI * 2;
              return (
                <circle key={i} cx={Math.cos(a) * 16} cy={Math.sin(a) * 16} r="4" fill="#f2c94c" />
              );
            })}
            <circle r="4" fill={CHALK} />
          </g>
        </g>
      )}
    </svg>
  );
}
