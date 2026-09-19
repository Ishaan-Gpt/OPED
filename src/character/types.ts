import { ReactNode } from 'react';

export type CharacterState =
  | 'idle'
  | 'thinking'
  | 'speaking'
  | 'explaining'
  | 'pointing'
  | 'presenting'
  | 'question'
  | 'noPeek'
  | 'correct'
  | 'incorrect'
  | 'celebrate'
  | 'encourage'
  | 'confused'
  | 'surprised'
  | 'wave'
  | 'proud'
  | 'focused'
  | 'playful'
  | 'amazed'
  | 'puzzled'
  | 'doubleThumbsUp'
  | 'readingBook'
  | 'crossArms'
  | 'writeOnBoard'
  | 'heartHands'
  | 'bow'
  | 'applause'
  | 'victory'
  | 'salute'
  | 'secretTip'
  | 'stretch'
  | 'listeningEar';

export type ExpressionType =
  | 'idle'
  | 'happy'
  | 'excited'
  | 'thinking'
  | 'confused'
  | 'explaining'
  | 'question'
  | 'surprised'
  | 'encouraging'
  | 'correct'
  | 'incorrect'
  | 'celebrating'
  | 'proud'
  | 'focused'
  | 'playful'
  | 'amazed'
  | 'puzzled'
  | 'relieved'
  | 'empathetic'
  | 'mindBlown'
  | 'cheerful'
  | 'determined';

export type GestureType =
  | 'idle'
  | 'wave'
  | 'pointLeft'
  | 'pointRight'
  | 'pointUp'
  | 'pointDown'
  | 'pointAtTarget'
  | 'present'
  | 'explainOneHand'
  | 'explainBothHands'
  | 'thinking'
  | 'handOnChin'
  | 'thumbsUp'
  | 'celebrate'
  | 'encourage'
  | 'shrug'
  | 'stop'
  | 'wait'
  | 'comeHere'
  | 'handsOpen'
  | 'noPeek'
  | 'doubleThumbsUp'
  | 'readingBook'
  | 'crossArms'
  | 'writeOnBoard'
  | 'heartHands'
  | 'bow'
  | 'applause'
  | 'victory'
  | 'salute'
  | 'secretTip'
  | 'stretch'
  | 'listeningEar';

export type PositionPreset =
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'center-left'
  | 'center-right'
  | 'top-left'
  | 'top-right';

export interface PointTargetCoords {
  x: number;
  y: number;
}

export interface PointTargetElement {
  targetElement: HTMLElement | string;
}

export interface PointNamedTarget {
  target: 'board' | 'input' | 'sidebar' | 'student' | 'message1' | 'header';
}

export type PointTarget = PointTargetCoords | PointTargetElement | PointNamedTarget;

export type GazeDirection = 'center' | 'left' | 'right' | 'up' | 'down' | 'upper-left' | 'upper-right' | 'lower-left' | 'lower-right' | 'student';

export interface GazeTargetCoords {
  x: number;
  y: number;
}

export type GazeTarget = GazeDirection | GazeTargetCoords;

export interface CharacterProps {
  state?: CharacterState;
  expression?: ExpressionType;
  gesture?: GestureType;
  position?: PositionPreset | { x: number; y: number };
  scale?: number;
  gazeTarget?: GazeTarget;
  pointTarget?: PointTarget;
  speakingText?: string;
  isAudioSpeaking?: boolean;
  onAnimationComplete?: (state: CharacterState) => void;
  className?: string;
  showThoughtBubble?: boolean;
  thoughtContent?: ReactNode;
}

export interface CharacterConfig {
  skinColor: string;
  skinDarkColor: string;
  hairColor: string;
  shirtColor: string;
  vestColor: string;
  accentColor: string;
  glasses: boolean;
}

export interface BoneAngles {
  headTilt: number;
  headRotate: number;
  leftUpperArm: number;
  leftForearm: number;
  rightUpperArm: number;
  rightForearm: number;
  leftHandPose: 'flat' | 'pointing' | 'thumbsUp' | 'fist' | 'chin' | 'wave' | 'noPeek' | 'peace' | 'heart' | 'clap' | 'cupped' | 'salute' | 'book';
  rightHandPose: 'flat' | 'pointing' | 'thumbsUp' | 'fist' | 'chin' | 'wave' | 'noPeek' | 'peace' | 'heart' | 'clap' | 'cupped' | 'salute' | 'book';
}
