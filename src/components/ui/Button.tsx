"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-[var(--color-royal-primary)] text-white hover:bg-[var(--color-royal-accent)] shadow-photo hover:shadow-photo-hover",
      secondary: "bg-[var(--color-teal-primary)] text-white hover:bg-[var(--color-teal-accent)] shadow-photo hover:shadow-photo-hover",
      outline: "border-2 border-[var(--color-brown-primary)] text-[var(--color-brown-primary)] hover:bg-[var(--color-brown-primary)] hover:text-white",
      ghost: "hover:bg-gray-100 text-gray-900",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
