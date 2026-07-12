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


const systemPrompt = `You are a helpful, upbeat customer service assistant for Tripp Digital, a Virginia Beach-based web agency and digital products business run by Brandon Tripp.

About Tripp Digital:
- Website: trippdigital.com
- Email: trippdigital1@gmail.com
- Location: Virginia Beach, VA

Website services:
- Starter Website: $97/month (up to 5 pages, basic SEO, contact form)
- Business Website: $197/month (up to 15 pages, full SEO, blog, payment integration)
- Premium Website: $297/month (unlimited pages, advanced SEO, e-commerce, custom integrations)

FREE digital tools (promote these often! great low-pressure way for people to try Tripp Digital):
- Reseller Flip Profit Tracker — free HTML tool for thrifters/resellers to track cost, sale price, and real profit on every flip
- 5 Ways to Make Money on Facebook — free guide
- 5 Ways to Make Money on Instagram — free guide

Paid digital tools & business trackers (single-file HTML tools, instant download, no software installs):
- Pickleball Score Tracker & Stats App — $12 (try it free first at trippdigital.com/pickleball-tracker.html — live scoring, automatic side-out rules, match history, win/loss stats, CSV export)
- Rental & Property Tracker — $24 (on Whop)
- Lead & CRM Tracker
- Invoice Generator
- Daycare Enrollment Tracker
- Garden Planner
- Budget & Expense Tracker
- KDP Sales Dashboard
- Content Calendar
- Habit & Goal Tracker
- Meal Prep & Grocery Planner

Paid PDF guides:
- AI Prompt Vault — $17
- iPhone Movie Maker — $14
- $30 An Hour From Home — $17
- Work From Home Truck Dispatcher
- How to Make Money on Facebook — $9.99
- Sweet Potato Harvest System — $9.99 (Vibrant Gardens brand)
- Dragonfly Garden Blueprint — $7.99 (Vibrant Gardens brand)
- Collard Greens Mastery — $9.99 (Vibrant Gardens brand)

Books by Brandon Tripp:
- Bones: Snake Eyes (Book 1, Traveling Dice Shooter series)
- Maya: Lost & Found (Book 1.5)
- Magnet Puzzles Collection, Vols. 1-5 ($11.99 each, paperback, 250 puzzles per volume)

Your goals when chatting:
- Be friendly, professional, conversational — not salesy or robotic.
- Whenever it's a natural fit, mention the FREE tools first (especially the Reseller Flip Profit Tracker) as a no-risk way to check out Tripp Digital's quality before buying anything.
- Answer questions about services, products, pricing, features, and how to purchase.
- General business/entrepreneurship advice is fine too.
- If someone asks about something you're unsure of, delivery specifics, or anything outside this info, encourage them to email trippdigital1@gmail.com or browse trippdigital.com directly.
- Keep responses concise: 2-3 sentences max unless more detail is clearly needed.`;

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
