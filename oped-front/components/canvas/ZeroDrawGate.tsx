"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

interface Point {
  x: number;
  y: number;
  time: number;
}

interface ZeroDrawGateProps {
  onUnlock: () => void;
}

export const ZeroDrawGate: React.FC<ZeroDrawGateProps> = ({ onUnlock }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasStartedDrawing, setHasStartedDrawing] = useState(false);

  // Web Audio Synth for glass snap sound
  const playSnapSound = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(1200, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.3);

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(2400, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.35);
      osc2.stop(ctx.currentTime + 0.35);
    } catch {
      // AudioContext fallback
    }
  }, []);

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redraw canvas stroke
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (points.length < 2) return;

    // Glowing main stroke
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }

    ctx.strokeStyle = "#10B981"; // Emerald green
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = "#2E5243";
    ctx.shadowBlur = 15;
    ctx.stroke();

    // Inner bright core
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 0;
    ctx.stroke();
  }, [points]);

  useEffect(() => {
    renderCanvas();
  }, [points, renderCanvas]);

  // Gesture math verification
  const validateGesture = useCallback((strokePoints: Point[]) => {
    if (strokePoints.length < 12) {
      setFeedback("Draw a complete 0 loop");
      return false;
    }

    // 1. Compute Centroid
    const sum = strokePoints.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), {
      x: 0,
      y: 0,
    });
    const centroid = { x: sum.x / strokePoints.length, y: sum.y / strokePoints.length };

    // 2. Radii stats
    const radii = strokePoints.map((p) => Math.hypot(p.x - centroid.x, p.y - centroid.y));
    const meanRadius = radii.reduce((a, b) => a + b, 0) / radii.length;

    if (meanRadius < 20) {
      setFeedback("Draw a larger circle");
      return false;
    }

    const variance = radii.reduce((acc, r) => acc + Math.pow(r - meanRadius, 2), 0) / radii.length;
    const stdDev = Math.sqrt(variance);
    const circularity = stdDev / meanRadius;

    // 3. Angular Winding Check
    let totalSignedAngle = 0;
    for (let i = 1; i < strokePoints.length; i++) {
      const a1 = Math.atan2(strokePoints[i - 1].y - centroid.y, strokePoints[i - 1].x - centroid.x);
      const a2 = Math.atan2(strokePoints[i].y - centroid.y, strokePoints[i].x - centroid.x);
      let diff = a2 - a1;

      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;

      totalSignedAngle += diff;
    }

    const absWindingAngle = Math.abs(totalSignedAngle);

    // 4. Closure distance
    const startPoint = strokePoints[0];
    const endPoint = strokePoints[strokePoints.length - 1];
    const closureDist = Math.hypot(endPoint.x - startPoint.x, endPoint.y - startPoint.y);

    const isWindingValid = absWindingAngle > 5.2; // ~300+ degrees
    const isCircularityValid = circularity < 0.45;
    const isClosedValid = closureDist < meanRadius * 1.35;

    if (isWindingValid && isCircularityValid && isClosedValid) {
      return true;
    }

    if (!isWindingValid) {
      setFeedback("Complete a full 360° loop");
    } else if (!isCircularityValid) {
      setFeedback("Keep the shape smooth and circular");
    } else {
      setFeedback("Close the endpoints together");
    }
    return false;
  }, []);

  const triggerSuccessEffects = useCallback(
    (center: { x: number; y: number }) => {
      setIsUnlocked(true);
      playSnapSound();

      if (typeof window !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate([30, 50, 90]);
        } catch {
          // Haptics fallback
        }
      }

      // Confetti burst from centroid
      confetti({
        particleCount: 80,
        spread: 90,
        origin: {
          x: center.x / window.innerWidth,
          y: center.y / window.innerHeight,
        },
        colors: ["#10B981", "#2E5243", "#FFFFFF", "#34D399"],
        disableForReducedMotion: true,
      });

      setTimeout(() => {
        onUnlock();
      }, 1000);
    },
    [onUnlock, playSnapSound],
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isUnlocked) return;
    setIsDrawing(true);
    setHasStartedDrawing(true);
    setFeedback(null);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const p = { x: e.clientX - rect.left, y: e.clientY - rect.top, time: Date.now() };
    setPoints([p]);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing || isUnlocked) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const p = { x: e.clientX - rect.left, y: e.clientY - rect.top, time: Date.now() };
    setPoints((prev) => [...prev, p]);
  };

  const handlePointerUp = () => {
    if (!isDrawing || isUnlocked) return;
    setIsDrawing(false);

    if (points.length > 0) {
      const isValid = validateGesture(points);
      if (isValid) {
        const sum = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
        const centroid = { x: sum.x / points.length, y: sum.y / points.length };
        triggerSuccessEffects(centroid);
      } else {
        setTimeout(() => setPoints([]), 800);
      }
    }
  };

  const handleSkip = () => {
    playSnapSound();
    setIsUnlocked(true);
    onUnlock();
  };

  return (
    <AnimatePresence>
      {!isUnlocked && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black select-none touch-none overflow-hidden"
        >
          {/* Subtle Ambient Backlit Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,82,67,0.25)_0%,transparent_65%)] pointer-events-none" />

          {/* Interactive Draw Canvas */}
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute inset-0 w-full h-full cursor-crosshair z-10"
          />

          {/* Guide Overlay & Prompt UI */}
          <div className="relative z-20 pointer-events-none flex flex-col items-center space-y-8 px-4 text-center">
            {/* Dashed Circular Guide Ring */}
            <div className="relative flex items-center justify-center w-52 h-52 sm:w-64 sm:h-64 rounded-full border-2 border-dashed border-zinc-700/60 animate-[spin_30s_linear_infinite]">
              <div className="absolute inset-3 rounded-full border border-emerald-500/10" />
              <div className="absolute w-2 h-2 rounded-full bg-emerald-500/40 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping" />
            </div>

            {/* Title & Micro Prompt */}
            <div className="flex flex-col items-center space-y-3">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400 font-mono tracking-widest uppercase"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>BUNQ LABS GESTURE GATE</span>
              </motion.div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tighter text-white">
                Draw a{" "}
                <span className="text-emerald-400 underline decoration-emerald-500/30 underline-offset-8">
                  0
                </span>{" "}
                to enter
              </h1>

              <p className="text-sm text-zinc-400 max-w-xs font-normal">
                Trace a full zero loop anywhere on your screen to unlock the experience.
              </p>
            </div>

            {/* Realtime Feedback Toast */}
            {feedback && !isUnlocked && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-400" />
                <span>{feedback}</span>
              </motion.div>
            )}
          </div>

          {/* Accessible Skip Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={handleSkip}
            className="absolute bottom-8 right-8 z-30 flex items-center gap-2 px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 rounded-full transition-all duration-200 active:scale-95"
          >
            <span>Skip intro →</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
