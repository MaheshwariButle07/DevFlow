import fs from 'fs';
import path from 'path';

function getApiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/GEMINI_API_KEY=["']?([^"'\r\n]+)["']?/);
      if (match) return match[1];
    }
  } catch (err) {}
  return null;
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  if (!body.prompt || typeof body.prompt !== 'string' || body.prompt.length > 2000) {
    return Response.json({ error: 'Add a prompt under 2,000 characters.' }, { status: 400 });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return Response.json({ error: 'GEMINI_API_KEY is not configured in .env.local' }, { status: 500 });
  }

  try {
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: 'You are a Mock Data Architect. Return only a valid JSON array or object containing realistic mock data for the user request. Never wrap it in markdown formatting.' }] },
        contents: [{ role: 'user', parts: [{ text: `Create mock JSON data for this request: ${body.prompt}` }] }],
        generationConfig: { temperature: 0.4, responseMimeType: 'application/json', thinkingConfig: { thinkingBudget: 0 } }
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      return Response.json({ error: `The model could not generate data right now. Gemini error: ${errBody}` }, { status: 502 });
    }

    const result = await response.json();
    const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('No content returned');

    return Response.json({ data: JSON.parse(rawText) });
  } catch (err) {
    return Response.json({ error: `Data generation failed: ${err.message}` }, { status: 500 });
  }
}
