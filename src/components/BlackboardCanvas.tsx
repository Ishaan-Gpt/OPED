import { AnimatePresence, motion } from "framer-motion";
import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { NcertModule } from "@/config/rules";
import { RULES } from "@/config/rules";
import { motionTokens } from "@/styles/designSystem";
import { BOARD_LAYOUT_ID } from "@/components/SearchMorph";
import CaptionsBar from "@/components/CaptionsBar";
import ArtifactViewer from "@/components/ArtifactViewer";
import RecitationHUD from "@/components/RecitationHUD";
import PracticeHUD from "@/components/PracticeHUD";
import EmbeddedThreeDCanvas from "@/components/EmbeddedThreeDCanvas";
import EmbeddedVideoPlayer from "@/components/EmbeddedVideoPlayer";
import RightChatDrawer from "@/components/RightChatDrawer";
import { BrandMark, CheckSealIcon, TeacherIcon, EnterIcon } from "@/components/icons";
import { Sparkles, Brain, Target, BookOpen, CheckCircle2, ChevronRight, User, MessageSquare, Mic, MicOff } from "lucide-react";
import { AnimatedTeacher } from "@/character/AnimatedTeacher";
import type {
  CharacterState,
  ExpressionType,
  GestureType,
  GazeTarget,
  PointTarget,
  PositionPreset,
} from "@/character/types";
import { DemoControls } from "@/demo/DemoControls";
import { generateLessonVideo } from "@/lib/remotion/client";
import { streamTeacherResponse } from "@/lib/bedrock";
import MasteryOutcome from "@/components/MasteryOutcome";
import { retrieveOutcomeChapter, type LessonPage } from "@/data/ncert";
import type { StudentMasteryState } from "@/lib/teacher/agentOrchestrator";
import { calculateMastery, decideAgentNextStep } from "@/lib/teacher/agentOrchestrator";
import { generateDynamicLessonPages } from "@/lib/teacher/dynamicSlideGenerator";
import { speechPlayer } from "@/lib/audio/speechPlayer";
import Experience from "@/components/Experience";

interface Props {
  module: NcertModule;
  onExit: () => void;
}

export function BlackboardCanvas({ module, onExit }: Props) {
  // Retrieve authentic multi-page NCERT chapter module
  const outcomeModule = useMemo(() => {
    return retrieveOutcomeChapter(module.title) || retrieveOutcomeChapter(`c${module.grade}-${module.chapter}`);
  }, [module.title, module.grade, module.chapter]);

  // Student Onboarding State
  const [studentName, setStudentName] = useState<string>("");
  const [isNameModalOpen, setIsNameModalOpen] = useState(true);
  const [nameInput, setNameInput] = useState("");

  // Classroom Multi-Page & Multi-Stage State
  const initialPages: LessonPage[] = useMemo(() => {
    if (outcomeModule?.pages?.length) return outcomeModule.pages;
    return [
      {
        pageNumber: 1,
        pageType: "notes",
        heading: module.boardHeading,
        notes: module.notes,
        spokenLines: module.narration,
      },
    ];
  }, [outcomeModule, module]);

  const [pages, setPages] = useState<LessonPage[]>(initialPages);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [classroomStage, setClassroomStage] = useState<"onboarding" | "lesson_pages" | "memorize" | "practice" | "mastery">("onboarding");

  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [visibleNotesCount, setVisibleNotesCount] = useState(1);
  const [speaking, setSpeaking] = useState(true);
  const [currentCaption, setCurrentCaption] = useState("");
  const [teacherRepeat, setTeacherRepeat] = useState(0);
  const [captionSpeaker, setCaptionSpeaker] = useState("Dr. Rao");
  const [isStudentSpeaking, setIsStudentSpeaking] = useState(false);

  // Embedded Video State
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  // Floating Chat Drawer State
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Microphone Speech Recognition State
  const [isMicActive, setIsMicActive] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  // Student Telemetry State
  const [masteryState, setMasteryState] = useState<StudentMasteryState>({
    chapterId: module.id,
    chapterTitle: module.title,
    grade: module.grade,
    subject: module.subject,
    explainCompleted: false,
    viewed3D: false,
    interactedArtifact: false,
    viewedExplainerVideo: false,
    recitationScore: 0,
    recitationAttempts: 0,
    matchedKeywords: [],
    missingKeywords: [],
    isRecitationPassed: false,
    totalQuestions: outcomeModule?.practice?.questions?.length ?? 3,
    answeredQuestions: 0,
    correctAnswers: 0,
    practiceScore: 0,
    questionResults: [],
    struggleCount: 0,
    adaptiveInterventionsCount: 0,
    overallMasteryScore: 0,
    examReadinessRating: "Developing",
  });

  // 3D Avatar state
  const [isTeacherActive, setIsTeacherActive] = useState(true);
  const [teacherGreeting, setTeacherGreeting] = useState<string | null>(null);
  const [showStudioControls, setShowStudioControls] = useState(false);
  const [customState, setCustomState] = useState<CharacterState | null>(null);
  const [customExpression, setCustomExpression] = useState<ExpressionType | null>(null);
  const [customGesture, setCustomGesture] = useState<GestureType | null>(null);
  const [customGaze, setCustomGaze] = useState<GazeTarget | null>(null);
  const [customPoint, setCustomPoint] = useState<PointTarget | null>(null);
  const [customPosition, setCustomPosition] = useState<PositionPreset>("bottom-right");
  const [is3DClassroomActive, setIs3DClassroomActive] = useState<boolean>(true);
  const boardCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentPage = pages[activePageIndex] ?? pages[0]!;

  // --------------------------------------------------------------------------
  // ONBOARDING: Handle Name Submission
  // --------------------------------------------------------------------------
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = nameInput.trim() || "Student";
    setStudentName(finalName);
    setIsNameModalOpen(false);
    setClassroomStage("lesson_pages");
    setActivePageIndex(0);
    setCurrentLineIndex(0);
    setVisibleNotesCount(1);
    setSpeaking(true);
    setCaptionSpeaker("Dr. Rao");
    setIsStudentSpeaking(false);
    setCurrentCaption(`Hello ${finalName}! I'm Dr. Rao. Let's master NCERT Class ${module.grade} ${module.subject}: ${module.title}.`);
  };

  // --------------------------------------------------------------------------
  // PAGE-BY-PAGE LESSON DRIVER (Pure Voice-Driven Progression)
  // --------------------------------------------------------------------------
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (classroomStage !== "lesson_pages" || isMicActive || !currentPage) return;

    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }

    // 1. If this page is a video page, preload the video
    if (currentPage.pageType === "video" && currentPage.videoKind) {
      setMasteryState((prev) => ({ ...prev, viewedExplainerVideo: true }));
      void generateLessonVideo({
        title: currentPage.videoTitle || "Concept Video",
        bullets: module.notes.slice(0, 4) as [string, string, string, string],
        accent: "#2f9d8b",
        targetSeconds: 10,
        visualKind: currentPage.videoKind as any,
      }).then((clip) => {
        setActiveVideoUrl(clip.url);
      });
    }

    // 2. Drive the spoken lines of the current page
    const spokenLines = currentPage.spokenLines;
    const currentLine = spokenLines[currentLineIndex];

    if (!currentLine) {
      // Finished all lines on this page
      if (activePageIndex + 1 < pages.length) {
        pauseTimerRef.current = setTimeout(() => {
          setActivePageIndex((prev) => prev + 1);
          setCurrentLineIndex(0);
          setVisibleNotesCount(1);
        }, 1500);
      } else {
        pauseTimerRef.current = setTimeout(() => {
          setClassroomStage("memorize");
          startMemorizeStage();
        }, 1500);
      }
      return;
    }

    setSpeaking(true);
    setCaptionSpeaker("Dr. Rao");
    setIsStudentSpeaking(false);

    const spokenText =
      studentName && currentLineIndex === 0 && activePageIndex === 0
        ? currentLine.text.replace("Welcome to class!", `Welcome to class, ${studentName}!`)
        : currentLine.text;
    setCurrentCaption(spokenText);

    // If on a notes page, reveal notes progressively as lines are spoken
    if (currentPage.pageType === "notes" && currentPage.notes?.length) {
      const notesLen = currentPage.notes.length;
      const count = Math.min(
        notesLen,
        Math.floor(((currentLineIndex + 1) / spokenLines.length) * notesLen) + 1
      );
      setVisibleNotesCount((prev) => Math.max(prev, count));
    }

    // Play voice and ONLY advance when speech naturally concludes
    void speechPlayer.playSpokenLine({
      text: spokenText,
      chapterId: module.id,
      pageNumber: currentPage.pageNumber,
      lineIndex: currentLineIndex,
      onEnd: () => {
        setSpeaking(false);
        // After teacher finishes speaking the sentence, pause briefly to let student digest
        pauseTimerRef.current = setTimeout(() => {
          if (currentLineIndex + 1 < spokenLines.length) {
            setCurrentLineIndex((prev) => prev + 1);
          } else {
            // End of this slide's voiceover: notes & video slides auto-advance smoothly after speech finishes
            if (currentPage.pageType === "notes" || currentPage.pageType === "video") {
              if (activePageIndex + 1 < pages.length) {
                setActivePageIndex((prev) => prev + 1);
                setCurrentLineIndex(0);
                setVisibleNotesCount(1);
              } else {
                setClassroomStage("memorize");
                startMemorizeStage();
              }
            } else if (currentPage.pageType === "artifact" || currentPage.pageType === "3d") {
              // Interactive slides give the student a comfortable moment to explore the 2D/3D model
              pauseTimerRef.current = setTimeout(() => {
                if (activePageIndex + 1 < pages.length) {
                  setActivePageIndex((prev) => prev + 1);
                  setCurrentLineIndex(0);
                  setVisibleNotesCount(1);
                } else {
                  setClassroomStage("memorize");
                  startMemorizeStage();
                }
              }, 4500);
            }
          }
        }, 1200);
      },
    });

    return () => {
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
        pauseTimerRef.current = null;
      }
    };
  }, [classroomStage, isMicActive, activePageIndex, currentLineIndex, currentPage, pages, module, studentName]);

  const handleNextSlide = useCallback(() => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    speechPlayer.stopAll();
    if (activePageIndex + 1 < pages.length) {
      setActivePageIndex((prev) => prev + 1);
      setCurrentLineIndex(0);
      setVisibleNotesCount(1);
    } else {
      setClassroomStage("memorize");
      startMemorizeStage();
    }
  }, [activePageIndex, pages.length]);

  const handlePrevSlide = useCallback(() => {
    if (activePageIndex > 0) {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      speechPlayer.stopAll();
      setActivePageIndex((prev) => prev - 1);
      setCurrentLineIndex(0);
      setVisibleNotesCount(1);
    }
  }, [activePageIndex]);

  const handleReplayCurrentSlide = useCallback(() => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    speechPlayer.stopAll();
    setCurrentLineIndex(0);
    setVisibleNotesCount(1);
  }, []);

  // --------------------------------------------------------------------------
  // DYNAMIC SLIDE GENERATION (Triggered by Voice or Chat)
  // --------------------------------------------------------------------------
  const handleDynamicStudentRequest = async (userPrompt: string) => {
    setSpeaking(true);
    setCaptionSpeaker("Dr. Rao");
    setIsStudentSpeaking(false);
    setCurrentCaption(`Let me prepare dedicated blackboard slides on "${userPrompt}", ${studentName || "student"}...`);

    const result = await generateDynamicLessonPages({
      userPrompt,
      chapterTitle: module.title,
      grade: module.grade,
      subject: module.subject,
      studentName,
      currentNotes: currentPage.notes || [],
    });

    if (result.slides && result.slides.length > 0) {
      // Inset dynamic slides right after current slide
      setPages((prev) => {
        const next = [...prev];
        next.splice(activePageIndex + 1, 0, ...result.slides);
        return next;
      });

      // Jump to the newly created dynamic slide
      setActivePageIndex((prev) => prev + 1);
      setCurrentLineIndex(0);
      setVisibleNotesCount(1);
      setClassroomStage("lesson_pages");
      setCurrentCaption(result.teacherSpokenIntro);
    }
  };

  // --------------------------------------------------------------------------
  // LIVE MICROPHONE HANDLER (Pauses Flow & Captures Voice)
  // --------------------------------------------------------------------------
  const toggleMic = () => {
    if (isMicActive) {
      // Turn OFF mic and process what the student said
      setIsMicActive(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      if (speechTranscript.trim()) {
        const query = speechTranscript.trim();
        setSpeechTranscript("");
        void handleDynamicStudentRequest(query);
      }
    } else {
      // Turn ON mic -> Pause teacher flow and listen
      setIsMicActive(true);
      setSpeaking(false);
      setCaptionSpeaker(`[${studentName || "Student"}]`);
      setIsStudentSpeaking(true);
      setCurrentCaption("Listening... Speak your question or say 'Explain more from start'...");

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-IN";

        recognition.onresult = (event: any) => {
          const current = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join("");
          setSpeechTranscript(current);
          setCurrentCaption(`"${current}"`);
        };

        recognition.onerror = () => {
          setIsMicActive(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
      }
    }
  };

  // --------------------------------------------------------------------------
  // MEMORIZE / ACTIVE RECALL STAGE
  // --------------------------------------------------------------------------
  const startMemorizeStage = useCallback(() => {
    setClassroomStage("memorize");
    setTeacherRepeat(1);
    setSpeaking(true);
    setCaptionSpeaker("Dr. Rao");
    setIsStudentSpeaking(false);
    setCurrentCaption(`(1 of 2) ${studentName ? `${studentName}, listen` : "Listen"} carefully: ${module.examConcept}`);

    const t1 = setTimeout(() => {
      setTeacherRepeat(2);
      setCurrentCaption(`(2 of 2) Now recite this back: ${module.examConcept}`);
    }, 4200);

    const t2 = setTimeout(() => {
      setTeacherRepeat(0);
      setSpeaking(false);
      setCurrentCaption(`${studentName ? `${studentName}, recite` : "Recite"} the core concept into your microphone!`);
    }, 8400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [module.examConcept, studentName]);

  const handleRecitationReadiness = useCallback(
    (readinessScore: number) => {
      setMasteryState((prev) => {
        const attempts = prev.recitationAttempts + 1;
        const isPassed = readinessScore >= 70;
        const struggle = !isPassed ? prev.struggleCount + 1 : prev.struggleCount;
        const nextState: StudentMasteryState = {
          ...prev,
          recitationScore: Math.max(prev.recitationScore, readinessScore),
          recitationAttempts: attempts,
          isRecitationPassed: isPassed || prev.isRecitationPassed,
          struggleCount: struggle,
        };
        const computed = calculateMastery(nextState);
        nextState.overallMasteryScore = computed.overallScore;
        nextState.examReadinessRating = computed.rating;
        return nextState;
      });

      if (readinessScore >= 70) {
        setSpeaking(true);
        setCaptionSpeaker("Dr. Rao");
        setIsStudentSpeaking(false);
        setCurrentCaption(`Brilliant recall, ${studentName || "student"}! Now let's solve your NCERT practice questions on the board.`);
        setTimeout(() => {
          setSpeaking(false);
          setClassroomStage("practice");
        }, 2500);
      } else {
        setSpeaking(true);
        setCaptionSpeaker("Dr. Rao");
        setIsStudentSpeaking(false);
        setCurrentCaption("Good effort! You missed a few key exam keywords. Review the hint and try reciting once more.");
      }
    },
    [studentName]
  );

  // --------------------------------------------------------------------------
  // PRACTICE STAGE
  // --------------------------------------------------------------------------
  const handlePracticeComplete = useCallback(
    (
      score: number,
      results: { questionId: string; isCorrect: boolean; userAnswer: string; attempts: number }[]
    ) => {
      setMasteryState((prev) => {
        const correctCount = results.filter((r) => r.isCorrect).length;
        const nextState: StudentMasteryState = {
          ...prev,
          totalQuestions: results.length,
          answeredQuestions: results.length,
          correctAnswers: correctCount,
          practiceScore: score,
          questionResults: results,
        };
        const computed = calculateMastery(nextState);
        nextState.overallMasteryScore = computed.overallScore;
        nextState.examReadinessRating = computed.rating;
        return nextState;
      });

      setSpeaking(true);
      setCaptionSpeaker("Dr. Rao");
      setIsStudentSpeaking(false);
      setCurrentCaption(`Congratulations ${studentName || ""}! You've achieved verified NCERT Exam Readiness.`);
      setClassroomStage("mastery");
    },
    [studentName]
  );

  const handlePracticeQuestionAnswered = useCallback((isCorrect: boolean) => {
    setMasteryState((prev) => {
      const struggle = !isCorrect ? prev.struggleCount + 1 : prev.struggleCount;
      const nextState: StudentMasteryState = {
        ...prev,
        answeredQuestions: prev.answeredQuestions + 1,
        correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
        struggleCount: struggle,
      };
      const computed = calculateMastery(nextState);
      nextState.overallMasteryScore = computed.overallScore;
      nextState.examReadinessRating = computed.rating;
      return nextState;
    });
  }, []);

  // --------------------------------------------------------------------------
  // 3D AVATAR SYNCHRONIZATION
  // --------------------------------------------------------------------------
  const teacherProps = useMemo<{
    state: CharacterState;
    expression: ExpressionType;
    gesture: GestureType;
    gaze: GazeTarget;
    pointTarget: PointTarget;
  }>(() => {
    if (teacherGreeting) {
      return {
        state: "celebrate",
        expression: "happy",
        gesture: "doubleThumbsUp",
        gaze: "student",
        pointTarget: { target: "student" },
      };
    }

    if (isMicActive) {
      return {
        state: "listeningEar",
        expression: "focused",
        gesture: "listeningEar",
        gaze: "student",
        pointTarget: { target: "student" },
      };
    }

    if (currentPage?.pageType === "video" || currentPage?.pageType === "3d") {
      return {
        state: "amazed",
        expression: "mindBlown",
        gesture: "celebrate",
        gaze: "student",
        pointTarget: { target: "board" },
      };
    }

    if (classroomStage === "practice") {
      return {
        state: "idle",
        expression: "focused",
        gesture: "explainBothHands",
        gaze: "student",
        pointTarget: { target: "board" },
      };
    }

    if (classroomStage === "memorize") {
      if (teacherRepeat > 0) {
        return {
          state: "speaking",
          expression: "focused",
          gesture: "explainBothHands",
          gaze: "student",
          pointTarget: { target: "student" },
        };
      }
      return {
        state: "listeningEar",
        expression: "focused",
        gesture: "listeningEar",
        gaze: "student",
        pointTarget: { target: "student" },
      };
    }

    if (speaking) {
      return {
        state: "speaking",
        expression: "explaining",
        gesture: currentLineIndex % 2 === 0 ? "explainBothHands" : "pointAtTarget",
        gaze: "student",
        pointTarget: { target: "board" },
      };
    }

    return {
      state: "idle",
      expression: "happy",
      gesture: "idle",
      gaze: "student",
      pointTarget: { target: "board" },
    };
  }, [teacherGreeting, isMicActive, currentPage, classroomStage, teacherRepeat, speaking, currentLineIndex]);

  const handleTeacherClick = useCallback(() => {
    const stageName = classroomStage === "lesson_pages" ? "explain" : classroomStage === "practice" ? "practice" : "memorize";
    const decision = decideAgentNextStep(stageName, masteryState, outcomeModule);
    setTeacherGreeting(decision.teacherSpeech);
    const t = setTimeout(() => {
      setTeacherGreeting(null);
    }, 4500);
    return () => clearTimeout(t);
  }, [classroomStage, masteryState, outcomeModule]);

  const mainBoardCanvasElement = (
    <motion.div
      layoutId={BOARD_LAYOUT_ID}
      transition={motionTokens.spring}
      className={`board-frame relative w-full rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${
        is3DClassroomActive ? "bg-[#0c1512]/95 border-2 border-[#8b5a2b] shadow-2xl" : ""
      }`}
    >
      <div className="board-surface relative min-h-[400px] sm:min-h-[460px] p-6 sm:p-8 flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {/* STAGE 1: LESSON PAGES (Notes -> Video -> Simulator -> 3D -> Summary) */}
          {classroomStage === "lesson_pages" && currentPage && (
            <motion.div
              key={`page-${currentPage.pageNumber}-${currentPage.pageType}-${activePageIndex}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col justify-start w-full h-full"
            >
              {/* Page Type A: Chalk Notes */}
              {currentPage.pageType === "notes" && (
                <div className="flex-1 flex flex-col justify-start">
                  <h2 className="chalk-title text-2xl sm:text-3xl text-chalk border-b border-chalk/15 pb-2.5">
                    {currentPage.heading}
                  </h2>
                  <ul className="mt-5 space-y-4 flex-1">
                    {currentPage.notes?.slice(0, visibleNotesCount).map((n, i) => (
                      <motion.li
                        key={n}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i === visibleNotesCount - 1 ? 0.2 : 0 }}
                        className="flex items-start gap-3.5 font-[family-name:var(--font-chalk)] text-[1.15rem] sm:text-[1.25rem] leading-relaxed text-chalk/90"
                      >
                        <span className="mt-1.5 size-2 rounded-full bg-white/70 shrink-0" />
                        <span>{n}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Page Type B: Clean Borderless Full-Board Video with Seamless Looping */}
              {currentPage.pageType === "video" && activeVideoUrl && (
                <div className="flex-1 flex items-center justify-center w-full">
                  <EmbeddedVideoPlayer
                    title={currentPage.videoTitle || "Concept Video"}
                    url={activeVideoUrl}
                    loop={true}
                  />
                </div>
              )}

              {/* Page Type C: 2D Interactive Simulator */}
              {currentPage.pageType === "artifact" && (
                <div className="flex-1 flex flex-col justify-between w-full">
                  <h3 className="chalk-title text-xl text-chalk mb-3">
                    {currentPage.heading}
                  </h3>
                  <ArtifactViewer
                    kind={currentPage.artifactKind || module.artifact}
                    title={currentPage.artifactTitle || module.artifactTitle}
                  />
                </div>
              )}

              {/* Page Type D: Clean Borderless 3D Orbital Scene */}
              {currentPage.pageType === "3d" && (
                <div className="flex-1 flex flex-col justify-between w-full">
                  <EmbeddedThreeDCanvas
                    kind={currentPage.threeDKind || module.threeD}
                    title={currentPage.threeDTitle || module.threeDTitle}
                  />
                </div>
              )}

              {/* Bottom Slide Action & Audio Controls */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    disabled={activePageIndex === 0}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed border border-white/20 backdrop-blur-md text-white flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>◀ Previous</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleReplayCurrentSlide}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Replay explanation from Dr. Rao"
                  >
                    <Sparkles size={13} />
                    <span>Replay Voice</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <span>{activePageIndex + 1 < pages.length ? "Next Concept ➔" : "Start Recitation ➔"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STAGE 2: MEMORIZE (ACTIVE RECALL) */}
          {classroomStage === "memorize" && (
            <motion.div
              key="canvas-memorize"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full"
            >
              <div className="text-center mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 text-white border border-white/20 backdrop-blur-md">
                  Step 2: Active Recall Recitation
                </span>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-chalk mt-2">
                  Recite the Core Exam Concept
                </h3>
              </div>

              <RecitationHUD
                module={module}
                onReplay={startMemorizeStage}
                onReadiness={handleRecitationReadiness}
              />
            </motion.div>
          )}

          {/* STAGE 3: PRACTICE (INTERACTIVE NCERT EXERCISES) */}
          {classroomStage === "practice" && outcomeModule && (
            <motion.div
              key="canvas-practice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center w-full"
            >
              <PracticeHUD
                practice={outcomeModule.practice}
                onComplete={handlePracticeComplete}
                onQuestionAnswered={handlePracticeQuestionAnswered}
              />
            </motion.div>
          )}

          {/* STAGE 4: CERTIFIED EXAM MASTERY */}
          {classroomStage === "mastery" && (
            <motion.div
              key="canvas-mastery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center w-full"
            >
              <MasteryOutcome
                module={module}
                masteryState={masteryState}
                onNewTopic={onExit}
                onRetryChapter={() => {
                  setClassroomStage("lesson_pages");
                  setActivePageIndex(0);
                  setCurrentLineIndex(0);
                  setVisibleNotesCount(1);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  return (
    <div className={`relative min-h-[100svh] px-4 py-4 sm:px-8 flex flex-col justify-between transition-all duration-500 overflow-hidden ${
      is3DClassroomActive ? "bg-black" : "wall-backdrop"
    }`}>
      {/* FULLSCREEN 3D CLASSROOM VR VIEWPORT (Renders in background when 3D mode is toggled) */}
      {is3DClassroomActive && (
        <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-auto">
          <Experience isSpeaking={speaking || !!teacherGreeting}>
            {mainBoardCanvasElement}
          </Experience>
        </div>
      )}

      {/* Top Header & Exam Readiness */}
      <header className="relative z-10 mx-auto w-full max-w-[1060px] flex items-center justify-between gap-3 pb-2.5">
        <div className="flex items-center gap-3">
          <BrandMark size={34} variant="white" />
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.22em] text-white/60">
              NCERT · Class {module.grade} {module.subject} · Chapter {module.chapter}
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-lg sm:text-xl text-white">
              {module.title}
            </h1>
          </div>
        </div>

        {/* Multi-Page Lesson Navigator & Readiness */}
        <div className="flex items-center gap-3">
          {classroomStage === "lesson_pages" && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-white backdrop-blur-md">
              <BookOpen className="w-3.5 h-3.5 text-white/80" />
              <span>Slide {activePageIndex + 1} of {pages.length}</span>
              <div className="flex gap-1 ml-1.5">
                {pages.map((_, i) => (
                  <span
                    key={i}
                    className={`size-1.5 rounded-full transition-all ${
                      i === activePageIndex ? "bg-white w-3" : i < activePageIndex ? "bg-white/70" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs text-white backdrop-blur-md border border-white/20">
            <span className="text-white">
              <CheckSealIcon size={15} />
            </span>
            <span>Mastery</span>
            <span className="font-mono font-bold text-white">
              {masteryState.overallMasteryScore}%
            </span>
          </div>



          <button
            type="button"
            onClick={onExit}
            className="rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-3.5 py-1.5 text-xs text-white backdrop-blur-md cursor-pointer transition-all"
          >
            New topic
          </button>
        </div>
      </header>

      {/* Main Omnipotent Morphing Blackboard Canvas Frame (Rendered in 2D mode, or floating captions overlay in 3D mode) */}
      {!is3DClassroomActive ? (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto w-full max-w-[1060px] mx-auto">
          {mainBoardCanvasElement}

          {/* Dedicated Real-Time Word-by-Word Streaming Captions Bar Directly Below Canvas */}
          <div className="w-full mt-3.5">
            <CaptionsBar
              caption={currentCaption}
              speaking={speaking}
              label={captionSpeaker}
              isStudent={isStudentSpeaking}
            />
          </div>
        </div>
      ) : (
        <div className="relative z-10 w-full max-w-[1060px] mx-auto mb-2">
          <CaptionsBar
            caption={currentCaption}
            speaking={speaking}
            label={captionSpeaker}
            isStudent={isStudentSpeaking}
          />
        </div>
      )}

      {/* STUDENT NAME ONBOARDING POPUP MODAL */}
      <AnimatePresence>
        {isNameModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-zinc-900 border border-white/20 p-6 sm:p-8 shadow-2xl text-center flex flex-col gap-5 text-white backdrop-blur-xl"
            >
              <div className="size-16 rounded-full bg-white/10 border border-white/20 text-white mx-auto flex items-center justify-center backdrop-blur-md">
                <TeacherIcon size={32} />
              </div>

              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-white">
                  Welcome to OPED!
                </h2>
                <p className="text-sm text-white/70 mt-1.5 leading-relaxed">
                  I'm Dr. Rao, your interactive AI teacher. Before we start our blackboard lesson, what should I call you?
                </p>
              </div>

              <form onSubmit={handleNameSubmit} className="flex flex-col gap-3">
                <div className="relative">
                  <User className="w-4 h-4 text-white/70 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Enter your name..."
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-black/60 border border-white/20 focus:border-white/50 focus:ring-1 focus:ring-white/50 text-white text-sm outline-none transition-all placeholder:text-white/40"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all backdrop-blur-md active:scale-95 cursor-pointer shadow-lg"
                >
                  <span>Start Classroom Lesson</span>
                  <EnterIcon size={16} />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING BOTTOM-RIGHT ACTION DOCK (Chat Drawer & Live Mic Pause) */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
        {/* Live Mic Button */}
        <button
          type="button"
          onClick={toggleMic}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold shadow-2xl backdrop-blur-md border transition-all cursor-pointer ${
            isMicActive
              ? "bg-white/30 border-white/60 text-white animate-pulse"
              : "bg-white/10 border-white/20 text-white hover:bg-white/20"
          }`}
          title={isMicActive ? "Click to submit voice question" : "Click to speak with Dr. Rao"}
        >
          {isMicActive ? (
            <>
              <MicOff className="w-4 h-4" />
              <span>Tap to Send Voice</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              <span>Speak to Dr. Rao</span>
            </>
          )}
        </button>

        {/* Chat Drawer Trigger Button */}
        <button
          type="button"
          onClick={() => setIsChatOpen((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold shadow-2xl backdrop-blur-md border transition-all cursor-pointer ${
            isChatOpen
              ? "bg-white/30 border-white/60 text-white"
              : "bg-white/10 border-white/20 text-white hover:bg-white/20"
          }`}
          title="Open Classroom Chat"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat Drawer</span>
        </button>
      </div>

      {/* RIGHT CHAT DRAWER */}
      <RightChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        studentName={studentName}
        chapterTitle={module.title}
        currentNotes={currentPage.notes || module.notes}
        onGenerateSlidesFromPrompt={(prompt) => {
          setIsChatOpen(false);
          void handleDynamicStudentRequest(prompt);
        }}
      />

      {/* AI Teacher Avatar in Bottom Corner (Hidden during 3D Classroom Mode) */}
      <AnimatePresence>
        {isTeacherActive && !is3DClassroomActive && (
          <div className="fixed bottom-16 right-5 z-30 pointer-events-none">
            <AnimatedTeacher
              key="ai-teacher-active"
              state={customState || teacherProps.state}
              expression={customExpression || teacherProps.expression}
              gesture={customGesture || teacherProps.gesture}
              position={customPosition}
              scale={0.82}
              gazeTarget={customGaze || teacherProps.gaze}
              pointTarget={customPoint || teacherProps.pointTarget}
              speakingText={teacherGreeting || (speaking ? currentCaption : undefined)}
              isAudioSpeaking={speaking || !!teacherGreeting}
              avatarStyle="pulled"
              onClick={handleTeacherClick}
              className="pointer-events-auto cursor-pointer select-none"
            />
          </div>
        )}
      </AnimatePresence>

      {/* 3D Character Studio Drawer Controls */}
      <DemoControls
        isOpen={showStudioControls}
        onClose={() => setShowStudioControls(false)}
        currentState={customState || teacherProps.state}
        currentExpression={customExpression || teacherProps.expression}
        currentGesture={customGesture || teacherProps.gesture}
        currentPosition={customPosition}
        onPlayState={(st) => {
          setCustomState(st);
          setCustomExpression(null);
          setCustomGesture(null);
        }}
        onSetExpression={(exp) => setCustomExpression(exp)}
        onSetGesture={(gst) => setCustomGesture(gst)}
        onMoveTo={(pos) => setCustomPosition(pos)}
        onLookAt={(gz) => setCustomGaze(gz)}
        onPointAt={(pt) => setCustomPoint(pt)}
      />
    </div>
  );
}

export default BlackboardCanvas;
