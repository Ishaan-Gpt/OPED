"use client";

import React, { useState } from "react";
import SearchHero from "@/components/hero/SearchHero";
import ClassroomWall from "@/components/classroom/ClassroomWall";

export default function Home() {
  const [selectedChapter, setSelectedChapter] = useState(null);

  return (
    <div className="min-h-screen w-full font-sans antialiased selection:bg-teal-100 selection:text-teal-900">
      {!selectedChapter ? (
        <SearchHero 
          onSelectChapter={(chapter) => setSelectedChapter(chapter)} 
        />
      ) : (
        <ClassroomWall 
          chapterData={selectedChapter} 
          onExitClassroom={() => setSelectedChapter(null)} 
        />
      )}
    </div>
  );
}
