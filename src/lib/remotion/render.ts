import { createServerFn } from "@tanstack/react-start";
import path from "node:path";
import type { VideoBrief } from "../../../remotion/types";
import { clampFrames } from "../../../remotion/types";

export interface RenderedClip {
  url: string;
  durationSeconds: number;
}

const ENTRY_POINT = path.join(process.cwd(), "remotion", "index.ts");
const COMPOSITION_ID = "ExplainerClip";

async function renderLocally(brief: VideoBrief): Promise<RenderedClip> {
  const { bundle } = await import("@remotion/bundler");
  const { renderMedia, selectComposition } = await import("@remotion/renderer");
  const { randomUUID } = await import("node:crypto");
  const fs = await import("node:fs");

  const bundleLocation = await bundle({ entryPoint: ENTRY_POINT });
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: COMPOSITION_ID,
    inputProps: brief as unknown as Record<string, unknown>,
  });

  const outDir = path.join(process.cwd(), "public", "generated");
  fs.mkdirSync(outDir, { recursive: true });
  const fileName = `${randomUUID()}.mp4`;
  const outputLocation = path.join(outDir, fileName);

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation,
    inputProps: brief as unknown as Record<string, unknown>,
  });

  return {
    url: `/generated/${fileName}`,
    durationSeconds: clampFrames(brief.targetSeconds) / 30,
  };
}

async function renderOnLambda(brief: VideoBrief): Promise<RenderedClip> {
  const { renderMediaOnLambda, getRenderProgress } = await import("@remotion/lambda/client");

  const functionName = process.env["REMOTION_AWS_FUNCTION_NAME"];
  const serveUrl = process.env["REMOTION_AWS_SERVE_URL"];
  const region = (process.env["AWS_REGION"] ?? "ap-south-1") as "ap-south-1";
  if (!functionName || !serveUrl) {
    throw new Error(
      "Remotion Lambda is not configured — set REMOTION_AWS_FUNCTION_NAME and REMOTION_AWS_SERVE_URL (see REMOTION_AWS_DEPLOY.md).",
    );
  }

  const { renderId, bucketName } = await renderMediaOnLambda({
    region,
    functionName,
    serveUrl,
    composition: COMPOSITION_ID,
    inputProps: brief as unknown as Record<string, unknown>,
    codec: "h264",
    framesPerLambda: 20,
  });

  for (;;) {
    const progress = await getRenderProgress({ renderId, bucketName, functionName, region });
    if (progress.done && progress.outputFile) {
      return { url: progress.outputFile, durationSeconds: clampFrames(brief.targetSeconds) / 30 };
    }
    if (progress.fatalErrorEncountered) {
      throw new Error(
        progress.errors.map((e) => e.message).join("; ") || "Remotion Lambda render failed",
      );
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
}

/** Renders a short (<=15s) explainer clip for the given brief and returns a playable URL. */
export const generateLessonVideo = createServerFn({ method: "POST" })
  .validator((brief: VideoBrief) => brief)
  .handler(async ({ data }) => {
    const target = process.env["REMOTION_RENDER_TARGET"] === "lambda" ? "lambda" : "local";
    return target === "lambda" ? renderOnLambda(data) : renderLocally(data);
  });
