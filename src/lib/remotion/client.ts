import type { VideoBrief } from "../../../remotion/types";
import type { RenderedClip } from "./render";

/**
 * Client-safe call to the video-generation endpoint.
 * Dev: handled by the local Vite API middleware (vite.config.ts).
 * Prod: point this at the deployed Lambda Function URL, same pattern as src/lib/bedrock.ts.
 */
export async function generateLessonVideo(brief: VideoBrief): Promise<RenderedClip> {
  const res = await fetch("/api/video/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(brief),
  });
  if (!res.ok) throw new Error(`Video generation failed: ${res.status}`);
  return (await res.json()) as RenderedClip;
}
