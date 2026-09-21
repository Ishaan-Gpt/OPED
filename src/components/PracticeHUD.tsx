import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PracticeQuestion, PracticeSection } from "@/data/ncert";
import { Check, X, ArrowRight, HelpCircle, Award, Sparkles, RefreshCw } from "lucide-react";

interface Props {
  practice: PracticeSection;
  onComplete: (score: number, results: { questionId: string; isCorrect: boolean; userAnswer: string; attempts: number }[]) => void;
  onQuestionAnswered?: (isCorrect: boolean) => void;
}

export default function PracticeHUD({ practice, onComplete, onQuestionAnswered }: Props) {
  const questions = practice.questions;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, { isCorrect: boolean; answer: string }>>({});
  const [attemptsPerQuestion, setAttemptsPerQuestion] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const isAnswered = currentQ ? !!submittedAnswers[currentQ.id] : false;
  const currentResult = currentQ ? submittedAnswers[currentQ.id] : undefined;

  const currentInput = currentQ ? userInputs[currentQ.id] || "" : "";

  const handleInputChange = (val: string) => {
    if (!currentQ || isAnswered) return;
    setUserInputs((prev) => ({ ...prev, [currentQ.id]: val }));
  };

  const evaluateAnswer = (inputVal: string) => {
    if (!currentQ || isAnswered) return;
    const cleanInput = inputVal.trim().toLowerCase();
    const attempts = (attemptsPerQuestion[currentQ.id] || 0) + 1;
    setAttemptsPerQuestion((prev) => ({ ...prev, [currentQ.id]: attempts }));

    let isCorrect = false;
    if (currentQ.type === "fill-in-the-blanks") {
      const acceptable = [
        currentQ.correctAnswer.toLowerCase(),
        ...(currentQ.acceptableAnswers || []).map((a) => a.toLowerCase()),
      ];
      isCorrect = acceptable.some((ans) => cleanInput === ans || cleanInput.includes(ans));
    } else if (currentQ.type === "mcq" || currentQ.type === "true-false") {
      isCorrect = cleanInput === currentQ.correctAnswer.trim().toLowerCase();
    }

    setSubmittedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: { isCorrect, answer: inputVal },
    }));
    setShowExplanation(true);
    onQuestionAnswered?.(isCorrect);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Calculate final practice score
      const results = questions.map((q) => {
        const sub = submittedAnswers[q.id];
        return {
          questionId: q.id,
          isCorrect: sub?.isCorrect ?? false,
          userAnswer: sub?.answer ?? "",
          attempts: attemptsPerQuestion[q.id] ?? 1,
        };
      });
      const correctCount = results.filter((r) => r.isCorrect).length;
      const finalScore = Math.round((correctCount / totalQuestions) * 100);
      onComplete(finalScore, results);
    }
  };

  const correctSoFar = Object.values(submittedAnswers).filter((s) => s.isCorrect).length;
  const answeredSoFar = Object.keys(submittedAnswers).length;

  if (!currentQ) return null;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
      {/* HUD Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/80 backdrop-blur border border-emerald-500/20 text-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-medium">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Outcome Practice · Step 3 of 3</span>
        </div>
        <div className="flex items-center gap-3 text-slate-300">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          <span className="font-semibold text-emerald-400">
            Score: {answeredSoFar > 0 ? Math.round((correctSoFar / answeredSoFar) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Main Question Card */}
      <motion.div
        key={currentQ.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        className="relative p-6 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 shadow-2xl flex flex-col gap-5 text-white"
      >
        {/* Question Type Badge */}
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {currentQ.type.replace(/-/g, " ")}
          </span>
          {isAnswered && (
            <span
              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                currentResult?.isCorrect
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
              }`}
            >
              {currentResult?.isCorrect ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Correct
                </>
              ) : (
                <>
                  <X className="w-3.5 h-3.5" /> Incorrect
                </>
              )}
            </span>
          )}
        </div>

        {/* Question Prompt */}
        <h3 className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
          {currentQ.question}
        </h3>

        {/* Question Interactive Input Forms */}
        <div className="flex flex-col gap-2.5 pt-1">
          {currentQ.type === "fill-in-the-blanks" && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                disabled={isAnswered}
                placeholder="Type your answer here..."
                value={currentInput}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && currentInput.trim() && !isAnswered) {
                    evaluateAnswer(currentInput);
                  }
                }}
                className={`flex-1 px-4 py-3 rounded-xl bg-slate-800/90 border text-sm text-white placeholder-slate-400 focus:outline-none transition-all ${
                  isAnswered
                    ? currentResult?.isCorrect
                      ? "border-emerald-500/80 bg-emerald-950/20"
                      : "border-rose-500/80 bg-rose-950/20"
                    : "border-slate-600 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                }`}
              />
              {!isAnswered && (
                <button
                  type="button"
                  disabled={!currentInput.trim()}
                  onClick={() => evaluateAnswer(currentInput)}
                  className="px-5 py-3 rounded-xl font-medium text-sm bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white transition-colors cursor-pointer"
                >
                  Submit
                </button>
              )}
            </div>
          )}

          {currentQ.type === "mcq" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQ.options?.map((option, idx) => {
                const isSelected = currentResult?.answer === option;
                const isCorrectOption = option === currentQ.correctAnswer;
                let btnStyle = "bg-slate-800/80 border-slate-700/80 hover:bg-slate-750 text-slate-200";

                if (isAnswered) {
                  if (isCorrectOption) {
                    btnStyle = "bg-emerald-900/40 border-emerald-500 text-emerald-200 font-semibold";
                  } else if (isSelected && !currentResult?.isCorrect) {
                    btnStyle = "bg-rose-900/40 border-rose-500 text-rose-200";
                  } else {
                    btnStyle = "opacity-50 bg-slate-800/40 border-slate-750 text-slate-400";
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => evaluateAnswer(option)}
                    className={`p-3.5 rounded-xl border text-left text-sm transition-all flex items-start gap-2.5 ${btnStyle} cursor-pointer`}
                  >
                    <span className="w-5 h-5 rounded-full border border-current/30 flex items-center justify-center text-[11px] font-mono shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </button>
                );
              })}
            </div>
          )}

          {currentQ.type === "true-false" && (
            <div className="grid grid-cols-2 gap-3">
              {["True", "False"].map((opt) => {
                const isSelected = currentResult?.answer === opt;
                const isCorrectOption = opt === currentQ.correctAnswer;
                let btnStyle = "bg-slate-800/80 border-slate-700 hover:bg-slate-750 text-slate-200";

                if (isAnswered) {
                  if (isCorrectOption) {
                    btnStyle = "bg-emerald-900/40 border-emerald-500 text-emerald-200 font-semibold";
                  } else if (isSelected && !currentResult?.isCorrect) {
                    btnStyle = "bg-rose-900/40 border-rose-500 text-rose-200";
                  } else {
                    btnStyle = "opacity-40 bg-slate-800/40 border-slate-750 text-slate-400";
                  }
                }

                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => evaluateAnswer(opt)}
                    className={`py-3.5 px-4 rounded-xl border font-medium text-sm transition-all text-center ${btnStyle} cursor-pointer`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Pedagogical Explanation & Remediation */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-300 flex flex-col gap-1.5"
            >
              <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>NCERT Concept Explanation</span>
              </div>
              <p className="leading-relaxed">{currentQ.explanation}</p>
              {!currentResult?.isCorrect && (
                <div className="mt-1 font-medium text-emerald-300">
                  Correct Answer: <span className="font-bold">{currentQ.correctAnswer}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Question / Finish Action */}
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-end pt-2 border-t border-slate-800"
          >
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <span>{currentIndex + 1 < totalQuestions ? "Next Question" : "Complete Practice & View Report"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
