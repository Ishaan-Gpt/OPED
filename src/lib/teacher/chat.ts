/**
 * Streams a response from Groq for the "ask the teacher a question" feature.
 * Server-only (reads GROQ_API_KEY) — called from the dev API middleware in vite.config.ts
 * locally, and from the deployed Lambda proxy in production. Never import this from client code;
 * use src/lib/bedrock.ts (the client wrapper) instead.
 */
export async function* streamTeacherChat(userPrompt: string, context: string) {
  const apiKey = process.env["GROQ_API_KEY"] ?? process.env["VITE_GROQ_API_KEY"];
  if (!apiKey) {
    yield "Oops, my AI key is missing on the server. Please add GROQ_API_KEY to .env.local.";
    return;
  }

  const model = process.env["GROQ_MODEL"] ?? "openai/gpt-oss-20b";
  const systemPrompt = `You are Dr. Rao, an enthusiastic and expert NCERT teacher for Indian school students.
You are currently teaching a class using a digital blackboard.
Context of the current lesson:
${context}

Keep your responses extremely concise (1-2 sentences), encouraging, and easy to understand. Do not use markdown formatting like **bold** because your text will be read aloud and displayed in a small caption box.`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 512,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Failed to connect to Groq (HTTP ${response.status})`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let newlineIdx;
    while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, newlineIdx).trim();
      buffer = buffer.slice(newlineIdx + 1);
      if (line.startsWith("data: ") && line !== "data: [DONE]") {
        try {
          const data = JSON.parse(line.slice(6)) as {
            choices?: { delta?: { content?: string } }[];
          };
          const text = data.choices?.[0]?.delta?.content;
          if (text) yield text;
        } catch {
          // ignore fragmented SSE lines
        }
      }
    }
  }
}
