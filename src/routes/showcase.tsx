import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useRef } from "react";
import {
  Play,
  Eye,
  Move,
  Smile,
  Hand,
  Sparkles,
  Box,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  RefreshCw,
  Info,
} from "lucide-react";
import { AnimatedTeacher } from "../character/AnimatedTeacher";
import { useCharacterController } from "../character/CharacterController";
import {
  CharacterState,
  ExpressionType,
  GestureType,
  PositionPreset,
  GazeTarget,
} from "../character/types";

export const Route = createFileRoute("/showcase")({
  component: CharacterShowcasePage,
});

export function CharacterShowcasePage() {
  const teacher = useCharacterController("idle", "bottom-right");
  const [demoStep, setDemoStep] = useState<string | null>(null);
  const [demoActive, setDemoActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    "states" | "movement" | "gaze" | "expressions" | "gestures"
  >("states");

  // Dummy target refs
  const diagramRef = useRef<HTMLDivElement>(null);
  const conceptRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const threeDRef = useRef<HTMLDivElement>(null);

  // States list from prompt
  const coreStates: { id: CharacterState; label: string }[] = [
    { id: "idle", label: "Idle" },
    { id: "thinking", label: "Thinking" },
    { id: "speaking", label: "Speaking" },
    { id: "listeningEar", label: "Listening" },
    { id: "explaining", label: "Explaining" },
    { id: "presenting", label: "Presenting" },
    { id: "question", label: "Question" },
    { id: "pointing", label: "Point At Target" },
    { id: "wave", label: "Wave" },
    { id: "correct", label: "Correct (Thumbs Up)" },
    { id: "incorrect", label: "Incorrect (Encourage)" },
    { id: "celebrate", label: "Celebrate" },
    { id: "encourage", label: "Encourage" },
    { id: "confused", label: "Confused" },
    { id: "surprised", label: "Surprised" },
    { id: "noPeek", label: "No Peek 🙈" },
  ];

  const positions: { id: PositionPreset; label: string }[] = [
    { id: "top-left", label: "Top Left" },
    { id: "top-right", label: "Top Right" },
    { id: "center-left", label: "Center Left" },
    { id: "center-right", label: "Center Right" },
    { id: "bottom-left", label: "Bottom Left" },
    { id: "bottom-center", label: "Bottom Center" },
    { id: "bottom-right", label: "Bottom Right" },
  ];

  const gazeDirections: { id: GazeTarget; label: string }[] = [
    { id: "student", label: "Student (Center)" },
    { id: "left", label: "Left" },
    { id: "right", label: "Right" },
    { id: "up", label: "Up" },
    { id: "down", label: "Down" },
    { id: "upper-left", label: "Upper Left" },
    { id: "upper-right", label: "Upper Right (Thinking)" },
    { id: "lower-left", label: "Lower Left" },
    { id: "lower-right", label: "Lower Right" },
  ];

  const expressions: ExpressionType[] = [
    "idle",
    "happy",
    "excited",
    "thinking",
    "confused",
    "explaining",
    "question",
    "surprised",
    "encouraging",
    "correct",
    "incorrect",
    "celebrating",
    "proud",
    "focused",
    "playful",
    "amazed",
    "puzzled",
    "relieved",
    "empathetic",
    "mindBlown",
    "cheerful",
    "determined",
    "heartEyes",
    "starEyes",
    "eureka",
    "facepalm",
    "smartGlasses",
  ];

  const gestures: GestureType[] = [
    "idle",
    "wave",
    "pointLeft",
    "pointRight",
    "pointUp",
    "pointDown",
    "present",
    "explainOneHand",
    "explainBothHands",
    "thinking",
    "handOnChin",
    "thumbsUp",
    "doubleThumbsUp",
    "celebrate",
    "encourage",
    "shrug",
    "stop",
    "wait",
    "comeHere",
    "handsOpen",
    "noPeek",
    "readingBook",
    "crossArms",
    "writeOnBoard",
    "heartHands",
    "bow",
    "applause",
    "victory",
    "salute",
    "secretTip",
    "stretch",
    "listeningEar",
    "eureka",
    "facepalm",
    "flex",
    "shushing",
    "adjustGlasses",
    "highFive",
    "fingerGuns",
    "handsOnHips",
  ];

  // Full Teaching Sequence Demo implementation (Requirement #44)
  const runDemoLesson = async () => {
    if (demoActive) return;
    setDemoActive(true);

    const steps = [
      { name: "IDLE", fn: () => teacher.play("idle"), delay: 1800 },
      { name: "THINKING", fn: () => teacher.play("thinking"), delay: 2000 },
      { name: "SPEAKING", fn: () => teacher.play("speaking"), delay: 2200 },
      { name: "EXPLAINING", fn: () => teacher.play("explaining"), delay: 2500 },
      {
        name: "POINT AT BOARD",
        fn: () => {
          if (diagramRef.current) {
            teacher.pointAt({ targetElement: diagramRef.current });
          } else {
            teacher.play("pointing");
          }
        },
        delay: 2200,
      },
      { name: "LOOK AT BOARD", fn: () => teacher.lookAt("left"), delay: 1800 },
      { name: "LOOK AT STUDENT", fn: () => teacher.lookAt("student"), delay: 1800 },
      { name: "QUESTION", fn: () => teacher.play("question"), delay: 2200 },
      { name: "NO PEEK", fn: () => teacher.play("noPeek", 3500), delay: 3800 },
      { name: "LISTENING", fn: () => teacher.play("listeningEar"), delay: 2200 },
      { name: "CORRECT", fn: () => teacher.play("correct"), delay: 2200 },
      { name: "CELEBRATE", fn: () => teacher.play("celebrate"), delay: 2500 },
      { name: "EXPLAINING", fn: () => teacher.play("explaining"), delay: 2200 },
      { name: "IDLE", fn: () => teacher.play("idle"), delay: 1500 },
    ];

    for (const s of steps) {
      setDemoStep(s.name);
      s.fn();
      await new Promise((res) => setTimeout(res, s.delay));
    }

    setDemoStep(null);
    setDemoActive(false);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Background Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem]" />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 py-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 shadow-md">
            <Sparkles className="size-5 animate-pulse text-white" />
          </div>
          <div>
            <h1 className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
              AI Teacher Character Engine
              <span className="rounded-full border border-sky-500/30 bg-sky-500/20 px-2.5 py-0.5 text-xs font-semibold text-sky-400">
                Standalone System
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              High-Quality Vector Pixar-Style Character Rig with Contextual Awareness & Gesture
              Control
            </p>
          </div>
        </div>

        {/* Demo Lesson Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={runDemoLesson}
            disabled={demoActive}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all shadow-lg ${
              demoActive
                ? "cursor-wait animate-pulse border border-amber-500/40 bg-amber-500/20 text-amber-300"
                : "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sky-500/25 hover:scale-[1.02] hover:from-sky-400 hover:to-indigo-500 active:scale-[0.98]"
            }`}
          >
            {demoActive ? (
              <RefreshCw className="size-4 animate-spin" />
            ) : (
              <Play className="size-4 fill-current" />
            )}
            <span>{demoActive ? `Running: ${demoStep}` : "PLAY DEMO LESSON"}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Interactive Canvas Area (Dummy Targets for Pointing/Gaze Testing) */}
        <main className="relative z-10 flex flex-1 flex-col justify-between overflow-y-auto p-6">
          {/* Top Info Banner */}
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Info className="size-4 shrink-0 text-sky-400" />
              <span>
                Click <strong>&quot;Look At&quot;</strong>, <strong>&quot;Point At&quot;</strong>,
                or <strong>&quot;Present&quot;</strong> on any target below to test real-time
                positional kinematics and gaze angle calculations!
              </span>
            </div>
            <div className="flex items-center gap-4 font-mono text-[11px] text-slate-400">
              <div>
                State: <span className="font-bold text-sky-400">{teacher.state}</span>
              </div>
              <div>
                Expr: <span className="font-bold text-pink-400">{teacher.expression}</span>
              </div>
              <div>
                Gesture: <span className="font-bold text-emerald-400">{teacher.gesture}</span>
              </div>
            </div>
          </div>

          {/* Dummy Target Grid */}
          <div className="my-6 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">
            {/* Target 1: Diagram */}
            <div
              ref={diagramRef}
              className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg transition-all hover:border-sky-500/50"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
                  <BookOpen className="size-4" />
                  <span>[Diagram] Photosynthesis</span>
                </div>
                <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                  Target A
                </span>
              </div>
              <p className="mb-4 text-xs leading-relaxed text-slate-400">
                Diagram showing light-dependent reaction pathways in plant thylakoid membranes.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => teacher.lookAt({ targetElement: diagramRef.current! })}
                  className="flex-1 rounded-lg border border-sky-500/30 bg-sky-500/10 py-1.5 text-[11px] font-medium text-sky-300 transition-colors hover:bg-sky-500/20"
                >
                  Look At
                </button>
                <button
                  onClick={() => teacher.pointAt({ targetElement: diagramRef.current! })}
                  className="flex-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-1.5 text-[11px] font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20"
                >
                  Point At
                </button>
                <button
                  onClick={() => {
                    teacher.lookAt({ targetElement: diagramRef.current! });
                    teacher.play("presenting");
                  }}
                  className="flex-1 rounded-lg border border-purple-500/30 bg-purple-500/10 py-1.5 text-[11px] font-medium text-purple-300 transition-colors hover:bg-purple-500/20"
                >
                  Present
                </button>
              </div>
            </div>

            {/* Target 2: Important Concept */}
            <div
              ref={conceptRef}
              className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg transition-all hover:border-emerald-500/50"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <Sparkles className="size-4" />
                  <span>[Important Concept] E = mc²</span>
                </div>
                <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                  Target B
                </span>
              </div>
              <p className="mb-4 text-xs leading-relaxed text-slate-400">
                Mass-energy equivalence principle formulating mass into pure relativistic energy.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => teacher.lookAt({ targetElement: conceptRef.current! })}
                  className="flex-1 rounded-lg border border-sky-500/30 bg-sky-500/10 py-1.5 text-[11px] font-medium text-sky-300 transition-colors hover:bg-sky-500/20"
                >
                  Look At
                </button>
                <button
                  onClick={() => teacher.pointAt({ targetElement: conceptRef.current! })}
                  className="flex-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-1.5 text-[11px] font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20"
                >
                  Point At
                </button>
                <button
                  onClick={() => {
                    teacher.lookAt({ targetElement: conceptRef.current! });
                    teacher.play("presenting");
                  }}
                  className="flex-1 rounded-lg border border-purple-500/30 bg-purple-500/10 py-1.5 text-[11px] font-medium text-purple-300 transition-colors hover:bg-purple-500/20"
                >
                  Present
                </button>
              </div>
            </div>

            {/* Target 3: Question */}
            <div
              ref={questionRef}
              className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg transition-all hover:border-amber-500/50"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                  <HelpCircle className="size-4" />
                  <span>[Question] Recall Challenge</span>
                </div>
                <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                  Target C
                </span>
              </div>
              <p className="mb-4 text-xs leading-relaxed text-slate-400">
                &ldquo;What is the primary cellular powerhouse responsible for ATP
                production?&rdquo;
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    teacher.lookAt({ targetElement: questionRef.current! });
                    teacher.play("question");
                  }}
                  className="flex-1 rounded-lg border border-amber-500/30 bg-amber-500/10 py-1.5 text-[11px] font-medium text-amber-300 transition-colors hover:bg-amber-500/20"
                >
                  Ask Question
                </button>
                <button
                  onClick={() => teacher.play("noPeek", 3500)}
                  className="flex-1 rounded-lg border border-rose-500/30 bg-rose-500/10 py-1.5 text-[11px] font-medium text-rose-300 transition-colors hover:bg-rose-500/20"
                >
                  No Peek 🙈
                </button>
              </div>
            </div>

            {/* Target 4: Answer */}
            <div
              ref={answerRef}
              className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg transition-all hover:border-indigo-500/50"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                  <CheckCircle2 className="size-4" />
                  <span>[Answer] Mitochondria</span>
                </div>
                <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                  Target D
                </span>
              </div>
              <p className="mb-4 text-xs leading-relaxed text-slate-400">
                Correct answer verified. Triggers student praise and celebratory teacher feedback.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    teacher.lookAt({ targetElement: answerRef.current! });
                    teacher.play("correct");
                  }}
                  className="flex-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-1.5 text-[11px] font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20"
                >
                  Correct!
                </button>
                <button
                  onClick={() => {
                    teacher.lookAt({ targetElement: answerRef.current! });
                    teacher.play("celebrate");
                  }}
                  className="flex-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 py-1.5 text-[11px] font-medium text-indigo-300 transition-colors hover:bg-indigo-500/20"
                >
                  Celebrate
                </button>
              </div>
            </div>

            {/* Target 5: 3D Experience */}
            <div
              ref={threeDRef}
              className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg transition-all hover:border-pink-500/50 md:col-span-2"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-pink-400">
                  <Box className="size-4" />
                  <span>[3D Experience] Interactive Human Heart Simulation</span>
                </div>
                <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                  Target E
                </span>
              </div>
              <p className="mb-4 text-xs leading-relaxed text-slate-400">
                Fullscreen WebGL 3D anatomical organ simulation allowing rotatable blood flow
                investigation.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    teacher.lookAt({ targetElement: threeDRef.current! });
                    teacher.play("presenting");
                  }}
                  className="rounded-lg border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-[11px] font-medium text-pink-300 transition-colors hover:bg-pink-500/20"
                >
                  3D Presenting
                </button>
                <button
                  onClick={() => {
                    teacher.pointAt({ targetElement: threeDRef.current! });
                  }}
                  className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-[11px] font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20"
                >
                  Point 3D Model
                </button>
              </div>
            </div>
          </div>

          {/* Active Character System Render */}
          <AnimatedTeacher
            state={teacher.state}
            expression={teacher.expression}
            gesture={teacher.gesture}
            position={teacher.position}
            gazeTarget={teacher.gazeTarget}
            pointTarget={teacher.pointTarget}
          />
        </main>

        {/* Control Suite Sidebar */}
        <aside className="relative z-20 flex w-80 flex-col overflow-hidden border-l border-slate-800 bg-slate-900/95 shadow-2xl md:w-96">
          {/* Tab Navigation */}
          <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-800 bg-slate-950 p-3">
            <button
              onClick={() => setActiveTab("states")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === "states"
                  ? "bg-sky-500 text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Play className="size-3.5" />
              <span>States</span>
            </button>
            <button
              onClick={() => setActiveTab("movement")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === "movement"
                  ? "bg-purple-500 text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Move className="size-3.5" />
              <span>Move</span>
            </button>
            <button
              onClick={() => setActiveTab("gaze")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === "gaze"
                  ? "bg-amber-500 text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Eye className="size-3.5" />
              <span>Gaze</span>
            </button>
            <button
              onClick={() => setActiveTab("expressions")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === "expressions"
                  ? "bg-pink-500 text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Smile className="size-3.5" />
              <span>Face</span>
            </button>
            <button
              onClick={() => setActiveTab("gestures")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === "gestures"
                  ? "bg-emerald-500 text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Hand className="size-3.5" />
              <span>Hands</span>
            </button>
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4 text-xs">
            {activeTab === "states" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between font-semibold text-slate-300">
                  <span>Core Character States ({coreStates.length})</span>
                  <span className="font-mono text-[10px] text-slate-500">STATE MACHINE</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {coreStates.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => teacher.play(st.id)}
                      className={`rounded-xl border px-3 py-2 text-left font-medium transition-all ${
                        teacher.state === st.id
                          ? "border-sky-400 bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                          : "border-slate-700/80 bg-slate-800/80 text-slate-300 hover:bg-slate-700/80"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "movement" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between font-semibold text-slate-300">
                  <span>Spatial Position (moveTo)</span>
                  <span className="font-mono text-[10px] text-slate-500">SCREEN PRESETS</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {positions.map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => teacher.moveTo(pos.id)}
                      className={`rounded-xl border px-3 py-2 text-left font-medium transition-all ${
                        teacher.position === pos.id
                          ? "border-purple-400 bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                          : "border-slate-700/80 bg-slate-800/80 text-slate-300 hover:bg-slate-700/80"
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "gaze" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between font-semibold text-slate-300">
                  <span>Gaze Controller (lookAt)</span>
                  <span className="font-mono text-[10px] text-slate-500">EYE KINEMATICS</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {gazeDirections.map((gz) => (
                    <button
                      key={typeof gz.id === "string" ? gz.id : "coords"}
                      onClick={() => teacher.lookAt(gz.id)}
                      className="rounded-xl border border-slate-700/80 bg-slate-800/80 px-3 py-2 text-left font-medium text-amber-300 transition-colors hover:bg-slate-700/80"
                    >
                      👀 {gz.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "expressions" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between font-semibold text-slate-300">
                  <span>Facial Expression Library ({expressions.length})</span>
                  <span className="font-mono text-[10px] text-slate-500">FACE RIG</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {expressions.map((exp) => (
                    <button
                      key={exp}
                      onClick={() => teacher.setExpression(exp)}
                      className={`truncate rounded-lg border px-2 py-1.5 text-[11px] capitalize ${
                        teacher.expression === exp
                          ? "border-pink-400 bg-pink-500 text-white"
                          : "border-slate-700/80 bg-slate-800/80 text-slate-300 hover:bg-slate-700/80"
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "gestures" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between font-semibold text-slate-300">
                  <span>Arm & Hand Gestures ({gestures.length})</span>
                  <span className="font-mono text-[10px] text-slate-500">LIMB RIG</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {gestures.map((gst) => (
                    <button
                      key={gst}
                      onClick={() => teacher.setGesture(gst)}
                      className={`truncate rounded-lg border px-2 py-1.5 text-[11px] capitalize ${
                        teacher.gesture === gst
                          ? "border-emerald-400 bg-emerald-500 text-white"
                          : "border-slate-700/80 bg-slate-800/80 text-slate-300 hover:bg-slate-700/80"
                      }`}
                    >
                      {gst}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
