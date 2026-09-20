/**
 * Streams a response from Groq LLM API.
 * This bypasses AWS Bedrock entirely, providing a fast free alternative for the hackathon.
 * @param userPrompt The question or input from the student
 * @param context The current NCERT module context (title, notes)
 */
export async function* streamTeacherResponse(userPrompt: string, context: string) {
  const apiKey = import.meta.env["VITE_GROQ_API_KEY"];
  if (!apiKey) {
    yield "Oops, my AI key is missing. Please add VITE_GROQ_API_KEY to your .env file!";
    return;
  }

  const systemPrompt = `You are Dr. Rao, an enthusiastic and expert NCERT teacher for Indian school students. 
You are currently teaching a class using a digital blackboard.
Context of the current lesson:
${context}

Keep your responses extremely concise (1-2 sentences), encouraging, and easy to understand. Do not use markdown formatting like **bold** because your text will be read aloud and displayed in a small caption box.`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile", // State-of-the-art reasoning model on Groq
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 512,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to connect to AI Teacher (Groq HTTP ${response.status})`);
  }

  if (!response.body) {
    throw new Error("No response body received.");
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
          const data = JSON.parse(line.slice(6));
          const text = data.choices?.[0]?.delta?.content;
          if (text) {
            yield text;
          }
        } catch (e) {
          // ignore parsing errors for fragmented lines
        }
      }
    }
  }
}
