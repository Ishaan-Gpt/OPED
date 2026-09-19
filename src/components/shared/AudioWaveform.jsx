"use client";

import React from "react";
import { DESIGN_SYSTEM } from "@/config/design_system";

export default function AudioWaveform({ active = true, label = "AI Teacher Reciting..." }) {
  return (
    <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-gray-100">
      <div className="flex items-end gap-1 h-5">
        {[0.4, 0.8, 0.5, 1.0, 0.6, 0.9, 0.3].map((heightScale, i) => (
          <span
            key={i}
            className={`w-1 rounded-full transition-all duration-300 ${active ? "animate-pulse" : ""}`}
            style={{
              height: active ? `${heightScale * 20}px` : "4px",
              backgroundColor: active ? DESIGN_SYSTEM.colors.tealGreen.bright : "#9CA3AF",
              animationDelay: `${i * 120}ms`
            }}
          />
        ))}
      </div>

      <span 
        className="text-xs font-semibold tracking-wide"
        style={{ color: DESIGN_SYSTEM.colors.tealGreen.primary }}
      >
        {label}
      </span>
    </div>
  );
}
