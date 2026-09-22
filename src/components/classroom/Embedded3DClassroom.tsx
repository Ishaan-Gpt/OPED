import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ThreeWhiteboardMesh } from "./ThreeWhiteboardMesh";

interface Props {
  sourceCanvasRef?: React.RefObject<HTMLCanvasElement | null>;
  title?: string;
  notes?: string[];
  caption?: string;
  isSpeaking?: boolean;
  className?: string;
}

// Procedural 3D Teacher Avatar (Humanoid Rig with Head Bob & Gesture Motions)
function Procedural3DTeacher({ isSpeaking = false }: { isSpeaking?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Gentle breathing idle
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.05 - 0.5;
    }
    if (headRef.current) {
      // Head tilt & idle look around
      headRef.current.rotation.y = Math.sin(t * 0.8) * 0.15;
      if (isSpeaking) {
        headRef.current.rotation.x = Math.sin(t * 8) * 0.08;
      } else {
        headRef.current.rotation.x = 0;
      }
    }
    if (rightArmRef.current) {
      // Right arm gesture towards board when speaking
      if (isSpeaking) {
        rightArmRef.current.rotation.z = Math.sin(t * 4) * 0.25 - 0.6;
        rightArmRef.current.rotation.x = Math.cos(t * 3) * 0.2 - 0.4;
      } else {
        rightArmRef.current.rotation.z = -0.2;
        rightArmRef.current.rotation.x = 0;
      }
    }
    if (leftArmRef.current) {
      if (isSpeaking) {
        leftArmRef.current.rotation.z = Math.cos(t * 3) * 0.15 + 0.3;
      } else {
        leftArmRef.current.rotation.z = 0.2;
      }
    }
  });

  return (
    <group ref={groupRef} position={[-3.8, -0.5, -10]}>
      {/* Torso / Suit Jacket */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.9, 1.3, 0.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>

      {/* Inner Shirt */}
      <mesh position={[0, 1.35, 0.26]}>
        <planeGeometry args={[0.3, 0.6]} />
        <meshStandardMaterial color="#0f766e" />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#f5d0b5" roughness={0.5} />

        {/* Glasses */}
        <mesh position={[0, 0.05, 0.32]}>
          <boxGeometry args={[0.55, 0.16, 0.08]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} />
        </mesh>
      </mesh>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.55, 1.6, 0]}>
        <mesh position={[0.1, -0.4, 0]}>
          <cylinderGeometry args={[0.1, 0.08, 0.9, 16]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Hand */}
        <mesh position={[0.1, -0.9, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#f5d0b5" />
        </mesh>
      </group>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.55, 1.6, 0]}>
        <mesh position={[-0.1, -0.4, 0]}>
          <cylinderGeometry args={[0.1, 0.08, 0.9, 16]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Hand */}
        <mesh position={[-0.1, -0.9, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#f5d0b5" />
        </mesh>
      </group>

      {/* Trousers / Legs */}
      <mesh position={[-0.22, 0.25, 0]}>
        <cylinderGeometry args={[0.14, 0.12, 1.0, 16]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.22, 0.25, 0]}>
        <cylinderGeometry args={[0.14, 0.12, 1.0, 16]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  );
}

// Procedural 3D Classroom Environment (Walls, Wooden Floor, Desks & Lighting)
function ProceduralClassroomEnvironment() {
  return (
    <group>
      {/* Floor */}
      <mesh position={[0, -2, -6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#47301c" roughness={0.7} />
      </mesh>

      {/* Back Wall (Behind Whiteboard) */}
      <mesh position={[0, 3, -13]}>
        <planeGeometry args={[30, 12]} />
        <meshStandardMaterial color="#1e2926" roughness={0.8} />
      </mesh>

      {/* Side Wall Left */}
      <mesh position={[-14, 3, -6]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[30, 12]} />
        <meshStandardMaterial color="#18231f" roughness={0.8} />
      </mesh>

      {/* Side Wall Right */}
      <mesh position={[14, 3, -6]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[30, 12]} />
        <meshStandardMaterial color="#18231f" roughness={0.8} />
      </mesh>

      {/* Teacher Podium Desk */}
      <mesh position={[-3.8, -1.5, -9.5]}>
        <boxGeometry args={[2.8, 0.9, 1.2]} />
        <meshStandardMaterial color="#6e4221" roughness={0.5} />
      </mesh>

      {/* Student Desks (Row 1) */}
      <mesh position={[-3, -1.4, -4]}>
        <boxGeometry args={[2.2, 0.8, 1.0]} />
        <meshStandardMaterial color="#7c4a24" roughness={0.6} />
      </mesh>
      <mesh position={[3, -1.4, -4]}>
        <boxGeometry args={[2.2, 0.8, 1.0]} />
        <meshStandardMaterial color="#7c4a24" roughness={0.6} />
      </mesh>

      {/* Student Desks (Row 2) */}
      <mesh position={[-3, -1.4, 0]}>
        <boxGeometry args={[2.2, 0.8, 1.0]} />
        <meshStandardMaterial color="#7c4a24" roughness={0.6} />
      </mesh>
      <mesh position={[3, -1.4, 0]}>
        <boxGeometry args={[2.2, 0.8, 1.0]} />
        <meshStandardMaterial color="#7c4a24" roughness={0.6} />
      </mesh>
    </group>
  );
}

export default function Embedded3DClassroom({
  sourceCanvasRef,
  title = "NCERT Classroom Derivation",
  notes = [],
  caption = "",
  isSpeaking = false,
  className = "w-full h-full min-h-[500px] relative",
}: Props) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0.5, 3], fov: 50 }}
        className="w-full h-full rounded-2xl overflow-hidden"
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} />
        <pointLight position={[0, 4, -8]} intensity={0.8} color="#6ee7b7" />

        <Suspense fallback={null}>
          {/* 3D Classroom Walls, Floor, Desks */}
          <ProceduralClassroomEnvironment />

          {/* Live 3D Blackboard Plane Mesh */}
          <ThreeWhiteboardMesh
            {...(sourceCanvasRef ? { sourceCanvasRef } : {})}
            title={title}
            notes={notes}
            caption={caption}
            position={[0, 0.6, -16.55]}
            width={18}
            height={9.2}
          />

          {/* 3D AI Teacher Avatar Model */}
          <Procedural3DTeacher isSpeaking={isSpeaking} />

          {/* Smooth Camera Controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 3.5}
            minDistance={2}
            maxDistance={12}
            target={[0, 0.6, -8]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
