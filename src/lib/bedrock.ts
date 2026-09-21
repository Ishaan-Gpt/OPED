/**
 * Client-safe "ask the teacher a question" streaming call.
 * Dev: handled by the local Vite API middleware (vite.config.ts).
 * Prod: point this at the deployed Lambda Function URL.
 *
 * The Groq call itself lives server-side in src/lib/teacher/chat.ts — this file must never read
 * an API key directly (a prior version read import.meta.env.VITE_GROQ_API_KEY here, which Vite
 * bakes into the client bundle in plaintext, publicly exposing the key to anyone viewing the page).
 */
export async function* streamTeacherResponse(userPrompt: string, context: string) {
  const response = await fetch("/api/teacher/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userPrompt, context }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Failed to connect to AI Teacher (HTTP ${response.status})`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield decoder.decode(value, { stream: true });
  }
}
