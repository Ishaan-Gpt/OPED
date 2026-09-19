"use client";

import React, { useState } from "react";
import BlackboardCanvas from "@/components/blackboard/BlackboardCanvas";
import Canvas3DViewer from "@/components/canvas3d/Canvas3DViewer";
import { DESIGN_SYSTEM } from "@/config/design_system";

export default function ClassroomWall({ chapterData, onExitClassroom }) {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [active3DModel, setActive3DModel] = useState(null);

  const handleNextModule = () => {
    if (currentModuleIndex < chapterData.modules.length - 1) {
      setCurrentModuleIndex(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-[#F4F1EA] p-4 md:p-8 flex flex-col items-center justify-center overflow-x-hidden">
      {/* Photorealistic Wall Background Texture & Ambient Lighting */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px)`,
          backgroundSize: "40px 40px"
        }}
      />
      
      {/* Top Ceiling & Wall Depth Lighting Gradients */}
      <div 
        className="absolute top-0 inset-x-0 h-40 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(61, 43, 31, 0.08) 0%, transparent 100%)`
        }}
      />

      {/* Classroom Content Layer */}
      <main className="w-full z-10 relative my-auto">
        <BlackboardCanvas
          chapterData={chapterData}
          currentModuleIndex={currentModuleIndex}
          onNextModule={handleNextModule}
          onOpen3D={(modelData) => setActive3DModel(modelData)}
          onExitClassroom={onExitClassroom}
        />
      </main>

      {/* 3D Interactive Viewer Fullscreen Modal */}
      {active3DModel && (
        <Canvas3DViewer
          modelData={active3DModel}
          onClose={() => setActive3DModel(null)}
        />
      )}
    </div>
  );
}
