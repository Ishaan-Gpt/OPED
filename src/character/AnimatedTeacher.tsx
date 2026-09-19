import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CharacterProps, PositionPreset, BoneAngles } from './types';
import { CharacterRig } from './CharacterRig';
import { GESTURE_PRESETS } from './CharacterGestures';
import { calculateGaze } from './CharacterGaze';
import { calculatePointingAngles } from './CharacterPointing';
import { STATE_PRESETS } from './CharacterController';

const POSITION_STYLES: Record<PositionPreset, string> = {
  'bottom-right': 'bottom-4 right-4 md:bottom-6 md:right-8',
  'bottom-left': 'bottom-4 left-4 md:bottom-6 md:left-8',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 md:bottom-6',
  'center-right': 'top-1/2 -translate-y-1/2 right-4 md:right-8',
  'center-left': 'top-1/2 -translate-y-1/2 left-4 md:left-8',
  'top-right': 'top-16 right-4 md:top-20 md:right-8',
  'top-left': 'top-16 left-4 md:top-20 md:left-8',
};

export const AnimatedTeacher: React.FC<CharacterProps> = ({
  state = 'idle',
  expression,
  gesture,
  position = 'bottom-right',
  scale = 1.0,
  gazeTarget,
  pointTarget,
  speakingText,
  isAudioSpeaking = false,
  onAnimationComplete,
  className = '',
  showThoughtBubble,
  thoughtContent,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const [characterRect, setCharacterRect] = useState<DOMRect | undefined>(undefined);

  // Derive current active expression and gesture from state preset or explicit props
  const activeExpression = expression || STATE_PRESETS[state]?.expression || 'idle';
  const activeGesture = gesture || STATE_PRESETS[state]?.gesture || 'idle';
  const activeGaze = gazeTarget || STATE_PRESETS[state]?.gaze || 'student';

  // Natural Blink Loop
  useEffect(() => {
    let blinkTimeout: ReturnType<typeof setTimeout>;

    const scheduleBlink = () => {
      const nextBlinkMs = 2200 + Math.random() * 2800;
      blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 150);
      }, nextBlinkMs);
    };

    scheduleBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  // Update container rect for spatial targeting
  useEffect(() => {
    const updateRect = () => {
      if (containerRef.current) {
        setCharacterRect(containerRef.current.getBoundingClientRect());
      }
    };
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, [position]);

  // Compute Gaze Pupil & Head offsets
  const gazeResult = calculateGaze(activeGaze, characterRect);

  // Base Bone Angles from Gesture Preset
  const baseBoneAngles: BoneAngles = GESTURE_PRESETS[activeGesture] || GESTURE_PRESETS.idle;

  // Spatial Pointing Angles Override (if in pointing state or pointTarget is provided)
  const pointingOverride = (state === 'pointing' || activeGesture === 'pointAtTarget')
    ? calculatePointingAngles(pointTarget, characterRect)
    : null;

  // Final Bone Angles merging preset and pointing math
  const finalBoneAngles: BoneAngles = {
    ...baseBoneAngles,
    headRotate: (baseBoneAngles.headRotate || 0) + (gazeResult.headRotate || 0) + (pointingOverride?.headRotate || 0),
    headTilt: (baseBoneAngles.headTilt || 0) + (gazeResult.headTilt || 0) + (pointingOverride?.headTilt || 0),
    ...(pointingOverride && pointingOverride.useLeftArm
      ? {
          leftUpperArm: pointingOverride.leftUpperArm,
          leftForearm: pointingOverride.leftForearm,
          leftHandPose: 'pointing',
        }
      : pointingOverride && !pointingOverride.useLeftArm
      ? {
          rightUpperArm: pointingOverride.rightUpperArm,
          rightForearm: pointingOverride.rightForearm,
          rightHandPose: 'pointing',
        }
      : {}),
  };

  // Determine container position style
  const isPresetPosition = typeof position === 'string' && position in POSITION_STYLES;
  const positionClass = isPresetPosition ? POSITION_STYLES[position as PositionPreset] : '';
  const customPositionStyle = typeof position === 'object' ? { left: `${position.x}px`, top: `${position.y}px` } : {};

  return (
    <motion.div
      ref={containerRef}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: scale }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 18,
      }}
      className={`fixed z-30 pointer-events-auto flex flex-col items-center ${positionClass} ${className}`}
      style={customPositionStyle}
      onAnimationComplete={() => onAnimationComplete && onAnimationComplete(state)}
    >
      {/* THOUGHT BUBBLE / SPEECH BADGE */}
      {(showThoughtBubble || state === 'thinking' || speakingText) && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="mb-2 max-w-xs px-4 py-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-xl text-xs text-slate-200 flex items-center gap-2 z-40"
        >
          {state === 'thinking' && (
            <div className="flex items-center gap-1 text-amber-400 font-medium">
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

      {/* CHARACTER SVG RIG CONTAINER */}
      <div className="w-56 h-72 md:w-64 md:h-80 relative">
        <CharacterRig
          boneAngles={finalBoneAngles}
          expression={activeExpression}
          pupilOffset={gazeResult.pupilOffset}
          isBlinking={isBlinking}
          isNoPeekActive={state === 'noPeek' || activeGesture === 'noPeek'}
          isSpeaking={isAudioSpeaking || state === 'speaking'}
        />
      </div>
    </motion.div>
  );
};
