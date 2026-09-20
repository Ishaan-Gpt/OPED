import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { SceneTheme } from "./theme";

const CHALK = "#f3f1e7";

/** Themed, multi-depth environment behind the main illustration — the actual "set" the camera moves through. */
export function Environment({ theme }: { theme: SceneTheme }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames;

  // Slow continuous dolly — the whole set drifts, not just a punch per beat.
  const farDrift = interpolate(t, [0, 1], [0, -18]);
  const farZoom = interpolate(t, [0, 1], [1.02, 1.14]);
  const midDrift = interpolate(t, [0, 1], [0, -36]);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.base, overflow: "hidden" }}>
      {/* Far layer: base gradient + zoom, slowest parallax */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 30% 20%, ${theme.glow}2e 0%, ${theme.base} 65%)`,
          transform: `scale(${farZoom}) translateX(${farDrift}px)`,
        }}
      />

      {theme.environment === "lab" && (
        <LabLayer frame={frame} midDrift={midDrift} glow={theme.glow} />
      )}
      {theme.environment === "night" && (
        <NightLayer frame={frame} midDrift={midDrift} glow={theme.glow} />
      )}
      {theme.environment === "space" && (
        <SpaceLayer frame={frame} midDrift={midDrift} glow={theme.glow} />
      )}
      {theme.environment === "sky" && (
        <SkyLayer frame={frame} midDrift={midDrift} glow={theme.glow} />
      )}
      {theme.environment === "blueprint" && (
        <BlueprintLayer frame={frame} midDrift={midDrift} glow={theme.glow} />
      )}
      {theme.environment === "nebula" && (
        <NebulaLayer frame={frame} midDrift={midDrift} glow={theme.glow} />
      )}

      {/* Vignette, closest layer, gives the frame edge falloff a real camera lens has */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 100% at 50% 45%, transparent 45%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
}

interface LayerProps {
  frame: number;
  midDrift: number;
  glow: string;
}

function Stars({
  count,
  seedBase,
  twinkle = true,
}: {
  count: number;
  seedBase: number;
  twinkle?: boolean;
}) {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const seed = seedBase + i * 71;
        const x = (seed * 37) % 100;
        const y = (seed * 53) % 100;
        const size = 1 + (seed % 3);
        const opacity = twinkle
          ? interpolate(Math.sin((frame + seed) / 18), [-1, 1], [0.15, 0.75])
          : 0.5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: CHALK,
              opacity,
            }}
          />
        );
      })}
    </>
  );
}

function LabLayer({ frame, midDrift, glow }: LayerProps) {
  return (
    <AbsoluteFill style={{ transform: `translateX(${midDrift}px)` }}>
      {/* Faint tile grid, like a lab wall */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${glow}14 1px, transparent 1px), linear-gradient(90deg, ${glow}14 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          opacity: 0.5,
        }}
      />
      {/* Bench line + soft bottle silhouettes */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "18%",
          height: 3,
          background: `linear-gradient(90deg, transparent, ${glow}55, transparent)`,
        }}
      />
      {[0.12, 0.82, 0.9].map((x, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${x * 100}%`,
            bottom: "18%",
            width: 18 + i * 4,
            height: 34 + i * 6,
            borderRadius: "6px 6px 3px 3px",
            background: `linear-gradient(180deg, ${glow}22, transparent)`,
            filter: "blur(1px)",
            transform: `translateY(${Math.sin(frame / 60 + i) * 2}px)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
}

function NightLayer({ frame, midDrift, glow }: LayerProps) {
  return (
    <AbsoluteFill style={{ transform: `translateX(${midDrift}px)` }}>
      <Stars count={40} seedBase={11} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "28%",
          background: `linear-gradient(180deg, transparent, ${glow}18)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "26%",
          width: 2,
          height: "50%",
          background: `linear-gradient(180deg, ${glow}00, ${glow}30, ${glow}00)`,
          transform: `translateX(${Math.sin(frame / 90) * 20}px)`,
        }}
      />
    </AbsoluteFill>
  );
}

function SpaceLayer({ frame, midDrift, glow }: LayerProps) {
  return (
    <AbsoluteFill style={{ transform: `translateX(${midDrift * 0.6}px)` }}>
      <Stars count={70} seedBase={31} />
      <div
        style={{
          position: "absolute",
          left: "20%",
          top: "15%",
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glow}22, transparent 70%)`,
          filter: "blur(20px)",
          transform: `translate(${Math.sin(frame / 120) * 12}px, ${Math.cos(frame / 140) * 10}px)`,
        }}
      />
    </AbsoluteFill>
  );
}

function SkyLayer({ frame, midDrift, glow }: LayerProps) {
  return (
    <AbsoluteFill style={{ transform: `translateX(${midDrift}px)` }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, #7fc9e8aa 0%, ${glow}22 55%, transparent 75%)`,
          opacity: 0.4,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "22%",
          background: `linear-gradient(180deg, transparent, ${glow}2e)`,
        }}
      />
      {/* Rolling hill silhouettes for depth */}
      <svg
        viewBox="0 0 400 100"
        style={{ position: "absolute", bottom: 0, width: "100%", height: "16%" }}
      >
        <path d="M0 60 Q100 20 200 55 T400 40 V100 H0 Z" fill={glow} opacity="0.18" />
      </svg>
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${8 + i * 16}%`,
            bottom: `${8 + (i % 2) * 4}%`,
            fontSize: 10 + (i % 3) * 3,
            opacity: 0.3,
            transform: `translateY(${Math.sin(frame / 50 + i) * 3}px)`,
          }}
        >
          🍃
        </div>
      ))}
    </AbsoluteFill>
  );
}

function BlueprintLayer({ frame, midDrift, glow }: LayerProps) {
  return (
    <AbsoluteFill style={{ transform: `translateX(${midDrift}px)` }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${glow}20 1px, transparent 1px), linear-gradient(90deg, ${glow}20 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${glow}10 1px, transparent 1px), linear-gradient(90deg, ${glow}10 1px, transparent 1px)`,
          backgroundSize: "8px 8px",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${20 + Math.sin(frame / 100) * 8}%`,
          top: 0,
          bottom: 0,
          width: 1,
          background: `${glow}30`,
        }}
      />
    </AbsoluteFill>
  );
}

function NebulaLayer({ frame, midDrift, glow }: LayerProps) {
  return (
    <AbsoluteFill style={{ transform: `translateX(${midDrift * 0.5}px)` }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${20 + i * 25}%`,
            top: `${15 + i * 20}%`,
            width: 200 - i * 30,
            height: 200 - i * 30,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${glow}20, transparent 70%)`,
            filter: "blur(24px)",
            transform: `translate(${Math.sin(frame / 100 + i) * 14}px, ${Math.cos(frame / 130 + i) * 10}px)`,
          }}
        />
      ))}
      <Stars count={20} seedBase={91} twinkle={false} />
    </AbsoluteFill>
  );
}
