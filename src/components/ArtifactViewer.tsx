import { motion } from "framer-motion";
import { useState } from "react";
import type { ArtifactKind } from "@/config/rules";
import { ChalkIcon } from "@/components/icons";

interface Props {
  kind: ArtifactKind;
  title: string;
}

/** Interactive chalk artifacts drawn on the board — touch & mouse friendly. */
export function ArtifactViewer({ kind, title }: Props) {
  return (
    <div className="rounded-2xl border border-chalk/12 bg-black/20 p-4">
      <div className="mb-3 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.18em] text-chalk/45">
        <ChalkIcon size={14} /> Interactive · {title}
      </div>
      {kind === "ray-slider" && <RaySlider />}
      {kind === "prism-spectrum" && <PrismSpectrum />}
      {kind === "cell-labels" && <LabelArtifact />}
      {kind === "number-line" && <NumberLine />}
    </div>
  );
}

function Slider({
  value,
  onChange,
  min,
  max,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  label: string;
}) {
  return (
    <label className="mt-3 block text-xs text-chalk/60">
      {label}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-chalk/20 accent-[var(--teal-soft)]"
      />
    </label>
  );
}

function RaySlider() {
  const [u, setU] = useState(150);
  const f = 90;
  const mirrorX = 340;
  const objX = mirrorX - u;
  const v = u === f ? Infinity : (f * u) / (u - f);
  const imgX = Number.isFinite(v) ? mirrorX - v : NaN;
  const objH = 46;
  const imgH = Number.isFinite(v) ? (-v / u) * objH : 0;

  return (
    <div>
      <svg viewBox="0 0 400 190" className="w-full">
        <line x1="20" y1="120" x2="390" y2="120" stroke="rgba(243,241,231,.35)" strokeDasharray="4 5" />
        <path
          d={`M${mirrorX} 40 q26 80 0 160`}
          stroke="rgba(243,241,231,.85)"
          strokeWidth="3"
          fill="none"
        />
        <circle cx={mirrorX - f} cy="120" r="3" fill="#2f9d8b" />
        <text x={mirrorX - f - 4} y="138" fill="#2f9d8b" fontSize="11">
          F
        </text>
        <line x1={objX} y1="120" x2={objX} y2={120 - objH} stroke="#f3f1e7" strokeWidth="3" />
        <path d={`M${objX} ${120 - objH} l-4 7 8 0z`} fill="#f3f1e7" />
        <line
          x1={objX}
          y1={120 - objH}
          x2={mirrorX}
          y2={120 - objH}
          stroke="rgba(158,27,50,.85)"
          strokeWidth="1.6"
        />
        <line
          x1={mirrorX}
          y1={120 - objH}
          x2={mirrorX - f - 60}
          y2={120 + objH * 0.9}
          stroke="rgba(158,27,50,.85)"
          strokeWidth="1.6"
        />
        {Number.isFinite(imgX) && (
          <motion.line
            initial={{ x1: imgX, x2: imgX, y1: 120, y2: 120 - imgH }}
            animate={{ x1: imgX, x2: imgX, y1: 120, y2: 120 - imgH }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            stroke="#2f9d8b"
            strokeWidth="3"
          />
        )}
      </svg>
      <Slider value={u} onChange={setU} min={100} max={300} label={`Object distance u = ${u} units`} />
      <p className="mt-2 text-xs text-chalk/55">
        Image distance v ={" "}
        <span className="text-teal-soft">{Number.isFinite(v) ? v.toFixed(0) : "∞"}</span> · magnification
        m = <span className="text-teal-soft">{Number.isFinite(v) ? (-v / u).toFixed(2) : "—"}</span>
      </p>
    </div>
  );
}

const VIBGYOR = ["#8b5cf6", "#4f46e5", "#2563eb", "#16a34a", "#eab308", "#f97316", "#dc2626"];

function PrismSpectrum() {
  const [angle, setAngle] = useState(18);
  return (
    <div>
      <svg viewBox="0 0 400 190" className="w-full">
        <path d="M200 40 L260 150 L140 150 Z" fill="rgba(243,241,231,.10)" stroke="rgba(243,241,231,.7)" strokeWidth="2" />
        <line x1="20" y1={95 - angle} x2="172" y2="105" stroke="#f3f1e7" strokeWidth="2.4" />
        {VIBGYOR.map((c, i) => (
          <motion.line
            key={c}
            x1="228"
            y1="112"
            initial={{ x2: 388, y2: 78 + i * (5 + angle * 0.28) }}
            animate={{ x2: 388, y2: 78 + i * (5 + angle * 0.28) }}
            transition={{ type: "spring", stiffness: 140, damping: 20 }}
            stroke={c}
            strokeWidth="2.4"
          />
        ))}
      </svg>
      <Slider value={angle} onChange={setAngle} min={4} max={40} label={`Angle of incidence = ${angle}°`} />
      <p className="mt-2 text-xs text-chalk/55">
        Violet deviates most, red the least — that spread is <span className="text-teal-soft">dispersion</span>.
      </p>
    </div>
  );
}

const LABELS = [
  { id: "a", name: "Nucleus / centre", x: 120, y: 95 },
  { id: "b", name: "First shell (K)", x: 190, y: 60 },
  { id: "c", name: "Outer shell (L)", x: 258, y: 118 },
];

function LabelArtifact() {
  const [found, setFound] = useState<string[]>([]);
  return (
    <div>
      <svg viewBox="0 0 400 190" className="w-full">
        <circle cx="120" cy="95" r="14" fill="rgba(158,27,50,.75)" />
        <circle cx="120" cy="95" r="45" fill="none" stroke="rgba(243,241,231,.4)" strokeDasharray="3 5" />
        <circle cx="120" cy="95" r="78" fill="none" stroke="rgba(243,241,231,.28)" strokeDasharray="3 5" />
        {LABELS.map((l) => {
          const on = found.includes(l.id);
          return (
            <g key={l.id} onClick={() => setFound((f) => (on ? f : [...f, l.id]))} className="cursor-pointer">
              <circle
                cx={l.x}
                cy={l.y}
                r="9"
                fill={on ? "#2f9d8b" : "rgba(243,241,231,.18)"}
                stroke="rgba(243,241,231,.6)"
              />
              {on && (
                <text x={l.x + 14} y={l.y + 4} fill="#f3f1e7" fontSize="12">
                  {l.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <p className="mt-1 text-xs text-chalk/55">
        Tap each marker to reveal the label — {found.length}/{LABELS.length} identified.
      </p>
    </div>
  );
}

function NumberLine() {
  const [x, setX] = useState(3);
  const result = 2 * x + 3;
  return (
    <div>
      <svg viewBox="0 0 400 120" className="w-full">
        <line x1="20" y1="70" x2="380" y2="70" stroke="rgba(243,241,231,.6)" strokeWidth="2" />
        {Array.from({ length: 11 }, (_, i) => (
          <g key={i}>
            <line x1={20 + i * 36} y1="62" x2={20 + i * 36} y2="78" stroke="rgba(243,241,231,.45)" />
            <text x={20 + i * 36 - 3} y="94" fill="rgba(243,241,231,.5)" fontSize="10">
              {i}
            </text>
          </g>
        ))}
        <motion.circle
          initial={{ cx: 20 + Math.min(result, 10) * 36 }}
          animate={{ cx: 20 + Math.min(result, 10) * 36 }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          cy="70"
          r="8"
          fill="#2f9d8b"
        />
      </svg>
      <Slider value={x} onChange={setX} min={0} max={4} label={`x = ${x}`} />
      <p className="mt-2 font-[family-name:var(--font-chalk)] text-lg text-chalk">
        2x + 3 = <span className="text-teal-soft">{result}</span>
      </p>
    </div>
  );
}

export default ArtifactViewer;
