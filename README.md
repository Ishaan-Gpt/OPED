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

# One-time: download the headless Chrome build Remotion renders videos with
# (~150MB, needs internet, only has to run once per machine)
npx remotion browser ensure

# Start local dev server
npm run dev

# Build production bundle
npm run build
```

Node 18 or newer is required. Check with `node -v` — if it's older, update Node first
(https://nodejs.org), everything else on this page assumes a modern Node.

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

### 🤖 Fastest path: paste this into your AI coding agent

If you have Claude Code, Cursor, Copilot, or any other agent with terminal access, paste this
whole block as one prompt and let it do the setup for you — it covers everything above:

```
Set up this repo to run locally with working AI video generation:
1. Run `npm install`.
2. Run `cp .env.example .env.local` (only if .env.local doesn't already exist).
3. Tell me to get a free Groq API key at https://console.groq.com/keys, then open .env.local
   and set GROQ_API_KEY=<the key I give you> (I'll paste it when you ask).
4. Run `npx remotion browser ensure` (one-time headless Chrome download for Remotion, needs internet).
5. Run `npm run dev` and confirm it starts cleanly on http://localhost:3000 without errors.
6. Once it's running, verify AI decisions actually work by running this in another terminal:
   curl -X POST http://localhost:3000/api/teacher/decide -H "Content-Type: application/json" -d "{\"boardHeading\":\"Light\",\"notes\":[\"reflection\"],\"examConcept\":\"x\",\"currentLine\":\"Watch the ray diagram.\",\"stage\":\"understanding\"}"
   It should return JSON with "action":"generate_video" or "action":"continue" — NOT an error.
7. Open http://localhost:3000, search "class 7 photosynthesis", and confirm a video actually
   plays at some point during the lesson (try "class 10 science chapter 10" too if the first
   one doesn't trigger a video — not every line triggers one, that's expected).
Report back what worked and paste any error output verbatim if something fails.
```

No agent? Just work through the "Quick Start" and "Environment setup" sections above by hand —
they're the same steps.

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
