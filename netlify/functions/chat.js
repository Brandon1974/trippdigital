const Anthropic = require("@anthropic-ai/sdk");
const { getStore } = require("@netlify/blobs");

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function blobsStore(name) {
  if (process.env.NETLIFY_SITE_ID && process.env.NETLIFY_API_TOKEN) {
    return getStore({
      name,
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_API_TOKEN,
    });
  }
  return getStore(name);
}

async function logChatActivity(isNewConversation) {
  try {
    const store = blobsStore("site-analytics");
    const now = new Date();
    const dayKey = `chatday:${now.toISOString().slice(0, 10)}`;

    // bump total messages counter
    const msgTotalRaw = await store.get("chat-message-count");
    const msgTotal = (parseInt(msgTotalRaw, 10) || 0) + 1;
    await store.set("chat-message-count", String(msgTotal));

    // bump today's message count
    const dayRaw = await store.get(dayKey);
    const dayCount = (parseInt(dayRaw, 10) || 0) + 1;
    await store.set(dayKey, String(dayCount));

    // bump distinct conversation counter (first message in a session)
    if (isNewConversation) {
      const convTotalRaw = await store.get("chat-conversation-count");
      const convTotal = (parseInt(convTotalRaw, 10) || 0) + 1;
      await store.set("chat-conversation-count", String(convTotal));
    }
  } catch (err) {
    console.error("Chat tracking failed:", err.message);
  }
}

async function logConversationTranscript(userMessage, assistantMessage) {
  try {
    const store = blobsStore("site-analytics");
    const now = new Date();
    const dayKey = `chatlog:${now.toISOString().slice(0, 10)}`;

    const existing = (await store.get(dayKey, { type: "json" })) || [];
    existing.push({
      time: now.toISOString(),
      question: userMessage.slice(0, 500),
      answer: assistantMessage.slice(0, 800),
    });
    await store.set(dayKey, JSON.stringify(existing));
  } catch (err) {
    console.error("Transcript logging failed:", err.message);
  }
}

async function submitChatToNetlifyForms(userMessage) {
  try {
    // Submit chat message as a Netlify Form submission
    // This triggers Netlify's built-in form notifications
    const formName = "chat-messages";
    const now = new Date();

    const formData = new URLSearchParams();
    formData.append("form-name", formName);
    formData.append("message", userMessage.slice(0, 500));
    formData.append("timestamp", now.toISOString());

    // Submit to Netlify forms endpoint
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    console.log("Chat message submitted to Netlify Forms");
  } catch (err) {
    console.error("Netlify Forms submission failed:", err.message);
    // Don't block chat response if form submission fails
  }
}


const fs = require("fs");
const path = require("path");

function loadProducts() {
  try {
    const filePath = path.join(__dirname, "../../data/products.json");
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("products.json loaded but empty or invalid");
    }
    return parsed;
  } catch (err) {
    console.error("Could not load products.json:", err.message);
    return null;
  }
}

function buildSystemPrompt() {
  const products = loadProducts();

  if (!products) {
    return `You are a customer service assistant for Tripp Digital. Our product catalog failed to load right now. Do NOT invent, guess, or make up any product names, prices, or features. Tell the person you're having a technical issue pulling up the product list and to check trippdigital.com directly or email trippdigital1@gmail.com. Keep it brief and apologetic.`;
  }

  const freeItems = products.filter((p) => p.price.toLowerCase() === "free");
  const paidTools = products.filter((p) => p.type === "tool" && p.price.toLowerCase() !== "free");
  const guides = products.filter((p) => p.type === "guide" && p.price.toLowerCase() !== "free");
  const books = products.filter((p) => p.type === "book");

  const formatItem = (p) => {
    const trial = p.free_trial ? ` (try free first at ${p.link})` : "";
    return `- ${p.name} — ${p.price}${trial}: ${p.description}`;
  };

  return `You are a helpful, upbeat customer service assistant for Tripp Digital, a Virginia Beach-based web agency and digital products business run by Brandon Tripp.

About Tripp Digital:
- Website: trippdigital.com
- Email: trippdigital1@gmail.com
- Location: Virginia Beach, VA

Website services:
- Starter Website: $97/month (up to 5 pages, basic SEO, contact form)
- Business Website: $197/month (up to 15 pages, full SEO, blog, payment integration)
- Premium Website: $297/month (unlimited pages, advanced SEO, e-commerce, custom integrations)

FREE items (promote these often! great low-pressure way for people to try Tripp Digital):
${freeItems.map(formatItem).join("\n")}

Paid digital tools & business trackers (single-file HTML tools, instant download, no software installs):
${paidTools.map(formatItem).join("\n")}

Paid PDF guides:
${guides.map(formatItem).join("\n")}

Books by Brandon Tripp:
${books.map(formatItem).join("\n")}

Your goals when chatting:
- Be friendly, professional, conversational — not salesy or robotic.
- Whenever it's a natural fit, mention FREE items first as a no-risk way to check out Tripp Digital's quality before buying anything. If a paid item has a free trial link, mention that too.
- Answer questions about services, products, pricing, features, and how to purchase.
- General business/entrepreneurship advice is fine too.
- If someone asks about something you're unsure of, delivery specifics, or anything outside this info, encourage them to email trippdigital1@gmail.com or browse trippdigital.com directly.
- Keep responses concise: 2-3 sentences max unless more detail is clearly needed.`;
}

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

    // track usage - fire and forget, never blocks the response
    const isNewConversation = claudeMessages.length === 1;
    logChatActivity(isNewConversation);

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: buildSystemPrompt(),
      messages: claudeMessages,
    });

    const assistantMessage = response.content[0].text;

    const latestUserMessage = claudeMessages[claudeMessages.length - 1];
    const userText = typeof latestUserMessage.content === "string"
      ? latestUserMessage.content
      : JSON.stringify(latestUserMessage.content);
    logConversationTranscript(userText, assistantMessage);

    // Submit to Netlify Forms (fire and forget, triggers email notifications)
    submitChatToNetlifyForms(userText);

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
