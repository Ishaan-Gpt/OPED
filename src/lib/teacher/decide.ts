import type { VideoBrief } from "../../../remotion/types";
import { VISUAL_KINDS } from "../../../remotion/types";

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

When you trigger a video, you must also pick "visualKind" — the animated illustration the video
will actually show. Pick the closest real match, even if imperfect — only fall back to "generic"
when truly nothing else fits, from exactly these options:
- "reaction": a test tube with bubbling, color-changing liquid — chemical reactions, acids/bases, mixing
- "ray": a light ray hitting a mirror and reflecting — optics, reflection, refraction, angles
- "atom": electrons orbiting a nucleus — atomic structure, bonding, particles
- "photosynthesis": sunlight hitting a leaf producing glucose — plant/biological processes, energy flow
- "graph": a line graph drawing itself — data trends, proportional relationships, statistics
- "cell": a cell membrane forming with a nucleus and organelles — cell biology, tissues, organisms
- "circuit": a wire loop with a switch, current, and a bulb lighting up — electricity, circuits, conductors
- "map": a region outline with a compass rose and a route/pin — geography, directions, locations, social studies
- "equation": an algebraic equation solving step by step — algebra, solving for a variable, arithmetic rules
- "generic": abstract orbiting shapes — last resort only
Never invent a visualKind outside this list.

Respond with ONLY compact JSON, no prose, matching one of:
{"action":"continue"}
{"action":"generate_video","videoBrief":{"title":"...","bullets":["...","...","..."],"accent":"#2f9d8b","targetSeconds":10,"visualKind":"reaction"}}
Keep bullets short (under 12 words each), max 4 bullets, targetSeconds between 4 and 15.
Valid visualKind values: ${VISUAL_KINDS.join(", ")}.`;

async function callGroq(context: TeacherContext): Promise<TeacherDecision> {
  const apiKey = process.env["GROQ_API_KEY"];
  if (!apiKey) return FALLBACK;

  const model = process.env["GROQ_MODEL"] ?? "openai/gpt-oss-120b";
  const userMessage = [
    `Chapter: ${context.boardHeading}`,
    `Exam concept to secure: ${context.examConcept}`,
    `Board notes: ${context.notes.join(" | ")}`,
    `Current stage: ${context.stage}`,
    `Current narration line: "${context.currentLine}"`,
  ].join("\n");

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.4,
        max_tokens: 600,
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) return FALLBACK;
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = json.choices?.[0]?.message?.content ?? "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return FALLBACK;
    const parsed = JSON.parse(match[0]) as TeacherDecision;
    if (
      parsed.action === "generate_video" &&
      parsed.videoBrief?.title &&
      parsed.videoBrief?.bullets?.length
    ) {
      if (!VISUAL_KINDS.includes(parsed.videoBrief.visualKind as never)) {
        parsed.videoBrief.visualKind = "generic";
      }
      return parsed;
    }
    if (parsed.action === "continue") return parsed;
    return FALLBACK;
  } catch {
    return FALLBACK;
  }
}

/**
 * The adaptive teacher's single decision point: continue narrating, or generate a short video.
 * Server-only (reads GROQ_API_KEY) — called from the dev API middleware in vite.config.ts
 * locally, and from the deployed Lambda proxy in production. Never import this from client code;
 * use src/lib/teacher/client.ts instead.
 */
export async function decideTeacherMove(context: TeacherContext): Promise<TeacherDecision> {
  return callGroq(context);
}
