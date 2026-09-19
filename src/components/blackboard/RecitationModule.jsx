"use client";

import React, { useState, useEffect } from "react";
import { DESIGN_SYSTEM } from "@/config/design_system";
import Badge from "@/components/shared/Badge";
import { awsService } from "@/services/aws_service";
import { Mic, MicOff, CheckCircle2, AlertTriangle, Volume2, Send, Sparkles, RotateCcw } from "lucide-react";

export default function RecitationModule({ targetSentence, onPass, onRetry }) {
  const [studentInput, setStudentInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [attemptCount, setAttemptCount] = useState(0);

  // Teacher 2-time recitation cycle state
  const [teacherRecitationStep, setTeacherRecitationStep] = useState(1); // 1 = first time, 2 = second time, 3 = student turn
  const [isTeacherSpeaking, setIsTeacherSpeaking] = useState(false);

  // Automated 2-time Teacher Recitation Sequence
  const speakTeacherRecitation = (round = 1) => {
    setIsTeacherSpeaking(true);
    setTeacherRecitationStep(round);

    awsService.synthesizeTeacherSpeech(targetSentence, {
      onStart: () => setIsTeacherSpeaking(true),
      onEnd: () => {
        setIsTeacherSpeaking(false);
        if (round === 1) {
          // Short pause before second recitation
          setTimeout(() => {
            speakTeacherRecitation(2);
          }, 1200);
        } else if (round === 2) {
          // After 2nd recitation, prompt student
          setTeacherRecitationStep(3);
          awsService.synthesizeTeacherSpeech("Now it is your turn. Please recite this concept back to me.");
        }
      }
    });
  };

  // Trigger teacher recitation on mount or retry
  useEffect(() => {
    speakTeacherRecitation(1);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [targetSentence]);

  // Web Speech API Voice Recognition
  const toggleVoiceListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice speech recognition is not supported in this browser. Please type your recitation below!");
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
          .map(r => r[0].transcript)
          .join("");
        setStudentInput(transcript);
      };
      recognition.onend = () => setIsListening(false);
      recognition.start();
    }
  };

  const handleEvaluation = async (e) => {
    if (e) e.preventDefault();
    if (!studentInput.trim()) return;

    const newAttempt = attemptCount + 1;
    setAttemptCount(newAttempt);

    const result = await awsService.evaluateStudentRecitation({
      targetSentence,
      studentAnswer: studentInput,
      attemptCount: newAttempt
    });

    setEvaluation(result);

    if (result.passed) {
      setTimeout(() => {
        onPass();
      }, 1600);
    } else {
      // Dynamic teacher adaptation on retry
      onRetry();
      setTimeout(() => {
        speakTeacherRecitation(1);
      }, 1500);
    }
  };

  return (
    <div 
      className="w-full p-6 md:p-8 rounded-3xl border bg-white/95 shadow-xl backdrop-blur-md transition-all duration-300"
      style={{
        borderColor: evaluation?.passed 
          ? DESIGN_SYSTEM.colors.tealGreen.border 
          : evaluation && !evaluation.passed 
            ? DESIGN_SYSTEM.colors.royalRed.border 
            : DESIGN_SYSTEM.colors.earthyBrown.border
      }}
    >
      {/* Top Phase Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <Badge variant={evaluation?.passed ? "teal" : "royalRed"} icon={Sparkles}>
            Phase B: Recitation & Verification
          </Badge>
          <span className="text-xs font-semibold text-gray-500">
            Attempts: {attemptCount}
          </span>
        </div>

        {/* 2-Time Recitation Tracker */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500">Teacher Recitation:</span>
          <span 
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors ${
              teacherRecitationStep === 1 
                ? "bg-teal-100 text-teal-800 border-teal-300" 
                : "bg-gray-100 text-gray-500 border-gray-200"
            }`}
          >
            1 of 2
          </span>
          <span 
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors ${
              teacherRecitationStep === 2 
                ? "bg-teal-100 text-teal-800 border-teal-300" 
                : teacherRecitationStep === 3 
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300" 
                  : "bg-gray-100 text-gray-500 border-gray-200"
            }`}
          >
            2 of 2
          </span>
        </div>
      </div>

      {/* Target Concept Box */}
      <div 
        className="p-5 rounded-2xl border mb-6 relative overflow-hidden"
        style={{
          backgroundColor: DESIGN_SYSTEM.colors.earthyBrown.lightBg,
          borderColor: DESIGN_SYSTEM.colors.earthyBrown.border
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
            Mandatory Exam Concept (Told 2 Times by Teacher):
          </span>
          <button
            onClick={() => speakTeacherRecitation(1)}
            className="flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 transition-colors"
            title="Hear Teacher Recite Again"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Listen Again</span>
          </button>
        </div>

        <p 
          className="text-base md:text-xl font-bold text-amber-950 leading-relaxed italic"
          style={{ fontFamily: DESIGN_SYSTEM.typography.fonts.sans }}
        >
          "{targetSentence}"
        </p>

        {isTeacherSpeaking && (
          <div className="mt-3 flex items-center gap-2 text-xs font-bold text-teal-800 animate-pulse">
            <Volume2 className="w-4 h-4 text-teal-700" />
            <span>Teacher is reciting ({teacherRecitationStep}/2)... Listen carefully!</span>
          </div>
        )}
      </div>

      {/* Student Recitation Input Section */}
      <form onSubmit={handleEvaluation} className="space-y-4">
        <div className="relative">
          <textarea
            value={studentInput}
            onChange={(e) => setStudentInput(e.target.value)}
            disabled={teacherRecitationStep < 3 && isTeacherSpeaking}
            placeholder={
              teacherRecitationStep < 3 && isTeacherSpeaking
                ? "Listening to teacher recitations 1 & 2... Prepare your answer!"
                : "Speak into microphone or type your recitation here..."
            }
            rows={3}
            className="w-full p-4 pr-14 text-base border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all font-medium text-gray-900 placeholder-gray-400 bg-white"
            style={{
              borderColor: isListening ? DESIGN_SYSTEM.colors.tealGreen.bright : "#E5E7EB"
            }}
          />

          <button
            type="button"
            onClick={toggleVoiceListening}
            className={`absolute right-3.5 top-3.5 p-2.5 rounded-xl transition-all ${
              isListening 
                ? "bg-red-600 text-white animate-pulse shadow-md" 
                : "bg-teal-50 text-teal-800 hover:bg-teal-100"
            }`}
            title={isListening ? "Stop Recording" : "Start Voice Recitation"}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">
            {isListening ? "🎙️ Speaking... Recite the exact wording." : "Click mic to speak or type answer"}
          </span>

          <button
            type="submit"
            disabled={!studentInput.trim()}
            className="px-6 py-3 rounded-xl font-bold text-sm text-white flex items-center gap-2 shadow-md transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
            style={{
              backgroundColor: DESIGN_SYSTEM.colors.tealGreen.primary
            }}
          >
            <span>Verify Recitation</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Dynamic Teacher Evaluation Feedback */}
      {evaluation && (
        <div 
          className="mt-6 p-5 rounded-2xl border flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
          style={{
            backgroundColor: evaluation.passed ? DESIGN_SYSTEM.colors.tealGreen.lightBg : DESIGN_SYSTEM.colors.royalRed.lightBg,
            borderColor: evaluation.passed ? DESIGN_SYSTEM.colors.tealGreen.border : DESIGN_SYSTEM.colors.royalRed.border,
            color: evaluation.passed ? DESIGN_SYSTEM.colors.tealGreen.primary : DESIGN_SYSTEM.colors.royalRed.primary
          }}
        >
          {evaluation.passed ? (
            <CheckCircle2 className="w-7 h-7 shrink-0 mt-0.5 text-teal-700" />
          ) : (
            <AlertTriangle className="w-7 h-7 shrink-0 mt-0.5 text-red-700" />
          )}

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-base">
                {evaluation.passed ? "Concept Verified! 100% Exam Ready" : "Recitation Needs Adjustment"}
              </h4>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/90 shadow-2xs">
                Keyword Accuracy: {evaluation.score}%
              </span>
            </div>
            
            <p className="text-sm mt-1.5 leading-relaxed font-medium">
              {evaluation.feedback}
            </p>

            {evaluation.missingKeywords && evaluation.missingKeywords.length > 0 && (
              <div className="mt-2 text-xs font-semibold">
                <span>Missing exact NCERT words: </span>
                <span className="underline">{evaluation.missingKeywords.join(", ")}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
