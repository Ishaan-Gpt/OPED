import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type IconName = "arrow-right" | "menu" | "close" | "star";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 24, className, ...props }: IconProps) {
  const baseClasses = "inline-block flex-shrink-0 text-current";
  
  const getPath = () => {
    switch (name) {
      case "arrow-right":
        return <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />;
      case "menu":
        return <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />;
      case "close":
        return <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />;
      case "star":
        return <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />;
      default:
        return null;
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width={size}
      height={size}
      className={cn(baseClasses, className)}
      {...props}
    >
      {getPath()}
    </svg>
  );
}
