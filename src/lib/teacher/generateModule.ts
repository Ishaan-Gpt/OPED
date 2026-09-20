import type { NcertModule } from "../../config/rules";

export interface ModuleRequest {
  grade: number;
  subject: string;
  chapter: number | undefined;
  /** the student's raw search text, for extra context on what they actually asked for */
  topic: string;
}

interface GeneratedFields {
  title: string;
  aliases: string[];
  boardHeading: string;
  notes: string[];
  narration: { text: string; hold: number }[];
  examConcept: string;
  examKeywords: string[];
  hint: string;
}

const SYSTEM_PROMPT = `You are an enthusiastic NCERT teacher preparing a brand-new, lively lesson for a
digital blackboard classroom. The student asked for a chapter that isn't pre-scripted yet, so you must
write the whole lesson yourself, accurate to the real NCERT syllabus for that class and subject.

Write like a teacher who is excited about the topic, not a textbook — short, punchy, concrete sentences.
No filler like "let's dive in" or "in this chapter we will learn". Get straight to the content.

Respond with ONLY compact JSON, no prose, matching exactly:
{
  "title": "short chapter title",
  "aliases": ["3-6 lowercase keywords a student might search"],
  "boardHeading": "heading shown on the blackboard",
  "notes": ["3-4 short factual notes, each one line, the kind you'd chalk on a board"],
  "narration": [
    {"text": "spoken line 1, energetic and concrete", "hold": 3.2},
    {"text": "spoken line 2", "hold": 3.6},
    {"text": "spoken line 3", "hold": 3.6},
    {"text": "spoken line 4, wraps the core idea", "hold": 3.4}
  ],
  "examConcept": "one sentence: the single most exam-important fact of this chapter",
  "examKeywords": ["4-7 short terms a student must say to prove they know examConcept"],
  "hint": "one sentence coaching the student on what to recite"
}
"hold" is seconds the line stays on screen (3 to 5). Keep notes and narration factually correct for
real NCERT content at the given class level — do not invent facts.`;

function isValid(x: unknown): x is GeneratedFields {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o["title"] === "string" &&
    Array.isArray(o["aliases"]) &&
    typeof o["boardHeading"] === "string" &&
    Array.isArray(o["notes"]) &&
    (o["notes"] as unknown[]).length > 0 &&
    Array.isArray(o["narration"]) &&
    (o["narration"] as unknown[]).length > 0 &&
    typeof o["examConcept"] === "string" &&
    Array.isArray(o["examKeywords"]) &&
    (o["examKeywords"] as unknown[]).length > 0 &&
    typeof o["hint"] === "string"
  );
}

/**
 * Generates a full lesson for a chapter that isn't in the pre-scripted NCERT_INDEX.
 * Server-only (reads GROQ_API_KEY) — called from the dev API middleware in vite.config.ts
 * locally, and from the deployed Lambda proxy in production. Never import from client code;
 * use src/lib/teacher/generateModuleClient.ts instead.
 */
export async function generateLessonModule(req: ModuleRequest): Promise<NcertModule | null> {
  const apiKey = process.env["GROQ_API_KEY"];
  if (!apiKey) return null;

  const model = process.env["GROQ_MODEL"] ?? "openai/gpt-oss-20b";
  const userMessage = [
    `Class: ${req.grade}`,
    `Subject: ${req.subject}`,
    req.chapter ? `Chapter number: ${req.chapter}` : null,
    `Student searched for: "${req.topic}"`,
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
        temperature: 0.6,
        max_tokens: 1200,
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = json.choices?.[0]?.message?.content ?? "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed: unknown = JSON.parse(match[0]);
    if (!isValid(parsed)) return null;

    const chapter = req.chapter ?? 1;
    return {
      id: `gen-c${req.grade}-${req.subject.toLowerCase().replace(/\s+/g, "")}-${chapter}`,
      grade: req.grade,
      subject: req.subject,
      chapter,
      title: parsed.title,
      aliases: parsed.aliases,
      boardHeading: parsed.boardHeading,
      notes: parsed.notes,
      narration: parsed.narration,
      // Generated chapters reuse the most content-neutral interactive widgets — the alternative,
      // letting the model pick from ray-slider/prism-spectrum/cell-labels, risks showing a fixed
      // widget (e.g. hardcoded atom shell labels) that doesn't match the generated topic at all.
      artifact: "number-line",
      artifactTitle: "Explore the idea",
      threeD: "solid",
      threeDTitle: "3D exploration",
      examConcept: parsed.examConcept,
      examKeywords: parsed.examKeywords,
      hint: parsed.hint,
    };
  } catch {
    return null;
  }
}
