const Anthropic = require("@anthropic-ai/sdk");
const { getStore } = require("@netlify/blobs");
const nodemailer = require("nodemailer");

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


async function getChatLogs() {
  try {
    const store = blobsStore("site-analytics");
    const now = new Date();
    const dayKey = `chatlog:${now.toISOString().slice(0, 10)}`;
    const chats = (await store.get(dayKey, { type: "json" })) || [];
    const totalMsgs = await store.get("chat-message-count");
    const convs = await store.get("chat-conversation-count");
    return {
      totalMessages: parseInt(totalMsgs, 10) || 0,
      totalConversations: parseInt(convs, 10) || 0,
      today: now.toISOString().slice(0, 10),
      todaysChats: chats,
    };
  } catch (err) {
    console.error("Failed to get chat logs:", err.message);
    return null;
  }
}

async function sendChatLogsEmail(chats, recipientEmail) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const chatList = chats.todaysChats
      .map((chat, i) => `${i + 1}. [${chat.time}]\n   Q: ${chat.question}\n   A: ${chat.answer}`)
      .join("\n\n");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: `Tripp Digital Chat Logs - ${chats.today}`,
      html: `
        <h2>Your Chat Activity for ${chats.today}</h2>
        <p><strong>Total Messages Today:</strong> ${chats.todaysChats.length}</p>
        <p><strong>Total Messages (All Time):</strong> ${chats.totalMessages}</p>
        <p><strong>Total Conversations:</strong> ${chats.totalConversations}</p>
        <hr>
        <h3>Today's Chats:</h3>
        ${chats.todaysChats.length === 0 ? "<p>No chats yet today.</p>" : `<pre>${chatList}</pre>`}
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error("Failed to send email:", err.message);
    return false;
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
- Keep responses concise: 2-3 sentences max unless more detail is clearly needed.

SPECIAL: If Brandon (the owner) asks you to show his chats, email chats, or check chat logs, let him know you can fetch that information for him and will provide a summary or email it to him.`;
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

    const latestUserMessage = claudeMessages[claudeMessages.length - 1];
    const userText = typeof latestUserMessage.content === "string"
      ? latestUserMessage.content
      : JSON.stringify(latestUserMessage.content);

    // Check if user is asking about their chats
    const chatKeywords = ["show my chats", "show chats", "email chats", "check my chats", "my chat logs", "chat logs"];
    const isAskingAboutChats = chatKeywords.some(keyword => userText.toLowerCase().includes(keyword));

    // Handle chat log requests
    if (isAskingAboutChats) {
      const chats = await getChatLogs();
      if (!chats) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: "Sorry, I couldn't retrieve your chat logs right now. Please try again in a moment.",
            stop_reason: "end_turn",
          }),
        };
      }

      // Check if they want it emailed
      const shouldEmail = userText.toLowerCase().includes("email");
      let message = `Here's your chat activity for ${chats.today}:\n\n`;
      message += `Total Messages Today: ${chats.todaysChats.length}\n`;
      message += `Total Messages (All Time): ${chats.totalMessages}\n`;
      message += `Total Conversations: ${chats.totalConversations}\n\n`;

      if (chats.todaysChats.length === 0) {
        message += "No chats logged yet today.";
      } else {
        message += "Today's Chats:\n";
        chats.todaysChats.forEach((chat, i) => {
          message += `\n${i + 1}. [${chat.time}]\nQ: ${chat.question}\nA: ${chat.answer}`;
        });
      }

      if (shouldEmail && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        const emailSent = await sendChatLogsEmail(chats, process.env.EMAIL_USER);
        if (emailSent) {
          message += `\n\nI've also emailed these chat logs to ${process.env.EMAIL_USER}`;
        }
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: message,
          stop_reason: "end_turn",
        }),
      };
    }

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
