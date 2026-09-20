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
  | 'listeningEar'
  | 'eureka'
  | 'facepalm'
  | 'flex'
  | 'shushing'
  | 'adjustGlasses'
  | 'highFive'
  | 'fingerGuns'
  | 'handsOnHips'
  | 'heartEyes'
  | 'starEyes'
  | 'cheeringRally';

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
  | 'determined'
  | 'heartEyes'
  | 'starEyes'
  | 'eureka'
  | 'facepalm'
  | 'sleepy'
  | 'shushing'
  | 'smartGlasses';

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
  | 'listeningEar'
  | 'eureka'
  | 'facepalm'
  | 'flex'
  | 'shushing'
  | 'adjustGlasses'
  | 'highFive'
  | 'fingerGuns'
  | 'handsOnHips'
  | 'heartOverhead'
  | 'cheeringRally';

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
  state?: CharacterState | undefined;
  expression?: ExpressionType | undefined;
  gesture?: GestureType | undefined;
  position?: PositionPreset | { x: number; y: number } | undefined;
  scale?: number | undefined;
  gazeTarget?: GazeTarget | undefined;
  pointTarget?: PointTarget | undefined;
  speakingText?: string | undefined;
  isAudioSpeaking?: boolean | undefined;
  onAnimationComplete?: ((state: CharacterState) => void) | undefined;
  className?: string | undefined;
  showThoughtBubble?: boolean | undefined;
  thoughtContent?: ReactNode | undefined;
  onClick?: (() => void) | undefined;
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
  leftHandPose: 'flat' | 'pointing' | 'thumbsUp' | 'fist' | 'chin' | 'wave' | 'noPeek' | 'peace' | 'heart' | 'clap' | 'cupped' | 'salute' | 'book' | 'fingerGun' | 'facepalm' | 'adjustGlasses' | 'highFive';
  rightHandPose: 'flat' | 'pointing' | 'thumbsUp' | 'fist' | 'chin' | 'wave' | 'noPeek' | 'peace' | 'heart' | 'clap' | 'cupped' | 'salute' | 'book' | 'fingerGun' | 'facepalm' | 'adjustGlasses' | 'highFive';
}

export interface TeacherRefHandle {
  play: (state: CharacterState | 'idle' | 'explain' | 'thinking' | 'question' | 'listen' | 'correct' | 'celebrate' | 'noPeek', durationMs?: number) => void;
  speak: () => void;
  stopSpeaking: () => void;
  setExpression: (expr: ExpressionType) => void;
  setGesture: (g: GestureType) => void;
  lookAt: (target: GazeTarget | { x: number; y: number } | number, y?: number) => void;
  pointAt: (target: PointTarget | { x: number; y: number } | number, y?: number) => void;
  moveTo: (position: PositionPreset | { x: number; y: number } | number, y?: number) => void;
}

