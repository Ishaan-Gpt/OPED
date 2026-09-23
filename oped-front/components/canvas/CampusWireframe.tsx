"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function CampusBuildings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  // Generate 3D classroom wireframe grid with Royal Sapphire & Iris color palette
  const buildings = [
    { pos: [0, 0.75, 0], scale: [1.8, 1.5, 1.8], color: "#2563EB" },
    { pos: [-2, 1, -1.5], scale: [1.2, 2.0, 1.2], color: "#60A5FA" },
    { pos: [2.2, 0.6, 1.2], scale: [1.4, 1.2, 1.4], color: "#3B82F6" },
    { pos: [-1.8, 0.5, 2], scale: [1.0, 1.0, 1.5], color: "#1E3A8A" },
    { pos: [2.0, 1.2, -1.8], scale: [1.1, 2.4, 1.1], color: "#6366F1" },
    { pos: [0, 1.8, -2.5], scale: [1.5, 3.6, 1.5], color: "#93C5FD" },
    { pos: [-3.2, 0.4, 0.5], scale: [1.6, 0.8, 1.2], color: "#1D4ED8" },
    { pos: [3.2, 0.5, -0.5], scale: [1.2, 1.0, 1.8], color: "#38BDF8" },
  ];

  return (
    <group ref={groupRef}>
      {/* Grid Floor */}
      <gridHelper args={[20, 20, "#1E3A8A", "#1E293B"]} position={[0, -0.01, 0]} />

      {/* 3D Wireframe Buildings */}
      {buildings.map((b, i) => (
        <group key={i} position={b.pos as [number, number, number]}>
          <mesh>
            <boxGeometry args={b.scale as [number, number, number]} />
            <meshBasicMaterial color={b.color} wireframe transparent opacity={0.65} />
          </mesh>
          <mesh>
            <boxGeometry args={[b.scale[0] * 0.98, b.scale[1] * 0.98, b.scale[2] * 0.98]} />
            <meshBasicMaterial color="#0B0F17" transparent opacity={0.85} />
          </mesh>
        </group>
      ))}

      {/* Dynamic Data Node Beacons */}
      {buildings.map((b, i) => (
        <mesh key={`beacon-${i}`} position={[b.pos[0], b.pos[1] + b.scale[1] / 2 + 0.2, b.pos[2]]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>
      ))}
    </group>
  );
}

export const CampusWireframe: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 text-xs font-mono">
        Initializing OPED 3D Viewport...
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-b from-[#0F172A] to-[#0B0F17] group shadow-2xl">
      {/* Subtle Backlight Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.25)_0%,transparent_70%)] pointer-events-none" />

      {/* R3F Canvas */}
      <Canvas camera={{ position: [6, 7, 8], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
          <CampusBuildings />
        </Float>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
        />
      </Canvas>

      {/* Canvas UI Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-300 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        <span>OPED 3D CLASSROOM MATRIX VIEWPORT</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 text-[10px] font-mono text-slate-400 pointer-events-none">
        DRAG TO ROTATE 3D MODEL
      </div>
    </div>
  );
};
