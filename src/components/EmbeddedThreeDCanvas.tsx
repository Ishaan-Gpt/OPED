import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, Float } from "@react-three/drei";
import { Suspense } from "react";
import { motion } from "framer-motion";
import type { ThreeDKind } from "@/config/rules";

interface Props {
  kind: ThreeDKind;
  title: string;
  onDone?: () => void;
}

function Scene({ kind }: { kind: ThreeDKind }) {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 7, 5]} intensity={1.6} />
      <Environment>
        <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} />
        <Lightformer
          intensity={1.2}
          color="#9ad6c9"
          position={[-5, 1, -1]}
          rotation-y={Math.PI / 2}
          scale={[20, 1, 1]}
        />
      </Environment>

      {kind === "atom" && <AtomModel />}
      {kind === "lens" && <LensModel />}
      {kind === "leaf-cell" && <LeafCellModel />}
      {kind === "solid" && <PrismModel />}

      <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.8} minDistance={3} maxDistance={10} />
    </>
  );
}

function AtomModel() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.7, 48, 48]} />
        <meshStandardMaterial color="#9e1b32" roughness={0.3} metalness={0.2} />
      </mesh>
      {[1.7, 2.6].map((r, ri) => (
        <group key={r} rotation={[ri ? 1.1 : 0.2, ri ? 0.6 : 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, 0.015, 8, 96]} />
            <meshStandardMaterial color="#f3f1e7" />
          </mesh>
          {Array.from({ length: ri ? 8 : 2 }, (_, i) => {
            const a = (i / (ri ? 8 : 2)) * Math.PI * 2;
            return (
              <Float key={i} speed={2} floatIntensity={0.3}>
                <mesh position={[Math.cos(a) * r, 0, Math.sin(a) * r]}>
                  <sphereGeometry args={[0.13, 24, 24]} />
                  <meshStandardMaterial color="#2f9d8b" emissive="#0f6b5f" emissiveIntensity={0.4} />
                </mesh>
              </Float>
            );
          })}
        </group>
      ))}
    </group>
  );
}

function LensModel() {
  return (
    <group>
      <mesh scale={[0.35, 1.5, 1.5]}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshPhysicalMaterial
          color="#bfe4dc"
          transparent
          opacity={0.55}
          roughness={0.05}
          metalness={0}
          transmission={0.85}
          thickness={1.2}
        />
      </mesh>
      {[-0.8, 0, 0.8].map((y) => (
        <mesh key={y} position={[-2.2, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 2.4, 8]} />
          <meshStandardMaterial color="#f3f1e7" emissive="#f3f1e7" emissiveIntensity={0.5} />
        </mesh>
      ))}
      {[-0.8, 0, 0.8].map((y) => (
        <mesh key={`r${y}`} position={[1.7, y / 2.4, 0]} rotation={[0, 0, Math.PI / 2 + y * 0.18]}>
          <cylinderGeometry args={[0.02, 0.02, 2.6, 8]} />
          <meshStandardMaterial color="#9e1b32" emissive="#9e1b32" emissiveIntensity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function LeafCellModel() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[3.4, 1.8, 2]} />
        <meshStandardMaterial color="#cfe6d4" roughness={0.6} transparent opacity={0.28} />
      </mesh>
      {Array.from({ length: 7 }, (_, i) => (
        <Float key={i} speed={1.4} floatIntensity={0.6}>
          <mesh
            position={[(i % 4) * 0.8 - 1.2, Math.sin(i) * 0.5, ((i * 37) % 10) / 10 - 0.5]}
            rotation={[0.4, i, 0.2]}
          >
            <capsuleGeometry args={[0.18, 0.3, 8, 16]} />
            <meshStandardMaterial color="#0f6b5f" roughness={0.35} />
          </mesh>
        </Float>
      ))}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.36, 32, 32]} />
        <meshStandardMaterial color="#6b4228" roughness={0.5} />
      </mesh>
    </group>
  );
}

function PrismModel() {
  return (
    <mesh rotation={[0, 0.4, 0]}>
      <cylinderGeometry args={[1.3, 1.3, 2, 3]} />
      <meshPhysicalMaterial
        color="#dfeeea"
        transparent
        opacity={0.6}
        roughness={0.06}
        transmission={0.85}
        thickness={1.5}
      />
    </mesh>
  );
}

/** Clean, borderless 3D viewport inside the blackboard canvas. */
export default function EmbeddedThreeDCanvas({ kind, title, onDone }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="relative w-full h-[380px] sm:h-[460px] rounded-2xl overflow-hidden bg-[#0a1210] flex flex-col justify-between"
    >
      <Canvas camera={{ position: [0, 1.4, 5.5], fov: 48 }} dpr={[1, 2]}>
        <color attach="background" args={["#0a1210"]} />
        <Suspense fallback={null}>
          <Scene kind={kind} />
        </Suspense>
      </Canvas>

      {/* Orbit Interaction Hint */}
      <p className="pointer-events-none absolute bottom-3 inset-x-0 text-center text-[11px] text-chalk/50">
        Drag on blackboard to orbit 3D model in real time
      </p>

      {onDone && (
        <button
          type="button"
          onClick={onDone}
          className="absolute bottom-3 right-4 px-4 py-1.5 rounded-full bg-teal text-white font-semibold text-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
        >
          Done Exploring →
        </button>
      )}
    </motion.div>
  );
}
