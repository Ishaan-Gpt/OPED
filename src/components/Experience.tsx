import { Suspense, ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Html } from "@react-three/drei";
import { Classroom } from "./world/Classroom";
import { Teacher } from "./world/Teacher";
import { Students } from "./world/Students";
import { FPVCamera } from "./world/FPVCamera";

interface ExperienceProps {
  isSpeaking?: boolean | undefined;
  className?: string | undefined;
  children?: ReactNode | undefined;
}

export function Experience({
  isSpeaking,
  className = "w-full h-full",
  children,
}: ExperienceProps) {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <Canvas className="w-full h-full" camera={{ position: [0, 1.1, 4.6], fov: 50 }}>
        <FPVCamera />
        <Suspense fallback={null}>
          <Environment preset="sunset" />
          <ambientLight intensity={0.8} color={"#ffe8f0"} />
          <directionalLight position={[5, 10, 5]} intensity={0.6} />

          <Classroom position={[0, -8, 0]} rotation={[0, Math.PI, 0]} />
          <Teacher position={[-12, -7.95, -14]} rotation={[0, 1, 0]} isSpeakingOverride={isSpeaking ?? false} />
          <Students />

          {/* Embed OG Blackboard Canvas onto 3D Classroom Wall behind Teacher with WebGL Occlusion */}
          {children && (
            <Html
              transform
              occlude
              position={[0, 0.6, -16.55]}
              rotation={[0, 0, 0]}
              distanceFactor={8.2}
              className="w-[1000px] pointer-events-auto select-none"
            >
              {children}
            </Html>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Experience;
