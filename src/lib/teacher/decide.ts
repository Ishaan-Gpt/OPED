import { createServerFn } from "@tanstack/react-start";
import type { VideoBrief } from "../../../remotion/types";

export interface TeacherContext {
  boardHeading: string;
  notes: string[];
  examConcept: string;
  /** the narration line the student is currently on */
  currentLine: string;
  stage: "understanding" | "artifact" | "recall";
}

export type TeacherDecision =
  { action: "continue" } | { action: "generate_video"; videoBrief: VideoBrief };

const FALLBACK: TeacherDecision = { action: "continue" };

const SYSTEM_PROMPT = `You are an AI classroom teacher directing a live NCERT lesson blackboard.
After each narration beat you decide the single next best move for the student's understanding.
You may either let the lesson continue as normal, or trigger a short (max 15 second) generated
explainer video when — and only when — the current concept is genuinely easier to grasp in motion
(e.g. a ray diagram, a process, a transformation) than as static text.
Respond with ONLY compact JSON, no prose, matching one of:
{"action":"continue"}
{"action":"generate_video","videoBrief":{"title":"...","bullets":["...","...","..."],"accent":"#2f9d8b","targetSeconds":10}}
Keep bullets short (under 12 words each), max 4 bullets, targetSeconds between 4 and 15.`;

async function retrieveGrounding(query: string): Promise<string | null> {
  const kbId = process.env["AWS_KNOWLEDGE_BASE_ID"];
  const token = process.env["AWS_BEARER_TOKEN_BEDROCK"];
  const region = process.env["AWS_REGION"] ?? "ap-south-1";
  if (!kbId || !token) return null;

  try {
    const res = await fetch(
      `https://bedrock-agent-runtime.${region}.amazonaws.com/knowledgebases/${kbId}/retrieve`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          retrievalQuery: { text: query },
          retrievalConfiguration: { vectorSearchConfiguration: { numberOfResults: 3 } },
        }),
      },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { retrievalResults?: { content?: { text?: string } }[] };
    return (
      (json.retrievalResults ?? [])
        .map((r) => r.content?.text)
        .filter(Boolean)
        .join("\n") || null
    );
  } catch {
    return null;
  }
}

async function callBedrock(
  context: TeacherContext,
  grounding: string | null,
): Promise<TeacherDecision> {
  const token = process.env["AWS_BEARER_TOKEN_BEDROCK"];
  const region = process.env["AWS_REGION"] ?? "ap-south-1";
  if (!token) return FALLBACK;

  const modelId = "anthropic.claude-3-5-sonnet-20241022-v2:0";
  const userMessage = [
    `Chapter: ${context.boardHeading}`,
    `Exam concept to secure: ${context.examConcept}`,
    `Board notes: ${context.notes.join(" | ")}`,
    grounding ? `Reference material: ${grounding}` : null,
    `Current stage: ${context.stage}`,
    `Current narration line: "${context.currentLine}"`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch(
      `https://bedrock-runtime.${region}.amazonaws.com/model/${modelId}/converse`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          system: [{ text: SYSTEM_PROMPT }],
          messages: [{ role: "user", content: [{ text: userMessage }] }],
          inferenceConfig: { maxTokens: 400, temperature: 0.4 },
        }),
      },
    );
    if (!res.ok) return FALLBACK;
    const json = (await res.json()) as {
      output?: { message?: { content?: { text?: string }[] } };
    };
    const text = json.output?.message?.content?.map((c) => c.text).join("") ?? "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return FALLBACK;
    const parsed = JSON.parse(match[0]) as TeacherDecision;
    if (
      parsed.action === "generate_video" &&
      parsed.videoBrief?.title &&
      parsed.videoBrief?.bullets?.length
    ) {
      return parsed;
    }
    if (parsed.action === "continue") return parsed;
    return FALLBACK;
  } catch {
    return FALLBACK;
  }
}

/** The adaptive teacher's single decision point: continue narrating, or generate a short video. */
export const decideTeacherMove = createServerFn({ method: "POST" })
  .validator((context: TeacherContext) => context)
  .handler(async ({ data }) => {
    const grounding = await retrieveGrounding(`${data.boardHeading}: ${data.currentLine}`);
    return callBedrock(data, grounding);
  });
