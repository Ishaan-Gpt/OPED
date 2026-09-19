"use client";

import React, { useState } from "react";
import Logo from "@/components/shared/Logo";
import Badge from "@/components/shared/Badge";
import { DESIGN_SYSTEM } from "@/config/design_system";
import { searchNcertDatabase } from "@/data/ncert_db";
import { Search, Sparkles, BookOpen, AlertCircle, ArrowRight } from "lucide-react";

export default function SearchHero({ onSelectChapter }) {
  const [query, setQuery] = useState("");
  const [outOfScopeNotice, setOutOfScopeNotice] = useState(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const result = searchNcertDatabase(query);

    if (result.matched) {
      setOutOfScopeNotice(null);
      onSelectChapter(result.data);
    } else {
      setOutOfScopeNotice(result.outOfScopeMessage);
    }
  };

  const handlePresetClick = (presetQuery) => {
    setQuery(presetQuery);
    const result = searchNcertDatabase(presetQuery);
    if (result.matched) {
      setOutOfScopeNotice(null);
      onSelectChapter(result.data);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between p-6 md:p-10 relative overflow-hidden bg-[#FAFBFD]">
      {/* Background Studio Light Flourishes */}
      <div 
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-40"
        style={{ background: `radial-gradient(circle, ${DESIGN_SYSTEM.colors.tealGreen.lightBg} 0%, transparent 70%)` }}
      />
      <div 
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-30"
        style={{ background: `radial-gradient(circle, ${DESIGN_SYSTEM.colors.earthyBrown.lightBg} 0%, transparent 70%)` }}
      />

      {/* Top Header Bar */}
      <header className="w-full flex items-center justify-between z-10">
        <Logo size="lg" />

        <div className="hidden md:flex items-center gap-3">
          <Badge variant="brown" icon={BookOpen}>
            NCERT Classes 4 - 10 Pre-Connected
          </Badge>
          <Badge variant="royalRed" icon={Sparkles}>
            100% Exam Readiness Guaranteed
          </Badge>
        </div>
      </header>

      {/* Centered Search Engine Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto w-full z-10 py-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 shadow-xs border bg-white"
             style={{ borderColor: DESIGN_SYSTEM.colors.earthyBrown.border, color: DESIGN_SYSTEM.colors.earthyBrown.primary }}>
          <Sparkles className="w-4 h-4 text-amber-600" />
          Outcome-Based Dynamic Classroom Engine
        </div>

        <h1 
          className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 mb-4 leading-tight"
          style={{ fontFamily: DESIGN_SYSTEM.typography.fonts.sans }}
        >
          Master Any <span style={{ color: DESIGN_SYSTEM.colors.tealGreen.primary }}>NCERT Chapter</span>.
          <br />
          Be <span style={{ color: DESIGN_SYSTEM.colors.royalRed.primary }}>100% Exam Ready</span>.
        </h1>

        <p className="text-base md:text-lg text-gray-600 mb-8 max-w-xl">
          Enter an NCERT chapter name or number to launch your dynamic 2-way interactive blackboard classroom.
        </p>

        {/* Central Searchbar */}
        <form onSubmit={handleSearchSubmit} className="w-full relative group">
          <div 
            className="flex items-center bg-white rounded-2xl p-2.5 shadow-xl transition-all duration-300 border-2 group-focus-within:ring-4"
            style={{ 
              borderColor: DESIGN_SYSTEM.colors.earthyBrown.primary,
              boxShadow: DESIGN_SYSTEM.shadows.searchBarShadow
            }}
          >
            <div className="pl-4 pr-2 text-gray-400">
              <Search className="w-6 h-6 text-gray-400 group-focus-within:text-teal-700 transition-colors" />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type NCERT Chapter (e.g. NCERT Class 6 Science Chapter 2)..."
              className="w-full py-3 px-2 text-lg text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none font-medium"
              autoFocus
            />

            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl font-bold text-white flex items-center gap-2 transition-all hover:opacity-90 active:scale-98 shadow-md"
              style={{
                backgroundColor: DESIGN_SYSTEM.colors.tealGreen.primary
              }}
            >
              <span>Start Class</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Out-of-Scope Notice Display */}
        {outOfScopeNotice && (
          <div 
            className="mt-6 w-full p-4 rounded-xl text-left border flex items-start gap-3 shadow-md animate-in fade-in slide-in-from-top-2 duration-300"
            style={{
              backgroundColor: DESIGN_SYSTEM.colors.royalRed.lightBg,
              borderColor: DESIGN_SYSTEM.colors.royalRed.border,
              color: DESIGN_SYSTEM.colors.royalRed.primary
            }}
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm font-semibold whitespace-pre-line leading-relaxed">
              {outOfScopeNotice}
            </div>
          </div>
        )}

        {/* Popular Preset Chips */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold text-gray-400 mr-1">Quick Try:</span>
          {[
            "NCERT Class 6 Science Chapter 2",
            "NCERT Class 8 Science Chapter 11",
            "NCERT Class 10 Science Chapter 10",
            "NCERT Class 4 EVS Chapter 1"
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetClick(preset)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-50 transition-all text-gray-700 shadow-2xs hover:border-gray-400"
            >
              {preset}
            </button>
          ))}
        </div>
      </main>

      {/* Footer info */}
      <footer className="w-full text-center text-xs text-gray-400 z-10 py-2 border-t border-gray-100">
        OPED Outcome-Based Classroom • Powered by AWS Free Tier Architecture & 2-Way Speech Verification
      </footer>
    </div>
  );
}
