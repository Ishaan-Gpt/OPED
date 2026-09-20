import React from 'react';
import { motion } from 'framer-motion';
import { CharacterProps, CharacterState } from './types';
import { CharacterRig } from './CharacterRig';
import { GESTURE_PRESETS } from './CharacterGestures';
import { calculateGaze } from './CharacterGaze';
import { calculatePointingAngles } from './CharacterPointing';
import { STATE_PRESETS } from './CharacterController';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface NFTTeacherAvatarProps extends CharacterProps {
  cardTitle?: string;
  nftId?: string;
  showCardFrame?: boolean;
}

const STATE_AURA_COLORS: Record<CharacterState, { border: string; glow: string; badgeBg: string; text: string }> = {
  idle: { border: 'border-blue-500/40', glow: 'shadow-[0_0_40px_rgba(59,130,246,0.25)]', badgeBg: 'bg-blue-500/20 text-blue-300', text: 'Idle Mode' },
  thinking: { border: 'border-amber-500/40', glow: 'shadow-[0_0_45px_rgba(245,158,11,0.3)]', badgeBg: 'bg-amber-500/20 text-amber-300', text: 'Thinking...' },
  speaking: { border: 'border-emerald-500/50', glow: 'shadow-[0_0_50px_rgba(16,185,129,0.35)]', badgeBg: 'bg-emerald-500/20 text-emerald-300', text: 'Teaching Live' },
  explaining: { border: 'border-cyan-500/50', glow: 'shadow-[0_0_50px_rgba(6,182,212,0.35)]', badgeBg: 'bg-cyan-500/20 text-cyan-300', text: 'Explaining' },
  pointing: { border: 'border-indigo-500/50', glow: 'shadow-[0_0_45px_rgba(99,102,241,0.3)]', badgeBg: 'bg-indigo-500/20 text-indigo-300', text: 'Pointing' },
  presenting: { border: 'border-blue-500/50', glow: 'shadow-[0_0_45px_rgba(59,130,246,0.3)]', badgeBg: 'bg-blue-500/20 text-blue-300', text: 'Presenting' },
  question: { border: 'border-amber-500/50', glow: 'shadow-[0_0_50px_rgba(245,158,11,0.35)]', badgeBg: 'bg-amber-500/20 text-amber-300', text: 'Question Time' },
  noPeek: { border: 'border-purple-500/60', glow: 'shadow-[0_0_60px_rgba(168,85,247,0.4)]', badgeBg: 'bg-purple-500/20 text-purple-300', text: 'NO PEEKING! 🙈' },
  correct: { border: 'border-emerald-500/60', glow: 'shadow-[0_0_55px_rgba(16,185,129,0.4)]', badgeBg: 'bg-emerald-500/20 text-emerald-300', text: 'Correct! 🎉' },
  incorrect: { border: 'border-rose-500/50', glow: 'shadow-[0_0_45px_rgba(244,63,94,0.3)]', badgeBg: 'bg-rose-500/20 text-rose-300', text: 'Try Again' },
  celebrate: { border: 'border-yellow-500/60', glow: 'shadow-[0_0_60px_rgba(234,179,8,0.45)]', badgeBg: 'bg-yellow-500/20 text-yellow-300', text: 'Victory! 🌟' },
  encourage: { border: 'border-blue-500/40', glow: 'shadow-[0_0_40px_rgba(59,130,246,0.25)]', badgeBg: 'bg-blue-500/20 text-blue-300', text: 'You Can Do It!' },
  confused: { border: 'border-orange-500/40', glow: 'shadow-[0_0_40px_rgba(249,115,22,0.25)]', badgeBg: 'bg-orange-500/20 text-orange-300', text: 'Puzzled' },
  surprised: { border: 'border-pink-500/50', glow: 'shadow-[0_0_45px_rgba(236,72,153,0.3)]', badgeBg: 'bg-pink-500/20 text-pink-300', text: 'Mind Blown!' },
  wave: { border: 'border-emerald-500/40', glow: 'shadow-[0_0_40px_rgba(16,185,129,0.25)]', badgeBg: 'bg-emerald-500/20 text-emerald-300', text: 'Hello!' },
  proud: { border: 'border-purple-500/50', glow: 'shadow-[0_0_45px_rgba(168,85,247,0.3)]', badgeBg: 'bg-purple-500/20 text-purple-300', text: 'Proud' },
  focused: { border: 'border-blue-500/50', glow: 'shadow-[0_0_45px_rgba(59,130,246,0.3)]', badgeBg: 'bg-blue-500/20 text-blue-300', text: 'Deep Focus' },
  playful: { border: 'border-pink-500/50', glow: 'shadow-[0_0_45px_rgba(236,72,153,0.3)]', badgeBg: 'bg-pink-500/20 text-pink-300', text: 'Playful' },
  amazed: { border: 'border-cyan-500/50', glow: 'shadow-[0_0_50px_rgba(6,182,212,0.35)]', badgeBg: 'bg-cyan-500/20 text-cyan-300', text: 'Amazed' },
  puzzled: { border: 'border-amber-500/40', glow: 'shadow-[0_0_40px_rgba(245,158,11,0.25)]', badgeBg: 'bg-amber-500/20 text-amber-300', text: 'Hmm...' },
  doubleThumbsUp: { border: 'border-emerald-500/60', glow: 'shadow-[0_0_55px_rgba(16,185,129,0.4)]', badgeBg: 'bg-emerald-500/20 text-emerald-300', text: 'Super Great!' },
  readingBook: { border: 'border-indigo-500/50', glow: 'shadow-[0_0_45px_rgba(99,102,241,0.3)]', badgeBg: 'bg-indigo-500/20 text-indigo-300', text: 'Reading Lesson' },
  crossArms: { border: 'border-slate-500/50', glow: 'shadow-[0_0_40px_rgba(100,116,139,0.3)]', badgeBg: 'bg-slate-500/20 text-slate-300', text: 'Master Teacher' },
  writeOnBoard: { border: 'border-blue-500/50', glow: 'shadow-[0_0_45px_rgba(59,130,246,0.3)]', badgeBg: 'bg-blue-500/20 text-blue-300', text: 'Writing Board' },
  heartHands: { border: 'border-rose-500/60', glow: 'shadow-[0_0_55px_rgba(244,63,94,0.4)]', badgeBg: 'bg-rose-500/20 text-rose-300', text: 'Love Learning' },
  bow: { border: 'border-emerald-500/40', glow: 'shadow-[0_0_40px_rgba(16,185,129,0.25)]', badgeBg: 'bg-emerald-500/20 text-emerald-300', text: 'Respect' },
  applause: { border: 'border-yellow-500/50', glow: 'shadow-[0_0_50px_rgba(234,179,8,0.35)]', badgeBg: 'bg-yellow-500/20 text-yellow-300', text: 'Bravo!' },
  victory: { border: 'border-cyan-500/50', glow: 'shadow-[0_0_45px_rgba(6,182,212,0.3)]', badgeBg: 'bg-cyan-500/20 text-cyan-300', text: 'Victory!' },
  salute: { border: 'border-blue-500/50', glow: 'shadow-[0_0_45px_rgba(59,130,246,0.3)]', badgeBg: 'bg-blue-500/20 text-blue-300', text: 'Ready!' },
  secretTip: { border: 'border-purple-500/50', glow: 'shadow-[0_0_45px_rgba(168,85,247,0.3)]', badgeBg: 'bg-purple-500/20 text-purple-300', text: 'Pro Tip' },
  stretch: { border: 'border-amber-500/40', glow: 'shadow-[0_0_40px_rgba(245,158,11,0.25)]', badgeBg: 'bg-amber-500/20 text-amber-300', text: 'Energize' },
  listeningEar: { border: 'border-emerald-500/50', glow: 'shadow-[0_0_45px_rgba(16,185,129,0.3)]', badgeBg: 'bg-emerald-500/20 text-emerald-300', text: 'Listening...' },
  eureka: { border: 'border-amber-500/60', glow: 'shadow-[0_0_60px_rgba(245,158,11,0.45)]', badgeBg: 'bg-amber-500/20 text-amber-300', text: 'Eureka! 💡' },
  facepalm: { border: 'border-rose-500/50', glow: 'shadow-[0_0_45px_rgba(244,63,94,0.3)]', badgeBg: 'bg-rose-500/20 text-rose-300', text: 'Facepalm' },
  flex: { border: 'border-blue-500/60', glow: 'shadow-[0_0_55px_rgba(59,130,246,0.4)]', badgeBg: 'bg-blue-500/20 text-blue-300', text: 'Power Knowledge' },
  shushing: { border: 'border-purple-500/40', glow: 'shadow-[0_0_40px_rgba(168,85,247,0.25)]', badgeBg: 'bg-purple-500/20 text-purple-300', text: 'Quiet Please' },
  adjustGlasses: { border: 'border-cyan-500/50', glow: 'shadow-[0_0_45px_rgba(6,182,212,0.3)]', badgeBg: 'bg-cyan-500/20 text-cyan-300', text: 'Smart Professor' },
  highFive: { border: 'border-emerald-500/60', glow: 'shadow-[0_0_55px_rgba(16,185,129,0.4)]', badgeBg: 'bg-emerald-500/20 text-emerald-300', text: 'High Five! ✋' },
  fingerGuns: { border: 'border-pink-500/50', glow: 'shadow-[0_0_45px_rgba(236,72,153,0.3)]', badgeBg: 'bg-pink-500/20 text-pink-300', text: 'Bingo!' },
  handsOnHips: { border: 'border-slate-500/50', glow: 'shadow-[0_0_40px_rgba(100,116,139,0.3)]', badgeBg: 'bg-slate-500/20 text-slate-300', text: 'Teacher Ready' },
  heartEyes: { border: 'border-rose-500/60', glow: 'shadow-[0_0_60px_rgba(244,63,94,0.45)]', badgeBg: 'bg-rose-500/20 text-rose-300', text: 'Love It! 😍' },
  starEyes: { border: 'border-yellow-500/60', glow: 'shadow-[0_0_60px_rgba(234,179,8,0.45)]', badgeBg: 'bg-yellow-500/20 text-yellow-300', text: 'Hyped! 🤩' },
  cheeringRally: { border: 'border-emerald-500/60', glow: 'shadow-[0_0_55px_rgba(16,185,129,0.4)]', badgeBg: 'bg-emerald-500/20 text-emerald-300', text: 'Cheering!' },
};

export const NFTTeacherAvatar: React.FC<NFTTeacherAvatarProps> = ({
  state = 'idle',
  expression,
  gesture,
  gazeTarget,
  pointTarget,
  speakingText,
  isAudioSpeaking = false,
  cardTitle = 'AI Teacher NFT #001',
  nftId = 'LEGENDARY • LEVEL 99',
  showCardFrame = true,
  className = '',
}) => {
  const [isBlinking, setIsBlinking] = React.useState(false);

  React.useEffect(() => {
    let blinkTimeout: ReturnType<typeof setTimeout>;
    const scheduleBlink = () => {
      blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 150);
      }, 2400 + Math.random() * 2600);
    };
    scheduleBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  const activeExpression = expression || STATE_PRESETS[state]?.expression || 'idle';
  const activeGesture = gesture || STATE_PRESETS[state]?.gesture || 'idle';
  const activeGaze = gazeTarget || STATE_PRESETS[state]?.gaze || 'student';

  const gazeResult = calculateGaze(activeGaze);
  const baseBoneAngles = GESTURE_PRESETS[activeGesture] || GESTURE_PRESETS.idle;
  const pointingOverride = (state === 'pointing' || activeGesture === 'pointAtTarget')
    ? calculatePointingAngles(pointTarget)
    : null;

  const finalBoneAngles = {
    ...baseBoneAngles,
    headRotate: (baseBoneAngles.headRotate || 0) + (gazeResult.headRotate || 0) + (pointingOverride?.headRotate || 0),
    headTilt: (baseBoneAngles.headTilt || 0) + (gazeResult.headTilt || 0) + (pointingOverride?.headTilt || 0),
    ...(pointingOverride && pointingOverride.useLeftArm
      ? { leftUpperArm: pointingOverride.leftUpperArm, leftForearm: pointingOverride.leftForearm, leftHandPose: 'pointing' as const }
      : pointingOverride && !pointingOverride.useLeftArm
      ? { rightUpperArm: pointingOverride.rightUpperArm, rightForearm: pointingOverride.rightForearm, rightHandPose: 'pointing' as const }
      : {}),
  };

  const aura = STATE_AURA_COLORS[state] || STATE_AURA_COLORS.idle;

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      <div
        className={`relative rounded-3xl p-3 md:p-4 bg-[#171717]/90 backdrop-blur-2xl border ${aura.border} ${aura.glow} transition-all duration-500 flex flex-col items-center overflow-visible ${
          showCardFrame ? 'w-64 md:w-72' : 'w-auto'
        }`}
      >
        {showCardFrame && (
          <div className="w-full flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[10px] font-bold text-slate-200">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              <span>{cardTitle}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" />
              <span>VERIFIED</span>
            </div>
          </div>
        )}

        {(state === 'thinking' || speakingText) && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mb-2 w-full px-3 py-2 bg-[#212121] border border-[#383838] rounded-xl text-xs text-slate-200 text-center font-medium shadow-lg z-30"
          >
            {state === 'thinking' ? (
              <span className="text-amber-400 font-semibold flex items-center justify-center gap-1.5">
                <Zap className="w-3.5 h-3.5 animate-bounce" />
                Processing Query...
              </span>
            ) : (
              <p className="truncate">"{speakingText}"</p>
            )}
          </motion.div>
        )}

        <div className="w-56 h-64 md:w-60 md:h-72 relative">
          <CharacterRig
            boneAngles={finalBoneAngles}
            expression={activeExpression}
            pupilOffset={gazeResult.pupilOffset}
            isBlinking={isBlinking}
            isNoPeekActive={state === 'noPeek' || activeGesture === 'noPeek'}
            isSpeaking={isAudioSpeaking || state === 'speaking'}
          />
        </div>

        {showCardFrame && (
          <div className="w-full mt-2 pt-2 border-t border-[#2f2f2f] flex items-center justify-between px-1">
            <span className="text-[10px] font-mono text-slate-400 font-semibold tracking-wider">
              {nftId}
            </span>
            <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border border-current ${aura.badgeBg}`}>
              {aura.text}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
