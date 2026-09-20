import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { motion } from "framer-motion";
import {
  CharacterProps,
  PositionPreset,
  BoneAngles,
  TeacherRefHandle,
  CharacterState,
  ExpressionType,
  GestureType,
  GazeTarget,
  PointTarget,
} from "./types";
import { CharacterRig } from "./CharacterRig";
import { GESTURE_PRESETS } from "./CharacterGestures";
import { calculateGaze } from "./CharacterGaze";
import { calculatePointingAngles } from "./CharacterPointing";
import { STATE_PRESETS } from "./CharacterController";

const POSITION_STYLES: Record<PositionPreset, string> = {
  "bottom-right": "bottom-4 right-4 md:bottom-6 md:right-8",
  "bottom-left": "bottom-4 left-4 md:bottom-6 md:left-8",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 md:bottom-6",
  "center-right": "top-1/2 -translate-y-1/2 right-4 md:right-8",
  "center-left": "top-1/2 -translate-y-1/2 left-4 md:left-8",
  "top-right": "top-16 right-4 md:top-20 md:right-8",
  "top-left": "top-16 left-4 md:top-20 md:left-8",
};

export const AnimatedTeacher = forwardRef<
  TeacherRefHandle,
  CharacterProps & { avatarStyle?: "standard" | "nft" }
>(
  (
    {
      state: initialPropsState,
      expression: initialPropsExpression,
      gesture: initialPropsGesture,
      position: initialPropsPosition = "bottom-right",
      scale = 1.0,
      gazeTarget: initialPropsGaze,
      pointTarget: initialPropsPointTarget,
      speakingText,
      isAudioSpeaking: initialPropsSpeaking = false,
      onAnimationComplete,
      className = "",
      showThoughtBubble,
      thoughtContent,
      onClick,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [currentState, setCurrentState] = useState<CharacterState>(initialPropsState || "idle");
    const [currentExpression, setCurrentExpression] = useState<ExpressionType | undefined>(
      initialPropsExpression,
    );
    const [currentGesture, setCurrentGesture] = useState<GestureType | undefined>(
      initialPropsGesture,
    );
    const [currentPosition, setCurrentPosition] = useState<
      PositionPreset | { x: number; y: number }
    >(initialPropsPosition);
    const [currentGaze, setCurrentGaze] = useState<GazeTarget | undefined>(initialPropsGaze);
    const [currentPointTarget, setCurrentPointTarget] = useState<PointTarget | undefined>(
      initialPropsPointTarget,
    );
    const [isSpeakingInternal, setIsSpeakingInternal] = useState<boolean>(initialPropsSpeaking);
    const [isBlinking, setIsBlinking] = useState<boolean>(false);
    const [characterRect, setCharacterRect] = useState<DOMRect | undefined>(undefined);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync controlled props if updated from parent props
    useEffect(() => {
      if (initialPropsState) setCurrentState(initialPropsState);
    }, [initialPropsState]);

    useEffect(() => {
      if (initialPropsExpression) setCurrentExpression(initialPropsExpression);
    }, [initialPropsExpression]);

    useEffect(() => {
      if (initialPropsGesture) setCurrentGesture(initialPropsGesture);
    }, [initialPropsGesture]);

    useEffect(() => {
      if (initialPropsPosition) setCurrentPosition(initialPropsPosition);
    }, [initialPropsPosition]);

    useEffect(() => {
      if (initialPropsGaze) setCurrentGaze(initialPropsGaze);
    }, [initialPropsGaze]);

    useEffect(() => {
      if (initialPropsPointTarget) setCurrentPointTarget(initialPropsPointTarget);
    }, [initialPropsPointTarget]);

    useEffect(() => {
      if (typeof initialPropsSpeaking === "boolean") setIsSpeakingInternal(initialPropsSpeaking);
    }, [initialPropsSpeaking]);

    // Imperative Controller Handle API (Section 5 requirement)
    useImperativeHandle(
      ref,
      () => ({
        play: (
          newState:
            | CharacterState
            | "idle"
            | "explain"
            | "thinking"
            | "question"
            | "listen"
            | "correct"
            | "celebrate"
            | "noPeek",
          durationMs?: number,
        ) => {
          let resolvedState = newState as CharacterState;
          if (newState === "explain") resolvedState = "explaining";
          if (newState === "listen") resolvedState = "listeningEar";

          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          setCurrentState(resolvedState);

          const preset = STATE_PRESETS[resolvedState] || STATE_PRESETS.idle;
          setCurrentExpression(preset.expression);
          setCurrentGesture(preset.gesture);
          if (preset.gaze) setCurrentGaze(preset.gaze);

          if (durationMs) {
            timeoutRef.current = setTimeout(() => {
              setCurrentState("idle");
              setCurrentExpression("idle");
              setCurrentGesture("idle");
            }, durationMs);
          }
        },
        speak: () => setIsSpeakingInternal(true),
        stopSpeaking: () => setIsSpeakingInternal(false),
        setExpression: (expr: ExpressionType) => setCurrentExpression(expr),
        setGesture: (g: GestureType) => setCurrentGesture(g),
        lookAt: (target: GazeTarget | { x: number; y: number } | number, y?: number) => {
          if (typeof target === "number" && typeof y === "number") {
            setCurrentGaze({ x: target, y });
          } else {
            setCurrentGaze(target as GazeTarget);
          }
        },
        pointAt: (target: PointTarget | { x: number; y: number } | number, y?: number) => {
          if (typeof target === "number" && typeof y === "number") {
            setCurrentPointTarget({ x: target, y });
          } else {
            setCurrentPointTarget(target as PointTarget);
          }
          setCurrentState("pointing");
          setCurrentGesture("pointAtTarget");
          setCurrentExpression("explaining");
        },
        moveTo: (position: PositionPreset | { x: number; y: number } | number, y?: number) => {
          if (typeof position === "number" && typeof y === "number") {
            setCurrentPosition({ x: position, y });
          } else {
            setCurrentPosition(position as PositionPreset | { x: number; y: number });
          }
        },
      }),
      [],
    );

    // Automatic Natural Blinking Loop (Section 2 & 6 requirement)
    useEffect(() => {
      let blinkTimeout: ReturnType<typeof setTimeout>;
      const scheduleBlink = () => {
        const nextBlinkMs = 2200 + Math.random() * 2600;
        blinkTimeout = setTimeout(() => {
          setIsBlinking(true);
          setTimeout(() => {
            setIsBlinking(false);
            scheduleBlink();
          }, 140);
        }, nextBlinkMs);
      };
      scheduleBlink();
      return () => clearTimeout(blinkTimeout);
    }, []);

    // Rect tracking for inverse kinematics coordinate target pointing
    useEffect(() => {
      const updateRect = () => {
        if (containerRef.current) {
          setCharacterRect(containerRef.current.getBoundingClientRect());
        }
      };
      updateRect();
      window.addEventListener("resize", updateRect);
      return () => window.removeEventListener("resize", updateRect);
    }, [currentPosition]);

    const activeState = currentState;
    const activeExpression = currentExpression || STATE_PRESETS[activeState]?.expression || "idle";
    const activeGesture = currentGesture || STATE_PRESETS[activeState]?.gesture || "idle";
    const activeGaze = currentGaze || STATE_PRESETS[activeState]?.gaze || "student";

    const gazeResult = calculateGaze(activeGaze, characterRect);
    const baseBoneAngles: BoneAngles = GESTURE_PRESETS[activeGesture] || GESTURE_PRESETS.idle;
    const pointingOverride =
      activeState === "pointing" || activeGesture === "pointAtTarget"
        ? calculatePointingAngles(currentPointTarget, characterRect)
        : null;

    const finalBoneAngles: BoneAngles = {
      ...baseBoneAngles,
      headRotate:
        (baseBoneAngles.headRotate || 0) +
        (gazeResult.headRotate || 0) +
        (pointingOverride?.headRotate || 0),
      headTilt:
        (baseBoneAngles.headTilt || 0) +
        (gazeResult.headTilt || 0) +
        (pointingOverride?.headTilt || 0),
      ...(pointingOverride && pointingOverride.useLeftArm
        ? {
            leftUpperArm: pointingOverride.leftUpperArm,
            leftForearm: pointingOverride.leftForearm,
            leftHandPose: "pointing",
          }
        : pointingOverride && !pointingOverride.useLeftArm
          ? {
              rightUpperArm: pointingOverride.rightUpperArm,
              rightForearm: pointingOverride.rightForearm,
              rightHandPose: "pointing",
            }
          : {}),
    };

    const isPresetPosition =
      typeof currentPosition === "string" && currentPosition in POSITION_STYLES;
    const positionClass = isPresetPosition
      ? POSITION_STYLES[currentPosition as PositionPreset]
      : "";
    const customPositionStyle =
      typeof currentPosition === "object"
        ? { left: `${currentPosition.x}px`, top: `${currentPosition.y}px` }
        : {};

    return (
      <motion.div
        ref={containerRef}
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: scale }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{
          type: "spring",
          stiffness: 90,
          damping: 16,
        }}
        className={`fixed z-30 pointer-events-auto flex flex-col items-center ${positionClass} ${className}`}
        style={customPositionStyle}
        onClick={onClick}
        onAnimationComplete={() => onAnimationComplete && onAnimationComplete(activeState)}
      >
        {/* Thought Bubble / Speech Badge Overlay */}
        {(showThoughtBubble || activeState === "thinking" || speakingText) && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-2 max-w-xs px-4 py-2 bg-[#171717]/95 backdrop-blur-md border border-[#383838] rounded-2xl shadow-2xl text-xs text-slate-200 flex items-center gap-2 z-40"
          >
            {activeState === "thinking" && (
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Thinking...</span>
              </div>
            )}
            {speakingText && (
              <p className="text-slate-100 font-medium leading-relaxed">
                &ldquo;{speakingText}&rdquo;
              </p>
            )}
            {thoughtContent}
          </motion.div>
        )}

        {/* Character Viewport Rig */}
        <div className="w-60 h-72 md:w-64 md:h-80 relative overflow-visible">
          <CharacterRig
            boneAngles={finalBoneAngles}
            expression={activeExpression}
            pupilOffset={gazeResult.pupilOffset}
            isBlinking={isBlinking}
            isNoPeekActive={activeState === "noPeek" || activeGesture === "noPeek"}
            isSpeaking={isSpeakingInternal || activeState === "speaking"}
          />
        </div>
      </motion.div>
    );
  },
);

AnimatedTeacher.displayName = "AnimatedTeacher";
