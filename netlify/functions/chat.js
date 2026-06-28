const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const systemPrompt = `You are a helpful customer service assistant for Tripp Digital, a Virginia Beach-based web agency that creates professional websites and digital products for entrepreneurs and small businesses.

About Tripp Digital:
- Website: trippdigital.com
- Email: trippdigital1@gmail.com
- Location: Virginia Beach, VA

Services offered:
- Starter Website: $97/month (up to 5 pages, basic SEO, contact form)
- Business Website: $197/month (up to 15 pages, full SEO, blog, payment integration)
- Premium Website: $297/month (unlimited pages, advanced SEO, e-commerce, custom integrations)

Digital Products:
- Make Money With Puzzle Books on KDP ($27)
- How to Start a Grant Writing Business ($37)
- Invoice & Contract Templates Bundle ($12)
- Business Plan Template ($17)
- Client Onboarding Kit ($12)
- Grant Proposal Template ($15)
- Build With AI Complete Pack ($19)

Books:
- Bones: Snake Eyes (Book 1 of The Traveling Dice Shooter Series)
- Maya: Lost but Now Found (Book 1.5)
- MagnetMind Puzzle Books Collection

Be friendly, professional, and helpful. Answer questions about:
- Website services and pricing
- Digital products
- Features and benefits
- How to purchase
- General business advice related to web agencies and entrepreneurship

If someone asks about pricing, delivery, or anything you're unsure about, encourage them to email trippdigital1@gmail.com or visit the website.

Keep responses concise and conversational. Use 2-3 sentences max unless more detail is needed.`;

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Debug: Check if API key is loaded
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not set!");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "API key not configured" }),
      };
    }

    const { messages } = JSON.parse(event.body);

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Messages array required" }),
      };
    }

    // Convert messages to Claude format
    const claudeMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages: claudeMessages,
    });

    const assistantMessage = response.content[0].text;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: assistantMessage,
        stop_reason: response.stop_reason,
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
