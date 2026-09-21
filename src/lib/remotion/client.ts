import type { VideoBrief } from "../../../remotion/types";
import type { RenderedClip } from "./render";
import { getPreloadedVideo } from "./preloadedVideos";

/**
 * Client-safe call to retrieve or generate a lesson video clip.
 * 1. Checks preloaded static video cache first (instant 0ms response).
 * 2. Falls back to live generation endpoint if not preloaded.
 */
export async function generateLessonVideo(brief: VideoBrief): Promise<RenderedClip> {
  // 1. Instant cache hit
  const preloaded = getPreloadedVideo(brief.visualKind);
  if (preloaded) {
    return {
      url: preloaded.url,
      durationSeconds: preloaded.durationSeconds,
    };
  }

  // 2. Fallback to API generation
  try {
    const res = await fetch("/api/video/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(brief),
    });
    if (!res.ok) throw new Error(`Video generation failed: ${res.status}`);
    return (await res.json()) as RenderedClip;
  } catch (e) {
    // If backend generation is unavailable, use generic fallback video
    const fallback = getPreloadedVideo("generic");
    if (fallback) {
      return {
        url: fallback.url,
        durationSeconds: fallback.durationSeconds,
      };
    }
    throw e;
  }
}
