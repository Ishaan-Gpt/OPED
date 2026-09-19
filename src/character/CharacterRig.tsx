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
  accentColor: '#38BDF8',
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

  // 3D Volumetric Mouth Renderer
  const render3DMouth = () => {
    const mouthType = isSpeaking ? 'speaking' : expr.mouth.type;

    switch (mouthType) {
      case 'bigSmile':
      case 'grin':
        return (
          <g transform="translate(160, 156)">
            <path
              d="M -19 0 Q 0 26 19 0 Z"
              fill="url(#mouthInnerGrad)"
              stroke="#991B1B"
              strokeWidth="1.5"
            />
            {/* 3D Teeth */}
            <path d="M -16 1 Q 0 7 16 1 Z" fill="#FFFFFF" />
            {/* 3D Tongue */}
            <path d="M -11 13 Q 0 9 11 13 Q 0 24 -11 13 Z" fill="url(#tongueGrad)" />
          </g>
        );
      case 'speaking':
        return (
          <motion.g
            animate={{
              scaleY: [0.7, 1.4, 0.8, 1.3, 0.7],
              scaleX: [0.95, 1.05, 0.9, 1.1, 0.95],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.28,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '160px 158px' }}
          >
            <ellipse cx="160" cy="158" rx="13" ry="10" fill="url(#mouthInnerGrad)" stroke="#7F1D1D" strokeWidth="1" />
            <path d="M 149 153 Q 160 157 171 153 Z" fill="#FFFFFF" />
            <ellipse cx="160" cy="162" rx="7.5" ry="4" fill="url(#tongueGrad)" />
          </motion.g>
        );
      case 'surprised':
      case 'mindBlown':
      case 'gasp':
        return (
          <ellipse cx="160" cy="159" rx="10" ry="14" fill="url(#mouthInnerGrad)" stroke="#991B1B" strokeWidth="1.5" />
        );
      case 'shush':
        return (
          <ellipse cx="160" cy="158" rx="5" ry="6" fill="url(#mouthInnerGrad)" stroke="#991B1B" strokeWidth="1" />
        );
      case 'smirk':
        return (
          <path d="M 148 158 Q 162 165 174 153" fill="none" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
        );
      case 'thinking':
        return (
          <path d="M 148 160 Q 158 153 172 158" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
        );
      case 'concerned':
        return (
          <path d="M 148 161 Q 160 153 172 161" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
        );
      case 'puzzled':
        return (
          <path d="M 146 162 Q 156 154 174 158" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
        );
      case 'proud':
      case 'gentle':
        return (
          <path d="M 148 156 Q 160 166 172 156" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
        );
      case 'smile':
      default:
        return (
          <path d="M 146 155 Q 160 169 174 155" fill="none" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
        );
    }
  };

  // 3D Volumetric Hand Renderer
  const render3DHand = (
    pose: BoneAngles['leftHandPose'],
    isRight: boolean
  ) => {
    const flip = isRight ? 1 : -1;
    switch (pose) {
      case 'pointing':
        return (
          <g transform={`scale(${flip}, 1)`}>
            <circle cx="0" cy="8" r="10" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1.2" />
            <rect x="-4" y="-16" width="8" height="18" rx="4" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1.2" />
            <circle cx="5" cy="6" r="4" fill="#D99B7A" />
            <circle cx="5" cy="12" r="4" fill="#D99B7A" />
          </g>
        );
      case 'fingerGun':
        return (
          <g transform={`scale(${flip}, 1)`}>
            <circle cx="0" cy="8" r="10" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1.2" />
            <rect x="-4" y="-18" width="8" height="20" rx="4" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1.2" />
            <rect x="-12" y="2" width="14" height="7" rx="3.5" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1.2" />
          </g>
        );
      case 'thumbsUp':
        return (
          <g transform={`scale(${flip}, 1)`}>
            <circle cx="0" cy="6" r="9" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1.2" />
            <rect x="-3.5" y="-15" width="7" height="15" rx="3.5" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1.2" />
          </g>
        );
      case 'peace':
        return (
          <g transform={`scale(${flip}, 1)`}>
            <circle cx="0" cy="8" r="9" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1.2" />
            <rect x="-6" y="-15" width="5.5" height="16" rx="2.8" transform="rotate(-10 -3 -7)" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1" />
            <rect x="0.5" y="-15" width="5.5" height="16" rx="2.8" transform="rotate(10 3 -7)" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1" />
          </g>
        );
      case 'heart':
        return (
          <g transform={`scale(${flip}, 1)`}>
            <path d="M 0 0 C -6 -8 -12 -2 0 8 C 12 -2 6 -8 0 0 Z" fill="url(#heart3DGrad)" stroke="#E11D48" strokeWidth="1" />
          </g>
        );
      case 'salute':
      case 'adjustGlasses':
        return (
          <g transform={`scale(${flip}, 1)`}>
            <rect x="-8" y="-4" width="16" height="8" rx="3" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1.2" />
          </g>
        );
      case 'highFive':
      case 'facepalm':
        return (
          <g transform={`scale(${flip}, 1)`}>
            <circle cx="0" cy="4" r="11" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1.2" />
            <rect x="-9" y="-11" width="4.5" height="13" rx="2.2" fill="url(#skin3DGrad)" />
            <rect x="-3.5" y="-14" width="4.5" height="15" rx="2.2" fill="url(#skin3DGrad)" />
            <rect x="2" y="-13" width="4.5" height="14" rx="2.2" fill="url(#skin3DGrad)" />
            <rect x="7.5" y="-9" width="4" height="11" rx="2" fill="url(#skin3DGrad)" />
          </g>
        );
      case 'book':
        return (
          <g transform={`scale(${flip}, 1)`}>
            <rect x="-12" y="-8" width="24" height="18" rx="2" fill="url(#book3DGrad)" stroke="#1D4ED8" strokeWidth="1.2" />
            <line x1="0" y1="-8" x2="0" y2="10" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>
        );
      case 'cupped':
        return (
          <g transform={`scale(${flip}, 1)`}>
            <path d="M -10 -4 C -12 6 0 12 10 4 C 8 -4 -6 -6 -10 -4 Z" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1.2" />
          </g>
        );
      case 'wave':
        return (
          <g transform={`scale(${flip}, 1)`}>
            <circle cx="0" cy="5" r="9" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1.2" />
            <rect x="-9" y="-11" width="4.5" height="13" rx="2.2" fill="url(#skin3DGrad)" />
            <rect x="-3.5" y="-14" width="4.5" height="15" rx="2.2" fill="url(#skin3DGrad)" />
            <rect x="2" y="-13" width="4.5" height="14" rx="2.2" fill="url(#skin3DGrad)" />
            <rect x="7.5" y="-9" width="4" height="11" rx="2" fill="url(#skin3DGrad)" />
          </g>
        );
      case 'flat':
      default:
        return (
          <g transform={`scale(${flip}, 1)`}>
            <circle cx="0" cy="3" r="10" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1.2" />
            <rect x="-6" y="-7" width="12" height="9" rx="3" fill="url(#skin3DGrad)" />
          </g>
        );
    }
  };

  // 3D VOLUMETRIC EYE RENDERER WITH SPHERICAL DEPTH & GLASS REFRACTION
  const render3DEye = (isLeft: boolean) => {
    const shape = expr.eyes.shape;

    return (
      <g transform={`translate(${isLeft ? 126 : 194}, 122)`}>
        {/* 3D Eyeball Sphere with Ambient Occlusion Shadow */}
        <ellipse cx="0" cy="0" rx="15.5" ry="17.5" fill="url(#eyeSocketGrad)" stroke="#CBD5E1" strokeWidth="1" />
        <ellipse cx="0" cy="-2" rx="14" ry="15" fill="url(#eyeball3DGrad)" />

        {/* Dynamic 3D Pupil / Iris */}
        {shape === 'heart' ? (
          <g transform="scale(0.9)">
            <path d="M 0 -2 C -6 -10 -12 -3 0 8 C 12 -3 6 -10 0 -2 Z" fill="url(#heart3DGrad)" stroke="#E11D48" strokeWidth="1" />
          </g>
        ) : shape === 'star' ? (
          <g transform="scale(0.85)">
            <polygon points="0,-12 3.5,-3.5 12,0 3.5,3.5 0,12 -3.5,3.5 -12,0 -3.5,-3.5" fill="#F59E0B" />
          </g>
        ) : (
          <motion.g
            animate={{
              x: finalPupilX,
              y: finalPupilY,
            }}
            transition={{ type: 'spring', stiffness: 220, damping: 15 }}
          >
            {/* 3D Iris Outer Ring */}
            <ellipse cx="0" cy="0" rx="9.5" ry="11.5" fill="#0B1329" />
            {/* 3D Spherical Iris Radial Gradient */}
            <ellipse cx="0" cy="0" rx="7.2" ry="9" fill="url(#iris3DGrad)" />
            {/* Deep 3D Pupil Center */}
            <circle cx="0" cy="0" r="3.5" fill="#020617" />

            {/* Specular 3D Glass Highlights */}
            <ellipse cx="-3.2" cy="-4.2" rx="3.2" ry="3.2" fill="#FFFFFF" />
            <circle cx="3.5" cy="3.5" r="1.5" fill="#FFFFFF" opacity="0.9" />
            <path d="M -5 4 Q 0 7.5 5 4" fill="none" stroke="#93C5FD" strokeWidth="1.2" opacity="0.8" />
          </motion.g>
        )}

        {/* Eyelid Blink Cover */}
        <motion.rect
          x="-17"
          y="-19"
          width="34"
          height="38"
          fill="url(#skin3DGrad)"
          animate={{
            scaleY: isBlinking ? 1 : (shape === 'wink' && !isLeft ? 1 : shape === 'closed' ? 1 : 1 - expr.eyes.lidOpenness),
          }}
          style={{ transformOrigin: '0px -19px' }}
          transition={{ duration: 0.1 }}
        />

        {/* 3D Eyelash Upper Lid Shadow Stroke */}
        <path d="M -16 -8 Q 0 -22 16 -8" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
      </g>
    );
  };

  return (
    <div className={`relative flex items-center justify-center select-none overflow-visible ${className}`} style={{ perspective: '1000px' }}>
      <svg
        viewBox="0 0 320 400"
        className="w-full h-full filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.45)] overflow-visible"
        style={{ maxHeight: '100%', maxWidth: '100%' }}
      >
        <defs>
          {/* 3D SPHERICAL GRADIENTS FOR SKIN & BODY */}
          <radialGradient id="headSkin3D" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF4ED" />
            <stop offset="60%" stopColor="#FDE2D1" />
            <stop offset="90%" stopColor="#F7C4A5" />
            <stop offset="100%" stopColor="#E5A784" />
          </radialGradient>

          <radialGradient id="skin3DGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF1E6" />
            <stop offset="70%" stopColor="#FDE2D1" />
            <stop offset="100%" stopColor="#E2A988" />
          </radialGradient>

          {/* 3D HAIR GRADIENT */}
          <linearGradient id="hair3DGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A3222" />
            <stop offset="50%" stopColor="#2C1D11" />
            <stop offset="100%" stopColor="#190F08" />
          </linearGradient>

          {/* 3D VEST & SHIRT GRADIENTS */}
          <linearGradient id="vest3DGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="40%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id="shirt3DGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          {/* 3D EYE GRADIENTS */}
          <radialGradient id="eyeball3DGrad" cx="40%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="85%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </radialGradient>

          <radialGradient id="eyeSocketGrad" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </radialGradient>

          <radialGradient id="iris3DGrad" cx="40%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E40AF" />
          </radialGradient>

          {/* MOUTH & ACCENT GRADIENTS */}
          <linearGradient id="mouthInnerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#991B1B" />
            <stop offset="100%" stopColor="#450A0A" />
          </linearGradient>

          <linearGradient id="tongueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>

          <radialGradient id="heart3DGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FF758F" />
            <stop offset="100%" stopColor="#E11D48" />
          </radialGradient>

          <linearGradient id="book3DGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.35)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          <radialGradient id="lightbulbGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="rgba(245,158,11,0)" />
          </radialGradient>
        </defs>

        {/* Dynamic 3D Ground Shadow */}
        <motion.ellipse
          cx="160"
          cy="385"
          rx="74"
          ry="12"
          fill="url(#shadowGrad)"
          animate={{
            scaleX: [1, 1.06, 1],
            opacity: [0.8, 0.95, 0.8],
          }}
          transition={{
            repeat: Infinity,
            duration: 3.6,
            ease: 'easeInOut',
          }}
        />

        {/* EUREKA GLOWING LIGHTBULB */}
        {expression === 'eureka' && (
          <motion.g
            initial={{ scale: 0, y: -20 }}
            animate={{ scale: 1.25, y: -38 }}
            className="z-50"
          >
            <circle cx="160" cy="28" r="22" fill="url(#lightbulbGlow)" />
            <circle cx="160" cy="28" r="13" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.5" />
            <path d="M 154 38 L 166 38 L 163 43 L 157 43 Z" fill="#64748B" />
            <line x1="160" y1="9" x2="160" y2="3" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="144" y1="18" x2="138" y2="13" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="176" y1="18" x2="182" y2="13" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
          </motion.g>
        )}

        {/* 3D ALIVE RIGGED CARTOON CHARACTER CONTAINER */}
        <motion.g
          animate={{
            y: [0, -4.5, 0],
            rotate: [0, 0.7, -0.7, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 3.6,
            ease: 'easeInOut',
          }}
        >
          {/* LEGS */}
          <rect x="136" y="325" width="16" height="52" rx="6" fill="#1E293B" />
          <rect x="168" y="325" width="16" height="52" rx="6" fill="#1E293B" />
          <ellipse cx="144" cy="377" rx="13" ry="5.5" fill="#0F172A" />
          <ellipse cx="176" cy="377" rx="13" ry="5.5" fill="#0F172A" />

          {/* 3D VOLUMETRIC TORSO & CLOTHING WITH BREATHING SWAY */}
          <motion.g
            animate={{
              scaleY: [1, 1.018, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.6,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '160px 325px' }}
          >
            {/* Shirt */}
            <path
              d="M 108 205 Q 160 192 212 205 L 222 325 Q 160 334 98 325 Z"
              fill="url(#shirt3DGrad)"
            />
            {/* 3D Vest */}
            <path
              d="M 108 205 L 142 325 L 98 325 Z"
              fill="url(#vest3DGrad)"
            />
            <path
              d="M 212 205 L 178 325 L 222 325 Z"
              fill="url(#vest3DGrad)"
            />
            {/* Collar & 3D Tie */}
            <polygon points="160,202 152,212 160,222 168,212" fill="#38BDF8" />
            <polygon points="160,202 146,210 160,218 174,210" fill="#FFFFFF" />
            {/* Metallic Teacher Badge */}
            <rect x="122" y="235" width="14" height="18" rx="3" fill="url(#lightbulbGlow)" stroke="#D97706" strokeWidth="1" />
            <circle cx="129" cy="241" r="3" fill="#FFFFFF" />
          </motion.g>

          {/* LEFT ARM */}
          <motion.g
            animate={{
              rotate: boneAngles.leftUpperArm,
            }}
            transition={{ type: 'spring', stiffness: 90, damping: 13 }}
            style={{ transformOrigin: '108px 208px' }}
          >
            <path d="M 108 208 L 78 262" stroke="url(#vest3DGrad)" strokeWidth="20" strokeLinecap="round" />
            <motion.g
              animate={{ rotate: boneAngles.leftForearm }}
              transition={{ type: 'spring', stiffness: 90, damping: 13 }}
              style={{ transformOrigin: '78px 262px' }}
            >
              <path d="M 78 262 L 54 308" stroke="url(#skin3DGrad)" strokeWidth="16" strokeLinecap="round" />
              <g transform="translate(54, 312)">
                {render3DHand(boneAngles.leftHandPose, false)}
              </g>
            </motion.g>
          </motion.g>

          {/* RIGHT ARM */}
          <motion.g
            animate={{
              rotate: boneAngles.rightUpperArm,
            }}
            transition={{ type: 'spring', stiffness: 90, damping: 13 }}
            style={{ transformOrigin: '212px 208px' }}
          >
            <path d="M 212 208 L 242 262" stroke="url(#vest3DGrad)" strokeWidth="20" strokeLinecap="round" />
            <motion.g
              animate={{ rotate: boneAngles.rightForearm }}
              transition={{ type: 'spring', stiffness: 90, damping: 13 }}
              style={{ transformOrigin: '242px 262px' }}
            >
              <path d="M 242 262 L 266 308" stroke="url(#skin3DGrad)" strokeWidth="16" strokeLinecap="round" />
              <g transform="translate(266, 312)">
                {render3DHand(boneAngles.rightHandPose, true)}
              </g>
            </motion.g>
          </motion.g>

          {/* 3D NECK & AMBIENT SHADOW */}
          <rect x="147" y="176" width="26" height="30" rx="6" fill="#E2A988" />
          <path d="M 147 180 Q 160 188 173 180 Z" fill="#D99B7A" opacity="0.6" />

          {/* 3D HEAD & DYNAMIC FACIAL RIG */}
          <motion.g
            animate={{
              rotate: boneAngles.headRotate + boneAngles.headTilt,
              y: [0, -1, 0],
            }}
            transition={{ type: 'spring', stiffness: 110, damping: 12 }}
            style={{ transformOrigin: '160px 180px' }}
          >
            {/* 3D Head Sphere Base */}
            <ellipse cx="160" cy="130" rx="58" ry="60" fill="url(#headSkin3D)" stroke="#E5A784" strokeWidth="1.2" />

            {/* Specular Forehead Light Highlight */}
            <ellipse cx="145" cy="98" rx="28" ry="12" fill="#FFFFFF" opacity="0.2" />

            {/* 3D Ears */}
            <ellipse cx="99" cy="132" rx="9.5" ry="13" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1" />
            <ellipse cx="221" cy="132" rx="9.5" ry="13" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1" />

            {/* 3D Layered Haircut with Specular Sheen */}
            <path
              d="M 98 125 C 92 75, 140 54, 160 54 C 188 54, 228 75, 222 125 C 212 95, 196 74, 160 76 C 128 74, 108 95, 98 125 Z"
              fill="url(#hair3DGrad)"
            />
            {/* Hair Specular Sheen */}
            <path
              d="M 125 72 C 145 60, 175 66, 188 80 C 170 72, 145 72, 125 72 Z"
              fill="#6B4B35"
              opacity="0.7"
            />

            {/* EYEBROWS */}
            <motion.g
              animate={{
                rotate: expr.eyebrows.leftAngle,
                y: expr.eyebrows.leftHeight,
              }}
              transition={{ type: 'spring', stiffness: 150, damping: 11 }}
              style={{ transformOrigin: '126px 98px' }}
            >
              <path d="M 110 100 Q 126 92 142 98" fill="none" stroke={config.hairColor} strokeWidth="4.5" strokeLinecap="round" />
            </motion.g>

            <motion.g
              animate={{
                rotate: expr.eyebrows.rightAngle,
                y: expr.eyebrows.rightHeight,
              }}
              transition={{ type: 'spring', stiffness: 150, damping: 11 }}
              style={{ transformOrigin: '194px 98px' }}
            >
              <path d="M 178 98 Q 194 92 210 100" fill="none" stroke={config.hairColor} strokeWidth="4.5" strokeLinecap="round" />
            </motion.g>

            {/* RENDER 3D SPHERICAL EYES */}
            {render3DEye(true)}
            {render3DEye(false)}

            {/* 3D GLASSES WITH METALLIC FRAME SHINE */}
            {config.glasses && (
              <g stroke="#334155" strokeWidth="2.5" fill="none">
                <rect x="107" y="107" width="38" height="30" rx="9" />
                <rect x="175" y="107" width="38" height="30" rx="9" />
                <line x1="145" y1="120" x2="175" y2="120" strokeWidth="3" />
                <line x1="99" y1="118" x2="107" y2="120" />
                <line x1="213" y1="120" x2="221" y2="118" />
                {/* Lens Specular Reflection */}
                <path d="M 110 110 L 125 110 L 115 130 Z" fill="#FFFFFF" opacity="0.15" stroke="none" />
                <path d="M 178 110 L 193 110 L 183 130 Z" fill="#FFFFFF" opacity="0.15" stroke="none" />
              </g>
            )}

            {/* 3D NOSE TIP */}
            <path d="M 158 133 Q 160 140 162 140" fill="none" stroke="#D99B7A" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="160" cy="138" rx="2" ry="1" fill="#FFFFFF" opacity="0.4" />

            {/* MOUTH */}
            {render3DMouth()}

            {/* SOFT 3D CHEEK BLUSH */}
            <ellipse cx="110" cy="142" rx="9.5" ry="6" fill="#FB7185" opacity="0.32" />
            <ellipse cx="210" cy="142" rx="9.5" ry="6" fill="#FB7185" opacity="0.32" />
          </motion.g>
        </motion.g>
      </svg>

      {/* 3D CAMERA PALM EXTENSION */}
      <AnimatePresence>
        {isNoPeekActive && (
          <motion.div
            initial={{ scale: 0.2, opacity: 0, x: 100, y: 100 }}
            animate={{ scale: 4.6, opacity: 1, x: -60, y: -40 }}
            exit={{ scale: 0.2, opacity: 0, x: 100, y: 100 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-50 pointer-events-none drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)]"
            style={{ width: '180px', height: '180px', top: '15%', left: '15%' }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              <g>
                <path d="M 90 90 L 50 50" stroke="url(#skin3DGrad)" strokeWidth="22" strokeLinecap="round" />
                <ellipse cx="45" cy="45" rx="26" ry="24" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1.2" />
                <rect x="20" y="24" width="7.5" height="24" rx="3.7" transform="rotate(-28 24 36)" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1" />
                <rect x="26" y="11" width="8" height="28" rx="4" transform="rotate(-10 30 25)" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1" />
                <rect x="39" y="7" width="8" height="30" rx="4" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1" />
                <rect x="52" y="11" width="7.5" height="27" rx="3.7" transform="rotate(10 56 24)" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1" />
                <rect x="63" y="22" width="7" height="22" rx="3.5" transform="rotate(26 67 33)" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1" />
                <rect x="24" y="42" width="42" height="13" rx="4" fill="#1E293B" opacity="0.95" />
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
