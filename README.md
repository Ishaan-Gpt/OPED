# Animated AI Teacher Character Engine

A standalone, high-quality vector animated cartoon AI teacher system built as a reusable React component suite for educational web applications.

## 🌟 Quick Links

* **Showcase & Interactive Test Suite**: Navigate to `/showcase` in your browser.
* **Character Documentation**: See [`src/character/README.md`](file:///Users/keshav/oped/src/character/README.md) for complete API documentation, controller methods, and integration guides.

## 🚀 Quick Start

```sh
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build production bundle
npm run build
```

## 🧩 Component Usage Example

```tsx
import { AnimatedTeacher, useCharacterController } from './character';

export function LessonScreen() {
  const teacher = useCharacterController('idle', 'bottom-right');

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
