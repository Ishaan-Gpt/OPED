"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function CampusBuildings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  // Generate wireframe building grid
  const buildings = [
    { pos: [0, 0.75, 0], scale: [1.8, 1.5, 1.8], color: "#10B981" },
    { pos: [-2, 1, -1.5], scale: [1.2, 2.0, 1.2], color: "#34D399" },
    { pos: [2.2, 0.6, 1.2], scale: [1.4, 1.2, 1.4], color: "#059669" },
    { pos: [-1.8, 0.5, 2], scale: [1.0, 1.0, 1.5], color: "#2E5243" },
    { pos: [2.0, 1.2, -1.8], scale: [1.1, 2.4, 1.1], color: "#10B981" },
    { pos: [0, 1.8, -2.5], scale: [1.5, 3.6, 1.5], color: "#6EE7B7" },
    { pos: [-3.2, 0.4, 0.5], scale: [1.6, 0.8, 1.2], color: "#047857" },
    { pos: [3.2, 0.5, -0.5], scale: [1.2, 1.0, 1.8], color: "#10B981" },
  ];

  return (
    <group ref={groupRef}>
      {/* Grid Floor */}
      <gridHelper args={[20, 20, "#2E5243", "#18181B"]} position={[0, -0.01, 0]} />

      {/* Campus Buildings Wireframes */}
      {buildings.map((b, i) => (
        <group key={i} position={b.pos as [number, number, number]}>
          <mesh>
            <boxGeometry args={b.scale as [number, number, number]} />
            <meshBasicMaterial color={b.color} wireframe transparent opacity={0.6} />
          </mesh>
          <mesh>
            <boxGeometry args={[b.scale[0] * 0.98, b.scale[1] * 0.98, b.scale[2] * 0.98]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.85} />
          </mesh>
        </group>
      ))}

      {/* Dynamic Data Node Beacons */}
      {buildings.map((b, i) => (
        <mesh key={`beacon-${i}`} position={[b.pos[0], b.pos[1] + b.scale[1] / 2 + 0.2, b.pos[2]]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#10B981" />
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
      <div className="w-full h-full flex items-center justify-center bg-black/40 rounded-3xl border border-white/5 text-zinc-500 text-xs font-mono">
        Initializing 3D Wireframe Viewport...
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#080808] to-black group">
      {/* Subtle Backlight Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,82,67,0.3)_0%,transparent_70%)] pointer-events-none" />

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
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 border border-white/10 text-[10px] font-mono text-zinc-400 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>ZERO CAMPUS AERIAL WIREFRAME</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 text-[10px] font-mono text-zinc-500 pointer-events-none">
        DRAG TO ROTATE 3D MODEL
      </div>
    </div>
  );
};
