// get-stats.js
// Returns aggregate visit stats. No passcode - open access.
const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  try {
    const store = getStore("site-analytics");

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

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        total,
        last14Days: days.map((d) => ({ date: d.date, count: d.count })),
        topPages: pageCounts,
        topReferrers: refCounts,
        deviceCounts,
      }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
