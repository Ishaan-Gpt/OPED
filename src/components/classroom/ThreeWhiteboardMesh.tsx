import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  sourceCanvasRef?: React.RefObject<HTMLCanvasElement | null>;
  title?: string;
  notes?: string[];
  caption?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
}

const W = 1024;
const H = 512;

export function ThreeWhiteboardMesh({
  sourceCanvasRef,
  title = "NCERT Classroom Derivation",
  notes = [],
  caption = "",
  position = [0, 0.8, -12],
  rotation = [0, 0, 0],
  width = 14,
  height = 7,
}: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Offscreen canvas for rendering blackboard texture
  const canvas = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    return c;
  }, []);

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.anisotropy = 8;
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    return t;
  }, [canvas]);

  const drawBoard = () => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dark Chalkboard Background
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#192823");
    grad.addColorStop(1, "#121d19");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Wooden Frame Border
    ctx.strokeStyle = "#855428";
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, W - 14, H - 14);

    // Inner Chalk Line Border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, W - 40, H - 40);

    // If active 2D source canvas is passed, draw source canvas directly onto texture plane
    if (sourceCanvasRef?.current) {
      try {
        const src = sourceCanvasRef.current;
        if (src.width > 0 && src.height > 0) {
          const scale = Math.min((W - 60) / src.width, (H - 60) / src.height);
          const dw = src.width * scale;
          const dh = src.height * scale;
          const dx = (W - dw) / 2;
          const dy = (H - dh) / 2;
          ctx.drawImage(src, dx, dy, dw, dh);
          texture.needsUpdate = true;
          return;
        }
      } catch (err) {
        // Fall back to chalk text rendering below
      }
    }

    // Title / Header
    ctx.fillStyle = "#6ee7b7";
    ctx.font = "bold 38px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(title, W / 2, 70);

    // Divider Chalk Line
    ctx.strokeStyle = "rgba(110, 231, 183, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 90);
    ctx.lineTo(W - 80, 90);
    ctx.stroke();

    // Notes & Derivations
    ctx.textAlign = "left";
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "24px sans-serif";
    let startY = 140;

    const displayNotes = notes.length > 0 ? notes : [
      "• Concept: Spoken pacing synchronized with 3D AI Teacher",
      "• Whiteboard: Live chalk equations & optical diagrams",
      "• Recitation: Outcome mastery challenge post lesson"
    ];

    displayNotes.slice(0, 6).forEach((note, idx) => {
      ctx.fillText(`${idx + 1}. ${note}`, 70, startY);
      startY += 48;
    });

    // Caption Box at bottom of 3D board
    if (caption) {
      ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
      ctx.fillRect(40, H - 90, W - 80, 60);
      ctx.strokeStyle = "rgba(52, 211, 153, 0.4)";
      ctx.strokeRect(40, H - 90, W - 80, 60);

      ctx.fillStyle = "#34d399";
      ctx.font = "italic 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`🗣️ "${caption.length > 70 ? caption.slice(0, 70) + '...' : caption}"`, W / 2, H - 52);
    }

    texture.needsUpdate = true;
  };

  useEffect(() => {
    drawBoard();
  }, [title, notes, caption, sourceCanvasRef]);

  useFrame(() => {
    if (sourceCanvasRef?.current) {
      texture.needsUpdate = true;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* 3D Blackboard Plane */}
      <mesh ref={meshRef}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          ref={materialRef}
          map={texture}
          roughness={0.4}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3D Wooden Blackboard Bezel / Trim */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[width + 0.4, height + 0.4, 0.1]} />
        <meshStandardMaterial color="#5c3a1e" roughness={0.6} />
      </mesh>
    </group>
  );
}
