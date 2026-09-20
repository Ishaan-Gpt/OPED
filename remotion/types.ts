export interface VideoBrief {
  title: string;
  bullets: string[];
  /** hex accent color, defaults to the board's teal */
  accent?: string;
  /** desired clip length in seconds, capped to MAX_VIDEO_SECONDS */
  targetSeconds?: number;
}

export const FPS = 30;
export const MAX_VIDEO_SECONDS = 15;
export const MAX_VIDEO_FRAMES = FPS * MAX_VIDEO_SECONDS;

export function clampFrames(targetSeconds: number | undefined): number {
  const seconds = Math.min(Math.max(targetSeconds ?? 10, 4), MAX_VIDEO_SECONDS);
  return Math.round(seconds * FPS);
}
