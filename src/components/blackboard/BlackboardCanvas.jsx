"use client";

import React, { useState } from "react";
import { DESIGN_SYSTEM } from "@/config/design_system";
import AudioWaveform from "@/components/shared/AudioWaveform";
import RecitationModule from "@/components/blackboard/RecitationModule";
import Badge from "@/components/shared/Badge";
import { Box, Volume2, Sparkles, CheckCircle, ArrowRight, Layers, Sliders } from "lucide-react";

export default function BlackboardCanvas({ 
  chapterData, 
  currentModuleIndex, 
  onNextModule, 
  onOpen3D, 
  onExitClassroom 
}) {
  const currentModule = chapterData.modules[currentModuleIndex] || chapterData.modules[0];
  const [learningPhase, setLearningPhase] = useState("understanding"); // "understanding" | "recitation" | "completed"
  const [isSpeaking, setIsSpeaking] = useState(true);

  // Interactive Artifact Simulation State (e.g. Area vs Pressure slider or Nutrient balance)
  const [artifactAreaVal, setArtifactAreaVal] = useState(5);
  const artifactForce = 50;
  const computedPressure = (artifactForce / Math.max(artifactAreaVal, 1)).toFixed(1);

  // Play Browser Audio TTS for Teacher Speech
  const playTeacherSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const textToSpeak = currentModule.understanding.teacherSpeech;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStartRecitationPhase = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setLearningPhase("recitation");
  };

  const handlePassRecitation = () => {
    setLearningPhase("completed");
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      {/* Top Header Bar inside Classroom */}
      <div className="flex items-center justify-between bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onExitClassroom}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-gray-300 hover:bg-gray-100 transition-all text-gray-700"
          >
            ← Exit Chapter
          </button>
          <div className="h-4 w-[1px] bg-gray-300" />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            NCERT Class {chapterData.classNum} • {chapterData.subject}
          </span>
          <h2 className="text-base font-bold text-gray-900 hidden sm:inline-block">
            {chapterData.title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="brown" icon={Layers}>
            Module {currentModuleIndex + 1} of {chapterData.modules.length}
          </Badge>
          <Badge variant="teal" icon={CheckCircle}>
            100% Exam Ready
          </Badge>
        </div>
      </div>

      {/* Photorealistic Wooden Blackboard Frame Container */}
      <div 
        className="relative w-full rounded-3xl p-6 md:p-8 shadow-2xl transition-all duration-500 overflow-hidden"
        style={{
          backgroundColor: DESIGN_SYSTEM.colors.earthyBrown.darkWood,
          boxShadow: DESIGN_SYSTEM.shadows.woodFrame
        }}
      >
        {/* Actual Slate Blackboard Interior */}
        <div 
          className="relative w-full rounded-2xl p-6 md:p-8 min-h-[460px] flex flex-col justify-between border-4 shadow-inner overflow-hidden"
          style={{
            backgroundColor: DESIGN_SYSTEM.colors.base.slateGreen,
            borderColor: "#1E3A2B"
          }}
        >
          {/* Subtle Chalkboard Texture Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
              backgroundSize: "24px 24px"
            }}
          />

          {/* Top Board Status Bar */}
          <div className="flex items-center justify-between z-10 border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span 
                className="text-xs tracking-widest uppercase font-bold text-emerald-300"
                style={{ fontFamily: DESIGN_SYSTEM.typography.fonts.sans }}
              >
                {currentModule.title}
              </span>
            </div>

            {/* Audio Waveform Indicator */}
            <AudioWaveform active={isSpeaking} label={isSpeaking ? "AI Teacher Reciting NCERT..." : "Audio Paused"} />
          </div>

          {/* Blackboard Content Area (Chalk Text, Formulas, Images, Interactive Artifacts) */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 py-4">
            
            {/* Left Column: Text & Formulas */}
            <div className="lg:col-span-7 space-y-5 text-emerald-50">
              <h3 
                className="text-2xl md:text-4xl font-bold tracking-wide text-white drop-shadow-sm"
                style={{ fontFamily: DESIGN_SYSTEM.typography.fonts.sans }}
              >
                {currentModule.understanding.blackboardContent.heading}
              </h3>

              <ul className="space-y-3">
                {currentModule.understanding.blackboardContent.bulletPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-base md:text-lg font-medium text-emerald-100">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {/* Formula Chalk Banner */}
              {currentModule.understanding.blackboardContent.formula && (
                <div className="inline-block p-4 rounded-xl border border-amber-400/40 bg-amber-950/30 backdrop-blur-xs">
                  <span className="text-xs uppercase font-bold text-amber-300 tracking-wider block mb-1">
                    Exam Formula / Key Equation:
                  </span>
                  <p 
                    className="text-lg md:text-2xl font-bold text-amber-200"
                    style={{ fontFamily: DESIGN_SYSTEM.typography.fonts.chalk }}
                  >
                    {currentModule.understanding.blackboardContent.formula}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Multipurpose Canvas (Diagrams, Interactive Artifact, 3D Experience) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center gap-4">
              
              {/* Multipurpose Interactive Artifact Widget */}
              <div className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Interactive Artifact</span>
                  </div>
                  <span className="text-[10px] text-emerald-200 font-semibold">Live Simulation</span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-200 space-y-2">
                  <div className="flex justify-between font-bold">
                    <span>Contact Area (A): {artifactAreaVal} cm²</span>
                    <span className="text-amber-300">Pressure (P): {computedPressure} N/cm²</span>
                  </div>
                  
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={artifactAreaVal}
                    onChange={(e) => setArtifactAreaVal(Number(e.target.value))}
                    className="w-full accent-teal-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-emerald-400">
                    <span>Small Area (High Pressure)</span>
                    <span>Large Area (Low Pressure)</span>
                  </div>
                </div>
              </div>

              {/* 3D Interactive Trigger Overlay (Blurred background with 'Enter 3D' option) */}
              {currentModule.interactive3D?.has3D && (
                <div className="w-full relative group">
                  <div className="p-4 rounded-2xl bg-teal-900/60 border-2 border-teal-400/60 backdrop-blur-md text-center transition-all group-hover:scale-102 shadow-xl">
                    <div className="flex items-center justify-center gap-2 text-teal-200 font-bold text-xs uppercase tracking-wider mb-1">
                      <Box className="w-4 h-4 text-teal-300" />
                      3D Experience Available
                    </div>
                    <p className="text-xs text-emerald-100 mb-3 font-medium">
                      {currentModule.interactive3D.title}
                    </p>

                    <button
                      onClick={() => onOpen3D(currentModule.interactive3D)}
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                      style={{
                        backgroundColor: DESIGN_SYSTEM.colors.tealGreen.primary
                      }}
                    >
                      <Box className="w-4 h-4" />
                      <span>Enter 3D Experience (Zoom)</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Synchronized Captions Bar */}
          <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/15 backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
              <button 
                onClick={playTeacherSpeech}
                className="p-2 rounded-lg bg-teal-800/80 hover:bg-teal-700 text-teal-100 transition-colors shrink-0"
                title="Replay Teacher Voice"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-300 tracking-wider block">
                  AI Teacher Audio Captions (NCERT Concept)
                </span>
                <p className="text-sm text-white font-medium italic">
                  "{currentModule.understanding.teacherSpeech}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase Transition Action Bar */}
      <div className="flex flex-col gap-4">
        {learningPhase === "understanding" && (
          <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-200 shadow-md">
            <div>
              <h4 className="font-bold text-gray-900 text-base">Finished Understanding Phase A?</h4>
              <p className="text-xs text-gray-500 font-medium">
                Teacher will recite the key concept twice, then test student recitation.
              </p>
            </div>

            <button
              onClick={handleStartRecitationPhase}
              className="px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 shadow-lg transition-all hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: DESIGN_SYSTEM.colors.royalRed.primary
              }}
            >
              <span>Begin Student Recitation (Phase B)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Phase B: Student Recitation Module */}
        {learningPhase === "recitation" && (
          <RecitationModule
            targetSentence={currentModule.recitationTarget}
            onPass={handlePassRecitation}
            onRetry={() => playTeacherSpeech()}
          />
        )}

        {/* Module Completed State */}
        {learningPhase === "completed" && (
          <div className="p-6 rounded-2xl bg-teal-50 border-2 border-teal-500 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg animate-in fade-in duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-teal-600 text-white shadow-md">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-teal-950">Module Mastery Complete!</h3>
                <p className="text-sm text-teal-800 font-medium">
                  Student has successfully recited key concept wording. You are 100% exam ready for this module!
                </p>
              </div>
            </div>

            {currentModuleIndex < chapterData.modules.length - 1 ? (
              <button
                onClick={() => {
                  setLearningPhase("understanding");
                  onNextModule();
                }}
                className="px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 shadow-lg transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
                style={{
                  backgroundColor: DESIGN_SYSTEM.colors.tealGreen.primary
                }}
              >
                <span>Proceed to Next Module</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <div className="text-center md:text-right">
                <Badge variant="royalRed" icon={Sparkles}>
                  🏆 Entire Chapter 100% Exam Ready!
                </Badge>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
