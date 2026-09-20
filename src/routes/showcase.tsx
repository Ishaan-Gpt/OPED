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
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden flex flex-col">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              AI Teacher Character Engine
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold">
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
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg ${
              demoActive
                ? "bg-amber-500/20 border border-amber-500/40 text-amber-300 animate-pulse cursor-wait"
                : "bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-sky-500/25 hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {demoActive ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            <span>{demoActive ? `Running: ${demoStep}` : "PLAY DEMO LESSON"}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Interactive Canvas Area (Dummy Targets for Pointing/Gaze Testing) */}
        <main className="relative flex-1 p-6 overflow-y-auto z-10 flex flex-col justify-between">
          {/* Top Info Banner */}
          <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span>
                Click <strong>&quot;Look At&quot;</strong>, <strong>&quot;Point At&quot;</strong>,
                or <strong>&quot;Present&quot;</strong> on any target below to test real-time
                positional kinematics and gaze angle calculations!
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
              <div>
                State: <span className="text-sky-400 font-bold">{teacher.state}</span>
              </div>
              <div>
                Expr: <span className="text-pink-400 font-bold">{teacher.expression}</span>
              </div>
              <div>
                Gesture: <span className="text-emerald-400 font-bold">{teacher.gesture}</span>
              </div>
            </div>
          </div>

          {/* Dummy Target Grid (Requirement #43) */}
          <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl">
            {/* Target 1: Diagram */}
            <div
              ref={diagramRef}
              className="bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 rounded-2xl p-4 shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs">
                  <BookOpen className="w-4 h-4" />
                  <span>[Diagram] Photosynthesis</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  Target A
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Diagram showing light-dependent reaction pathways in plant thylakoid membranes.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => teacher.lookAt({ targetElement: diagramRef.current! })}
                  className="flex-1 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-[11px] font-medium transition-colors"
                >
                  Look At
                </button>
                <button
                  onClick={() => teacher.pointAt({ targetElement: diagramRef.current! })}
                  className="flex-1 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium transition-colors"
                >
                  Point At
                </button>
                <button
                  onClick={() => {
                    teacher.lookAt({ targetElement: diagramRef.current! });
                    teacher.play("present");
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[11px] font-medium transition-colors"
                >
                  Present
                </button>
              </div>
            </div>

            {/* Target 2: Important Concept */}
            <div
              ref={conceptRef}
              className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>[Important Concept] E = mc²</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  Target B
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Mass-energy equivalence principle formulating mass into pure relativistic energy.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => teacher.lookAt({ targetElement: conceptRef.current! })}
                  className="flex-1 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-[11px] font-medium transition-colors"
                >
                  Look At
                </button>
                <button
                  onClick={() => teacher.pointAt({ targetElement: conceptRef.current! })}
                  className="flex-1 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium transition-colors"
                >
                  Point At
                </button>
                <button
                  onClick={() => {
                    teacher.lookAt({ targetElement: conceptRef.current! });
                    teacher.play("present");
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[11px] font-medium transition-colors"
                >
                  Present
                </button>
              </div>
            </div>

            {/* Target 3: Question */}
            <div
              ref={questionRef}
              className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                  <HelpCircle className="w-4 h-4" />
                  <span>[Question] Recall Challenge</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  Target C
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                &ldquo;What is the primary cellular powerhouse responsible for ATP
                production?&rdquo;
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    teacher.lookAt({ targetElement: questionRef.current! });
                    teacher.play("question");
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-medium transition-colors"
                >
                  Ask Question
                </button>
                <button
                  onClick={() => teacher.play("noPeek", 3500)}
                  className="flex-1 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-medium transition-colors"
                >
                  No Peek 🙈
                </button>
              </div>
            </div>

            {/* Target 4: Answer */}
            <div
              ref={answerRef}
              className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>[Answer] Mitochondria</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  Target D
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Correct answer verified. Triggers student praise and celebratory teacher feedback.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    teacher.lookAt({ targetElement: answerRef.current! });
                    teacher.play("correct");
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium transition-colors"
                >
                  Correct!
                </button>
                <button
                  onClick={() => {
                    teacher.lookAt({ targetElement: answerRef.current! });
                    teacher.play("celebrate");
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[11px] font-medium transition-colors"
                >
                  Celebrate
                </button>
              </div>
            </div>

            {/* Target 5: 3D Experience */}
            <div
              ref={threeDRef}
              className="bg-slate-900/80 border border-slate-800 hover:border-pink-500/50 rounded-2xl p-4 shadow-lg transition-all group md:col-span-2"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-pink-400 font-semibold text-xs">
                  <Box className="w-4 h-4" />
                  <span>[3D Experience] Interactive Human Heart Simulation</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  Target E
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Fullscreen WebGL 3D anatomical organ simulation allowing rotatable blood flow
                investigation.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    teacher.lookAt({ targetElement: threeDRef.current! });
                    teacher.play("presenting");
                  }}
                  className="py-1.5 px-4 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 text-[11px] font-medium transition-colors"
                >
                  3D Presenting
                </button>
                <button
                  onClick={() => {
                    teacher.pointAt({ targetElement: threeDRef.current! });
                  }}
                  className="py-1.5 px-4 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium transition-colors"
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

        {/* Control Suite Sidebar (Requirement #42) */}
        <aside className="relative z-20 w-80 md:w-96 bg-slate-900/95 border-l border-slate-800 flex flex-col overflow-hidden shadow-2xl">
          {/* Tab Navigation */}
          <div className="p-3 border-b border-slate-800 bg-slate-950 flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("states")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === "states"
                  ? "bg-sky-500 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>States</span>
            </button>
            <button
              onClick={() => setActiveTab("movement")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === "movement"
                  ? "bg-purple-500 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Move className="w-3.5 h-3.5" />
              <span>Move</span>
            </button>
            <button
              onClick={() => setActiveTab("gaze")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === "gaze"
                  ? "bg-amber-500 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Gaze</span>
            </button>
            <button
              onClick={() => setActiveTab("expressions")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === "expressions"
                  ? "bg-pink-500 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              <span>Face</span>
            </button>
            <button
              onClick={() => setActiveTab("gestures")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === "gestures"
                  ? "bg-emerald-500 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Hand className="w-3.5 h-3.5" />
              <span>Hands</span>
            </button>
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {activeTab === "states" && (
              <div className="space-y-3">
                <div className="text-slate-300 font-semibold flex items-center justify-between">
                  <span>Core Character States ({coreStates.length})</span>
                  <span className="text-[10px] text-slate-500 font-mono">STATE MACHINE</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {coreStates.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => teacher.play(st.id)}
                      className={`px-3 py-2 rounded-xl border text-left font-medium transition-all ${
                        teacher.state === st.id
                          ? "bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-500/20"
                          : "bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700/80"
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
                <div className="text-slate-300 font-semibold flex items-center justify-between">
                  <span>Spatial Position (moveTo)</span>
                  <span className="text-[10px] text-slate-500 font-mono">SCREEN PRESETS</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {positions.map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => teacher.moveTo(pos.id)}
                      className={`px-3 py-2 rounded-xl border text-left font-medium transition-all ${
                        teacher.position === pos.id
                          ? "bg-purple-500 border-purple-400 text-white shadow-lg shadow-purple-500/20"
                          : "bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700/80"
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
                <div className="text-slate-300 font-semibold flex items-center justify-between">
                  <span>Gaze Controller (lookAt)</span>
                  <span className="text-[10px] text-slate-500 font-mono">EYE KINEMATICS</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {gazeDirections.map((gz) => (
                    <button
                      key={typeof gz.id === "string" ? gz.id : "coords"}
                      onClick={() => teacher.lookAt(gz.id)}
                      className="px-3 py-2 rounded-xl border bg-slate-800/80 border-slate-700/80 hover:bg-slate-700/80 text-amber-300 font-medium text-left transition-colors"
                    >
                      👀 {gz.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "expressions" && (
              <div className="space-y-3">
                <div className="text-slate-300 font-semibold flex items-center justify-between">
                  <span>Facial Expression Library ({expressions.length})</span>
                  <span className="text-[10px] text-slate-500 font-mono">FACE RIG</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {expressions.map((exp) => (
                    <button
                      key={exp}
                      onClick={() => teacher.setExpression(exp)}
                      className={`px-2 py-1.5 rounded-lg border text-[11px] capitalize truncate ${
                        teacher.expression === exp
                          ? "bg-pink-500 border-pink-400 text-white"
                          : "bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700/80"
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
                <div className="text-slate-300 font-semibold flex items-center justify-between">
                  <span>Arm & Hand Gestures ({gestures.length})</span>
                  <span className="text-[10px] text-slate-500 font-mono">LIMB RIG</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {gestures.map((gst) => (
                    <button
                      key={gst}
                      onClick={() => teacher.setGesture(gst)}
                      className={`px-2 py-1.5 rounded-lg border text-[11px] capitalize truncate ${
                        teacher.gesture === gst
                          ? "bg-emerald-500 border-emerald-400 text-white"
                          : "bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700/80"
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
