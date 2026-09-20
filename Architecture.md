# OPED — Full System Architecture, AWS Map & Agentic Workflow

This supersedes the class 1-4/dashboard-driven flow in the earlier AWS doc with the outcome-based, NCERT-anchored, search-first flow. Everything below is scoped to what's needed to make that exact experience work: search → parse → prep → understand → recite → adapt → mark-exam-ready.

---

## 1. System Overview

```
                         ┌─────────────────────────────┐
                         │   Next.js Frontend (S3+CF)   │
                         │  Search → Blackboard → 3D    │
                         └──────────────┬───────────────┘
                                        │ HTTPS / WSS
                         ┌──────────────▼───────────────┐
                         │      API Gateway (REST+WS)     │
                         └──────────────┬───────────────┘
                                        │
      ┌─────────────────────────────────┼─────────────────────────────────┐
      │                                 │                                 │
┌─────▼──────┐                  ┌───────▼────────┐                ┌───────▼────────┐
│ Query Router│                  │ Lesson Compiler │                │ Recitation Agent│
│   Lambda    │                  │ Lambda (Step Fn)│                │  Lambda (Step Fn)│
└─────┬──────┘                  └───────┬────────┘                └───────┬────────┘
      │                                 │                                 │
      │                          ┌──────▼──────┐                  ┌───────▼───────┐
      │                          │ NCERT Content│                  │ STT (Transcribe│
      │                          │   (Aurora +   │                  │ /Bedrock ASR)  │
      │                          │  OpenSearch)  │                  └───────┬───────┘
      │                          └──────┬──────┘                          │
      │                                 │                          ┌───────▼───────┐
      │                          ┌──────▼──────┐                  │  Bedrock LLM   │
      │                          │  Bedrock LLM │                  │ (match/verdict)│
      │                          │ (compile+TTS │                  └───────┬───────┘
      │                          │   script)    │                          │
      │                          └──────┬──────┘                  ┌───────▼───────┐
      │                                 │                          │ DynamoDB       │
      │                          ┌──────▼──────┐                  │ (session state,│
      │                          │ Polly/Bedrock│                  │ mastery log)   │
      │                          │  TTS → S3    │                  └────────────────┘
      │                          └─────────────┘
      │
┌─────▼──────────┐
│ ElastiCache     │  ← session/lesson cache, rate limits
│ Redis           │
└─────────────────┘
```

Everything the student-facing app talks to is either API Gateway (request/response, e.g. "compile this chapter") or a WebSocket connection (streaming: captions syncing to TTS, live recitation feedback, hand-raise doubt events).

---

## 2. AWS Service Map

| Service | Role in OPED | Notes |
|---|---|---|
| **S3 + CloudFront** | Hosts the Next.js static/export assets, serves TTS audio, serves NCERT diagram images, caches 3D GLB assets | Same pattern as before; TTS bucket gets a short TTL since content is chapter-specific and reused across students |
| **API Gateway (HTTP API + WebSocket API)** | HTTP: search/parse, chapter compile trigger, mastery fetch. WebSocket: live caption stream, recitation turn-by-turn, hand-raise doubt | WebSocket is what makes "teacher adapts live" possible without polling |
| **Lambda** | All stateless compute: query router, TTS request, STT request, mastery scoring, WebSocket connection handlers | Node.js 20, one function per responsibility (see §4) |
| **Step Functions** | Orchestrates the two multi-step **agentic loops** that aren't a single request/response: Lesson Compilation, and Recitation Evaluation | This is the actual "agentic loop" runtime — see §6 |
| **Amazon Bedrock** | LLM calls for: (a) NCERT chapter → condensed teaching script, (b) recitation semantic match/verdict, (c) fallback lesson generation | Claude models via Bedrock, kept in-AWS instead of hitting Anthropic/Gemini/OpenAI APIs directly — removes 3 external vendor dependencies from the old multi-tier fallback |
| **Amazon Transcribe** (or Bedrock ASR) | Speech-to-text for the student's spoken recitation | Streaming mode so partial transcripts can start scoring before the student finishes, cutting perceived latency |
| **Amazon Polly (Neural/Generative voices) + Bedrock TTS** | Teacher voice synthesis for the "understanding" narration and recitation prompts | Polly primary (cheap, fast, good Indian-English voices), Bedrock/other TTS as fallback |
| **Aurora Serverless v2 (PostgreSQL)** | System-of-record: students, schools, lessons, chapters, **mastery/outcome log per chapter per student** | Same base schema as before, extended — see §5 |
| **Amazon OpenSearch Service** | Semantic/keyword search over the NCERT DB — this is what powers "match the query to a chapter" and "find the exact passage to condense" | Vector + BM25 hybrid index over chapter text, section headers, keywords |
| **DynamoDB** | Fast, ephemeral session state: current lesson phase, current board content, WebSocket connection IDs, in-flight recitation attempt count | Chosen over Aurora for this because it's single-digit-ms, high-write, TTL-expiring data — not the durable record |
| **ElastiCache Redis** | Compiled-lesson cache (`lesson:{class}:{subject}:{chapter}` → compiled script, so the second student on the same chapter doesn't re-run the LLM), rate limiting | 24h TTL on compiled lessons; near-identical requests are common (many students, same chapter) |
| **Step Functions + EventBridge** | Scheduled: nightly mastery report rollups, NCERT DB re-ingestion checks, cache warm jobs for popular chapters | |
| **Secrets Manager** | Bedrock/Polly/Transcribe are IAM-based (no API keys needed), so Secrets Manager here mainly holds DB creds and any payment/school-admin secrets | Smaller surface than before since LLM/TTS/STT are all native AWS |
| **CloudWatch + X-Ray** | Logs, metrics, and **distributed tracing across the agentic loop** — critical because the recitation loop spans Lambda → Transcribe → Bedrock → DynamoDB and you need to see where latency/failures happen in one trace | |
| **WAF + Shield Standard** | Standard protection on API Gateway | |
| **Cognito** | Student/school auth | |

**Why Bedrock instead of the old Gemini→Claude→OpenAI chain:** the outcome-based version needs tight latency and needs to stay inside one IAM boundary for the recitation loop (audio in, verdict out, nothing leaving AWS). Bedrock hosting Claude directly removes the external API hop and the three-vendor fallback complexity — one provider, one retry policy, one place to set guardrails.

---

## 3. End-to-End Workflow (what actually happens, in order)

1. **Student lands** on the white search screen (static, served from CloudFront, zero backend calls).
2. **Student types/speaks a query.** On submit, frontend calls `POST /api/query/parse`.
3. **Query Router Lambda** runs a lightweight classifier (regex + small Bedrock call if ambiguous) to extract `{class, subject, chapter}`. If it doesn't confidently resolve to an NCERT chapter in scope (4-10), it returns a `not_in_scope` response with the hint message — no further backend work happens, this is intentionally cheap and fast.
4. **If resolved:** frontend calls `POST /api/lesson/compile` with `{class, subject, chapter}`, and simultaneously opens the WebSocket connection for the session.
5. **Lesson Compilation (agentic loop, §4.2)** runs — check Redis cache first; on miss, Step Functions orchestrates OpenSearch retrieval → Bedrock condensation → Polly TTS generation → cache write. Returns a `compiledLessonId`.
6. **Frontend enters Understanding phase (5a):** WebSocket streams caption text + TTS audio URLs segment by segment; blackboard renders text/images in sync. No backend loop needed here — it's playback of pre-compiled content.
7. **Frontend enters Recitation phase (5b):** for each recitation checkpoint, frontend streams the student's mic audio over WebSocket into the **Recitation Evaluation agentic loop (§4.4)**. The loop returns a verdict (`proceed` / `repeat`) and the frontend animates the red/green border accordingly, live.
8. **On chapter completion:** frontend calls `POST /api/outcome/record`, which writes to Aurora's mastery log and triggers the **Mastery Scoring agent (§4.5)** to compute the chapter's exam-readiness score.
9. **Student can re-enter** the same chapter later; compiled content is reused from cache, but the recitation loop always re-runs live (mastery isn't cached, only content is).

---

## 4. The Agentic Loops

"Agentic" here specifically means: an LLM makes a decision that changes the next step, and the system runs another round based on that decision, rather than a fixed pipeline. Two of the five things below are genuinely agentic loops; the others are orchestrated pipelines that call an LLM once. Being precise about which is which matters for how you implement and monitor them.

### 4.1 Query Router (pipeline, not a loop)
- **Trigger:** every search submission.
- **Steps:** regex match against `NCERT [class] [subject] [chapter]` pattern → if it matches, direct lookup. If it doesn't match cleanly (natural language query, typo, partial), one Bedrock call with a tight system prompt: *"Map this query to {class 4-10, subject, chapter} from this allowed list, or return NOT_FOUND."*
- **Exit:** single LLM call, single decision, done. No loop.
- **Latency target:** < 400ms for the regex path, < 1.2s for the LLM path.

### 4.2 Lesson Compilation Agent (orchestrated pipeline, cached)
- **Trigger:** cache miss on `POST /api/lesson/compile`.
- **Orchestration:** Step Functions state machine, not raw Lambda chaining, because this has retry-with-backoff needs at every step and you want visibility into which step failed.
- **Steps:**
  1. `FetchChapter` — OpenSearch/Aurora pulls the full NCERT chapter text + associated diagram references for `{class, subject, chapter}`.
  2. `CompileScript` — Bedrock call with a strict system prompt: *condense to teaching length, but preserve original NCERT wording (no paraphrasing of definitions/facts — this is exam-facing content).* Output is structured JSON: array of segments, each with `teacherLine`, `boardContent` (text/image ref), and — critically — a flag on which segments are `recitationRequired: true` with the exact `expectedRecitation` text the student needs to say back.
  3. `ValidateSchema` — JSON schema validation (segments, recitation flags, timing all present). On failure, retry `CompileScript` once with an error-correction prompt appended; on second failure, fall back to a simpler rule-based segmentation of the raw chapter text (no LLM) so the lesson still loads.
  4. `GenerateAudio` — for each `teacherLine`, Polly synthesizes and writes to S3, returns URLs.
  5. `CacheResult` — write the compiled lesson JSON (with audio URLs) into Redis (`lesson:{class}:{subject}:{chapter}`, 24h TTL) and Aurora (permanent record, for offline/audit).
- **This is not agentic in the strict sense** — it doesn't branch based on an LLM's judgment call about what to do next. It's a validated pipeline. Keep it that way; don't let the compiler "decide" pacing, because pacing is the recitation loop's job.

### 4.3 Delivery Orchestrator (state machine, not agentic)
- Simple phase state machine per session, held in DynamoDB: `understanding(segment N) → recitation(segment N) → understanding(segment N+1) → ... → chapterComplete`.
- WebSocket Lambda pushes the next segment's content/audio when the frontend signals "ready for next" or when a recitation checkpoint resolves to `proceed`.
- No LLM calls here — this just walks the pre-compiled script.

### 4.4 Recitation Evaluation Agent — THE core agentic loop
This is the one place the system is making a real-time pedagogical judgment call, so it deserves the most detail.

**Trigger:** frontend hits a `recitationRequired` segment, records the student speaking (after the teacher has said the line twice, per your spec), streams audio over WebSocket.

**Orchestration:** Step Functions **Express Workflow** (not Standard — this needs sub-second-to-few-second total latency, Express is built for that), triggered per recitation attempt.

**Loop structure:**

```
┌─────────────────────────────────────────────────────────┐
│ START: attemptCount = 1 (max 3, then auto-proceed with   │
│ a gentle "let's continue" — never trap a student in a    │
│ loop)                                                     │
└────────────────────────┬──────────────────────────────────┘
                          ▼
              ┌───────────────────────┐
              │ Transcribe (streaming) │  audio → text
              └───────────┬───────────┘
                          ▼
              ┌───────────────────────┐
              │ Bedrock: Match Agent   │
              │ Input: expectedRecitation +
              │        actual transcript +
              │        subject/class context
              │ Output: {verdict: correct|
              │   partial|incorrect,
              │   confidence, missingConcepts[]}
              └───────────┬───────────┘
                          ▼
                 ┌────────┴────────┐
                 │  branch on verdict │
                 └────────┬────────┘
        ┌─────────────────┼─────────────────────┐
        ▼                 ▼                      ▼
   correct           partial/incorrect      transcription failed/
        │             (attemptCount<3)       empty audio
        │                 │                      │
        ▼                 ▼                      ▼
  write mastery      Bedrock: Adapt Agent    retry capture once,
  log entry           generates a targeted   then fall back to
  (attempt#, verdict, hint referencing the   text-based recitation
  confidence) →        missingConcepts,       (student types instead
  return PROCEED        teacher re-states     of speaks)
  to frontend            that part only (not
                          the whole segment
                          again) → attemptCount++
                          → LOOP back to
                          Transcribe on next
                          student attempt
```

**Why this is genuinely "agentic":** the Match Agent's verdict determines whether the loop continues and, if it does, the Adapt Agent generates a *different, targeted* re-teach rather than replaying the same content — that's the LLM making a judgment that changes the next action, which is the actual definition of the loop here, not just a retry mechanism.

**Implementation pattern (Lambda inside the Express Step Function):**

```javascript
// matchAgent.js
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const client = new BedrockRuntimeClient({ region: "ap-south-1" });

exports.handler = async (event) => {
  const { expectedRecitation, transcript, classLevel, subject } = event;

  const prompt = `You are evaluating a class ${classLevel} student's spoken recitation
against the expected NCERT content. Be lenient on phrasing, strict on core concepts.

Expected: "${expectedRecitation}"
Student said: "${transcript}"

Return ONLY JSON: {"verdict": "correct"|"partial"|"incorrect",
"confidence": 0-1, "missingConcepts": ["..."]}`;

  const response = await client.send(new InvokeModelCommand({
    modelId: "anthropic.claude-3-5-sonnet-20241022-v2:0",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }]
    })
  }));

  const result = JSON.parse(new TextDecoder().decode(response.body));
  return JSON.parse(result.content[0].text); // { verdict, confidence, missingConcepts }
};
```

**State machine definition (excerpt):**

```json
{
  "StartAt": "Transcribe",
  "States": {
    "Transcribe": { "Type": "Task", "Resource": "arn:...transcribeAudio", "Next": "MatchAgent" },
    "MatchAgent": { "Type": "Task", "Resource": "arn:...matchAgent", "Next": "EvaluateVerdict" },
    "EvaluateVerdict": {
      "Type": "Choice",
      "Choices": [
        { "Variable": "$.verdict", "StringEquals": "correct", "Next": "LogMasteryAndProceed" },
        { "And": [
            {"Variable": "$.verdict", "StringEquals": "incorrect"},
            {"Variable": "$.attemptCount", "NumericLessThan": 3}
          ], "Next": "AdaptAgent" }
      ],
      "Default": "AutoProceedGracefully"
    },
    "AdaptAgent": { "Type": "Task", "Resource": "arn:...adaptAgent", "Next": "IncrementAttempt" },
    "IncrementAttempt": { "Type": "Pass", "Next": "WaitForNextAttempt" },
    "WaitForNextAttempt": { "Type": "Task", "Resource": "arn:...pushToWebSocket", "End": true },
    "LogMasteryAndProceed": { "Type": "Task", "Resource": "arn:...writeMasteryLog", "End": true },
    "AutoProceedGracefully": { "Type": "Task", "Resource": "arn:...writeMasteryLog", "End": true }
  }
}
```

**Latency budget:** Transcribe streaming (~300-600ms after speech ends) + Bedrock match call (~500-900ms) = under 1.5s from "student stops talking" to "border color changes." This is the number to protect — it's the moment the whole "dynamic, adaptive" claim lives or dies on.

### 4.5 Mastery / Exam-Readiness Scoring Agent
- **Trigger:** on chapter completion.
- **Not a loop** — one Bedrock call that takes the full attempt log for the chapter (every recitation checkpoint's verdict, confidence, attempt count) and produces a structured `chapterReadiness` score plus a short natural-language note on weak concepts, written to Aurora's `learning_outcomes` table.
- **This score is the thing "outcome-based" ultimately reports on** — it's what would show a parent/school "this chapter is exam-ready" vs "needs review," and it's the number your `NCERT [class] [subject] [chapter]` re-entry flow would check to decide whether to skip straight to a quick review vs. full re-teach.

---

## 5. Data Model Additions (on top of the existing Aurora schema)

```sql
-- NCERT content, class 4-10
CREATE TABLE ncert_chapters (
  id UUID PRIMARY KEY,
  class_level INT,          -- 4-10
  subject VARCHAR(100),
  chapter_number INT,
  title VARCHAR(255),
  raw_text TEXT,             -- full original NCERT wording
  diagram_refs JSONB,        -- S3 keys for associated images
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Compiled lesson cache (durable copy; Redis holds the hot cache)
CREATE TABLE compiled_lessons (
  id UUID PRIMARY KEY,
  chapter_id UUID REFERENCES ncert_chapters(id),
  compiled_json JSONB,       -- segments, recitation flags, audio URLs
  compiled_at TIMESTAMP DEFAULT NOW()
);

-- Every recitation attempt, for mastery scoring and audit
CREATE TABLE recitation_attempts (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  chapter_id UUID REFERENCES ncert_chapters(id),
  segment_index INT,
  attempt_number INT,
  transcript TEXT,
  verdict VARCHAR(20),       -- correct, partial, incorrect
  confidence DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chapter-level outcome, this is the "100% exam ready" number
CREATE TABLE learning_outcomes (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  chapter_id UUID REFERENCES ncert_chapters(id),
  readiness_score DECIMAL(5,2),   -- 0-100
  weak_concepts JSONB,
  completed_at TIMESTAMP DEFAULT NOW()
);
```

DynamoDB (ephemeral, single-table design):
```
PK: SESSION#{sessionId}       SK: STATE
  → { phase, currentSegment, wsConnectionId, attemptCount, ttl }

PK: SESSION#{sessionId}       SK: RECITATION#{segmentIndex}#{attempt}
  → { transcript, verdict, timestamp, ttl }
```

---

## 6. NCERT DB Ingestion (how the "pre-connected DB" actually gets built)

1. Source NCERT PDFs (classes 4-10, all subjects) → S3 raw bucket.
2. Textract/PDF-parsing Lambda extracts chapter text + figure positions → writes to `ncert_chapters` (raw_text preserved verbatim — this matters since the compile step is instructed not to paraphrase facts).
3. Bedrock embedding call per chapter/section → indexed into OpenSearch for the Query Router and for the Lesson Compiler's retrieval step.
4. A validation pass flags chapters where extraction confidence is low (scanned/complex layout pages) for manual review before they go live — you don't want the compiler condensing garbled OCR text into a "concise" lesson that's now wrong.

---

## 7. Implementation Order

1. **Aurora + OpenSearch + NCERT ingestion pipeline** first — nothing else works without content in the DB.
2. **Query Router + Lesson Compiler (§4.1, §4.2)** — get "type a chapter, get a compiled script back" working end-to-end before touching recitation.
3. **Delivery Orchestrator + WebSocket plumbing (§4.3)** — get Understanding-phase playback working (captions + audio + board sync), no recitation yet.
4. **Recitation Evaluation loop (§4.4)** — the hard part; build and tune Match Agent prompts against real student transcripts before wiring it into the live UI, since prompt leniency (how forgiving of phrasing vs. how strict on concepts) needs real data to calibrate.
5. **Mastery Scoring (§4.5) + outcome reporting** — last, since it depends on real attempt data existing.
6. **3D portal mode** integrates independently once the board/canvas frontend and the content pipeline are both stable — it's a rendering concern, not a data/agent concern, so it can run in parallel with steps 2-4 on a separate track.