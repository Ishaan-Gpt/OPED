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

# Set up your env file (see "Environment setup" below — REQUIRED for videos/AI to work)
cp .env.example .env.local
# then edit .env.local and add GROQ_API_KEY

# Start local dev server
npm run dev

# Build production bundle
npm run build
```

## 🔑 Environment setup (required — read this if videos/AI aren't working)

If the app runs but the AI teacher never generates a video (or the "ask a question" chat doesn't
respond), you're almost certainly missing `GROQ_API_KEY`. Without it, every AI decision silently
falls back to "continue" so the app never crashes — it just quietly does nothing.

1. Copy the example env file: `cp .env.example .env.local` (never commit `.env.local` — it's
   gitignored on purpose).
2. Get a free Groq API key at **https://console.groq.com/keys**.
3. Open `.env.local` and set:
   ```
   GROQ_API_KEY=gsk_your_key_here
   ```
4. Restart `npm run dev` (env vars are only loaded at server startup).
5. Verify it's actually working — with the dev server running, in another terminal:
   ```sh
   curl -X POST http://localhost:3000/api/teacher/decide -H "Content-Type: application/json" -d "{\"boardHeading\":\"Light\",\"notes\":[\"reflection\"],\"examConcept\":\"x\",\"currentLine\":\"Watch the ray diagram.\",\"stage\":\"understanding\"}"
   ```
   If this returns `{"action":"generate_video",...}` (or a sensible `{"action":"continue"}`), the
   key is working. If you see `{"action":"continue"}` for literally everything you try, the key
   isn't loading — double check it's in `.env.local` (not `.env`) at the project root and that you
   restarted the dev server after adding it.
6. In the app itself, search a chapter that's likely to trigger a video, e.g. `class 7 photosynthesis`
   or `class 10 science chapter 10` — not every narration line triggers one (the AI is deliberately
   selective), so try a couple of different chapters if the first one just plays plain narration.

Everything else in `.env.example` (AWS Bedrock, Remotion Lambda) is only needed for the production
AWS deployment path — see `REMOTION_AWS_DEPLOY.md`. Local dev only needs `GROQ_API_KEY`.

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
