# 🎓 Comprehensive System Architecture & Technical Manual: Animated AI Teacher Engine (`abc.md`)

---

## 📌 1. EXECUTIVE SUMMARY

The **Animated AI Teacher Character Engine** is an expressive, modular, vector-rigged cartoon character system built in React, TypeScript, and Framer Motion. 

Unlike conventional avatar solutions that swap static PNG images or CSS background loops, this engine uses a **hierarchical bone skeletal rig**. Each part of the character—eyes, eyelids, eyebrows, mouth, head, neck, upper arms, forearms, hands, torso, and legs—is independently driven by continuous angle matrices and inverse kinematics calculations.

### Primary Objectives Met:
* **Zero PNG Pose Swapping**: 100% dynamic vector SVG elements animated via continuous transforms and spring physics.
* **Proportional Integrity**: The body torso and head maintain consistent proportions during all actions.
* **Contextual & Target Awareness**: Real-time pointing and gaze tracking toward arbitrary screen coordinates $\{x, y\}$, DOM elements, or named UI zones (`board`, `student`, `input`, `sidebar`, `header`).
* **Signature "No-Peek" Camera Perspective**: Hand scales up dramatically ($4.6\times$) on a foreground layer ($z\text{-50}$) while the body remains unchanged ($1.0\times$), simulating reaching out of the screen.
* **Standalone Reusability**: Completely decoupled from parent backend/UI, controlled via a simple React component (`<AnimatedTeacher />`) and controller hook (`useCharacterController`).

---

## 📁 2. FILE & MODULE ARCHITECTURE

| File Path | Role & Purpose |
| :--- | :--- |
| [`src/character/types.ts`](file:///Users/keshav/oped/src/character/types.ts) | TypeScript interfaces, states (`CharacterState`), expressions (`ExpressionType`), gestures (`GestureType`), bone angles (`BoneAngles`), and target types (`PointTarget`, `GazeTarget`). |
| [`src/character/CharacterRig.tsx`](file:///Users/keshav/oped/src/character/CharacterRig.tsx) | SVG rendering system featuring 3D gradients, volumetric eyes/iris, 3D mouth, pearl earrings, cat-eye spectacles, bone rotation chains, and the camera extension palm. |
| [`src/character/AnimatedTeacher.tsx`](file:///Users/keshav/oped/src/character/AnimatedTeacher.tsx) | Wrapper React component handling bounding box tracking, respiratory idle loops, asynchronous blinking, thought bubble overlays, and spring position updates. |
| [`src/character/CharacterController.ts`](file:///Users/keshav/oped/src/character/CharacterController.ts) | State machine hook (`useCharacterController`) managing animation priorities, durations, preset state mappings (`STATE_PRESETS`), and spatial positions. |
| [`src/character/CharacterExpressions.ts`](file:///Users/keshav/oped/src/character/CharacterExpressions.ts) | Preset dictionary (`EXPRESSION_PRESETS`) of 29 facial morph parameters (eyebrow angles/heights, eye shape, pupil offsets, lid openness, mouth type/dimensions). |
| [`src/character/CharacterGestures.ts`](file:///Users/keshav/oped/src/character/CharacterGestures.ts) | Preset dictionary (`GESTURE_PRESETS`) of 41 limb configurations (head tilt/rotate, left/right upper arm angles, forearm angles, left/right hand poses). |
| [`src/character/CharacterPointing.ts`](file:///Users/keshav/oped/src/character/CharacterPointing.ts) | Kinematics engine resolving target coordinates and calculating arm angles, forearm bend, hand pose, and head tilt toward targets. |
| [`src/character/CharacterGaze.ts`](file:///Users/keshav/oped/src/character/CharacterGaze.ts) | Eye tracking engine mapping gaze directions or pixel coordinates $\{x, y\}$ to pupil offsets and head tilt/rotation. |
| [`src/character/index.ts`](file:///Users/keshav/oped/src/character/index.ts) | Barrel export file exposing all public components, hooks, utilities, and types. |
| [`src/routes/showcase.tsx`](file:///Users/keshav/oped/src/routes/showcase.tsx) | Standalone interactive showcase page (`/showcase`) with dummy targets (`[Diagram]`, `[Concept]`, `[Question]`, `[Answer]`, `[3D]`), control sidebar, and automated demo lesson. |

---

## 🦴 3. ANATOMICAL SKELETON & RENDERING HIERARCHY

The SVG vector skeleton in `CharacterRig.tsx` is structured hierarchically from back to front:

```text
TeacherRig Viewport (320px x 400px)
│
├── Ground Shadow (Radial Gradient Ellipse with breathing scale)
├── Lightbulb / Eureka Badge (Rendered overhead when state === 'eureka')
│
└── Animated Cartoon Group (Breath translation y: [0, -4.5, 0], rotate: [0, 0.7, -0.7, 0])
    │
    ├── Legs & Cream Trousers (Static base support, rx: 7)
    ├── Back Hair (3D Pixar-style dark cascading waves behind shoulders)
    │
    ├── Torso (Fitted Black T-Shirt + High-Waisted Tailored Cream Trousers + Button)
    │
    ├── Left Arm (Upper Arm → Forearm → Left Hand)
    │   └── Upper Arm (Rotate: boneAngles.leftUpperArm)
    │       └── Forearm (Rotate: boneAngles.leftForearm)
    │           └── Hand Pose (Rendered via render3DHand)
    │
    ├── Right Arm (Upper Arm → Forearm → Right Hand)
    │   └── Upper Arm (Rotate: boneAngles.rightUpperArm)
    │       └── Forearm (Rotate: boneAngles.rightForearm)
    │           └── Hand Pose (Rendered via render3DHand)
    │
    ├── Neck (Skin gradient + Ambient jaw shadow overlay)
    │
    └── Head Group (Rotate: boneAngles.headRotate + boneAngles.headTilt)
        ├── Head Base Sphere (Radial gradient #headSkin3D)
        ├── Forehead Light Specular Highlight
        ├── Ears & Pearl Earrings (Shined white pearls)
        ├── Waved Long Black Hair (Front lock wave)
        ├── Eyebrows (Left/Right independent height & angle morphing)
        ├── 3D Spherical Eyes (Spherical iris radial gradient + glass highlights + lid blink rect)
        ├── Cat-Eye Spectacles (Dark black frames + lens specular reflections)
        ├── 3D Nose Tip (Nose curve + highlight)
        ├── 3D Volumetric Mouth (Teeth, tongue, inner mouth gradient / motion lip-sync loop)
        └── Soft Cheek Blush Ellipses
```

---

## ⚙️ 4. HOW IT WORKS: CORE MECHANISMS

### A. Gaze Controller Engine (`CharacterGaze.ts`)
Gaze is calculated dynamically through `calculateGaze(target, characterRect)`:
1. **Direction String Mapping**: Standard directions (`student`, `left`, `right`, `up`, `down`, `upper-left`, `upper-right`, `lower-left`, `lower-right`) map to fixed pupil offsets ($\pm 6\text{px}$) and head tilt/rotation ($\pm 8^\circ$).
2. **Coordinate Target Mapping**: Given a target point $(x, y)$, the vector relative to the character center $(x_c, y_c)$ is calculated:
   $$dx = x - x_c, \quad dy = y - y_c$$
   Normalized offsets produce pupil displacements up to $\pm 7\text{px}$ and head rotations up to $\pm 12^\circ$, creating natural gaze follow behavior.

---

### B. Pointing Kinematics Engine (`CharacterPointing.ts`)
When pointing at content (`teacher.pointAt(target)`):
1. **Target Resolution**: Resolves target position from:
   * Explicit pixel coordinates $\{x, y\}$
   * DOM element `getBoundingClientRect()` center coordinates
   * Named UI anchors (`board`, `input`, `sidebar`, `student`, `header`)
2. **Limb Selection**: If target $x < \text{character } x$, the left arm is selected; otherwise, the right arm is selected.
3. **Angle Calculation**: Evaluates the trigonometric angle $\theta = \text{atan2}(dy, dx)$.
4. **Bone Assignment**: Maps $\theta$ to upper arm rotation angle (clamped between $10^\circ$ and $130^\circ$), forearm bend angle, pointing hand pose (`'pointing'`), and head rotation toward the target.

---

### C. Signature "No-Peek" Camera Perspective Sequence (`noPeek`)
When asking students to recall concepts without looking at the board:
1. `teacher.play('noPeek')` triggers `isNoPeekActive = true`.
2. The main character body remains at standard scale ($1.0\times$).
3. An `<AnimatePresence>` overlay renders the extended hand on a separate foreground layer (`z-50`).
4. Framer Motion animates the hand:
   $$\text{scale: } 0.2 \longrightarrow 4.6, \quad \text{opacity: } 0 \longrightarrow 1, \quad \text{easing: spring cubic-bezier}$$
5. The enlarged palm ($4.6\times$) covers the blackboard/quiz area on screen while a `"NO PEEKING! 🙈"` badge appears.
6. After $3.5\text{ seconds}$, the palm smoothly retracts and the teacher returns to `idle`.

---

## 📊 5. COMPLETE LIST OF STATES, EXPRESSIONS & GESTURES

### A. Character States (42 Presets)
`idle`, `thinking`, `speaking`, `explaining`, `pointing`, `presenting`, `question`, `noPeek`, `correct`, `incorrect`, `celebrate`, `encourage`, `confused`, `surprised`, `wave`, `proud`, `focused`, `playful`, `amazed`, `puzzled`, `doubleThumbsUp`, `readingBook`, `crossArms`, `writeOnBoard`, `heartHands`, `bow`, `applause`, `victory`, `salute`, `secretTip`, `stretch`, `listeningEar`, `eureka`, `facepalm`, `flex`, `shushing`, `adjustGlasses`, `highFive`, `fingerGuns`, `handsOnHips`, `heartEyes`, `starEyes`, `cheeringRally`.

### B. Facial Expressions (29 Morph Presets)
`idle`, `happy`, `excited`, `thinking`, `confused`, `explaining`, `question`, `surprised`, `encouraging`, `correct`, `incorrect`, `celebrating`, `proud`, `focused`, `playful`, `amazed`, `puzzled`, `relieved`, `empathetic`, `mindBlown`, `cheerful`, `determined`, `heartEyes`, `starEyes`, `eureka`, `facepalm`, `sleepy`, `shushing`, `smartGlasses`.

### C. Hand Gestures (41 Limb Angles & Poses)
`idle`, `wave`, `pointLeft`, `pointRight`, `pointUp`, `pointDown`, `pointAtTarget`, `present`, `explainOneHand`, `explainBothHands`, `thinking`, `handOnChin`, `thumbsUp`, `doubleThumbsUp`, `celebrate`, `encourage`, `shrug`, `stop`, `wait`, `comeHere`, `handsOpen`, `noPeek`, `readingBook`, `crossArms`, `writeOnBoard`, `heartHands`, `bow`, `applause`, `victory`, `salute`, `secretTip`, `stretch`, `listeningEar`, `eureka`, `facepalm`, `flex`, `shushing`, `adjustGlasses`, `highFive`, `fingerGuns`, `handsOnHips`, `heartOverhead`, `cheeringRally`.

---

## 💻 6. DEVELOPER INTEGRATION & API GUIDE

### Basic Integration
```tsx
import { AnimatedTeacher } from '@/character';

export function LessonView() {
  return (
    <div className="relative min-h-screen">
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

### Advanced Controller Integration
```tsx
import { AnimatedTeacher, useCharacterController } from '@/character';

export function ActiveRecallClassroom() {
  const teacher = useCharacterController('idle', 'bottom-right');

  const handleStudentAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      teacher.play('correct');
      teacher.lookAt('student');
    } else {
      teacher.play('incorrect');
      teacher.lookAt('student');
    }
  };

  const handleRecallPhase = () => {
    teacher.play('question');
    setTimeout(() => {
      teacher.play('noPeek', 3500); // Cover board for 3.5s
    }, 1500);
  };

  return (
    <div className="relative min-h-screen">
      {/* Educational Content & Blackboard UI */}
      
      {/* Teacher Character */}
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

## 🧪 7. SHOWCASE TEST PAGE (`/showcase`)

To test all capabilities locally:
1. Run `npm run dev`
2. Navigate to `http://localhost:3000/showcase`
3. Click **"PLAY DEMO LESSON"** or interact with any of the 5 dummy target cards to verify real-time gaze and pointing calculations.
