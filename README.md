# OPED — AI Powered Blackboard & Animated Teacher Engine

This repository contains the OPED digital blackboard application powered by React, Vite, TanStack Router, Remotion, and AWS CDK services.

## 🌟 Quick Links

* **Main Application**: `http://localhost:3000`
* **AI Teacher Character Showcase**: Navigate to `/showcase` in your browser.
* **Character Documentation**: See [`src/character/README.md`](file:///Users/keshav/oped/src/character/README.md) for complete API documentation, controller methods, and integration guides.
* **System Architecture**: See [`Architecture.md`](file:///Users/keshav/oped/Architecture.md) and [`abc.md`](file:///Users/keshav/oped/abc.md).

## 🚀 Quick Start

```sh
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build production bundle
npm run build
```

## 🧩 Character Component Usage Example

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

## 🏗️ Backend Services Architecture

This frontend is backed by AWS CDK infrastructure (Lambda, DynamoDB, API Gateway, Fargate) located in the `/services` folder.
