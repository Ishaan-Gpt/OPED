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

/**
 * The model doesn't reliably follow the visualKind guidance for a few easily-confused pairs
 * (Rutherford's nucleus discovery vs. general Bohr shell-building both look like "atom" content
 * to it at this temperature). Keyword overrides catch the cases prose instructions alone miss.
 */
function refineVisualKind(context: TeacherContext, brief: VideoBrief): VideoBrief["visualKind"] {
  const text = `${context.currentLine} ${brief.title} ${brief.bullets.join(" ")}`.toLowerCase();
  if (/rutherford|gold foil|alpha particle/.test(text)) return "rutherfordAtom";
  if (/concave/.test(text)) return "concaveMirror";
  if (/convex/.test(text)) return "convexMirror";
  return brief.visualKind;
}

const SYSTEM_PROMPT = `You are an AI classroom teacher directing a live NCERT lesson blackboard.
After each narration beat you decide the single next best move for the student's understanding.
You may either let the lesson continue as normal, or trigger a short (max 15 second) generated
explainer video when — and only when — the current concept is genuinely easier to grasp in motion
(e.g. a ray diagram, a process, a transformation) than as static text.

CRITICAL: the video must be about the CURRENT NARRATION LINE specifically, not the whole chapter.
The chapter/notes/exam-concept fields are background context only, to help you understand the
subject — do NOT summarize all of them into one generic "full cycle" video. If the current line is
about one narrow sub-step (e.g. just how water enters the stem), the video's title and all 4 bullets
must stay on that one sub-step in more depth, not restate the entire process from the beginning.
Two different narration lines in the same chapter must never produce near-identical bullets — if you
notice your bullets would basically repeat what an earlier beat already covered, narrow your focus
further into just this line's specific detail instead.

When you trigger a video, you must also pick "visualKind" — the animated illustration the video
will actually show. Pick the closest real match, even if imperfect — only fall back to "generic"
when truly nothing else fits, from exactly these options:
- "reaction": a test tube with bubbling, color-changing liquid — chemical reactions, acids/bases, mixing
- "ray": a flat (plane) mirror with a ray bouncing off it, angle of incidence = angle of reflection —
  use ONLY for the general law of reflection or a plane/flat mirror, NOT for curved mirrors
- "concaveMirror": a curved mirror where parallel rays converge through a real focus to form a real,
  inverted image — use specifically for CONCAVE mirrors (converging mirrors)
- "convexMirror": a curved mirror where rays diverge outward, forming a virtual, upright, smaller
  image behind the mirror — use specifically for CONVEX mirrors (diverging mirrors)
- "atom": a nucleus with electron shells filling in one by one — Bohr's model, shell capacity
  (2n² rule), K/L/M shells, general "building the atom" content
- "rutherfordAtom": the gold foil experiment — alpha particles fired at a foil, most pass straight
  through empty space, a rare one deflects off a tiny dense nucleus — use for RUTHERFORD's model
  specifically, even if the line doesn't say "gold foil" explicitly (e.g. "nearly all the mass sits
  in a tiny, positively charged nucleus" is Rutherford's finding and belongs here, NOT in "atom")
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
  const apiKey = process.env["GROQ_API_KEY"] ?? process.env["VITE_GROQ_API_KEY"];
  if (!apiKey) return FALLBACK;

  const model = process.env["GROQ_MODEL"] ?? "openai/gpt-oss-20b";
  const userMessage = [
    `THE LINE TO MAKE A VIDEO ABOUT (if you decide to): "${context.currentLine}"`,
    ``,
    `Background context only — do not summarize all of this into the video:`,
    `Chapter: ${context.boardHeading}`,
    `Exam concept for the whole chapter: ${context.examConcept}`,
    `Board notes for the whole chapter: ${context.notes.join(" | ")}`,
    `Current stage: ${context.stage}`,
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
      const refined = refineVisualKind(context, parsed.videoBrief) ?? "generic";
      parsed.videoBrief.visualKind = VISUAL_KINDS.includes(refined as never) ? refined : "generic";
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
