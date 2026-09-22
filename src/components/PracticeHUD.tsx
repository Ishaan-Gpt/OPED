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
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-zinc-900/90 backdrop-blur-md border border-white/20 text-xs text-white">
        <div className="flex items-center gap-2 text-white font-medium">
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
          <span>Outcome Practice · Step 3 of 3</span>
        </div>
        <div className="flex items-center gap-3 text-white/80">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <span className="font-semibold text-white">
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
        className="relative p-6 rounded-2xl bg-zinc-900/95 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col gap-5 text-white"
      >
        {/* Question Type Badge */}
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/10 text-white border border-white/20 backdrop-blur-md">
            {currentQ.type.replace(/-/g, " ")}
          </span>
          {isAnswered && (
            <span
              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md ${
                currentResult?.isCorrect
                  ? "bg-white/30 text-white border border-white/50"
                  : "bg-white/10 text-white/70 border border-white/20"
              }`}
            >
              {currentResult?.isCorrect ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" /> Correct
                </>
              ) : (
                <>
                  <X className="w-3.5 h-3.5 text-white/70" /> Incorrect
                </>
              )}
            </span>
          )}
        </div>

        {/* Question Prompt */}
        <h3 className="text-base sm:text-lg font-medium text-white leading-relaxed">
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
                className={`flex-1 px-4 py-3 rounded-xl bg-black/60 border text-sm text-white placeholder-white/40 focus:outline-none transition-all ${
                  isAnswered
                    ? currentResult?.isCorrect
                      ? "border-white/60 bg-white/20"
                      : "border-white/30 bg-white/5"
                    : "border-white/20 focus:border-white/60 focus:ring-1 focus:ring-white/60"
                }`}
              />
              {!isAnswered && (
                <button
                  type="button"
                  disabled={!currentInput.trim()}
                  onClick={() => evaluateAnswer(currentInput)}
                  className="px-5 py-3 rounded-xl font-semibold text-sm bg-white/20 hover:bg-white/30 border border-white/30 disabled:opacity-40 text-white transition-all cursor-pointer backdrop-blur-md"
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
                let btnStyle = "bg-white/10 border-white/20 hover:bg-white/20 text-white backdrop-blur-md";

                if (isAnswered) {
                  if (isCorrectOption) {
                    btnStyle = "bg-white/30 border-white/60 text-white font-bold backdrop-blur-md";
                  } else if (isSelected && !currentResult?.isCorrect) {
                    btnStyle = "bg-white/5 border-white/20 text-white/50 line-through backdrop-blur-md";
                  } else {
                    btnStyle = "opacity-40 bg-white/5 border-white/10 text-white/40 backdrop-blur-md";
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
                let btnStyle = "bg-white/10 border-white/20 hover:bg-white/20 text-white backdrop-blur-md";

                if (isAnswered) {
                  if (isCorrectOption) {
                    btnStyle = "bg-white/30 border-white/60 text-white font-bold backdrop-blur-md";
                  } else if (isSelected && !currentResult?.isCorrect) {
                    btnStyle = "bg-white/5 border-white/20 text-white/50 line-through backdrop-blur-md";
                  } else {
                    btnStyle = "opacity-40 bg-white/5 border-white/10 text-white/40 backdrop-blur-md";
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
              className="p-3.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white/90 flex flex-col gap-1.5 backdrop-blur-md"
            >
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <HelpCircle className="w-3.5 h-3.5 text-white" />
                <span>NCERT Concept Explanation</span>
              </div>
              <p className="leading-relaxed">{currentQ.explanation}</p>
              {!currentResult?.isCorrect && (
                <div className="mt-1 font-medium text-white">
                  Correct Answer: <span className="font-bold underline">{currentQ.correctAnswer}</span>
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
            className="flex justify-end pt-2 border-t border-white/15"
          >
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-white/20 hover:bg-white/30 border border-white/30 text-white transition-all cursor-pointer shadow-lg backdrop-blur-md"
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
