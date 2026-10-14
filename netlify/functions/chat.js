// Tripp Digital chat — on-board assistant.
//
// The reply engine is deterministic and runs entirely on-board: no external
// AI calls, no API key, no credits. It answers from the real product catalog
// (data/products.json) using intent matching, and can take a message for the
// team (lead capture by email) when a question falls outside what it knows.
//
// Contract used by chatbot.js (unchanged):
//   POST { messages: [{ role, content }, ...] }  ->  200 { message: string }
const { getStore } = require("@netlify/blobs");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const STORE_EMAIL = "trippdigital1@gmail.com";
const STORE_LINK = "https://payhip.com/Tinytripp";
const FACEBOOK_GROUP = "https://www.facebook.com/groups/1892482921392392";
// Marker sentence used by the fallback reply. The lead-capture logic watches
// for it in the conversation history to know the visitor was asked for an
// email address (so a follow-up email counts as an answer to that prompt).
const FALLBACK_MARKER = "pass a message to the team";

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
    const dateKey = now.toISOString().slice(0, 10);
    // Each message gets its own unique key instead of all messages for a day
    // sharing one array. The old approach read-modified-wrote a single shared
    // key, so two chats landing close together could silently clobber each
    // other's write. Unique per-message keys remove that race entirely.
    const uniqueKey = `chatlog:${dateKey}:${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`;

    await store.set(
      uniqueKey,
      JSON.stringify({
        time: now.toISOString(),
        question: userMessage.slice(0, 500),
        answer: assistantMessage.slice(0, 800),
      })
    );
  } catch (err) {
    console.error("Transcript logging failed:", err.message);
  }
}

async function submitChatToNetlifyForms(userMessage, assistantMessage) {
  try {
    // Submit chat exchange as a Netlify Form submission
    // This triggers Netlify's built-in form notifications (email on new submission)
    const formName = "chat-messages";
    const now = new Date();

    const formData = new URLSearchParams();
    formData.append("form-name", formName);
    formData.append("message", userMessage.slice(0, 500));
    formData.append("reply", (assistantMessage || "").slice(0, 800));
    formData.append("timestamp", now.toISOString());

    // Must use an absolute URL — serverless functions have no browser location to
    // resolve a relative path against, so a bare "/" silently fails every time.
    const siteUrl = process.env.URL || "https://trippdigital.com";

    const response = await fetch(siteUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    if (!response.ok) {
      console.error("Netlify Forms submission returned status:", response.status);
    } else {
      console.log("Chat message submitted to Netlify Forms");
    }
  } catch (err) {
    console.error("Netlify Forms submission failed:", err.message);
    // Don't block chat response if form submission fails
  }
}


async function getChatLogs() {
  try {
    const store = blobsStore("site-analytics");
    const now = new Date();
    const dateKey = now.toISOString().slice(0, 10);
    const prefix = `chatlog:${dateKey}:`;

    const { blobs } = await store.list({ prefix });
    const chats = [];
    for (const b of blobs) {
      const entry = await store.get(b.key, { type: "json" });
      if (entry) chats.push(entry);
    }
    chats.sort((a, b) => new Date(a.time) - new Date(b.time));

    const totalMsgs = await store.get("chat-message-count");
    const convs = await store.get("chat-conversation-count");
    return {
      totalMessages: parseInt(totalMsgs, 10) || 0,
      totalConversations: parseInt(convs, 10) || 0,
      today: dateKey,
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

// Lead capture: email the owner the full transcript when a visitor leaves an
// email address. Uses the same Gmail/nodemailer setup as the chat-log email.
async function sendLeadEmail(visitorEmail, messages) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error("Lead email skipped: EMAIL_USER/EMAIL_PASSWORD not set");
      return false;
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const transcript = messages
      .map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content}`)
      .join("\n\n");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: visitorEmail,
      subject: `New chat lead from trippdigital.com — ${visitorEmail}`,
      text:
        `A visitor left a message in the Tripp Digital website chat.\n\n` +
        `Visitor email: ${visitorEmail}\n\n` +
        `--- Conversation ---\n${transcript}`,
    });
    return true;
  } catch (err) {
    console.error("Lead email failed:", err.message);
    return false;
  }
}

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

// ---------------------------------------------------------------------------
// Deterministic intent engine
// ---------------------------------------------------------------------------

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s$&.+-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fullUrl(link) {
  if (!link) return STORE_LINK;
  if (/^https?:\/\//i.test(link)) return link;
  return "https://" + link;
}

function isFree(product) {
  return String(product.price).toLowerCase() === "free";
}

const NAME_STOPWORDS = new Set(["the", "a", "an", "and", "or", "of", "to", "for", "with"]);

function nameWords(name) {
  return normalize(name)
    .split(" ")
    .filter((w) => w.length >= 2 && !NAME_STOPWORDS.has(w));
}

// Ordered, most specific first. Target = substring of a product name.
const ALIASES = [
  ["truck dispatcher", "Work From Home Truck Dispatcher"],
  ["dispatcher", "Work From Home Truck Dispatcher"],
  ["dispatch", "Work From Home Truck Dispatcher"],
  ["trucking", "Work From Home Truck Dispatcher"],
  ["gig driver", "Is It Worth It"],
  ["worth it", "Is It Worth It"],
  ["uber", "Is It Worth It"],
  ["doordash", "Is It Worth It"],
  ["instacart", "Is It Worth It"],
  ["grubhub", "Is It Worth It"],
  ["amazon flex", "Is It Worth It"],
  ["pickleball", "Pickleball Score Tracker"],
  ["reseller", "Reseller Flip Profit Tracker"],
  ["thrift", "Reseller Flip Profit Tracker"],
  ["flip tracker", "Reseller Flip Profit Tracker"],
  ["rental", "Rental & Property Tracker"],
  ["landlord", "Rental & Property Tracker"],
  ["property tracker", "Rental & Property Tracker"],
  ["crm", "Lead & CRM Tracker"],
  ["lead tracker", "Lead & CRM Tracker"],
  ["invoice", "Invoice Generator"],
  ["daycare", "Daycare Enrollment"],
  ["garden planner", "Garden Planner"],
  ["planting", "Garden Planner"],
  ["budget", "Budget & Expense Tracker"],
  ["expense tracker", "Budget & Expense Tracker"],
  ["kdp", "KDP Sales Dashboard"],
  ["royalties", "KDP Sales Dashboard"],
  ["content calendar", "Content Calendar"],
  ["habit", "Habit & Goal Tracker"],
  ["goal tracker", "Habit & Goal Tracker"],
  ["meal prep", "Meal Prep & Grocery Planner"],
  ["grocery planner", "Meal Prep & Grocery Planner"],
  ["social media dashboard", "Social Media Dashboard"],
  ["social media", "Social Media Dashboard"],
  ["client tracking", "Client Tracking Dashboard"],
  ["prompt vault", "AI Prompt Vault"],
  ["prompts", "AI Prompt Vault"],
  ["movie maker", "iPhone Movie Maker"],
  ["iphone movie", "iPhone Movie Maker"],
  ["collard", "Collard Greens Mastery"],
  ["sweet potato", "Sweet Potato Harvest"],
  ["dragonfly", "Dragonfly Garden Blueprint"],
  ["snake eyes", "Bones: Snake Eyes"],
  ["bones", "Bones: Snake Eyes"],
  ["maya", "Maya: Lost & Found"],
  ["magnet", "Magnet Puzzles"],
  ["puzzle", "Magnet Puzzles"],
  ["30 an hour", "$30 An Hour From Home"],
  ["work from home", "$30 An Hour From Home"],
  ["facebook", "5 Ways to Make Money on Facebook"],
  ["instagram", "5 Ways to Make Money on Instagram"],
];

function matchProduct(text, products) {
  if (!products || !text) return null;
  const padded = " " + normalize(text) + " ";

  // Exact full-name mention wins outright.
  for (const p of products) {
    if (padded.includes(" " + normalize(p.name) + " ")) return p;
  }

  // Alias pass (specific shorthands visitors actually type).
  for (const [alias, target] of ALIASES) {
    if (padded.includes(" " + alias + " ")) {
      const hit = products.find((p) => p.name.toLowerCase().includes(target.toLowerCase()));
      if (hit) return hit;
    }
  }

  // Name-word overlap scoring. A single matching word only counts when it is
  // distinctive (appears in exactly one product name), so generic words like
  // "tracker" or "dashboard" never produce a wrong match on their own.
  const wordFreq = {};
  for (const p of products) {
    for (const w of new Set(nameWords(p.name))) {
      wordFreq[w] = (wordFreq[w] || 0) + 1;
    }
  }

  let best = null;
  let bestScore = 0;
  let bestCount = 0;
  for (const p of products) {
    let score = 0;
    for (const w of nameWords(p.name)) {
      if (padded.includes(" " + w + " ")) score++;
    }
    if (score > bestScore) {
      best = p;
      bestScore = score;
      bestCount = 1;
    } else if (score === bestScore && score > 0) {
      bestCount++;
    }
  }

  if (bestScore >= 2) return best;
  if (bestScore === 1 && bestCount === 1) {
    const onlyWord = nameWords(best.name).find((w) => padded.includes(" " + w + " "));
    if (onlyWord && wordFreq[onlyWord] === 1) return best;
  }
  return null;
}

function describeProduct(p) {
  const link = fullUrl(p.link);
  if (isFree(p)) {
    return `${p.name} is free. ${p.description} Get it here: ${link}`;
  }
  if (String(p.price).toLowerCase() === "varies") {
    return `${p.name} — pricing varies by option, so check the listing for the current price. ${p.description} Details here: ${link}`;
  }
  const trial = p.free_trial ? " It has a free trial too, so you can try it before you buy." : "";
  return `${p.name} is ${p.price}. ${p.description} Get it here: ${link}${trial}`;
}

function formatAnswer(p) {
  if (!p) {
    return "Our tools are live web apps, not PDFs — each one is a single HTML file that opens right in your browser, with nothing to install. A few of our how-to guides are delivered as PDFs, and the books are on Amazon.";
  }
  if (p.type === "tool") {
    return `The ${p.name} is a live web app, not a PDF. It's a single HTML file that opens in any web browser — no install, no account, no subscription. It's ${isFree(p) ? "free" : p.price} here: ${fullUrl(p.link)}`;
  }
  if (p.type === "guide") {
    return `The ${p.name} is a step-by-step guide delivered as a PDF — instant download after checkout. (Our software tools are the live web apps; the guides are the PDFs.) It's ${isFree(p) ? "free" : p.price} here: ${fullUrl(p.link)}`;
  }
  return `${p.name} is a book by Brandon Tripp, available on Amazon here: ${fullUrl(p.link)}`;
}

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;

async function buildReply(latestText, messages, products) {
  const raw = String(latestText || "");
  const text = normalize(raw);
  const padded = " " + text + " ";
  const has = (...phrases) => phrases.some((ph) => padded.includes(" " + ph) || text.includes(ph));

  // --- Lead capture -------------------------------------------------------
  // An email in the latest message always captures. An email that only
  // appears earlier in the conversation captures when the visitor's latest
  // message follows our fallback prompt (they are answering it).
  let leadEmail = (raw.match(EMAIL_RE) || [null])[0];
  if (!leadEmail) {
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    if (lastAssistant && lastAssistant.content.includes(FALLBACK_MARKER)) {
      for (const m of messages) {
        const e = m.content.match(EMAIL_RE);
        if (e) {
          leadEmail = e[0];
          break;
        }
      }
    }
  }
  if (leadEmail) {
    const sent = await sendLeadEmail(leadEmail, messages);
    if (sent) {
      return "Thanks — I've sent your message to the Tripp Digital team, and they'll reply to the email address you gave us. Anything else I can help with in the meantime?";
    }
    return `Thanks for the details. I couldn't send that message just now, so please email the team directly at ${STORE_EMAIL} — they'll take it from there.`;
  }

  // --- Owner chat-log requests (owner tooling, kept from the old build) ---
  if (has("show my chats", "show chats", "email chats", "check my chats", "my chat logs", "chat logs")) {
    const chats = await getChatLogs();
    if (!chats) {
      return `I can't pull the chat logs right now. Brandon can see chat activity in the site's admin dashboard, or the team can help at ${STORE_EMAIL}.`;
    }
    const wantsOld = has("old", "previous", "earlier", "last week", "last month", "history");
    if (wantsOld) {
      return `I appreciate you asking, but I only have access to today's chat history. For a complete record, reach out to Brandon directly at ${STORE_EMAIL} — he can pull that for you. I can show you today's chats if you'd like!`;
    }
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
    if (text.includes("email") && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      const emailSent = await sendChatLogsEmail(chats, process.env.EMAIL_USER);
      if (emailSent) {
        message += `\n\nI've also emailed these chat logs to ${process.env.EMAIL_USER}`;
      }
    }
    return message;
  }

  // --- Greeting ------------------------------------------------------------
  if (
    text.length <= 40 &&
    /^(hi|hello|hey|yo|sup|good morning|good afternoon|good evening|howdy|hiya)\b/.test(text)
  ) {
    return "Hi there! I'm the Tripp Digital assistant. I can point you to products, prices, free items, or explain how delivery works — what are you looking for?";
  }

  // --- Identity ------------------------------------------------------------
  if (
    has("who are you", "what are you", "are you a robot", "are you a bot", "are you ai", "are you an ai", "are you human", "are you a real person", "your name")
  ) {
    return "I'm the automated assistant for Tripp Digital, Brandon Tripp's store — a built-in helper, not a person. I can answer product and price questions, or take a message for the team if you'd rather deal with a human.";
  }

  // --- Catalog / what do you sell ------------------------------------------
  if (
    has(
      "what do you sell", "what do you offer", "what do you have", "what are you selling",
      "your products", "show me products", "show me your products", "catalog",
      "what is this site", "what is tripp digital", "what does tripp digital do",
      "what kind of products", "what products"
    )
  ) {
    if (!products) {
      return `We sell live web app tools, step-by-step guides, and books — all instant download. The catalog is having a hiccup on my end, so browse the full shelf here: ${STORE_LINK} — or email us at ${STORE_EMAIL}.`;
    }
    const paidTools = products.filter((p) => p.type === "tool" && !isFree(p) && String(p.price).toLowerCase() !== "varies");
    const examples = paidTools.slice(0, 3).map((p) => `${p.name} (${p.price})`).join(", ");
    const freeExample = products.find((p) => isFree(p));
    const freeBit = freeExample ? ` There are free items too, like the ${freeExample.name}.` : "";
    return `We sell live web app tools, step-by-step guides, and books — all instant download, no subscriptions. Popular tools include ${examples}.${freeBit} Browse the full shelf here: ${STORE_LINK}`;
  }

  // --- Discounts (never invent a code) --------------------------------------
  if (has("discount", "coupon", "promo code", "promo", "sale price", "on sale", "deal", "% off", "percent off", "cheaper", "promo codes")) {
    return `I don't have any coupon codes to give out, and I won't invent one. Current deals and sale prices show right on the product listings, so check the store for what's live today: ${STORE_LINK}`;
  }

  // --- Refunds / contact ------------------------------------------------------
  if (has("refund", "money back", "return policy", "chargeback", "get my money")) {
    return `For refunds or order help, email the team at ${STORE_EMAIL} and we'll take care of you. You can also reach us in our Facebook community: ${FACEBOOK_GROUP}`;
  }
  if (
    has("talk to a human", "real person", "speak to someone", "contact you", "contact info", "how do i contact", "your email", "email address", "phone number", "call you", "get in touch", "customer service", "support")
  ) {
    return `You can reach the team any time at ${STORE_EMAIL}, or in our Facebook community: ${FACEBOOK_GROUP}. If you'd rather, type your question and your email address right here and I'll ${FALLBACK_MARKER} for you.`;
  }

  // --- Product match (price + product questions) -----------------------------
  const product = matchProduct(raw, products);

  // Format question about a specific product ("is it a PDF?")
  if (has("pdf", "format", "spreadsheet", "excel", "google sheets", "is it a file", "what format")) {
    return formatAnswer(product);
  }

  if (product) {
    // Delivery question about a specific product gets the product answer
    // plus the delivery facts, kept short.
    if (has("deliver", "delivery", "download", "how do i get", "after i buy", "install", "ship")) {
      return `${describeProduct(product)} Delivery is instant download after checkout — it's a single HTML file that opens in any browser, no install or account needed.`;
    }
    return describeProduct(product);
  }

  // --- Generic price question with no product named -------------------------
  if (has("how much", "price", "prices", "cost", "pricing")) {
    if (!products) {
      return `Prices are listed on every product page — browse the shelf here: ${STORE_LINK}. Or tell me the product name and I'll look it up.`;
    }
    const examples = products
      .filter((p) => !isFree(p) && String(p.price).toLowerCase() !== "varies")
      .slice(0, 3)
      .map((p) => `${p.name} (${p.price})`)
      .join(", ");
    return `Prices vary by product — for example: ${examples}. Tell me a product name and I'll give you its exact price, or browse everything here: ${STORE_LINK}`;
  }

  // --- How it works / delivery ------------------------------------------------
  if (
    has(
      "how does it work", "how do your products work", "how do i get it", "how do i get my",
      "delivery", "delivered", "download", "after i buy", "after checkout", "install",
      "do i need an account", "subscription", "sign up", "shipping", "ship it", "app store"
    )
  ) {
    return "Everything is instant download — right after checkout you get the file, no waiting and no shipping. The tools are single HTML files: save the file, open it in any web browser, and it just works — no account, no install, and no subscription.";
  }

  // --- Free items ---------------------------------------------------------------
  if (has("free")) {
    if (!products) {
      return `Yes — we have free items on the shelf here: ${STORE_LINK}. Look for the ones marked Free to get started at no cost.`;
    }
    const freeItems = products.filter((p) => isFree(p));
    const trialItems = products.filter((p) => p.free_trial && !isFree(p));
    const freeList = freeItems.slice(0, 4).map((p) => `${p.name} (${fullUrl(p.link)})`).join(", ");
    const trialBit = trialItems.length
      ? ` A few paid tools have free trials too, like the ${trialItems[0].name}.`
      : "";
    return `Yes — free starters include: ${freeList}.${trialBit} Full shelf: ${STORE_LINK}`;
  }

  // --- Website services / custom tool / affiliate --------------------------------
  if (
    has(
      "website", "web design", "build my website", "build me a website", "need a website",
      "custom tool", "build my tool", "build me a tool", "affiliate", "commission",
      "partner program", "become a partner", "my audience", "my niche", "sell your products", "promote your"
    )
  ) {
    return `Besides the products, Tripp Digital builds websites: Starter at $97/month, Business at $197/month, and Premium at $297/month. And if you have your own audience, we can build a free custom tool for your niche and set you up as an affiliate — start here: https://trippdigital.com/build-my-tool.html or email ${STORE_EMAIL}.`;
  }

  // --- Location ---------------------------------------------------------------------
  if (has("where are you located", "where are you based", "where is tripp digital", "located", "your location", "physical store", "storefront")) {
    return `We're an online store based in Virginia Beach, Virginia. Everything is delivered digitally by instant download, so there's no storefront to visit — the shop is right here and at ${STORE_LINK}.`;
  }

  // --- How to buy ----------------------------------------------------------------------
  if (has("how do i buy", "how to buy", "where do i buy", "checkout", "purchase", "place an order", "how do i order")) {
    return `Easy — find the product you want in the store, check out, and your download is available instantly: ${STORE_LINK}. Tell me a product name and I'll get you its exact link.`;
  }

  // --- Thanks ---------------------------------------------------------------------------
  if (/^(thanks|thank you|thank u|thx|great|awesome|perfect|cool|ok thanks)\b/.test(text)) {
    return `You're welcome! If you need a price or a product link, just ask — or browse the full shelf at ${STORE_LINK}.`;
  }

  // --- Fallback: offer to take a message --------------------------------------------------
  return `I want to make sure you get a real answer. I can help with products, prices, free items, and how delivery works — or I can ${FALLBACK_MARKER}. Just type your question and your email address, and I'll send it straight to them.`;
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { messages } = JSON.parse(event.body || "{}");

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Messages array required" }),
      };
    }

    // Keep only well-formed entries; remember the full history for context
    // (lead capture + transcripts) and find the latest visitor message.
    const cleanMessages = messages
      .filter((m) => m && typeof m.content === "string")
      .map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      }));

    const latestUser = [...cleanMessages].reverse().find((m) => m.role === "user");
    const userText = latestUser ? latestUser.content : "";

    // track usage - must complete before the function returns, or Netlify
    // freezes the container and kills these in-flight writes
    const isNewConversation = cleanMessages.filter((m) => m.role === "user").length <= 1;
    await logChatActivity(isNewConversation);

    const products = loadProducts();
    const assistantMessage = await buildReply(userText, cleanMessages, products);

    // Await both so the blob write + form submission finish before the
    // function returns (Netlify Functions freeze execution immediately
    // after the response is sent, killing any un-awaited async work).
    await Promise.all([
      logConversationTranscript(userText, assistantMessage),
      submitChatToNetlifyForms(userText, assistantMessage),
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: assistantMessage,
        stop_reason: "end_turn",
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
