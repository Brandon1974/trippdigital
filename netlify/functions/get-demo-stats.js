// get-demo-stats.js
// Returns demo funnel totals (opens / interactions / buy-clicks) per tool.
// Open access, no passcode - mirrors get-stats.js style.
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

// Known tools - extend this list as you add more demos.
const TOOLS = [
  "invoice-estimate-generator",
  "client-tracking-dashboard",
  "reseller-flip-profit-tracker",
  "budget-expense-tracker",
  "gig-driver-calculator",
  "pickleball-tracker",
];

const EVENTS = ["open", "interact", "buy_click"];

exports.handler = async () => {
  try {
    const store = blobsStore("demo-analytics");

    const results = {};
    for (const tool of TOOLS) {
      results[tool] = {};
      for (const evt of EVENTS) {
        const raw = await store.get(`total:${tool}:${evt}`);
        results[tool][evt] = parseInt(raw, 10) || 0;
      }
      const opens = results[tool].open || 0;
      const buys = results[tool].buy_click || 0;
      results[tool].conversionRate = opens > 0 ? ((buys / opens) * 100).toFixed(1) : "0.0";
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ ok: true, tools: results }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ ok: false, error: err.message }),
    };
  }
};
