import { useEffect, useMemo, useRef, RefObject } from "react";
import * as THREE from "three";
import { useLessonStore } from "../../store/useLessonStore";
import { boardBridge } from "../../lib/boardBridge";

const W = 1024;
const H = 512;

export interface WhiteboardProps {
  position?: [number, number, number] | undefined;
  rotation?: [number, number, number] | undefined;
  width?: number | undefined;
  height?: number | undefined;
  sourceCanvasRef?: RefObject<HTMLCanvasElement | null> | undefined;
  title?: string | undefined;
  notes?: string[] | undefined;
  caption?: string | undefined;
}

export function Whiteboard({
  position = [0, 0.6, -16.55],
  rotation = [0, 0, 0],
  width = 13,
  height = 6.5,
  sourceCanvasRef,
  title,
  notes,
  caption,
}: WhiteboardProps) {
  const board = useLessonStore((s) => s.board);
  const canvas = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    return c;
  }, []);

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.anisotropy = 4;
    return t;
  }, [canvas]);

  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(() => {
    let animFrameId: number;

    const render = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Dark chalkboard theme to match OPED aesthetic
      ctx.fillStyle = "#0c1512";
      ctx.fillRect(0, 0, W, H);

      // Wooden border
      ctx.strokeStyle = "#8b5a2b";
      ctx.lineWidth = 12;
      ctx.strokeRect(6, 6, W - 12, H - 12);

      // Grid pattern
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let x = 40; x < W; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 40; y < H; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Priority 1: Direct OPED Blackboard canvas reference
      if (sourceCanvasRef?.current) {
        const src = sourceCanvasRef.current;
        if (src.width > 0 && src.height > 0) {
          const scale = Math.min((W - 30) / src.width, (H - 30) / src.height);
          const dw = src.width * scale;
          const dh = src.height * scale;
          ctx.drawImage(src, (W - dw) / 2, (H - dh) / 2, dw, dh);
          texture.needsUpdate = true;
          animFrameId = requestAnimationFrame(render);
          return;
        }
      }

      // Priority 2: Interactive board bridge
      if (boardBridge.canvas) {
        const src = boardBridge.canvas;
        const scale = Math.min((W - 30) / src.width, (H - 30) / src.height);
        const dw = src.width * scale;
        const dh = src.height * scale;
        ctx.drawImage(src, (W - dw) / 2, (H - dh) / 2, dw, dh);
        texture.needsUpdate = true;
        animFrameId = requestAnimationFrame(render);
        return;
      }

      // Priority 3: Fallback lesson board rendering
      const currentTitle = title || board.title || "OPED AI Blackboard";
      const currentNotes = notes || board.lines;

      ctx.fillStyle = "#81e6d9";
      ctx.font = "bold 44px 'Comic Sans MS', 'Inter', sans-serif";
      ctx.textAlign = "center";
      wrapText(ctx, currentTitle, W / 2, 70, W - 120, 50);

      ctx.strokeStyle = "#4fd1c5";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(100, 105);
      ctx.lineTo(W - 100, 105);
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.fillStyle = "#f7fafc";
      ctx.font = "34px 'Consolas', 'Courier New', monospace";
      let y = 160;

      if (Array.isArray(currentNotes)) {
        for (const line of currentNotes.slice(-6)) {
          y = wrapText(ctx, "• " + line, 80, y, W - 160, 44) + 20;
        }
      }

      if (caption) {
        ctx.fillStyle = "#f6ad55";
        ctx.font = "italic 28px 'Segoe UI', sans-serif";
        ctx.textAlign = "center";
        wrapText(ctx, `Dr. Rao: "${caption}"`, W / 2, H - 50, W - 100, 34);
      }

      texture.needsUpdate = true;
      animFrameId = requestAnimationFrame(render);
    };

    render();
    boardBridge.events.addEventListener("update", render);
    return () => {
      boardBridge.events.removeEventListener("update", render);
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [board, canvas, texture, sourceCanvasRef, title, notes, caption]);

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial ref={materialRef} map={texture} toneMapped={false} />
    </mesh>
  );
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = String(text).split(" ");
  let line = "";
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, y);
  return y;
}
