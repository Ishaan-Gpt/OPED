import React from 'react';
import { motion } from 'framer-motion';
import { ExpressionType, CharacterConfig } from './types';
import { EXPRESSION_PRESETS } from './CharacterExpressions';

interface CharacterFaceProps {
  expression: ExpressionType;
  pupilOffset: { x: number; y: number };
  isBlinking: boolean;
  isSpeaking: boolean;
  config: CharacterConfig;
}

export const CharacterFace: React.FC<CharacterFaceProps> = ({
  expression,
  pupilOffset,
  isBlinking,
  isSpeaking,
  config,
}) => {
  const expr = EXPRESSION_PRESETS[expression] || EXPRESSION_PRESETS.idle;

  const finalPupilX = pupilOffset.x + expr.eyes.pupilOffset.x;
  const finalPupilY = pupilOffset.y + expr.eyes.pupilOffset.y;

  // 3D Volumetric Mouth Renderer
  const renderMouth = () => {
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
            <path d="M -16 1 Q 0 7 16 1 Z" fill="#FFFFFF" />
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

  // Eye Component
  const renderEye = (isLeft: boolean) => {
    const shape = expr.eyes.shape;

    return (
      <g transform={`translate(${isLeft ? 126 : 194}, 122)`}>
        {/* 3D Eyeball Sphere */}
        <ellipse cx="0" cy="0" rx="15.5" ry="17.5" fill="url(#eyeSocketGrad)" stroke="#CBD5E1" strokeWidth="1" />
        <ellipse cx="0" cy="-2" rx="14" ry="15" fill="url(#eyeball3DGrad)" />

        {/* Pupil / Iris */}
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
            <ellipse cx="0" cy="0" rx="9.5" ry="11.5" fill="#0B1329" />
            <ellipse cx="0" cy="0" rx="7.2" ry="9" fill="url(#iris3DGrad)" />
            <circle cx="0" cy="0" r="3.5" fill="#020617" />
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

        {/* Upper Lid Eyelash Stroke */}
        <path d="M -16 -8 Q 0 -22 16 -8" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
      </g>
    );
  };

  return (
    <>
      {/* 3D Head Sphere Base */}
      <ellipse cx="160" cy="130" rx="58" ry="60" fill="url(#headSkin3D)" stroke="#E5A784" strokeWidth="1.2" />

      {/* Forehead Light Specular Highlight */}
      <ellipse cx="145" cy="98" rx="28" ry="12" fill="#FFFFFF" opacity="0.22" />

      {/* Ears */}
      <ellipse cx="99" cy="132" rx="9.5" ry="13" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1" />
      <ellipse cx="221" cy="132" rx="9.5" ry="13" fill="url(#skin3DGrad)" stroke="#E2A988" strokeWidth="1" />

      {/* Pearl Earrings */}
      <circle cx="95" cy="138" r="4.5" fill="url(#pearlGrad)" stroke="#E2E8F0" strokeWidth="0.8" />
      <circle cx="93.5" cy="136.5" r="1.5" fill="#FFFFFF" />
      <circle cx="225" cy="138" r="4.5" fill="url(#pearlGrad)" stroke="#E2E8F0" strokeWidth="0.8" />
      <circle cx="223.5" cy="136.5" r="1.5" fill="#FFFFFF" />

      {/* Hair Over Head */}
      <path
        d="M 96 130 C 88 68, 138 48, 160 48 C 190 48, 232 68, 224 130 C 214 90, 198 66, 160 68 C 124 66, 106 90, 96 130 Z"
        fill="url(#hair3DGrad)"
      />
      <path
        d="M 115 62 C 145 52, 185 58, 205 78 C 185 66, 145 66, 115 62 Z"
        fill="url(#hairSheenGrad)"
      />

      {/* Eyebrows */}
      <motion.g
        animate={{
          rotate: expr.eyebrows.leftAngle,
          y: expr.eyebrows.leftHeight,
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 11 }}
        style={{ transformOrigin: '126px 98px' }}
      >
        <path d="M 108 98 Q 126 88 144 96" fill="none" stroke="#18161D" strokeWidth="4.8" strokeLinecap="round" />
      </motion.g>

      <motion.g
        animate={{
          rotate: expr.eyebrows.rightAngle,
          y: expr.eyebrows.rightHeight,
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 11 }}
        style={{ transformOrigin: '194px 98px' }}
      >
        <path d="M 176 96 Q 194 88 212 98" fill="none" stroke="#18161D" strokeWidth="4.8" strokeLinecap="round" />
      </motion.g>

      {/* Eyes */}
      {renderEye(true)}
      {renderEye(false)}

      {/* Cat-Eye Spectacles */}
      {config.glasses && (
        <g stroke="#18181B" strokeWidth="3.2" fill="none">
          <rect x="104" y="104" width="42" height="34" rx="12" />
          <rect x="174" y="104" width="42" height="34" rx="12" />
          <line x1="146" y1="118" x2="174" y2="118" strokeWidth="3.5" />
          <line x1="95" y1="115" x2="104" y2="117" strokeWidth="2.5" />
          <line x1="216" y1="117" x2="225" y2="115" strokeWidth="2.5" />
          <path d="M 108 108 L 125 108 L 114 132 Z" fill="#FFFFFF" opacity="0.18" stroke="none" />
          <path d="M 178 108 L 195 108 L 184 132 Z" fill="#FFFFFF" opacity="0.18" stroke="none" />
        </g>
      )}

      {/* Nose Tip */}
      <path d="M 158 133 Q 160 140 162 140" fill="none" stroke="#D99B7A" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="160" cy="138" rx="2" ry="1" fill="#FFFFFF" opacity="0.4" />

      {/* Mouth */}
      {renderMouth()}

      {/* Cheek Blush */}
      <ellipse cx="108" cy="144" rx="10.5" ry="6.5" fill="#FB7185" opacity="0.35" />
      <ellipse cx="212" cy="144" rx="10.5" ry="6.5" fill="#FB7185" opacity="0.35" />
    </>
  );
};
