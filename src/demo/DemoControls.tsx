import React from 'react';
import {
  X,
  Play,
  Smile,
  Move,
  Eye,
  Crosshair,
  Sparkles,
  Hand,
} from 'lucide-react';
import {
  CharacterState,
  ExpressionType,
  GestureType,
  PositionPreset,
  GazeTarget,
  PointTarget,
} from '../character/types';

interface DemoControlsProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: CharacterState;
  currentExpression: ExpressionType;
  currentGesture: GestureType;
  currentPosition: PositionPreset | { x: number; y: number };
  onPlayState: (state: CharacterState) => void;
  onSetExpression: (expr: ExpressionType) => void;
  onSetGesture: (g: GestureType) => void;
  onMoveTo: (pos: PositionPreset) => void;
  onLookAt: (gaze: GazeTarget) => void;
  onPointAt: (target: PointTarget) => void;
}

export const DemoControls: React.FC<DemoControlsProps> = ({
  isOpen,
  onClose,
  currentState,
  currentExpression,
  currentGesture,
  currentPosition,
  onPlayState,
  onSetExpression,
  onSetGesture,
  onMoveTo,
  onLookAt,
  onPointAt,
}) => {
  if (!isOpen) return null;

  const states: CharacterState[] = [
    'idle',
    'thinking',
    'speaking',
    'explaining',
    'pointing',
    'presenting',
    'question',
    'noPeek',
    'correct',
    'incorrect',
    'celebrate',
    'encourage',
    'confused',
    'surprised',
    'wave',
    'proud',
    'focused',
    'playful',
    'amazed',
    'puzzled',
    'doubleThumbsUp',
    'readingBook',
    'crossArms',
    'writeOnBoard',
    'heartHands',
    'bow',
    'applause',
    'victory',
    'salute',
    'secretTip',
    'stretch',
    'listeningEar',
  ];

  const expressions: ExpressionType[] = [
    'idle',
    'happy',
    'excited',
    'thinking',
    'confused',
    'explaining',
    'question',
    'surprised',
    'encouraging',
    'correct',
    'incorrect',
    'celebrating',
    'proud',
    'focused',
    'playful',
    'amazed',
    'puzzled',
    'relieved',
    'empathetic',
    'mindBlown',
    'cheerful',
    'determined',
  ];

  const gestures: GestureType[] = [
    'idle',
    'wave',
    'pointLeft',
    'pointRight',
    'pointUp',
    'pointDown',
    'present',
    'explainBothHands',
    'thinking',
    'handOnChin',
    'thumbsUp',
    'doubleThumbsUp',
    'celebrate',
    'encourage',
    'shrug',
    'stop',
    'wait',
    'comeHere',
    'handsOpen',
    'noPeek',
    'readingBook',
    'crossArms',
    'writeOnBoard',
    'heartHands',
    'bow',
    'applause',
    'victory',
    'salute',
    'secretTip',
    'stretch',
    'listeningEar',
  ];

  const positions: PositionPreset[] = [
    'bottom-right',
    'bottom-left',
    'bottom-center',
    'center-right',
    'center-left',
    'top-right',
    'top-left',
  ];

  const gazes: { label: string; value: GazeTarget }[] = [
    { label: 'Student (Camera)', value: 'student' },
    { label: 'Look Left', value: 'left' },
    { label: 'Look Right', value: 'right' },
    { label: 'Look Up', value: 'up' },
    { label: 'Look Down', value: 'down' },
    { label: 'Upper Right (Thinking)', value: 'upper-right' },
  ];

  const pointTargets: { label: string; value: PointTarget }[] = [
    { label: 'Educational Board', value: { target: 'board' } },
    { label: 'Chat Input Box', value: { target: 'input' } },
    { label: 'Sidebar Menu', value: { target: 'sidebar' } },
    { label: 'Navbar Header', value: { target: 'header' } },
    { label: 'Screen Center (700, 300)', value: { x: 700, y: 300 } },
  ];

  return (
    <div className="fixed top-16 right-4 z-40 w-80 md:w-[420px] max-h-[calc(100vh-5rem)] bg-[#171717]/95 backdrop-blur-xl border border-[#2f2f2f] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-5 duration-200">
      {/* Header */}
      <div className="p-3.5 border-b border-[#2f2f2f] flex items-center justify-between bg-[#212121]">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-100 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Full Pose & Expression Suite ({states.length} States)</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-[#2f2f2f] text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Control Categories Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* 1. STATE ANIMATION MACHINES */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
            <Play className="w-3.5 h-3.5 text-blue-400" />
            <span>Full Poses & Poses Presets ({states.length})</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {states.map((st) => (
              <button
                key={st}
                onClick={() => onPlayState(st)}
                className={`px-2 py-1.5 rounded-lg border font-medium capitalize text-[11px] truncate transition-all ${
                  currentState === st
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                    : 'bg-[#212121] border-[#2f2f2f] text-slate-300 hover:bg-[#2f2f2f]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* 2. POINT AT TARGETS */}
        <div className="space-y-2 pt-2 border-t border-[#2f2f2f]">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
            <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
            <span>Context-Aware Pointing</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {pointTargets.map((pt, i) => (
              <button
                key={i}
                onClick={() => onPointAt(pt.value)}
                className="px-2 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium truncate text-left transition-colors"
              >
                👉 {pt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. GAZE / LOOK AT CONTROL */}
        <div className="space-y-2 pt-2 border-t border-[#2f2f2f]">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Gaze Direction (Look At)</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {gazes.map((gz, i) => (
              <button
                key={i}
                onClick={() => onLookAt(gz.value)}
                className="px-2 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-medium truncate text-left transition-colors"
              >
                👀 {gz.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. SPATIAL POSITION MOVEMENT */}
        <div className="space-y-2 pt-2 border-t border-[#2f2f2f]">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
            <Move className="w-3.5 h-3.5 text-purple-400" />
            <span>Spatial Movement (moveTo)</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {positions.map((pos) => (
              <button
                key={pos}
                onClick={() => onMoveTo(pos)}
                className={`px-2 py-1.5 rounded-lg border font-medium text-[10px] truncate capitalize transition-all ${
                  currentPosition === pos
                    ? 'bg-purple-600 border-purple-500 text-white shadow-md'
                    : 'bg-[#212121] border-[#2f2f2f] text-slate-300 hover:bg-[#2f2f2f]'
                }`}
              >
                {pos.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* 5. FACIAL EXPRESSIONS OVERRIDE ({expressions.length}) */}
        <div className="space-y-2 pt-2 border-t border-[#2f2f2f]">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
            <Smile className="w-3.5 h-3.5 text-pink-400" />
            <span>Facial Expressions ({expressions.length})</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {expressions.map((exp) => (
              <button
                key={exp}
                onClick={() => onSetExpression(exp)}
                className={`px-2 py-1.5 rounded-lg border text-[10px] capitalize truncate ${
                  currentExpression === exp
                    ? 'bg-pink-600 border-pink-500 text-white'
                    : 'bg-[#212121] border-[#2f2f2f] text-slate-300 hover:bg-[#2f2f2f]'
                }`}
              >
                {exp}
              </button>
            ))}
          </div>
        </div>

        {/* 6. GESTURES OVERRIDE ({gestures.length}) */}
        <div className="space-y-2 pt-2 border-t border-[#2f2f2f]">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
            <Hand className="w-3.5 h-3.5 text-cyan-400" />
            <span>Gesture & Pose Library ({gestures.length})</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {gestures.map((gst) => (
              <button
                key={gst}
                onClick={() => onSetGesture(gst)}
                className={`px-2 py-1.5 rounded-lg border text-[10px] capitalize truncate ${
                  currentGesture === gst
                    ? 'bg-cyan-600 border-cyan-500 text-white'
                    : 'bg-[#212121] border-[#2f2f2f] text-slate-300 hover:bg-[#2f2f2f]'
                }`}
              >
                {gst}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
