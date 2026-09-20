import type { TeacherContext, TeacherDecision } from "./decide";

/**
 * Client-safe call to the adaptive teacher's decision endpoint.
 * Dev: handled by the local Vite API middleware (vite.config.ts).
 * Prod: point this at the deployed Lambda Function URL, same pattern as src/lib/bedrock.ts.
 */
export async function decideTeacherMove(context: TeacherContext): Promise<TeacherDecision> {
  try {
    const res = await fetch("/api/teacher/decide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(context),
    });
    if (!res.ok) return { action: "continue" };
    return (await res.json()) as TeacherDecision;
  } catch {
    return { action: "continue" };
  }
}
