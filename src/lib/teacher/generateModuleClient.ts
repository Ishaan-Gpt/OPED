import type { NcertModule } from "../../config/rules";
import type { ModuleRequest } from "./generateModule";

/**
 * Client-safe call to generate a lesson for a chapter that isn't pre-scripted.
 * Dev: handled by the local Vite API middleware (vite.config.ts).
 * Prod: point this at the deployed Lambda Function URL, same pattern as src/lib/bedrock.ts.
 */
export async function generateLessonModule(req: ModuleRequest): Promise<NcertModule | null> {
  try {
    const res = await fetch("/api/lesson/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (!res.ok) return null;
    return (await res.json()) as NcertModule;
  } catch {
    return null;
  }
}
