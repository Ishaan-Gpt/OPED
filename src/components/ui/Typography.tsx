import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TypographyVariant = "h1" | "h2" | "h3" | "h4" | "body" | "small";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: React.ElementType;
}

export function Typography({
  variant = "body",
  as,
  className,
  children,
  ...props
}: TypographyProps) {
  const Component = as || getElementForVariant(variant);

  const baseStyles = "text-[var(--foreground)] antialiased";

  const variants = {
    h1: "text-5xl md:text-7xl font-bold tracking-tight leading-tight",
    h2: "text-4xl md:text-5xl font-semibold tracking-tight",
    h3: "text-2xl md:text-3xl font-medium",
    h4: "text-xl md:text-2xl font-medium",
    body: "text-base md:text-lg leading-relaxed text-gray-700",
    small: "text-sm text-gray-500",
  };

  return (
    <Component className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </Component>
  );
}

function getElementForVariant(variant: TypographyVariant): React.ElementType {
  switch (variant) {
    case "h1":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "h4":
      return "h4";
    case "body":
      return "p";
    case "small":
      return "span";
    default:
      return "p";
  }
}
