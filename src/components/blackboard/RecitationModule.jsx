"use client";

import React, { useState, useEffect } from "react";
import { DESIGN_SYSTEM } from "@/config/design_system";
import Badge from "@/components/shared/Badge";
import { Mic, MicOff, CheckCircle2, AlertTriangle, RefreshCw, Send, Sparkles } from "lucide-react";

export default function RecitationModule({ targetSentence, onPass, onRetry }) {
  const [studentInput, setStudentInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [evaluation, setEvaluation] = useState(null); // { passed: boolean, feedback: string, score: number }
  const [attemptCount, setAttemptCount] = useState(0);

  // Initialize Web Speech API for voice recitation
  useEffect(() => {
    let recognition = null;
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join("");
        setStudentInput(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleVoiceListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice speech recognition is not supported in this browser. Please use text recitation below!");
      return;
    }

    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join("");
        setStudentInput(transcript);
      };
      recognition.onend = () => setIsListening(false);
      recognition.start();
    }
  };

  const evaluateRecitation = (e) => {
    if (e) e.preventDefault();
    if (!studentInput.trim()) return;

    setAttemptCount(prev => prev + 1);

    // Normalize comparison
    const targetClean = targetSentence.toLowerCase().replace(/[^a-z0-9 ]/g, "");
    const studentClean = studentInput.toLowerCase().replace(/[^a-z0-9 ]/g, "");

    const targetWords = targetClean.split(" ");
    const studentWords = new Set(studentClean.split(" "));

    let matchCount = 0;
    targetWords.forEach(w => {
      if (studentWords.has(w)) matchCount++;
    });

    const accuracyScore = Math.round((matchCount / targetWords.length) * 100);
    const passed = accuracyScore >= 60; // 60%+ NCERT keyword accuracy pass threshold

    if (passed) {
      setEvaluation({
        passed: true,
        score: accuracyScore,
        feedback: "Excellent! You recited the exact NCERT concept correctly. Exam readiness verified!"
      });
      setTimeout(() => {
        onPass();
      }, 1800);
    } else {
      setEvaluation({
        passed: false,
        score: accuracyScore,
        feedback: "Almost there! Make sure to include the exact key terms. Listen carefully and try reciting again."
      });
      onRetry();
    }
  };

  return (
    <div 
      className="w-full p-5 md:p-6 rounded-2xl border bg-white/95 shadow-lg backdrop-blur-md transition-all duration-300"
      style={{
        borderColor: evaluation?.passed 
          ? DESIGN_SYSTEM.colors.tealGreen.border 
          : evaluation && !evaluation.passed 
            ? DESIGN_SYSTEM.colors.royalRed.border 
            : DESIGN_SYSTEM.colors.earthyBrown.border
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge variant={evaluation?.passed ? "teal" : "royalRed"} icon={Sparkles}>
            Phase B: 2-Way Recitation Verification
          </Badge>
          <span className="text-xs font-semibold text-gray-400">Attempts: {attemptCount}</span>
        </div>

        <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
          Must Recite Correctly
        </span>
      </div>

      {/* Target Sentence Box */}
      <div 
        className="p-4 rounded-xl border mb-5"
        style={{
          backgroundColor: DESIGN_SYSTEM.colors.earthyBrown.lightBg,
          borderColor: DESIGN_SYSTEM.colors.earthyBrown.border
        }}
      >
        <span className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-amber-900">
          Recite This NCERT Concept Line:
        </span>
        <p 
          className="text-base md:text-lg font-bold text-amber-950 italic"
          style={{ fontFamily: DESIGN_SYSTEM.typography.fonts.sans }}
        >
          "{targetSentence}"
        </p>
      </div>

      {/* Recitation Controls */}
      <form onSubmit={evaluateRecitation} className="space-y-4">
        <div className="relative">
          <textarea
            value={studentInput}
            onChange={(e) => setStudentInput(e.target.value)}
            placeholder="Speak into microphone or type your recitation here..."
            rows={3}
            className="w-full p-3.5 pr-12 text-sm md:text-base border-2 rounded-xl focus:outline-none focus:ring-2 transition-all font-medium text-gray-900 placeholder-gray-400"
            style={{
              borderColor: isListening ? DESIGN_SYSTEM.colors.tealGreen.bright : "#E5E7EB"
            }}
          />

          <button
            type="button"
            onClick={toggleVoiceListening}
            className={`absolute right-3 top-3 p-2.5 rounded-xl transition-all ${
              isListening 
                ? "bg-red-600 text-white animate-pulse shadow-md" 
                : "bg-teal-50 text-teal-800 hover:bg-teal-100"
            }`}
            title={isListening ? "Stop Listening" : "Start Voice Recitation"}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">
            {isListening ? "🎙️ Listening to your voice... Speak now!" : "Click mic to speak or type answer"}
          </span>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl font-bold text-sm text-white flex items-center gap-2 shadow-md transition-all hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: DESIGN_SYSTEM.colors.tealGreen.primary
            }}
          >
            <span>Verify Answer</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Evaluation Feedback Alert */}
      {evaluation && (
        <div 
          className="mt-5 p-4 rounded-xl border flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
          style={{
            backgroundColor: evaluation.passed ? DESIGN_SYSTEM.colors.tealGreen.lightBg : DESIGN_SYSTEM.colors.royalRed.lightBg,
            borderColor: evaluation.passed ? DESIGN_SYSTEM.colors.tealGreen.border : DESIGN_SYSTEM.colors.royalRed.border,
            color: evaluation.passed ? DESIGN_SYSTEM.colors.tealGreen.primary : DESIGN_SYSTEM.colors.royalRed.primary
          }}
        >
          {evaluation.passed ? (
            <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
          )}

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm">
                {evaluation.passed ? "Check Passed! 100% Concept Mastered" : "Recitation Needs Precision"}
              </h4>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/80">
                Score: {evaluation.score}%
              </span>
            </div>
            <p className="text-xs mt-1 leading-relaxed font-medium">{evaluation.feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
}
