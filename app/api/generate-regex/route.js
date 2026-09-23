
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
  if (!body.prompt || typeof body.prompt !== 'string' || body.prompt.length > 1000) {
    return Response.json({ error: 'Add a pattern brief under 1,000 characters.' }, { status: 400 });
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
        systemInstruction: { parts: [{ text: 'You are a regex generator. Given any user prompt, generate a JSON object with keys:\n- "regexString": A valid JavaScript regex literal matching the user request (including flags g or gi, e.g. "/pattern/gi"). Do NOT include start ^ or end $ anchors unless explicitly requested.\n- "explanation": Clear, concise explanation of the regex components.\n- "sampleText": A realistic multi-line text sample containing 3-4 matching examples and 2 non-matching invalid examples to test the regex.' }] },
        contents: [{ role: 'user', parts: [{ text: body.prompt }] }],
        generationConfig: { temperature: 0.2, responseMimeType: 'application/json', thinkingConfig: { thinkingBudget: 0 } }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API Error:', errText);
      return Response.json({ error: `Gemini API Error: ${errText}` }, { status: 502 });
    }

    const result = await response.json();
    const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('No content returned from Gemini.');

    const parsed = JSON.parse(rawText);
    if (!parsed.regexString || !parsed.explanation) throw new Error('Invalid JSON structure returned from Gemini.');
    
    return Response.json(parsed);
  } catch (err) {
    console.error('Generate Regex Error:', err);
    return Response.json({ error: `Dynamic generation failed: ${err.message}` }, { status: 500 });
  }
}

