// track-visit.js
// Logs one visit per call into Netlify Blobs. No cookies, no personal data stored.
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

    const body = JSON.parse(event.body || "{}");
    const page = (body.page || "/").slice(0, 200);
    const referrer = (body.referrer || "direct").slice(0, 200);
    const ua = (event.headers["user-agent"] || "unknown").slice(0, 200);

    const device = /Mobile|Android|iPhone/i.test(ua) ? "mobile" : "desktop";

    const now = new Date();
    const dayKey = now.toISOString().slice(0, 10); // YYYY-MM-DD

    // pull today's log (array of visit records), append, save back
    const existing = await store.get(`day:${dayKey}`, { type: "json" }) || [];
    existing.push({
      t: now.toISOString(),
      page,
      referrer,
      device,
    });
    await store.setJSON(`day:${dayKey}`, existing);

    // bump running total counter
    const totalRaw = await store.get("total-count");
    const total = (parseInt(totalRaw, 10) || 0) + 1;
    await store.set("total-count", String(total));

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err.message }),
    };
  }
};
