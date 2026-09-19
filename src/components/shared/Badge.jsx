"use client";

import React from "react";
import { DESIGN_SYSTEM } from "@/config/design_system";

export default function Badge({ variant = "teal", children, icon: Icon, className = "" }) {
  let styleConfig = {
    bg: DESIGN_SYSTEM.colors.tealGreen.lightBg,
    color: DESIGN_SYSTEM.colors.tealGreen.primary,
    border: DESIGN_SYSTEM.colors.tealGreen.border
  };

  if (variant === "royalRed") {
    styleConfig = {
      bg: DESIGN_SYSTEM.colors.royalRed.lightBg,
      color: DESIGN_SYSTEM.colors.royalRed.primary,
      border: DESIGN_SYSTEM.colors.royalRed.border
    };
  } else if (variant === "brown") {
    styleConfig = {
      bg: DESIGN_SYSTEM.colors.earthyBrown.lightBg,
      color: DESIGN_SYSTEM.colors.earthyBrown.primary,
      border: DESIGN_SYSTEM.colors.earthyBrown.border
    };
  }

  return (
    <span 
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border shadow-2xs ${className}`}
      style={{
        backgroundColor: styleConfig.bg,
        color: styleConfig.color,
        borderColor: styleConfig.border
      }}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
}
