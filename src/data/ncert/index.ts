import class10Light from "./class-10-science-light.json";
import class9Atom from "./class-9-science-structure-of-atom.json";
import class7Plants from "./class-7-science-nutrition-in-plants.json";
import class8Light from "./class-8-science-light-dispersion.json";
import type { ArtifactKind, ThreeDKind, NcertModule } from "../../config/rules";
import type { VisualKind } from "../../remotion/types";

export interface SpokenLine {
  text: string;
  hold: number;
}

export interface LessonPage {
  pageNumber: number;
  pageType: "notes" | "video" | "artifact" | "3d";
  heading: string;
  notes?: string[];
  videoKind?: VisualKind;
  videoTitle?: string;
  artifactKind?: ArtifactKind;
  artifactTitle?: string;
  threeDKind?: ThreeDKind;
  threeDTitle?: string;
  spokenLines: SpokenLine[];
}

export interface MemorizeSection {
  conceptTitle: string;
  teacherRecitationPrompt: string;
  expectedRecitation: string;
  mustIncludeKeywords: string[];
  coachingHint: string;
}

export type PracticeQuestionType = "fill-in-the-blanks" | "mcq" | "true-false" | "short-answer";

export interface PracticeQuestion {
  id: string;
  type: PracticeQuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  acceptableAnswers?: string[];
  explanation: string;
}

export interface PracticeSection {
  title: string;
  questions: PracticeQuestion[];
}

export interface NcertChapterOutcomeModule {
  id: string;
  grade: number;
  subject: string;
  chapterNumber: number;
  chapterTitle: string;
  syllabus: string;
  summary: string;
  pages: LessonPage[];
  memorize: MemorizeSection;
  practice: PracticeSection;
}

export const NCERT_CHAPTER_MODULES: NcertChapterOutcomeModule[] = [
  class10Light as unknown as NcertChapterOutcomeModule,
  class9Atom as unknown as NcertChapterOutcomeModule,
  class7Plants as unknown as NcertChapterOutcomeModule,
  class8Light as unknown as NcertChapterOutcomeModule,
];

/**
 * Converts the outcome-based module into the app's NcertModule runtime format for legacy compatibility.
 */
export function toNcertModule(mod: NcertChapterOutcomeModule): NcertModule {
  const firstNotesPage = mod.pages.find((p) => p.pageType === "notes");
  const firstArtifactPage = mod.pages.find((p) => p.pageType === "artifact");
  const first3DPage = mod.pages.find((p) => p.pageType === "3d");

  return {
    id: mod.id,
    grade: mod.grade,
    subject: mod.subject,
    chapter: mod.chapterNumber,
    title: mod.chapterTitle,
    aliases: [
      mod.chapterTitle.toLowerCase(),
      mod.subject.toLowerCase(),
      ...mod.memorize.mustIncludeKeywords,
    ],
    boardHeading: firstNotesPage?.heading ?? mod.chapterTitle,
    notes: firstNotesPage?.notes ?? [],
    narration: mod.pages.flatMap((p) => p.spokenLines),
    artifact: firstArtifactPage?.artifactKind ?? "ray-slider",
    artifactTitle: firstArtifactPage?.artifactTitle ?? "Interactive Simulation",
    threeD: first3DPage?.threeDKind ?? "solid",
    threeDTitle: first3DPage?.threeDTitle ?? "3D Visual",
    examConcept: mod.memorize.expectedRecitation,
    examKeywords: mod.memorize.mustIncludeKeywords,
    hint: mod.memorize.coachingHint,
  };
}

/**
 * RAG Context Retriever: Returns the structured NCERT chapter with all 5 pages, memorize, and practice stages.
 */
export function retrieveOutcomeChapter(query: string): NcertChapterOutcomeModule | null {
  const q = query.toLowerCase();
  return (
    NCERT_CHAPTER_MODULES.find(
      (m) =>
        q.includes(m.id) ||
        q.includes(m.chapterTitle.toLowerCase()) ||
        q.includes(`class ${m.grade}`) ||
        m.memorize.mustIncludeKeywords.some((k) => q.includes(k.toLowerCase()))
    ) ?? null
  );
}
