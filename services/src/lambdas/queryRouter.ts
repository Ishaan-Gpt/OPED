import https from 'https';

export const handler = async (event: any) => {
  const apiKey = process.env.GROQ_API_KEY;
  const body = JSON.parse(event.body || '{}');
  const { query } = body;
  
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: "Missing GROQ_API_KEY" })
    };
  }

  const systemPrompt = `You are a curriculum mapping router. Analyze the user's educational query and output ONLY a JSON object representing the closest NCERT chapter match.
Format: {"title": "Chapter Title", "grade": 9, "subject": "Science", "chapter": 1}
If you cannot match it, return {"error": "Not found"}`;

  const requestBody = JSON.stringify({
    model: "openai/gpt-oss-20b",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: query || "What is an atom?" }
    ],
    temperature: 0.1,
    response_format: { type: "json_object" }
  });

  const options = {
    hostname: 'api.groq.com',
    port: 443,
    path: '/openai/v1/chat/completions',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Content-Length': requestBody.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const aiResponse = JSON.parse(parsed.choices[0].message.content);
          
          resolve({
            statusCode: 200,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ ok: true, module: aiResponse })
          });
        } catch (e) {
          resolve({
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: "Failed to parse Groq response", raw: data })
          });
        }
      });
    });

    req.on('error', (e) => {
      resolve({ statusCode: 500, body: JSON.stringify({ error: e.message }) });
    });

    req.write(requestBody);
    req.end();
  });
};
