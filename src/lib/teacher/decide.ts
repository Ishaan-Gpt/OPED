import type { VideoBrief, VisualKind } from "../../../remotion/types";
import { VISUAL_KINDS } from "../../../remotion/types";

export interface TeacherContext {
  boardHeading: string;
  notes: string[];
  examConcept: string;
  /** the narration line the student is currently on */
  currentLine: string;
  stage: "understanding" | "artifact" | "recall";
  /** visualKinds already shown as a video earlier in this same lesson — never repeat one */
  usedVisualKinds?: VisualKind[];
}

export type TeacherDecision =
  { action: "continue" } | { action: "generate_video"; videoBrief: VideoBrief };

const FALLBACK: TeacherDecision = { action: "continue" };

/**
 * Each scene's animation is a FIXED 4-beat sequence (it doesn't read the bullet text — it just
 * plays beat 0's visual, then beat 1's, etc). So the bullets MUST describe exactly these four
 * beats, in this order, for whichever visualKind is picked — otherwise the video's captions say
 * one thing while the animation shows something unrelated ("literally something else").
 */
const CANONICAL_BEATS: Partial<Record<VisualKind, [string, string, string, string]>> = {
  reaction: [
    "reagent is added to the tube",
    "liquids mix and swirl together",
    "the mixture fizzes with bubbles",
    "the reaction settles/completes",
  ],
  ray: [
    "incident ray travels toward the mirror",
    "ray reflects off the flat mirror",
    "normal line and both angles are marked",
    "angle of incidence equals angle of reflection",
  ],
  concaveMirror: [
    "object is placed beyond the centre of curvature",
    "a ray parallel to the axis reflects through the focus",
    "a second ray through the pole confirms it",
    "a real, inverted image forms where rays cross",
  ],
  convexMirror: [
    "object is placed in front of the mirror",
    "a ray parallel to the axis travels toward the mirror",
    "the ray reflects outward, diverging",
    "a virtual, upright, smaller image forms behind the mirror",
  ],
  prism: [
    "a beam of white light travels toward the prism",
    "the beam enters the prism and refracts",
    "a VIBGYOR spectrum fans out on exit",
    "violet bends most, red bends least",
  ],
  refraction: [
    "a ray travels through the first medium toward the boundary",
    "the ray bends toward the normal entering the denser medium",
    "both angles (incidence and refraction) are labelled",
    "conclusion: the ray slows down and bends toward the normal",
  ],
  atom: [
    "the nucleus (protons + neutrons) is placed at the centre",
    "the first shell (K) fills with up to 2 electrons",
    "the second shell (L) fills with up to 8 electrons",
    "shell capacity rule 2n² is shown",
  ],
  rutherfordAtom: [
    "alpha particles are fired at a thin gold foil",
    "most particles pass straight through empty space",
    "a rare particle deflects sharply off the nucleus",
    "conclusion: the nucleus is tiny, dense and positive",
  ],
  photosynthesis: [
    "carbon dioxide enters the leaf through the stomata",
    "water rises up through the stem into the leaf",
    "sunlight is captured by chlorophyll in the leaf",
    "glucose is produced and oxygen is released",
  ],
  graph: [
    "the axes are drawn in",
    "data points are plotted one by one",
    "a line connects the points",
    "the key trend/steepest section is highlighted",
  ],
  cell: [
    "the cell membrane forms",
    "the nucleus appears at the centre",
    "organelles (mitochondria) populate the cytoplasm",
    "the labelled parts are recapped",
  ],
  circuit: [
    "the wire loop connects the components",
    "the switch closes",
    "current flows around the loop",
    "the bulb lights up",
  ],
  map: [
    "the region outline is drawn",
    "the compass rose appears",
    "a route traces across the map",
    "a location pin drops",
  ],
  equation: [
    "the original equation is shown",
    "the first operation is applied to both sides",
    "the equation is simplified further",
    "the final answer is isolated and boxed",
  ],
};

const CANONICAL_BEATS_TEXT = Object.entries(CANONICAL_BEATS)
  .map(
    ([kind, beats]) =>
      `  "${kind}": beat1=${beats[0]}; beat2=${beats[1]}; beat3=${beats[2]}; beat4=${beats[3]}`,
  )
  .join("\n");

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
  if (/prism|dispersion|vibgyor|spectrum/.test(text)) return "prism";
  if (/refract/.test(text) && brief.visualKind !== "prism") return "refraction";
  return brief.visualKind;
}

const SYSTEM_PROMPT = `You are an AI classroom teacher directing a live NCERT lesson blackboard.
After each narration beat you decide the single next best move for the student's understanding.
You may either let the lesson continue as normal, or trigger a short (max 15 second) generated
explainer video when — and only when — the current concept is genuinely easier to grasp in motion
(e.g. a ray diagram, a process, a transformation) than as static text.

CRITICAL — the animation for each visualKind is a FIXED 4-beat sequence; it does not read your
bullets, it just plays its own 4 beats in order. Your 4 bullets MUST describe exactly those 4 beats,
in order, for whichever visualKind you pick, or the captions will say something the animation isn't
showing. The canonical 4 beats per visualKind are:
${CANONICAL_BEATS_TEXT}
Only pick a visualKind whose canonical 4-beat story is genuinely what the current line is about. If
the current line is a narrow point that doesn't match any canonical 4-beat story below, prefer
"continue" over forcing a mismatched video.

If a visualKind is listed as ALREADY USED earlier in this lesson, do not pick it again — prefer
"continue", or a different visualKind only if it's a genuinely better fit than reusing one.

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
- "prism": white light entering a triangular prism and splitting into a VIBGYOR spectrum, violet
  bending most and red least — use for DISPERSION of light specifically, not general refraction
- "refraction": a ray crossing a boundary between two media (e.g. air to water) and bending toward
  the normal as it slows down — use for general refraction/bending of light through a single medium
  change, NOT for the prism/dispersion/rainbow case (use "prism" for that instead)
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
Keep bullets short (under 12 words each), exactly 4 bullets matching the 4 canonical beats above,
targetSeconds between 4 and 15.
Valid visualKind values: ${VISUAL_KINDS.join(", ")}.`;

async function callGroq(context: TeacherContext): Promise<TeacherDecision> {
  const apiKey = process.env["GROQ_API_KEY"] ?? process.env["VITE_GROQ_API_KEY"];
  if (!apiKey) return FALLBACK;

  const model = process.env["GROQ_MODEL"] ?? "openai/gpt-oss-20b";
  const usedKinds = context.usedVisualKinds ?? [];
  const userMessage = [
    `THE LINE TO MAKE A VIDEO ABOUT (if you decide to): "${context.currentLine}"`,
    ``,
    `Background context only — do not summarize all of this into the video:`,
    `Chapter: ${context.boardHeading}`,
    `Exam concept for the whole chapter: ${context.examConcept}`,
    `Board notes for the whole chapter: ${context.notes.join(" | ")}`,
    `Current stage: ${context.stage}`,
    usedKinds.length ? `ALREADY USED this lesson (do not repeat): ${usedKinds.join(", ")}` : null,
  ]
    .filter(Boolean)
    .join("\n");

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
        max_tokens: 700,
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
      const kind = VISUAL_KINDS.includes(refined as never) ? refined : "generic";
      // Deterministic guard: prose instructions alone don't reliably stop repeats, so enforce it.
      if (usedKinds.includes(kind)) return FALLBACK;
      parsed.videoBrief.visualKind = kind;
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
