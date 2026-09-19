# Integration Guide: Dynamic AI Teacher Character System

This repository contains a **standalone, reusable animated AI Teacher character engine** (`src/character/`) separated from the demonstration testing environment (`src/demo/`).

Future frontend developers can easily extract the `src/character/` module and place it into any React / Next.js / Vite application.

---

## 📁 Architecture Overview

```text
src/
  character/                   <-- STANDALONE MODULE (Copy this folder into your app)
    AnimatedTeacher.tsx        <-- Main React Component
    CharacterController.ts     <-- State Machine Hook & Controller API
    CharacterRig.tsx           <-- SVG Vector Rig & Layered Body Parts
    CharacterExpressions.ts    <-- 22 Facial Expression Presets
    CharacterGestures.ts       <-- 32 Arm/Body Gesture Joint Presets
    CharacterGaze.ts           <-- Spatial Pupil & Head Gaze Engine
    CharacterPointing.ts       <-- Dynamic Pointing Calculation Engine
    types.ts                   <-- TypeScript Definitions
    index.ts                   <-- Module Barrel Export
  demo/                        <-- Demo ChatGPT Testing UI
```

---

## 🚀 Quick Start Integration

```tsx
import React from 'react';
import { AnimatedTeacher, useCharacterController } from './character';

export function MyEducationalApp() {
  const teacher = useCharacterController('idle', 'bottom-right');

  return (
    <div className="relative w-screen h-screen">
      {/* Production App UI */}
      <main>
        <button onClick={() => teacher.play('explaining')}>Explaining</button>
        <button onClick={() => teacher.play('doubleThumbsUp')}>Double Thumbs Up</button>
        <button onClick={() => teacher.play('readingBook')}>Reading Book</button>
        <button onClick={() => teacher.play('heartHands')}>Heart Hands</button>
        <button onClick={() => teacher.play('noPeek')}>Play "No Peeking!"</button>
      </main>

      {/* Embedded Teacher Character */}
      <AnimatedTeacher
        state={teacher.state}
        expression={teacher.expression}
        gesture={teacher.gesture}
        position={teacher.position}
        gazeTarget={teacher.gazeTarget}
        pointTarget={teacher.pointTarget}
      />
    </div>
  );
}
```

---

## 🎭 Full State Machine Presets (32 Poses & States)

The controller supports 32 high-level state triggers:

- `idle`
- `thinking`
- `speaking`
- `explaining`
- `pointing`
- `presenting`
- `question`
- `noPeek`
- `correct`
- `incorrect`
- `celebrate`
- `encourage`
- `confused`
- `surprised`
- `wave`
- `proud`
- `focused`
- `playful`
- `amazed`
- `puzzled`
- `doubleThumbsUp`
- `readingBook`
- `crossArms`
- `writeOnBoard`
- `heartHands`
- `bow`
- `applause`
- `victory`
- `salute`
- `secretTip`
- `stretch`
- `listeningEar`

---

## 😀 22 Facial Expressions & 32 Gestures

### Facial Expressions (`setExpression`):
`idle`, `happy`, `excited`, `thinking`, `confused`, `explaining`, `question`, `surprised`, `encouraging`, `correct`, `incorrect`, `celebrating`, `proud`, `focused`, `playful`, `amazed`, `puzzled`, `relieved`, `empathetic`, `mindBlown`, `cheerful`, `determined`.

### Gestures & Body Poses (`setGesture`):
`idle`, `wave`, `pointLeft`, `pointRight`, `pointUp`, `pointDown`, `pointAtTarget`, `present`, `explainOneHand`, `explainBothHands`, `thinking`, `handOnChin`, `thumbsUp`, `doubleThumbsUp`, `celebrate`, `encourage`, `shrug`, `stop`, `wait`, `comeHere`, `handsOpen`, `noPeek`, `readingBook`, `crossArms`, `writeOnBoard`, `heartHands`, `bow`, `applause`, `victory`, `salute`, `secretTip`, `stretch`, `listeningEar`.
