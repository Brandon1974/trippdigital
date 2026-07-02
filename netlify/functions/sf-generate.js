const Anthropic = require('@anthropic-ai/sdk');

const SYSTEM_PROMPT = `You are an expert web developer. Generate a complete, beautiful, modern HTML website based on the user's description.

RULES:
- Return ONLY the complete HTML document. No explanation, no markdown, no code fences.
- All CSS must be in a <style> tag in <head>. No external CSS files.
- All JavaScript must be in <script> tags. No external JS files.
- You MAY use Google Fonts via a <link> tag — that is the only allowed external resource.
- The site must be fully responsive and mobile-first.
- Make it look like a real, polished, professional business website — not a template.
- Use modern design: smooth gradients, clean typography, subtle shadows, good spacing.
- Include all sections and content the user described.
- Use real, specific placeholder content (not "Lorem ipsum") based on the business type.
- If a phone number, address, or other detail is given, use it exactly.
- Contact forms should be styled but do not need backend logic.`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured.' })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { description, image } = body;

  if (!description || !description.trim()) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Description is required.' }) };
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const userContent = [];

    if (image && image.data && image.mimeType) {
      userContent.push({
        type: 'image',
        source: { type: 'base64', media_type: image.mimeType, data: image.data }
      });
      userContent.push({
        type: 'text',
        text: `Build a complete website based on this description. Use the reference image for context (business details, branding, photos, etc.):\n\n${description.trim()}`
      });
    } else {
      userContent.push({
        type: 'text',
        text: `Build a complete website based on this description:\n\n${description.trim()}`
      });
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }]
    });

    let html = response.content[0].text.trim();

    // Strip any accidental code fences
    html = html.replace(/^```html\s*/i, '').replace(/\s*```$/, '').trim();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html })
    };

  } catch (err) {
    console.error('Generate error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message || 'Generation failed' })
    };
  }
};
