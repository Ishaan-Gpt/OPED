"use client";

import React from "react";
import { DESIGN_SYSTEM } from "@/config/design_system";

export default function Logo({ size = "md", className = "" }) {
  const isLarge = size === "lg";

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <div 
        className="flex items-center justify-center rounded-xl font-bold transition-transform hover:scale-105 shadow-md"
        style={{
          width: isLarge ? "52px" : "40px",
          height: isLarge ? "52px" : "40px",
          background: `linear-gradient(135deg, ${DESIGN_SYSTEM.colors.tealGreen.primary} 0%, ${DESIGN_SYSTEM.colors.tealGreen.accent} 100%)`,
          color: DESIGN_SYSTEM.colors.base.pureWhite,
          boxShadow: DESIGN_SYSTEM.shadows.blackboardGlow
        }}
      >
        <span className={isLarge ? "text-2xl" : "text-lg"} style={{ fontFamily: DESIGN_SYSTEM.typography.fonts.sans }}>
          O
        </span>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span 
            className={`font-black tracking-tight ${isLarge ? "text-3xl" : "text-xl"}`}
            style={{ 
              color: DESIGN_SYSTEM.colors.earthyBrown.darkWood,
              fontFamily: DESIGN_SYSTEM.typography.fonts.sans 
            }}
          >
            OPED
          </span>
          <span 
            className="px-1.5 py-0.5 text-[10px] uppercase font-bold rounded tracking-wider shadow-xs"
            style={{
              backgroundColor: DESIGN_SYSTEM.colors.royalRed.lightBg,
              color: DESIGN_SYSTEM.colors.royalRed.accent,
              border: `1px solid ${DESIGN_SYSTEM.colors.royalRed.border}`
            }}
          >
            Exam Ready
          </span>
        </div>
        
        {isLarge && (
          <span 
            className="text-xs font-medium tracking-wide mt-0.5"
            style={{ color: DESIGN_SYSTEM.colors.earthyBrown.accent }}
          >
            Outcome-Based Dynamic Classroom
          </span>
        )}
      </div>
    </div>
  );
}
