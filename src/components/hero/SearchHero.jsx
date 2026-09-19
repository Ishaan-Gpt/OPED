"use client";

import React, { useState } from "react";
import Logo from "@/components/shared/Logo";
import { DESIGN_SYSTEM } from "@/config/design_system";
import { searchNcertDatabase } from "@/data/ncert_db";
import { Search, ArrowRight, Loader2, BookOpen } from "lucide-react";

export default function SearchHero({ onSelectChapter }) {
  const [query, setQuery] = useState("");
  const [outOfScopeNotice, setOutOfScopeNotice] = useState(null);
  const [preparationStep, setPreparationStep] = useState(null); // null | "fetching" | "synthesizing" | "ready"

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || preparationStep) return;

    const result = searchNcertDatabase(query);

    if (result.matched) {
      setOutOfScopeNotice(null);
      // Trigger Class Preparation Sequence:
      // "first class is prepared -preparation time is taken-> Data is fetched from ncert db stored with me
      // It is then shortend and concise but same wording module is preapred"
      setPreparationStep("fetching");

      setTimeout(() => {
        setPreparationStep("synthesizing");
      }, 1000);

      setTimeout(() => {
        setPreparationStep("ready");
      }, 2000);

      setTimeout(() => {
        onSelectChapter(result.data);
      }, 2600);
    } else {
      setOutOfScopeNotice(result.outOfScopeMessage);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between p-6 md:p-10 relative bg-[#FAFBFD] overflow-hidden">
      {/* Top Left Logo Only (as specified: 'with a logo in the left nothing else') */}
      <header className="w-full flex items-center justify-start z-20">
        <Logo size="md" />
      </header>

      {/* Dead Center: Chat-like Searchbar & Expansion Transition */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full z-10 px-4">
        
        {/* Chat-Like Searchbar */}
        <div className="w-full relative">
          <form 
            onSubmit={handleSearchSubmit}
            className={`w-full transition-all duration-700 ease-out ${
              preparationStep === "ready" ? "scale-105 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            <div 
              className="flex items-center bg-white rounded-full px-5 py-3.5 shadow-xl transition-all duration-300 border hover:shadow-2xl focus-within:ring-2 focus-within:ring-[#005F56]"
              style={{
                borderColor: DESIGN_SYSTEM.colors.earthyBrown.border,
                boxShadow: DESIGN_SYSTEM.shadows.searchBarShadow
              }}
            >
              <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />

              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (outOfScopeNotice) setOutOfScopeNotice(null);
                }}
                disabled={Boolean(preparationStep)}
                placeholder="Ask or search NCERT chapter (e.g. NCERT Class 6 Science Chapter 2)..."
                className="w-full py-1 text-base md:text-lg text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none font-medium"
                autoFocus
              />

              <button
                type="submit"
                disabled={Boolean(preparationStep)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:opacity-90 active:scale-95 shrink-0 ml-2 shadow-sm"
                style={{
                  backgroundColor: DESIGN_SYSTEM.colors.tealGreen.primary
                }}
              >
                {preparationStep ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>

          {/* Preparation Stage Status Animation */}
          {preparationStep && (
            <div className="mt-8 flex flex-col items-center text-center animate-in fade-in duration-300">
              <div 
                className="p-4 rounded-2xl border bg-white shadow-lg flex items-center gap-3"
                style={{ borderColor: DESIGN_SYSTEM.colors.earthyBrown.primary }}
              >
                <div className="w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: DESIGN_SYSTEM.colors.tealGreen.bright }} />
                <span className="text-sm font-bold text-gray-800">
                  {preparationStep === "fetching" && "1/2 Fetching verified NCERT chapter data..."}
                  {preparationStep === "synthesizing" && "2/2 Preparing concise textbook wording & blackboard modules..."}
                  {preparationStep === "ready" && "Expanding Blackboard Classroom..."}
                </span>
              </div>
            </div>
          )}

          {/* Out-of-Scope Response (As specified: 'an ans comes that we are expanding try typing Ncert [class] [subject] [chapter no]') */}
          {outOfScopeNotice && !preparationStep && (
            <div 
              className="mt-6 p-4 rounded-2xl border bg-white shadow-md animate-in fade-in slide-in-from-top-2 duration-300"
              style={{
                borderColor: DESIGN_SYSTEM.colors.royalRed.border,
                borderLeftWidth: "4px",
                borderLeftColor: DESIGN_SYSTEM.colors.royalRed.primary
              }}
            >
              <p className="text-sm font-semibold text-gray-800 whitespace-pre-line leading-relaxed">
                {outOfScopeNotice}
              </p>
              
              {/* Quick try shortcut chip */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Quick example:</span>
                <button
                  onClick={() => {
                    setQuery("NCERT Class 6 Science Chapter 2");
                    setOutOfScopeNotice(null);
                  }}
                  className="text-xs font-bold text-[#005F56] hover:underline"
                >
                  NCERT Class 6 Science Chapter 2
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Clean Bottom Footer Anchor */}
      <footer className="w-full flex justify-between items-center text-[11px] text-gray-400 z-10">
        <span>OPED • Outcome-Based Education</span>
        <span>Desktop & Mobile Landscape Optimized</span>
      </footer>
    </div>
  );
}
