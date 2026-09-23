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
  if (!body.prompt || typeof body.prompt !== 'string' || body.prompt.length > 1500) {
    return Response.json({ error: 'Add a query question under 1,500 characters.' }, { status: 400 });
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
        systemInstruction: { parts: [{ text: 'You are an expert SQL Architect. Return a JSON object with keys:\n- "sqlQuery": Cleanly formatted SQL query without markdown fences.\n- "explanation": Concise, clear breakdown of indexes, joins, aggregations, and execution plan optimizations.' }] },
        contents: [{ role: 'user', parts: [{ text: `Schema:\n${body.schema || 'Not provided'}\n\nQuestion / Goal:\n${body.prompt}` }] }],
        generationConfig: { temperature: 0.2, responseMimeType: 'application/json', thinkingConfig: { thinkingBudget: 0 } }
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      return Response.json({ error: `The model could not generate SQL right now. Gemini error: ${errBody}` }, { status: 502 });
    }

    const result = await response.json();
    const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('No content returned');
    
    const parsed = JSON.parse(rawText);
    if (!parsed.sqlQuery || !parsed.explanation) throw new Error();
    return Response.json(parsed);
  } catch (err) {
    return Response.json({ error: `SQL generation failed: ${err.message}` }, { status: 500 });
  }
}
