const { getStore } = require("@netlify/blobs");

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

exports.handler = async (event, context) => {
  try {
    const store = blobsStore("site-analytics");

    // Get all chat logs for today
    const now = new Date();
    const dayKey = `chatlog:${now.toISOString().slice(0, 10)}`;

    const chats = (await store.get(dayKey, { type: "json" })) || [];

    // Get analytics
    const totalMsgs = await store.get("chat-message-count");
    const convs = await store.get("chat-conversation-count");

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        totalMessages: parseInt(totalMsgs, 10) || 0,
        totalConversations: parseInt(convs, 10) || 0,
        today: now.toISOString().slice(0, 10),
        todaysChats: chats,
      }),
    };
  } catch (error) {
    console.error("Error retrieving chats:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
