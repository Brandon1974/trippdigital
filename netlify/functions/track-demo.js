// track-demo.js
// Logs demo funnel events (open / interact / buy-click) per tool into Netlify Blobs.
// Same storage pattern as track-visit.js, kept in its own "demo-analytics" store
// so it doesn't mix with general site traffic.
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

const ALLOWED_EVENTS = ["open", "interact", "buy_click"];

exports.handler = async (event) => {
  try {
    const store = blobsStore("demo-analytics");

    const body = JSON.parse(event.body || "{}");
    const tool = (body.tool || "unknown-tool").slice(0, 80);
    const evt = ALLOWED_EVENTS.includes(body.event) ? body.event : "open";

    const now = new Date();
    const dayKey = now.toISOString().slice(0, 10); // YYYY-MM-DD

    // per-day per-tool per-event log (array of timestamps)
    const logKey = `log:${tool}:${evt}:${dayKey}`;
    const existing = (await store.get(logKey, { type: "json" })) || [];
    existing.push(now.toISOString());
    await store.setJSON(logKey, existing);

    // running all-time counter per tool per event
    const totalKey = `total:${tool}:${evt}`;
    const totalRaw = await store.get(totalKey);
    const total = (parseInt(totalRaw, 10) || 0) + 1;
    await store.set(totalKey, String(total));

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ ok: true, tool, event: evt, total }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ ok: false, error: err.message }),
    };
  }
};
