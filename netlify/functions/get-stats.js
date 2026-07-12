// get-stats.js
// Returns aggregate visit stats. No passcode - open access.
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

exports.handler = async (event) => {
  try {
    const store = blobsStore("site-analytics");

    const totalRaw = await store.get("total-count");
    const total = parseInt(totalRaw, 10) || 0;

    // pull last 14 days of daily logs
    const days = [];
    const now = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayKey = d.toISOString().slice(0, 10);
      const log = await store.get(`day:${dayKey}`, { type: "json" }) || [];
      days.push({ date: dayKey, count: log.length, visits: log });
    }

    // aggregate top pages and referrers across the pulled window
    const pageCounts = {};
    const refCounts = {};
    const deviceCounts = { mobile: 0, desktop: 0 };
    days.forEach((d) => {
      d.visits.forEach((v) => {
        pageCounts[v.page] = (pageCounts[v.page] || 0) + 1;
        refCounts[v.referrer] = (refCounts[v.referrer] || 0) + 1;
        deviceCounts[v.device] = (deviceCounts[v.device] || 0) + 1;
      });
    });

    // chat usage stats
    const chatMsgTotalRaw = await store.get("chat-message-count");
    const chatMsgTotal = parseInt(chatMsgTotalRaw, 10) || 0;
    const chatConvTotalRaw = await store.get("chat-conversation-count");
    const chatConvTotal = parseInt(chatConvTotalRaw, 10) || 0;

    const chatDays = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayKey = d.toISOString().slice(0, 10);
      const count = await store.get(`chatday:${dayKey}`);
      chatDays.push({ date: dayKey, count: parseInt(count, 10) || 0 });
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        total,
        last14Days: days.map((d) => ({ date: d.date, count: d.count })),
        topPages: pageCounts,
        topReferrers: refCounts,
        deviceCounts,
        chatMessageTotal: chatMsgTotal,
        chatConversationTotal: chatConvTotal,
        chatLast14Days: chatDays,
      }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
