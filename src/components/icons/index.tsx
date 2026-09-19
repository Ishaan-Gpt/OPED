/** Custom in-code SVG icon set (no icon library dependency). */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = ({ size = 20, ...rest }: IconProps) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...rest,
});

export function BrandMark({ size = 36, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...rest}>
      <rect x="3" y="8" width="42" height="30" rx="5" fill="#6b4228" />
      <rect x="6.5" y="11.5" width="35" height="23" rx="3" fill="#22312d" />
      <path
        d="M13 27c3.2-6.6 6-6.6 9.2 0 3.2 6.6 6 6.6 9.2 0"
        stroke="#f3f1e7"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <circle cx="35.5" cy="17" r="2.4" fill="#2f9d8b" />
      <path d="M17 41h14" stroke="#9e1b32" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function SearchIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </svg>
  );
}

export function EnterIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M20 5v6a3 3 0 0 1-3 3H5" />
      <path d="M8.5 10.5L5 14l3.5 3.5" />
    </svg>
  );
}

export function TeacherIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="7.5" r="3.5" />
      <path d="M4.5 20c1.2-4.2 4-6.3 7.5-6.3S18.3 15.8 19.5 20" />
    </svg>
  );
}

export function SoundIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 9.5h3l4.5-3.5v12L7 14.5H4z" />
      <path d="M15.5 9a4 4 0 0 1 0 6" />
      <path d="M18.2 6.6a7.5 7.5 0 0 1 0 10.8" />
    </svg>
  );
}

export function MicIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 12a6.5 6.5 0 0 0 13 0" />
      <path d="M12 18.5V21" />
    </svg>
  );
}

export function KeyboardIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="2.5" y="6.5" width="19" height="11" rx="2.5" />
      <path d="M6.5 10h.01M10 10h.01M13.5 10h.01M17 10h.01M8 14h8" />
    </svg>
  );
}

export function CubeIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 2.8l8.2 4.6v9.2L12 21.2 3.8 16.6V7.4z" />
      <path d="M3.8 7.4L12 12l8.2-4.6M12 12v9.2" />
    </svg>
  );
}

export function CheckSealIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 2.8l2.3 1.8 2.9-.2.9 2.8 2.4 1.7-1.1 2.7 1.1 2.7-2.4 1.7-.9 2.8-2.9-.2L12 21.2l-2.3-1.8-2.9.2-.9-2.8L3.5 15l1.1-2.7L3.5 9.6 5.9 8l.9-2.8 2.9.2z" />
      <path d="M8.6 12.2l2.4 2.3 4.4-4.6" />
    </svg>
  );
}

export function AlertIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 3.5l8.5 15h-17z" />
      <path d="M12 9.5v4M12 16.4h.01" />
    </svg>
  );
}

export function CloseIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ChalkIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M15.5 3.5l5 5-11 11-5-5z" />
      <path d="M4.5 19.5l-1.2 1.2" />
    </svg>
  );
}

export function ReplayIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 12a8 8 0 1 0 2.6-5.9" />
      <path d="M4 3.5V8h4.5" />
    </svg>
  );
}
