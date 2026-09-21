import type { LessonPage } from "@/data/ncert";

interface DynamicSlideRequest {
  userPrompt: string;
  chapterTitle: string;
  grade: number;
  subject: string;
  studentName?: string;
  currentNotes?: string[];
}

const SYSTEM_PROMPT = `You are Dr. Rao, an expert and enthusiastic NCERT school teacher for Indian students.
The student has interrupted the class or asked a specific question/request.
Your task is to generate 2 to 5 fresh, high-yield, structured blackboard pages (slides) that directly answer the student's request with deep clarity.

Respond with ONLY valid JSON matching this schema:
{
  "teacherSpokenIntro": "1-2 spoken sentences directly acknowledging the student and introducing the new slides",
  "slides": [
    {
      "pageNumber": 1,
      "pageType": "notes",
      "heading": "Clear blackboard chalk heading",
      "notes": [
        "• Structured bullet note 1",
        "• Structured bullet note 2",
        "• Structured bullet note 3"
      ],
      "spokenLines": [
        {"text": "Spoken line 1 in natural teacher tone", "hold": 4.0},
        {"text": "Spoken line 2 in natural teacher tone", "hold": 4.0}
      ]
    }
  ]
}`;

/**
 * Dynamically generates new blackboard slides and spoken narration on the fly using the server LLM.
 */
export async function generateDynamicLessonPages(
  req: DynamicSlideRequest
): Promise<{ teacherSpokenIntro: string; slides: LessonPage[] }> {
  const apiKey = process.env["GROQ_API_KEY"] ?? process.env["VITE_GROQ_API_KEY"];
  
  // High quality local fallback if API key is not present
  const fallbackIntro = `Great question, ${req.studentName || "student"}! Let me break down "${req.userPrompt}" on the blackboard with dedicated slides.`;
  const fallbackSlides: LessonPage[] = [
    {
      pageNumber: 1,
      pageType: "notes",
      heading: `Deep-Dive: ${req.userPrompt.slice(0, 40)}`,
      notes: [
        `• Core Principle: Detailed breakdown for NCERT Class ${req.grade} ${req.subject}.`,
        `• Step-by-Step Mechanism: Focused on understanding the underlying mechanism.`,
        `• Board Exam Relevance: High-yield definitions and conceptual applications.`,
      ],
      spokenLines: [
        {
          text: `Let's look at ${req.userPrompt} in greater detail on the blackboard.`,
          hold: 4.0,
        },
        {
          text: `Pay special attention to the core mechanism and how it applies to your exam questions.`,
          hold: 4.2,
        },
      ],
    },
  ];

  if (!apiKey) {
    return {
      teacherSpokenIntro: fallbackIntro,
      slides: fallbackSlides,
    };
  }

  const model = process.env["GROQ_MODEL"] ?? "openai/gpt-oss-20b";
  const userContent = `Student Name: ${req.studentName || "Student"}\nNCERT Chapter: Class ${req.grade} ${req.subject} — ${req.chapterTitle}\nExisting Chapter Notes: ${req.currentNotes?.join(" | ") || "N/A"}\nStudent's Request/Doubt: "${req.userPrompt}"`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        temperature: 0.5,
        max_tokens: 1500,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) return { teacherSpokenIntro: fallbackIntro, slides: fallbackSlides };

    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return { teacherSpokenIntro: fallbackIntro, slides: fallbackSlides };

    const parsed = JSON.parse(content) as {
      teacherSpokenIntro?: string;
      slides?: LessonPage[];
    };

    if (parsed.slides && Array.isArray(parsed.slides) && parsed.slides.length > 0) {
      return {
        teacherSpokenIntro: parsed.teacherSpokenIntro || fallbackIntro,
        slides: parsed.slides,
      };
    }

    return { teacherSpokenIntro: fallbackIntro, slides: fallbackSlides };
  } catch (err) {
    console.error("Dynamic slide generation error:", err);
    return { teacherSpokenIntro: fallbackIntro, slides: fallbackSlides };
  }
}
