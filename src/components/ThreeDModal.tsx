import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, Float } from "@react-three/drei";
import { Suspense } from "react";
import { motion } from "framer-motion";
import type { ThreeDKind } from "@/config/rules";
import { CloseIcon } from "@/components/icons";

interface Props {
  kind: ThreeDKind;
  title: string;
  onClose: () => void;
}

function Scene({ kind }: { kind: ThreeDKind }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 7, 5]} intensity={1.4} />
      <Environment>
        <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} />
        <Lightformer
          intensity={1}
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

      <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.7} minDistance={3} maxDistance={12} />
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

/** Full-screen 3D experience with orbit controls. */
export function ThreeDModal({ kind, title, onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.06 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 bg-[#101a17]"
    >
      <Canvas camera={{ position: [0, 1.6, 6], fov: 50 }} dpr={[1, 2]}>
        <color attach="background" args={["#101a17"]} />
        <Suspense fallback={null}>
          <Scene kind={kind} />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5">
        <div className="pointer-events-auto rounded-2xl bg-black/35 px-4 py-2.5 backdrop-blur">
          <p className="text-[0.62rem] uppercase tracking-[0.2em] text-chalk/45">3D Experience</p>
          <p className="font-[family-name:var(--font-display)] text-lg text-chalk">{title}</p>
        </div>
        <button
          onClick={onClose}
          className="pointer-events-auto grid size-11 place-items-center rounded-full bg-chalk text-[#101a17] transition-transform hover:scale-105 active:scale-95"
          aria-label="Exit 3D experience"
        >
          <CloseIcon size={20} />
        </button>
      </div>

      <p className="pointer-events-none absolute inset-x-0 bottom-6 text-center text-xs text-chalk/50">
        Drag to orbit · scroll or pinch to zoom
      </p>
    </motion.div>
  );
}

export default ThreeDModal;
