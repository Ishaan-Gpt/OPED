import { ExpressionType } from './types';

export interface ExpressionParams {
  eyebrows: {
    leftAngle: number;
    rightAngle: number;
    leftHeight: number;
    rightHeight: number;
  };
  eyes: {
    shape: 'normal' | 'happy' | 'excited' | 'curious' | 'thinking' | 'wide' | 'closed' | 'wink' | 'focused' | 'amazed' | 'heart' | 'star';
    pupilOffset: { x: number; y: number };
    lidOpenness: number;
  };
  mouth: {
    type: 'neutral' | 'smile' | 'bigSmile' | 'speaking' | 'surprised' | 'thinking' | 'concerned' | 'open' | 'gentle' | 'proud' | 'puzzled' | 'grin' | 'mindBlown' | 'shush' | 'gasp' | 'smirk';
    openWidth: number;
    openHeight: number;
  };
}

export const EXPRESSION_PRESETS: Record<ExpressionType, ExpressionParams> = {
  idle: {
    eyebrows: { leftAngle: 0, rightAngle: 0, leftHeight: 0, rightHeight: 0 },
    eyes: { shape: 'normal', pupilOffset: { x: 0, y: 0 }, lidOpenness: 1 },
    mouth: { type: 'smile', openWidth: 32, openHeight: 6 },
  },
  happy: {
    eyebrows: { leftAngle: -4, rightAngle: 4, leftHeight: -2, rightHeight: -2 },
    eyes: { shape: 'happy', pupilOffset: { x: 0, y: -1 }, lidOpenness: 0.9 },
    mouth: { type: 'smile', openWidth: 38, openHeight: 12 },
  },
  excited: {
    eyebrows: { leftAngle: -8, rightAngle: 8, leftHeight: -4, rightHeight: -4 },
    eyes: { shape: 'excited', pupilOffset: { x: 0, y: -2 }, lidOpenness: 1.1 },
    mouth: { type: 'bigSmile', openWidth: 44, openHeight: 20 },
  },
  thinking: {
    eyebrows: { leftAngle: 8, rightAngle: -4, leftHeight: -3, rightHeight: 1 },
    eyes: { shape: 'thinking', pupilOffset: { x: 4, y: -6 }, lidOpenness: 0.85 },
    mouth: { type: 'thinking', openWidth: 24, openHeight: 4 },
  },
  confused: {
    eyebrows: { leftAngle: 14, rightAngle: -10, leftHeight: -5, rightHeight: 3 },
    eyes: { shape: 'curious', pupilOffset: { x: -3, y: -3 }, lidOpenness: 0.9 },
    mouth: { type: 'concerned', openWidth: 28, openHeight: 8 },
  },
  explaining: {
    eyebrows: { leftAngle: -2, rightAngle: 2, leftHeight: -1, rightHeight: -1 },
    eyes: { shape: 'normal', pupilOffset: { x: 0, y: 0 }, lidOpenness: 1 },
    mouth: { type: 'speaking', openWidth: 36, openHeight: 14 },
  },
  question: {
    eyebrows: { leftAngle: -10, rightAngle: 10, leftHeight: -5, rightHeight: 2 },
    eyes: { shape: 'curious', pupilOffset: { x: 0, y: -2 }, lidOpenness: 1.05 },
    mouth: { type: 'gentle', openWidth: 30, openHeight: 10 },
  },
  surprised: {
    eyebrows: { leftAngle: -12, rightAngle: 12, leftHeight: -6, rightHeight: -6 },
    eyes: { shape: 'wide', pupilOffset: { x: 0, y: 0 }, lidOpenness: 1.25 },
    mouth: { type: 'surprised', openWidth: 26, openHeight: 24 },
  },
  encouraging: {
    eyebrows: { leftAngle: -3, rightAngle: 3, leftHeight: -2, rightHeight: -2 },
    eyes: { shape: 'happy', pupilOffset: { x: 0, y: 0 }, lidOpenness: 0.95 },
    mouth: { type: 'smile', openWidth: 36, openHeight: 10 },
  },
  correct: {
    eyebrows: { leftAngle: -8, rightAngle: 8, leftHeight: -4, rightHeight: -4 },
    eyes: { shape: 'excited', pupilOffset: { x: 0, y: -2 }, lidOpenness: 1.15 },
    mouth: { type: 'bigSmile', openWidth: 46, openHeight: 22 },
  },
  incorrect: {
    eyebrows: { leftAngle: 6, rightAngle: -6, leftHeight: 2, rightHeight: 2 },
    eyes: { shape: 'normal', pupilOffset: { x: 0, y: 2 }, lidOpenness: 0.9 },
    mouth: { type: 'concerned', openWidth: 28, openHeight: 6 },
  },
  celebrating: {
    eyebrows: { leftAngle: -10, rightAngle: 10, leftHeight: -5, rightHeight: -5 },
    eyes: { shape: 'excited', pupilOffset: { x: 0, y: -3 }, lidOpenness: 1.2 },
    mouth: { type: 'bigSmile', openWidth: 48, openHeight: 24 },
  },
  proud: {
    eyebrows: { leftAngle: -6, rightAngle: 6, leftHeight: -4, rightHeight: -4 },
    eyes: { shape: 'happy', pupilOffset: { x: 0, y: -2 }, lidOpenness: 0.9 },
    mouth: { type: 'proud', openWidth: 40, openHeight: 12 },
  },
  focused: {
    eyebrows: { leftAngle: 4, rightAngle: -4, leftHeight: 2, rightHeight: 2 },
    eyes: { shape: 'focused', pupilOffset: { x: 0, y: 0 }, lidOpenness: 0.75 },
    mouth: { type: 'neutral', openWidth: 26, openHeight: 4 },
  },
  playful: {
    eyebrows: { leftAngle: -12, rightAngle: 6, leftHeight: -4, rightHeight: 0 },
    eyes: { shape: 'wink', pupilOffset: { x: 1, y: -1 }, lidOpenness: 1 },
    mouth: { type: 'grin', openWidth: 38, openHeight: 14 },
  },
  amazed: {
    eyebrows: { leftAngle: -14, rightAngle: 14, leftHeight: -6, rightHeight: -6 },
    eyes: { shape: 'amazed', pupilOffset: { x: 0, y: 0 }, lidOpenness: 1.3 },
    mouth: { type: 'surprised', openWidth: 28, openHeight: 26 },
  },
  puzzled: {
    eyebrows: { leftAngle: 16, rightAngle: -8, leftHeight: -6, rightHeight: 2 },
    eyes: { shape: 'curious', pupilOffset: { x: -4, y: -2 }, lidOpenness: 0.9 },
    mouth: { type: 'puzzled', openWidth: 28, openHeight: 8 },
  },
  relieved: {
    eyebrows: { leftAngle: -2, rightAngle: 2, leftHeight: -1, rightHeight: -1 },
    eyes: { shape: 'closed', pupilOffset: { x: 0, y: 0 }, lidOpenness: 0.1 },
    mouth: { type: 'smile', openWidth: 34, openHeight: 8 },
  },
  empathetic: {
    eyebrows: { leftAngle: 4, rightAngle: -4, leftHeight: 1, rightHeight: 1 },
    eyes: { shape: 'happy', pupilOffset: { x: 0, y: 1 }, lidOpenness: 0.95 },
    mouth: { type: 'gentle', openWidth: 32, openHeight: 8 },
  },
  mindBlown: {
    eyebrows: { leftAngle: -16, rightAngle: 16, leftHeight: -8, rightHeight: -8 },
    eyes: { shape: 'amazed', pupilOffset: { x: 0, y: 0 }, lidOpenness: 1.35 },
    mouth: { type: 'mindBlown', openWidth: 36, openHeight: 28 },
  },
  cheerful: {
    eyebrows: { leftAngle: -8, rightAngle: 8, leftHeight: -4, rightHeight: -4 },
    eyes: { shape: 'happy', pupilOffset: { x: 0, y: -2 }, lidOpenness: 0.85 },
    mouth: { type: 'grin', openWidth: 44, openHeight: 20 },
  },
  determined: {
    eyebrows: { leftAngle: 8, rightAngle: -8, leftHeight: 2, rightHeight: 2 },
    eyes: { shape: 'focused', pupilOffset: { x: 0, y: -1 }, lidOpenness: 0.8 },
    mouth: { type: 'neutral', openWidth: 30, openHeight: 4 },
  },
  heartEyes: {
    eyebrows: { leftAngle: -10, rightAngle: 10, leftHeight: -5, rightHeight: -5 },
    eyes: { shape: 'heart', pupilOffset: { x: 0, y: 0 }, lidOpenness: 1.1 },
    mouth: { type: 'bigSmile', openWidth: 42, openHeight: 18 },
  },
  starEyes: {
    eyebrows: { leftAngle: -12, rightAngle: 12, leftHeight: -6, rightHeight: -6 },
    eyes: { shape: 'star', pupilOffset: { x: 0, y: 0 }, lidOpenness: 1.25 },
    mouth: { type: 'grin', openWidth: 46, openHeight: 22 },
  },
  eureka: {
    eyebrows: { leftAngle: -14, rightAngle: 10, leftHeight: -6, rightHeight: -2 },
    eyes: { shape: 'amazed', pupilOffset: { x: 0, y: -4 }, lidOpenness: 1.2 },
    mouth: { type: 'gasp', openWidth: 30, openHeight: 18 },
  },
  facepalm: {
    eyebrows: { leftAngle: 12, rightAngle: 12, leftHeight: 2, rightHeight: 2 },
    eyes: { shape: 'closed', pupilOffset: { x: 0, y: 0 }, lidOpenness: 0.05 },
    mouth: { type: 'concerned', openWidth: 26, openHeight: 6 },
  },
  sleepy: {
    eyebrows: { leftAngle: 0, rightAngle: 0, leftHeight: 2, rightHeight: 2 },
    eyes: { shape: 'closed', pupilOffset: { x: 0, y: 2 }, lidOpenness: 0.15 },
    mouth: { type: 'thinking', openWidth: 22, openHeight: 6 },
  },
  shushing: {
    eyebrows: { leftAngle: -4, rightAngle: 4, leftHeight: -1, rightHeight: -1 },
    eyes: { shape: 'normal', pupilOffset: { x: 0, y: 0 }, lidOpenness: 0.95 },
    mouth: { type: 'shush', openWidth: 14, openHeight: 10 },
  },
  smartGlasses: {
    eyebrows: { leftAngle: -8, rightAngle: -2, leftHeight: -4, rightHeight: 0 },
    eyes: { shape: 'focused', pupilOffset: { x: 2, y: -2 }, lidOpenness: 0.85 },
    mouth: { type: 'smirk', openWidth: 32, openHeight: 8 },
  },
};
