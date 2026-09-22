import type { NcertChapterOutcomeModule, PracticeQuestion } from "@/data/ncert";
import { retrieveOutcomeChapter } from "@/data/ncert";
import type { CharacterState, ExpressionType, GestureType } from "@/character/types";

export interface StudentMasteryState {
  chapterId: string;
  chapterTitle: string;
  grade: number;
  subject: string;
  
  // Explain stage metrics
  explainCompleted: boolean;
  viewed3D: boolean;
  interactedArtifact: boolean;
  viewedExplainerVideo: boolean;
  
  // Memorize stage metrics
  recitationScore: number; // 0 to 100
  recitationAttempts: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  isRecitationPassed: boolean;
  
  // Practice stage metrics
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  practiceScore: number; // 0 to 100
  questionResults: {
    questionId: string;
    isCorrect: boolean;
    userAnswer: string;
    attempts: number;
  }[];

  // Overall Brutal Tracking Metrics
  struggleCount: number;
  adaptiveInterventionsCount: number;
  overallMasteryScore: number; // 0 to 100
  examReadinessRating: "Unprepared" | "Developing" | "Proficient" | "Exam-Ready Mastery";
}

export interface AgentPedagogicalDecision {
  teacherSpeech: string;
  characterState: CharacterState;
  expression: ExpressionType;
  gesture: GestureType;
  recommendedAction?: "show_3d" | "show_artifact" | "trigger_video" | "retry_recitation" | "start_practice" | "grant_mastery";
  feedbackRationale: string;
}

/**
 * Evaluates the student's spoken/text recitation against the chapter's mandatory NCERT keywords.
 */
export function evaluateStudentRecitation(
  transcript: string,
  expectedKeywords: string[]
): {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  passed: boolean;
} {
  const cleanTranscript = transcript.toLowerCase();
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const kw of expectedKeywords) {
    const cleanKw = kw.toLowerCase().trim();
    // Normalize formula notation if present
    const normalizedKw = cleanKw.replace(/\s+/g, "");
    const normalizedTranscript = cleanTranscript.replace(/\s+/g, "");

    if (cleanTranscript.includes(cleanKw) || normalizedTranscript.includes(normalizedKw)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  }

  const score = expectedKeywords.length > 0
    ? Math.round((matchedKeywords.length / expectedKeywords.length) * 100)
    : 100;

  // Outcome-based threshold: at least 70% of mandatory keywords must be present
  const passed = score >= 70;

  return {
    score,
    matchedKeywords,
    missingKeywords,
    passed,
  };
}

/**
 * Calculates real-time composite mastery and exam readiness.
 */
export function calculateMastery(state: StudentMasteryState): {
  overallScore: number;
  rating: StudentMasteryState["examReadinessRating"];
} {
  // 40% weight on recitation active recall, 50% on practice questions, 10% on multimodal engagement
  const recitationWeight = (state.recitationScore || 0) * 0.4;
  const practiceWeight = (state.practiceScore || 0) * 0.5;
  const engagementBonus = (state.viewed3D || state.interactedArtifact ? 10 : 0);

  // Penalty for excessive struggles / retries
  const strugglePenalty = Math.min(state.struggleCount * 4, 20);

  const rawScore = recitationWeight + practiceWeight + engagementBonus - strugglePenalty;
  const overallScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  let rating: StudentMasteryState["examReadinessRating"] = "Unprepared";
  if (overallScore >= 85) rating = "Exam-Ready Mastery";
  else if (overallScore >= 70) rating = "Proficient";
  else if (overallScore >= 50) rating = "Developing";

  return { overallScore, rating };
}

/**
 * The Teacher Agent's Realtime Brain:
 * Analyzes the student's current learning trajectory and decides the next pedagogical move.
 */
export function decideAgentNextStep(
  stage: "explain" | "artifact" | "memorize" | "practice" | "mastery",
  state: StudentMasteryState,
  outcomeModule: NcertChapterOutcomeModule | null
): AgentPedagogicalDecision {
  if (stage === "explain") {
    const has3D = outcomeModule?.pages?.some((p) => p.pageType === "3d");
    if (!state.viewed3D && has3D) {
      return {
        teacherSpeech: "Let's observe this in 3D space to build your mental model before we memorize.",
        characterState: "pointing",
        expression: "explaining",
        gesture: "pointRight",
        recommendedAction: "show_3d",
        feedbackRationale: "Visual grounding needed for conceptual foundation.",
      };
    }
    return {
      teacherSpeech: "Follow the blackboard points carefully. Every line is high-yield for your exam.",
      characterState: "idle",
      expression: "happy",
      gesture: "explainBothHands",
      feedbackRationale: "Standard paced explanation.",
    };
  }

  if (stage === "memorize") {
    if (state.recitationAttempts > 0 && !state.isRecitationPassed) {
      // Student struggled with recitation
      if (state.recitationAttempts >= 2 && !state.viewedExplainerVideo) {
        return {
          teacherSpeech: "You're missing a few key exam terms. Watch this short concept clip to reinforce it!",
          characterState: "thinking",
          expression: "confused",
          gesture: "pointLeft",
          recommendedAction: "trigger_video",
          feedbackRationale: "Adaptive video intervention triggered due to multiple failed recitation attempts.",
        };
      }
      return {
        teacherSpeech: `Good effort! But remember to clearly mention: ${state.missingKeywords.slice(0, 2).join(", ")}. Try reciting again!`,
        characterState: "wave",
        expression: "explaining",
        gesture: "explainOneHand",
        recommendedAction: "retry_recitation",
        feedbackRationale: "Coaching student on missing keywords.",
      };
    }

    if (state.isRecitationPassed) {
      return {
        teacherSpeech: "Outstanding recall! You nailed the core definitions. Now let's test your problem-solving in Practice!",
        characterState: "celebrate",
        expression: "happy",
        gesture: "thumbsUp",
        recommendedAction: "start_practice",
        feedbackRationale: "Active recall cleared with high accuracy.",
      };
    }

    return {
      teacherSpeech: outcomeModule?.memorize.teacherRecitationPrompt ?? "Recite the core exam concept aloud into your mic!",
      characterState: "idle",
      expression: "happy",
      gesture: "explainBothHands",
      feedbackRationale: "Awaiting initial recitation.",
    };
  }

  if (stage === "practice") {
    if (state.answeredQuestions > 0 && state.practiceScore < 50 && state.struggleCount > 2) {
      return {
        teacherSpeech: "Take a deep breath and review the hint. Focus on the core formula we established on the board.",
        characterState: "thinking",
        expression: "empathetic",
        gesture: "explainOneHand",
        feedbackRationale: "Student showing signs of struggle in practice stage.",
      };
    }

    if (state.answeredQuestions === state.totalQuestions && state.totalQuestions > 0) {
      return {
        teacherSpeech: "Practice complete! Let's generate your final verified exam readiness report.",
        characterState: "celebrate",
        expression: "happy",
        gesture: "thumbsUp",
        recommendedAction: "grant_mastery",
        feedbackRationale: "All practice questions completed.",
      };
    }

    return {
      teacherSpeech: "Answer the practice questions below to lock in your score.",
      characterState: "idle",
      expression: "happy",
      gesture: "pointLeft",
      feedbackRationale: "Practice session in progress.",
    };
  }

  // Mastery stage
  return {
    teacherSpeech: "Congratulations on completing your outcome-based lesson! Your mastery certificate is ready.",
    characterState: "celebrate",
    expression: "happy",
    gesture: "celebrate",
    feedbackRationale: "Lesson finalized.",
  };
}
