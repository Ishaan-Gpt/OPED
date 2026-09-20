# Remotion → AWS Lambda deploy runbook

This is the step-by-step guide for deploying the video-rendering side of the app to AWS. It's kept up to date as the Remotion setup evolves — if you change anything here, tell the app team so `src/lib/remotion/render.ts` stays in sync with the env vars below.

**What this covers:** the app generates short (≤15s) explainer video clips on the fly using [Remotion](https://www.remotion.dev/). Locally it renders on your own machine. In production it renders on **AWS Lambda** via `@remotion/lambda` — that's what you're setting up.

**Not covered here:** the adaptive teacher's AI decisioning (Bedrock). That uses its own env vars (`AWS_BEARER_TOKEN_BEDROCK`, `AWS_KNOWLEDGE_BASE_ID`, `AWS_REGION`) which are separate from the Remotion Lambda setup below, but share the same AWS account/region.

---

## Architecture: this app is a static SPA, not a Node server

`amplify.yml` only uploads the built `dist/` folder — there's no Node server running in production. That means the video-generation and teacher-decision logic **cannot** run as a normal backend route; it has to live somewhere the browser can call directly over HTTPS.

- **`src/lib/teacher/decide.ts`** and **`src/lib/remotion/render.ts`** hold the real server-only logic (Node APIs, AWS calls). These are never imported by client code.
- **`src/lib/teacher/client.ts`** and **`src/lib/remotion/client.ts`** are what `BlackboardCanvas.tsx` actually calls — plain `fetch("/api/teacher/decide")` / `fetch("/api/video/generate")`.
- **In local dev**, `vite.config.ts` has a small middleware plugin (`devTeacherApiPlugin`) that serves those two `/api/...` routes directly out of `decide.ts`/`render.ts` — no AWS needed to develop locally.
- **In production**, those two routes don't exist (static hosting). The fix: deploy `decide.ts`'s and `render.ts`'s logic as two standalone **Lambda Function URLs** — exactly the pattern already used for the chat teacher in `src/lib/bedrock.ts` (`LAMBDA_URL = "https://....lambda-url.ap-south-1.on.aws/"`). Then update `client.ts` in both files to call those URLs instead of the relative `/api/...` paths.

This is the next piece of AWS work after the Lambda render setup below: wrap `decideTeacherMove`/`generateLessonVideo` in two small Lambda handlers (same shape as whatever function backs `src/lib/bedrock.ts`) and give the app team the Function URLs.

---

## ⚠️ Security first

A Bedrock bearer token was pasted into a chat during development (`AWS_BEARER_TOKEN_BEDROCK=ABSK...`). Treat it as **compromised**:

1. In the AWS Bedrock console, revoke/regenerate that API key.

**Also, as tested on 2026-09-20:** that key currently returns `400 Operation not allowed` on every `Converse` call (tried Claude 3.5 Sonnet v2 and Nova Pro, plain and cross-region `apac.` profile IDs) — consistent across all of them, meaning the IAM identity behind it isn't granted `bedrock:InvokeModel`/`bedrock:Converse`, or those models aren't enabled under **Model access** in the Bedrock console for this account/region. The Knowledge Base retrieve endpoint (`bedrock-agent-runtime`) also rejects this bearer token outright with a 403 — that API needs full AWS SigV4 credentials (access key/secret or a role), a Bedrock API key doesn't cover it. Both need fixing before the adaptive teacher will do anything beyond its safe fallback ("continue" / no grounding).
2. Put the new value **only** in a local `.env.local` file (already gitignored — never commit it).
3. Same rule applies to every credential below: real values go in `.env.local` or your deployment platform's secret/env-var store (Amplify Console → App settings → Environment variables), never in a committed file.

---

## Fixing Bedrock access — step by step in the console

Do this in AWS console, region **`ap-south-1`** (check the region dropdown top-right first).

**1. Enable model access (nothing works without this)**
1. Search "Bedrock" → open **Amazon Bedrock**.
2. Left sidebar → **Model access**.
3. **Modify model access** → check **Claude 3.5 Sonnet v2** (Anthropic) and **Nova Pro** (Amazon) → submit.
4. Wait for both to show green "Access granted" (Nova is instant; Anthropic may ask you to accept usage terms, still instant).

**2. Rotate the leaked API key**
1. Bedrock console → **API keys** → open the existing key → **revoke/delete** it.
2. **Generate API key** → create a new one → copy the value immediately (shown once) → give it only to whoever is updating `.env.local`.

**3. Fix the permissions on that key's identity (this is what's currently broken — "Operation not allowed")**
1. On the API key's detail page, note the IAM user/role it's attached to.
2. **IAM** console → **Users** (or **Roles**) → open that identity → **Add permissions** → **Create inline policy** → JSON tab:
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["bedrock:InvokeModel", "bedrock:Converse", "bedrock:ConverseStream"],
    "Resource": "*"
  }]
}
```
3. Save.

**4. Get real AWS credentials for the Knowledge Base (bearer token can't do this)**
1. **IAM** → **Users** → **Create user** (e.g. `oped-app-service`).
2. **Add permissions** → inline policy → JSON:
```json
{
  "Version": "2012-10-17",
  "Statement": [{ "Effect": "Allow", "Action": ["bedrock:Retrieve"], "Resource": "*" }]
}
```
3. Open the new user → **Security credentials** tab → **Create access key** → "Application running outside AWS" → copy the **Access Key ID** and **Secret Access Key** (shown once, save them now).
4. Hand these two values, plus the new Bedrock API key from step 2, back to the app team to drop into `.env.local`. Note: `src/lib/teacher/decide.ts`'s Knowledge Base call currently uses the bearer token and will need a small follow-up code change to sign requests with these access keys (SigV4) instead, once you have them.

---

## 0. Prerequisites

- An AWS account with billing enabled, region **`ap-south-1`** (Mumbai) — matches the rest of the app's AWS usage.
- Node.js 18+ and the AWS CLI installed locally, or IAM credentials you can export as env vars.
- An IAM user/role with permission to create IAM roles/policies, Lambda functions, and S3 buckets (an Administrator-level user is simplest for first-time setup; you can lock it down after).

Set your AWS credentials locally however you normally do (`aws configure`, or export `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_REGION=ap-south-1`). These are your **own deploy-time** credentials — separate from anything the running app uses.

---

## 1. Install the Remotion CLI in the project

From the repo root (already done in the codebase, just make sure deps are installed):

```bash
npm install
```

This already includes `remotion`, `@remotion/cli`, `@remotion/renderer`, `@remotion/bundler`, and `@remotion/lambda`.

## 2. Create the IAM role + policy Remotion needs

Remotion provides a one-shot command that prints/creates the exact IAM policy it needs (least-privilege, scoped to Remotion's own resources):

```bash
npx remotion lambda policies role
```

Follow the printed instructions — it either creates the role directly (if your AWS CLI credentials have IAM permissions) or gives you the JSON to paste into the IAM console. Name suggestion: `remotion-lambda-role`.

Then create the matching user policy so *you* (or the CI/CD pipeline) can call the Remotion deploy commands:

```bash
npx remotion lambda policies user
```

Attach that policy to the IAM user whose credentials you're using for deployment.

## 3. Deploy the Lambda function

```bash
npx remotion lambda functions deploy --region=ap-south-1
```

This creates the actual Lambda function that renders video. Note the **function name** it prints (something like `remotion-render-4-0-XXX-mem2048mb-disk2048mb-120sec`) — you'll need it below.

Defaults are fine for our use case (short ≤15s clips), but if renders ever time out, redeploy with a longer timeout:

```bash
npx remotion lambda functions deploy --region=ap-south-1 --timeout=180
```

**WebGL note:** the video compositions use `@remotion/effects` (the light-leak overlay), which needs a WebGL2-capable renderer. The app code already passes `chromiumOptions: { gl: "angle" }` on every render call (local and Lambda), so no extra deploy flag is needed here — just make sure you're deploying a recent enough Remotion Lambda function (this project is on 4.0.526) since ANGLE support on Lambda's software-only GPU requires a reasonably current version.

## 4. Deploy the "site" (the bundled Remotion compositions)

This uploads the actual video compositions (`remotion/` folder in the repo) to S3 so Lambda can render them:

```bash
npx remotion lambda sites create remotion/index.ts --region=ap-south-1
```

Note the **Serve URL** and **bucket name** it prints. Re-run this command every time the compositions in `remotion/` change and redeploy — it's cheap and fast.

## 5. Set the app's environment variables

Wherever the app runs in production (AWS Amplify Console → your app → Hosting → Environment variables), set:

| Variable | Value |
|---|---|
| `REMOTION_RENDER_TARGET` | `lambda` |
| `REMOTION_AWS_FUNCTION_NAME` | the function name from step 3 |
| `REMOTION_AWS_SERVE_URL` | the serve URL from step 4 |
| `REMOTION_AWS_BUCKET_NAME` | the bucket name from step 4 |
| `AWS_REGION` | `ap-south-1` |

The app also needs standard AWS credentials available to its own server runtime (Amplify's compute role, or `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` for a scoped IAM user) so it can call `renderMediaOnLambda` — the Lambda **invoke** permission comes from the "user" policy in step 2, so whatever identity the running app assumes needs that policy attached.

Locally (dev), leave `REMOTION_RENDER_TARGET` unset or `local` — it renders on your own machine instead of Lambda, no AWS needed. See `.env.example`.

## 6. Test it

Test the Lambda render directly from the CLI before wiring it into the app:

```bash
npx remotion lambda render <serve-url-from-step-4> ExplainerClip \
  --region=ap-south-1 \
  --props='{"title":"Test clip","bullets":["First point","Second point"],"targetSeconds":8}'
```

It should print progress and finally an S3 URL to a playable `.mp4`. If that works, the app's `generateLessonVideo` server function (`src/lib/remotion/render.ts`) will work the same way in production.

## Cost & limits to know

- Lambda has a hard **15-minute** execution cap — irrelevant here since our clips are capped at 15 **seconds**, but don't remove that cap in `remotion/types.ts` (`MAX_VIDEO_SECONDS`) without reconsidering render time.
- You're billed per render (Lambda invocation + S3 storage/egress) — for short clips this is fractions of a cent per video, but if usage scales up, keep an eye on S3 lifecycle rules for the output bucket (consider auto-expiring generated clips after a few days).
- `npx remotion lambda functions ls` / `npx remotion lambda sites ls` list what's currently deployed; `npx remotion lambda functions rm` / `sites rm` clean up old ones.

## When compositions change

Any time someone edits `remotion/compositions/ExplainerClip.tsx` (or adds new compositions), re-run step 4 (`sites create`) and update `REMOTION_AWS_SERVE_URL` if it changes. The Lambda function itself (step 3) only needs redeploying if Remotion's version is bumped in `package.json`.
