# Animated AI Teacher Character Engine

An expressive, modular, vector-based animated cartoon AI teacher system built as a reusable React component suite.

Designed specifically for interactive educational applications (NCERT classrooms, blackboard recitations, 3D simulations, and active recall quizzes).

---

## 🚀 Key Features

* **Rigged Character Architecture**: Built from independently controllable bones & parts (Head, Eyes, Eyebrows, Mouth, Torso, Arms, Forearms, Hands) rather than static PNG pose swapping.
* **Consistent Proportions**: Maintained anatomical proportions across all poses and gestures without unnatural resizing or distortion.
* **Dynamic Target Awareness**: Inverse-kinematics pointing system calculating exact upper arm, forearm, hand pose, head rotation, and head tilt toward arbitrary screen coordinates `{x, y}`, DOM elements, or named targets (`board`, `student`, `input`).
* **Gaze & Eye Controller**: 3D iris depth with natural micro-blinking (normal, slow, double blinks) and continuous gaze tracking.
* **Signature "No Peek" Interaction**: Playful animation sequence where the character's hand extends forward into the screen foreground (`scale 4.6x`) to temporarily cover the blackboard/content while keeping the body proportioned normally.
* **Spatial Movement (`moveTo`)**: Smooth spring-animated position updates across screen presets (`bottom-right`, `bottom-center`, `bottom-left`, `center-right`, `center-left`, `top-right`, `top-left`) and arbitrary pixel coordinates.
* **42 State Animations, 29 Facial Expressions & 41 Hand Gestures**: Fully customizable preset library for teaching, explaining, asking questions, celebrating, listening, thinking, and encouraging students.

---

## 📦 Installation & Export

Import the character and controller hook into any React application:

```tsx
import { AnimatedTeacher, useCharacterController } from '@/character';
```

---

## 💻 Basic Usage

```tsx
import React from 'react';
import { AnimatedTeacher } from '@/character';

export function LessonPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background / Application UI */}

      {/* Reusable Character Component */}
      <AnimatedTeacher
        state="explaining"
        expression="happy"
        position="bottom-right"
        gazeTarget="student"
      />
    </div>
  );
}
```

---

## 🎮 Advanced Controller System (`useCharacterController`)

The parent application controls **WHAT** the teacher does without needing to handle **HOW** the animation is implemented.

```tsx
import React from 'react';
import { AnimatedTeacher, useCharacterController } from '@/character';

export function InteractiveClassroom() {
  const teacher = useCharacterController('idle', 'bottom-right');

  const onQuestionAsked = () => {
    teacher.play('question');
    teacher.lookAt('student');
  };

  const onCoverBoard = () => {
    // Play signature No-Peek animation for 3.5 seconds
    teacher.play('noPeek', 3500);
  };

  const onPointToDiagram = (element: HTMLElement) => {
    teacher.pointAt({ targetElement: element });
  };

  const onAnswerCorrect = () => {
    teacher.play('correct');
  };

  return (
    <div>
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

## 🎯 API Reference

### `<AnimatedTeacher />` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `state` | `CharacterState` | `'idle'` | Active animation state preset |
| `expression` | `ExpressionType` | Derived from state | Facial expression override |
| `gesture` | `GestureType` | Derived from state | Hand/arm gesture override |
| `position` | `PositionPreset \| {x, y}` | `'bottom-right'` | Position preset or screen coordinates |
| `scale` | `number` | `1.0` | Overall render scale multiplier |
| `gazeTarget` | `GazeTarget` | `'student'` | Gaze target (`'left'`, `'right'`, `'student'`, or `{x, y}`) |
| `pointTarget` | `PointTarget` | `undefined` | Target coordinates or DOM element for pointing |
| `speakingText` | `string` | `undefined` | Optional thought bubble text |
| `isAudioSpeaking` | `boolean` | `false` | Lip sync speaking animation flag |
| `onClick` | `() => void` | `undefined` | Interactive click handler |

---

## 🕹️ Controller Methods (`useCharacterController`)

* `teacher.play(state: CharacterState, durationMs?: number)`: Trigger state animation with optional auto-return to idle.
* `teacher.lookAt(target: GazeTarget)`: Direct eye pupils and subtle head tilt toward target.
* `teacher.pointAt(target: PointTarget)`: Calculate inverse kinematics and point finger/hand toward target.
* `teacher.moveTo(position: PositionPreset | { x: number, y: number })`: Smoothly transition spatial screen location.
* `teacher.setExpression(expr: ExpressionType)`: Set immediate facial expression override.
* `teacher.setGesture(gesture: GestureType)`: Set immediate arm/hand gesture override.

---

## 🎨 Adding Custom Animations & Gestures

To add a new gesture preset:
1. Define the gesture name in `types.ts` (`GestureType`).
2. Add bone angles (head tilt/rotate, arm angles, hand pose) in `CharacterGestures.ts` (`GESTURE_PRESETS`).
3. (Optional) Map the gesture to a new `CharacterState` in `CharacterController.ts` (`STATE_PRESETS`).

---

## 🧪 Development Showcase & Test Page

A dedicated character test suite is available at route `/showcase`.

It provides interactive test controls for all states, positions, gaze directions, expressions, gestures, and dummy targets (`[Diagram]`, `[Important Concept]`, `[Question]`, `[Answer]`, `[3D Experience]`) plus a **"PLAY DEMO LESSON"** sequence.
