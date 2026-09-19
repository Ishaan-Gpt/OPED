import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  container?: boolean;
}

export function Section({ className, container = true, children, ...props }: SectionProps) {
  return (
    <section className={cn("py-20 md:py-32 w-full", className)} {...props}>
      {container ? (
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
}
