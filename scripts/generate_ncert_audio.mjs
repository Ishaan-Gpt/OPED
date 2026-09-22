import fs from "node:fs";
import path from "node:path";
import https from "node:https";

const API_KEY = process.env.ELEVENLABS_API_KEY || "sk_d33fec664d48bc45ea8ef93b0ea2019391f9111b0e0586fe";
const VOICE_ID = "jP6rT0U10vfyLbGW2Wm8"; // Anuj

const chapters = [
  {
    id: "c10-sci-10",
    filePath: "src/data/ncert/class-10-science-light.json",
  },
  {
    id: "c9-sci-4",
    filePath: "src/data/ncert/class-9-science-structure-of-atom.json",
  },
  {
    id: "c7-sci-1",
    filePath: "src/data/ncert/class-7-science-nutrition-in-plants.json",
  },
  {
    id: "c8-sci-11",
    filePath: "src/data/ncert/class-8-science-light-dispersion.json",
  },
];

const outDir = path.join(process.cwd(), "public", "audio", "ncert");
fs.mkdirSync(outDir, { recursive: true });

const FALLBACK_VOICE_ID = "onwK4e9ZLuTAKqWW03F9"; // Daniel (Steady Educator)

async function callElevenLabsTTS(text, voiceId) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      text,
      model_id: "eleven_turbo_v2_5",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    });

    const options = {
      hostname: "api.elevenlabs.io",
      port: 443,
      path: `/v1/text-to-speech/${voiceId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": API_KEY,
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 200) {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve({ success: true, buffer: Buffer.concat(chunks) }));
      } else {
        let errData = "";
        res.on("data", (chunk) => (errData += chunk));
        res.on("end", () => resolve({ success: false, statusCode: res.statusCode, error: errData }));
      }
    });

    req.on("error", (e) => resolve({ success: false, error: e.message }));
    req.write(postData);
    req.end();
  });
}

async function synthesizeLine(text, outFilePath) {
  if (fs.existsSync(outFilePath)) {
    console.log(`[SKIP] Already exists: ${path.basename(outFilePath)}`);
    return;
  }

  // 1. Try primary voice (Anuj)
  let result = await callElevenLabsTTS(text, VOICE_ID);

  // 2. If primary voice fails due to paid plan limitation, use high-quality educator voice
  if (!result.success && result.statusCode === 402) {
    result = await callElevenLabsTTS(text, FALLBACK_VOICE_ID);
  }

  if (result.success && result.buffer) {
    fs.writeFileSync(outFilePath, result.buffer);
    console.log(`[OK] Generated (${result.buffer.length} bytes): ${path.basename(outFilePath)}`);
  } else {
    console.error(`[FAIL] Could not generate ${path.basename(outFilePath)}:`, result.error);
  }
}

async function run() {
  console.log(`Starting audio generation with ElevenLabs Voice: Anuj (${VOICE_ID})...`);

  for (const ch of chapters) {
    const raw = fs.readFileSync(path.join(process.cwd(), ch.filePath), "utf-8");
    const json = JSON.parse(raw);

    for (const page of json.pages) {
      for (let li = 0; li < page.spokenLines.length; li++) {
        const line = page.spokenLines[li];
        const fileName = `${ch.id}-p${page.pageNumber}-l${li}.mp3`;
        const outPath = path.join(outDir, fileName);
        console.log(`Synthesizing: ${fileName} -> "${line.text.slice(0, 40)}..."`);
        await synthesizeLine(line.text, outPath);
        // Small rate limit pause
        await new Promise((r) => setTimeout(r, 200));
      }
    }
  }

  console.log("\nAll NCERT lesson audio generated successfully!");
}

run();
