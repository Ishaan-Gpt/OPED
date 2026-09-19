import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BoneAngles, CharacterConfig, ExpressionType } from './types';
import { EXPRESSION_PRESETS } from './CharacterExpressions';

interface CharacterRigProps {
  boneAngles: BoneAngles;
  expression: ExpressionType;
  pupilOffset: { x: number; y: number };
  isBlinking: boolean;
  isNoPeekActive: boolean;
  config?: Partial<CharacterConfig>;
  className?: string;
  isSpeaking?: boolean;
}

const defaultConfig: CharacterConfig = {
  skinColor: '#FDE2D1',
  skinDarkColor: '#F5C2A5',
  hairColor: '#2C1D11',
  shirtColor: '#475569',
  vestColor: '#1E293B',
  accentColor: '#3B82F6',
  glasses: true,
};

export const CharacterRig: React.FC<CharacterRigProps> = ({
  boneAngles,
  expression,
  pupilOffset,
  isBlinking,
  isNoPeekActive,
  config: customConfig,
  className = '',
  isSpeaking = false,
}) => {
  const config = { ...defaultConfig, ...customConfig };
  const expr = EXPRESSION_PRESETS[expression] || EXPRESSION_PRESETS.idle;

  const finalPupilX = pupilOffset.x + expr.eyes.pupilOffset.x;
  const finalPupilY = pupilOffset.y + expr.eyes.pupilOffset.y;

  // Mouth rendering supporting all expression types
  const renderMouth = () => {
    const mouthType = isSpeaking ? 'speaking' : expr.mouth.type;

    switch (mouthType) {
      case 'bigSmile':
      case 'grin':
        return (
          <g transform="translate(160, 156)">
            <path
              d="M -18 0 Q 0 24 18 0 Z"
              fill="#E11D48"
              stroke="#BE123C"
              strokeWidth="1.5"
            />
            <path d="M -15 1 Q 0 6 15 1 Z" fill="#FFFFFF" />
            <path d="M -10 12 Q 0 8 10 12 Q 0 22 -10 12 Z" fill="#FB7185" />
          </g>
        );
      case 'speaking':
        return (
          <motion.g
            animate={{
              scaleY: [0.75, 1.35, 0.85, 1.25, 0.75],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.32,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '160px 158px' }}
          >
            <ellipse cx="160" cy="158" rx="12" ry="9" fill="#9F1239" />
            <path d="M 150 154 Q 160 157 170 154 Z" fill="#FFFFFF" />
            <ellipse cx="160" cy="162" rx="7" ry="3.5" fill="#FB7185" />
          </motion.g>
        );
      case 'surprised':
      case 'mindBlown':
        return (
          <ellipse cx="160" cy="159" rx="10" ry="14" fill="#9F1239" stroke="#BE123C" strokeWidth="1.5" />
        );
      case 'thinking':
        return (
          <path d="M 148 160 Q 158 153 172 158" fill="none" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
        );
      case 'concerned':
        return (
          <path d="M 148 161 Q 160 153 172 161" fill="none" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
        );
      case 'puzzled':
        return (
          <path d="M 146 162 Q 156 154 174 158" fill="none" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
        );
      case 'proud':
      case 'gentle':
        return (
          <path d="M 148 156 Q 160 166 172 156" fill="none" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
        );
      case 'smile':
      default:
        return (
          <path d="M 146 155 Q 160 169 174 155" fill="none" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
        );
    }
  };

  // Hand shape renderer supporting 12+ pose variations
  const renderHand = (
    pose: BoneAngles['leftHandPose'],
    isRight: boolean
  ) => {
    const flip = isRight ? 1 : -1;
    switch (pose) {
      case 'pointing':
        return (
          <g transform={`scale(${flip}, 1)`}>
            <circle cx="0" cy="8" r="10" fill={config.skinColor} stroke={config.skinDarkColor} strokeWidth="1.5" />
            <rect x="-4" y="-15" width="8" height="17" rx="4" fill={config.skinColor} stroke={config.skinDarkColor} strokeWidth="1.5" />
            <circle cx="5" cy="6" r="4" fill={config.skinDarkColor} />
            <circle cx="5" cy="12" r="4" fill={config.skinDarkColor} />
          </g>
        );
      case 'thumbsUp':
        return (
          <g transform={`scale(${flip}, 1)`}>
            <circle cx="0" cy="6" r="9" fill={config.skinColor} stroke={config.skinDarkColor} strokeWidth="1.5" />
            <rect x="-3.5" y="-15" width="7" height="15" rx="3.5" fill={config.skinColor} stroke={config.skinDarkColor} strokeWidth="1.5" />
          </g>
        );
      case 'peace':
        return (
          <g transform={`scale(${flip}, 1)`}>
            <circle cx="0" cy="8" r="9" fill={config.skinColor} stroke={config.skinDarkColor} strokeWidth="1.5" />
            <rect x="-6" y="-15" width="5.5" height="16" rx="2.8" transform="rotate(-10 -3 -7)" fill={config.skinColor} stroke={config.skinDarkColor} strokeWidth="1.2" />
            <rect x="0.5" y="-15" width="5.5" height="16" rx="2.8" transform="rotate(10 3 -7)" fill={config.skinColor} stroke={config.skinDarkColor} strokeWidth="1.2" />
          </g>
        );
      case 'heart':
        return (
          <g transform={`scale(${flip}, 1)`}>
            <path d="M 0 0 C -6 -8 -12 -2 0 8 C 12 -2 6 -8 0 0 Z" fill="#FB7185" stroke="#E11D48" strokeWidth="1" />
          </g>
        );
      case 'salute':
        return (
          <g transform={`scale(${flip}, 1)`}>
            <rect x="-8" y="-4" width="16" height="8" rx="3" fill={config.skinColor} stroke={config.skinDarkColor} strokeWidth="1.5" />
          </g>
        );
      case 'book':
        return (
          <g transform={`scale(${flip}, 1)`}>
            <rect x="-12" y="-8" width="24" height="18" rx="2" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
            <line x1="0" y1="-8" x2="0" y2="10" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>
        );
      case 'cupped':
        return (
          <g transform={`scale(${flip}, 1)`}>
            <path d="M -10 -4 C -12 6 0 12 10 4 C 8 -4 -6 -6 -10 -4 Z" fill={config.skinColor} stroke={config.skinDarkColor} strokeWidth="1.5" />
          </g>
        );
      case 'wave':
        return (
          <g transform={`scale(${flip}, 1)`}>
            <circle cx="0" cy="5" r="9" fill={config.skinColor} stroke={config.skinDarkColor} strokeWidth="1.5" />
            <rect x="-9" y="-11" width="4.5" height="13" rx="2.2" fill={config.skinColor} />
            <rect x="-3.5" y="-14" width="4.5" height="15" rx="2.2" fill={config.skinColor} />
            <rect x="2" y="-13" width="4.5" height="14" rx="2.2" fill={config.skinColor} />
            <rect x="7.5" y="-9" width="4" height="11" rx="2" fill={config.skinColor} />
          </g>
        );
      case 'flat':
      default:
        return (
          <g transform={`scale(${flip}, 1)`}>
            <circle cx="0" cy="3" r="10" fill={config.skinColor} stroke={config.skinDarkColor} strokeWidth="1.5" />
            <rect x="-6" y="-7" width="12" height="9" rx="3" fill={config.skinColor} />
          </g>
        );
    }
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 320 400"
        className="w-full h-full drop-shadow-xl overflow-visible"
        style={{ maxHeight: '100%', maxWidth: '100%' }}
      >
        <defs>
          <radialGradient id="headSkinGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFF1E6" />
            <stop offset="100%" stopColor="#FDE2D1" />
          </radialGradient>
          <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.18)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>

        <ellipse cx="160" cy="385" rx="70" ry="10" fill="url(#shadowGrad)" />

        <motion.g
          animate={{
            y: [0, -2.5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 3.8,
            ease: 'easeInOut',
          }}
        >
          {/* LEGS */}
          <rect x="136" y="325" width="16" height="52" rx="6" fill="#334155" />
          <rect x="168" y="325" width="16" height="52" rx="6" fill="#334155" />
          <ellipse cx="144" cy="377" rx="13" ry="5.5" fill="#1E293B" />
          <ellipse cx="176" cy="377" rx="13" ry="5.5" fill="#1E293B" />

          {/* TORSO & CLOTHING */}
          <g>
            <path
              d="M 108 205 Q 160 192 212 205 L 222 325 Q 160 334 98 325 Z"
              fill={config.shirtColor}
            />
            <path
              d="M 108 205 L 142 325 L 98 325 Z"
              fill={config.vestColor}
            />
            <path
              d="M 212 205 L 178 325 L 222 325 Z"
              fill={config.vestColor}
            />
            <polygon points="160,202 152,212 160,222 168,212" fill="#38BDF8" />
            <polygon points="160,202 146,210 160,218 174,210" fill="#FFFFFF" />
            <rect x="122" y="235" width="14" height="18" rx="3" fill="#F59E0B" opacity="0.9" />
            <circle cx="129" cy="241" r="3" fill="#FFFFFF" />
          </g>

          {/* LEFT ARM */}
          <motion.g
            animate={{
              rotate: boneAngles.leftUpperArm,
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            style={{ transformOrigin: '108px 208px' }}
          >
            <path d="M 108 208 L 78 262" stroke={config.vestColor} strokeWidth="20" strokeLinecap="round" />
            <motion.g
              animate={{ rotate: boneAngles.leftForearm }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              style={{ transformOrigin: '78px 262px' }}
            >
              <path d="M 78 262 L 54 308" stroke={config.skinColor} strokeWidth="16" strokeLinecap="round" />
              <g transform="translate(54, 312)">
                {renderHand(boneAngles.leftHandPose, false)}
              </g>
            </motion.g>
          </motion.g>

          {/* RIGHT ARM */}
          <motion.g
            animate={{
              rotate: boneAngles.rightUpperArm,
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            style={{ transformOrigin: '212px 208px' }}
          >
            <path d="M 212 208 L 242 262" stroke={config.vestColor} strokeWidth="20" strokeLinecap="round" />
            <motion.g
              animate={{ rotate: boneAngles.rightForearm }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              style={{ transformOrigin: '242px 262px' }}
            >
              <path d="M 242 262 L 266 308" stroke={config.skinColor} strokeWidth="16" strokeLinecap="round" />
              <g transform="translate(266, 312)">
                {renderHand(boneAngles.rightHandPose, true)}
              </g>
            </motion.g>
          </motion.g>

          {/* NECK */}
          <rect x="147" y="176" width="26" height="30" rx="6" fill={config.skinDarkColor} />

          {/* HEAD & EXPRESSIONS */}
          <motion.g
            animate={{
              rotate: boneAngles.headRotate + boneAngles.headTilt,
            }}
            transition={{ type: 'spring', stiffness: 140, damping: 12 }}
            style={{ transformOrigin: '160px 180px' }}
          >
            <ellipse cx="160" cy="130" rx="58" ry="60" fill="url(#headSkinGrad)" stroke="#F5C2A5" strokeWidth="1.5" />

            <ellipse cx="99" cy="132" rx="9.5" ry="13" fill={config.skinColor} stroke="#F5C2A5" strokeWidth="1" />
            <ellipse cx="221" cy="132" rx="9.5" ry="13" fill={config.skinColor} stroke="#F5C2A5" strokeWidth="1" />

            <path
              d="M 98 125 C 92 75, 140 54, 160 54 C 188 54, 228 75, 222 125 C 212 95, 196 74, 160 76 C 128 74, 108 95, 98 125 Z"
              fill={config.hairColor}
            />
            <path
              d="M 120 76 C 142 60, 178 68, 195 86 C 172 76, 144 76, 120 76 Z"
              fill="#422A1D"
            />

            {/* EYEBROWS */}
            <motion.g
              animate={{
                rotate: expr.eyebrows.leftAngle,
                y: expr.eyebrows.leftHeight,
              }}
              transition={{ type: 'spring', stiffness: 180, damping: 12 }}
              style={{ transformOrigin: '126px 98px' }}
            >
              <path d="M 110 100 Q 126 92 142 98" fill="none" stroke={config.hairColor} strokeWidth="4.5" strokeLinecap="round" />
            </motion.g>

            <motion.g
              animate={{
                rotate: expr.eyebrows.rightAngle,
                y: expr.eyebrows.rightHeight,
              }}
              transition={{ type: 'spring', stiffness: 180, damping: 12 }}
              style={{ transformOrigin: '194px 98px' }}
            >
              <path d="M 178 98 Q 194 92 210 100" fill="none" stroke={config.hairColor} strokeWidth="4.5" strokeLinecap="round" />
            </motion.g>

            {/* EYES */}
            <g transform="translate(126, 122)">
              <ellipse cx="0" cy="0" rx="15" ry="17" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
              <motion.g
                animate={{
                  x: finalPupilX,
                  y: finalPupilY,
                }}
                transition={{ type: 'spring', stiffness: 220, damping: 15 }}
              >
                <ellipse cx="0" cy="0" rx="9" ry="11" fill="#1E293B" />
                <ellipse cx="0" cy="0" rx="5" ry="7" fill="#3B82F6" />
                <circle cx="-3" cy="-4" r="3" fill="#FFFFFF" />
                <circle cx="3.5" cy="3.5" r="1.5" fill="#FFFFFF" />
              </motion.g>
              <motion.rect
                x="-17"
                y="-19"
                width="34"
                height="38"
                fill={config.skinColor}
                animate={{
                  scaleY: isBlinking ? 1 : (expr.eyes.shape === 'closed' ? 1 : 1 - expr.eyes.lidOpenness),
                }}
                style={{ transformOrigin: '0px -19px' }}
                transition={{ duration: 0.1 }}
              />
            </g>

            <g transform="translate(194, 122)">
              <ellipse cx="0" cy="0" rx="15" ry="17" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
              <motion.g
                animate={{
                  x: finalPupilX,
                  y: finalPupilY,
                }}
                transition={{ type: 'spring', stiffness: 220, damping: 15 }}
              >
                <ellipse cx="0" cy="0" rx="9" ry="11" fill="#1E293B" />
                <ellipse cx="0" cy="0" rx="5" ry="7" fill="#3B82F6" />
                <circle cx="-3" cy="-4" r="3" fill="#FFFFFF" />
                <circle cx="3.5" cy="3.5" r="1.5" fill="#FFFFFF" />
              </motion.g>
              <motion.rect
                x="-17"
                y="-19"
                width="34"
                height="38"
                fill={config.skinColor}
                animate={{
                  scaleY: isBlinking ? 1 : (expr.eyes.shape === 'wink' ? 1 : expr.eyes.shape === 'closed' ? 1 : 1 - expr.eyes.lidOpenness),
                }}
                style={{ transformOrigin: '0px -19px' }}
                transition={{ duration: 0.1 }}
              />
            </g>

            {config.glasses && (
              <g stroke="#334155" strokeWidth="2.5" fill="none">
                <rect x="107" y="107" width="38" height="30" rx="9" />
                <rect x="175" y="107" width="38" height="30" rx="9" />
                <line x1="145" y1="120" x2="175" y2="120" strokeWidth="3" />
                <line x1="99" y1="118" x2="107" y2="120" />
                <line x1="213" y1="120" x2="221" y2="118" />
              </g>
            )}

            <path d="M 158 133 Q 160 140 162 140" fill="none" stroke="#E2A988" strokeWidth="2.5" strokeLinecap="round" />
            {renderMouth()}
            <ellipse cx="110" cy="142" rx="9" ry="5.5" fill="#FB7185" opacity="0.35" />
            <ellipse cx="210" cy="142" rx="9" ry="5.5" fill="#FB7185" opacity="0.35" />
          </motion.g>
        </motion.g>
      </svg>

      {/* "NO PEEKING!" CAMERA PALM OVERLAY */}
      <AnimatePresence>
        {isNoPeekActive && (
          <motion.div
            initial={{ scale: 0.2, opacity: 0, x: 100, y: 100 }}
            animate={{ scale: 4.6, opacity: 1, x: -60, y: -40 }}
            exit={{ scale: 0.2, opacity: 0, x: 100, y: 100 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-50 pointer-events-none drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
            style={{ width: '180px', height: '180px', top: '15%', left: '15%' }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              <g>
                <path d="M 90 90 L 50 50" stroke={config.skinColor} strokeWidth="22" strokeLinecap="round" />
                <ellipse cx="45" cy="45" rx="26" ry="24" fill={config.skinColor} stroke={config.skinDarkColor} strokeWidth="1.5" />
                <rect x="20" y="24" width="7.5" height="24" rx="3.7" transform="rotate(-28 24 36)" fill={config.skinColor} stroke={config.skinDarkColor} strokeWidth="1.2" />
                <rect x="26" y="11" width="8" height="28" rx="4" transform="rotate(-10 30 25)" fill={config.skinColor} stroke={config.skinDarkColor} strokeWidth="1.2" />
                <rect x="39" y="7" width="8" height="30" rx="4" fill={config.skinColor} stroke={config.skinDarkColor} strokeWidth="1.2" />
                <rect x="52" y="11" width="7.5" height="27" rx="3.7" transform="rotate(10 56 24)" fill={config.skinColor} stroke={config.skinDarkColor} strokeWidth="1.2" />
                <rect x="63" y="22" width="7" height="22" rx="3.5" transform="rotate(26 67 33)" fill={config.skinColor} stroke={config.skinDarkColor} strokeWidth="1.2" />
                <rect x="24" y="42" width="42" height="13" rx="4" fill="#1E293B" opacity="0.9" />
                <text x="45" y="51" textAnchor="middle" fill="#38BDF8" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">
                  NO PEEKING! 🙈
                </text>
              </g>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
