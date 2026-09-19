import { useState, useCallback, useRef } from 'react';
import {
  CharacterState,
  ExpressionType,
  GestureType,
  GazeTarget,
  PointTarget,
  PositionPreset,
} from './types';

export interface StatePreset {
  expression: ExpressionType;
  gesture: GestureType;
  gaze?: GazeTarget;
}

export const STATE_PRESETS: Record<CharacterState, StatePreset> = {
  idle: { expression: 'idle', gesture: 'idle', gaze: 'student' },
  thinking: { expression: 'thinking', gesture: 'handOnChin', gaze: 'upper-right' },
  speaking: { expression: 'explaining', gesture: 'explainOneHand', gaze: 'student' },
  explaining: { expression: 'explaining', gesture: 'explainBothHands', gaze: 'student' },
  pointing: { expression: 'explaining', gesture: 'pointAtTarget', gaze: 'left' },
  presenting: { expression: 'happy', gesture: 'present', gaze: 'left' },
  question: { expression: 'question', gesture: 'pointRight', gaze: 'student' },
  noPeek: { expression: 'excited', gesture: 'noPeek', gaze: 'student' },
  correct: { expression: 'correct', gesture: 'thumbsUp', gaze: 'student' },
  incorrect: { expression: 'incorrect', gesture: 'encourage', gaze: 'student' },
  celebrate: { expression: 'celebrating', gesture: 'celebrate', gaze: 'student' },
  encourage: { expression: 'encouraging', gesture: 'thumbsUp', gaze: 'student' },
  confused: { expression: 'confused', gesture: 'shrug', gaze: 'upper-left' },
  surprised: { expression: 'surprised', gesture: 'stop', gaze: 'student' },
  wave: { expression: 'happy', gesture: 'wave', gaze: 'student' },
  proud: { expression: 'proud', gesture: 'doubleThumbsUp', gaze: 'student' },
  focused: { expression: 'focused', gesture: 'writeOnBoard', gaze: 'left' },
  playful: { expression: 'playful', gesture: 'victory', gaze: 'student' },
  amazed: { expression: 'amazed', gesture: 'stretch', gaze: 'student' },
  puzzled: { expression: 'puzzled', gesture: 'thinking', gaze: 'upper-left' },
  doubleThumbsUp: { expression: 'correct', gesture: 'doubleThumbsUp', gaze: 'student' },
  readingBook: { expression: 'focused', gesture: 'readingBook', gaze: 'down' },
  crossArms: { expression: 'determined', gesture: 'crossArms', gaze: 'student' },
  writeOnBoard: { expression: 'explaining', gesture: 'writeOnBoard', gaze: 'left' },
  heartHands: { expression: 'empathetic', gesture: 'heartHands', gaze: 'student' },
  bow: { expression: 'cheerful', gesture: 'bow', gaze: 'down' },
  applause: { expression: 'cheerful', gesture: 'applause', gaze: 'student' },
  victory: { expression: 'cheerful', gesture: 'victory', gaze: 'student' },
  salute: { expression: 'determined', gesture: 'salute', gaze: 'student' },
  secretTip: { expression: 'playful', gesture: 'secretTip', gaze: 'student' },
  stretch: { expression: 'relieved', gesture: 'stretch', gaze: 'up' },
  listeningEar: { expression: 'question', gesture: 'listeningEar', gaze: 'student' },
};

export interface CharacterControllerReturn {
  state: CharacterState;
  expression: ExpressionType;
  gesture: GestureType;
  position: PositionPreset | { x: number; y: number };
  gazeTarget: GazeTarget;
  pointTarget: PointTarget | undefined;
  isNoPeekActive: boolean;
  play: (newState: CharacterState, durationMs?: number) => void;
  lookAt: (target: GazeTarget) => void;
  pointAt: (target: PointTarget) => void;
  moveTo: (newPosition: PositionPreset | { x: number; y: number }) => void;
  setExpression: (expr: ExpressionType) => void;
  setGesture: (g: GestureType) => void;
}

export function useCharacterController(
  initialState: CharacterState = 'idle',
  initialPosition: PositionPreset = 'bottom-right'
): CharacterControllerReturn {
  const [state, setState] = useState<CharacterState>(initialState);
  const [expression, setExpressionState] = useState<ExpressionType>(
    STATE_PRESETS[initialState].expression
  );
  const [gesture, setGestureState] = useState<GestureType>(
    STATE_PRESETS[initialState].gesture
  );
  const [position, setPositionState] = useState<PositionPreset | { x: number; y: number }>(
    initialPosition
  );
  const [gazeTarget, setGazeTargetState] = useState<GazeTarget>('student');
  const [pointTarget, setPointTargetState] = useState<PointTarget | undefined>(undefined);
  const [isNoPeekActive, setIsNoPeekActive] = useState<boolean>(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const play = useCallback((newState: CharacterState, durationMs?: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setState(newState);
    const preset = STATE_PRESETS[newState] || STATE_PRESETS.idle;
    setExpressionState(preset.expression);
    setGestureState(preset.gesture);

    if (preset.gaze) {
      setGazeTargetState(preset.gaze);
    }

    if (newState === 'noPeek') {
      setIsNoPeekActive(true);
      const timeout = durationMs || 3500;
      timeoutRef.current = setTimeout(() => {
        setIsNoPeekActive(false);
        play('idle');
      }, timeout);
    } else {
      setIsNoPeekActive(false);
    }

    if (newState === 'pointing') {
      if (!pointTarget) {
        setPointTargetState({ target: 'board' });
      }
    }

    if (durationMs && newState !== 'noPeek') {
      timeoutRef.current = setTimeout(() => {
        play('idle');
      }, durationMs);
    }
  }, [pointTarget]);

  const lookAt = useCallback((target: GazeTarget) => {
    setGazeTargetState(target);
  }, []);

  const pointAt = useCallback((target: PointTarget) => {
    setPointTargetState(target);
    setState('pointing');
    setGestureState('pointAtTarget');
    setExpressionState('explaining');
  }, []);

  const moveTo = useCallback((newPos: PositionPreset | { x: number; y: number }) => {
    setPositionState(newPos);
  }, []);

  const setExpression = useCallback((expr: ExpressionType) => {
    setExpressionState(expr);
  }, []);

  const setGesture = useCallback((g: GestureType) => {
    setGestureState(g);
  }, []);

  return {
    state,
    expression,
    gesture,
    position,
    gazeTarget,
    pointTarget,
    isNoPeekActive,
    play,
    lookAt,
    pointAt,
    moveTo,
    setExpression,
    setGesture,
  };
}
