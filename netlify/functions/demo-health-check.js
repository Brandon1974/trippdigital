const { schedule } = require('@netlify/functions');
const nodemailer = require('nodemailer');

// Every live Etsy demo + the real checkout link it should point to.
// Add a new entry here any time a new tool goes live on Etsy.
const WATCHED_DEMOS = [
  {
    name: 'Monthly Budget Planner',
    demoUrl: 'https://monthly-budget-planner-demo.netlify.app/',
    expectedLink: 'https://www.etsy.com/listing/4554795986/',
  },
  {
    name: 'Annual Budget Tracker',
    demoUrl: 'https://annual-budget-tracker-demo.netlify.app/',
    expectedLink: 'https://www.etsy.com/listing/4555130184/',
  },
  {
    name: 'Resale Business Planner',
    demoUrl: 'https://resale-business-planner-demo.netlify.app/',
    expectedLink: 'https://www.etsy.com/listing/4555154292/',
  },
  {
    name: 'Service Business CRM & Invoice Tracker',
    demoUrl: 'https://service-crm-invoice-tracker-demo.netlify.app/',
    expectedLink: 'https://www.etsy.com/listing/4555740422/',
  },
  {
    name: 'Reseller Profit Tracker',
    demoUrl: 'https://reseller-flip-profit-tracker-demo.netlify.app/',
    expectedLink: 'payhip.com/b/KR5Ai',
  },
  {
    name: 'Client Tracking Dashboard',
    demoUrl: 'https://trippdigital.com/client-tracking-dashboard.html',
    expectedLink: 'payhip.com/b/Nm184',
  },
];

// Phrases that mean the button is a dead placeholder, not a real link.
const PLACEHOLDER_SIGNS = [
  'would link to your etsy',
  'would link to your payhip',
];

async function checkDemo({ name, demoUrl, expectedLink }) {
  const issues = [];

  let res, html;
  try {
    res = await fetch(demoUrl, { redirect: 'follow' });
  } catch (err) {
    return { name, demoUrl, issues: [`Page failed to load at all (${err.message})`] };
  }

  if (!res.ok) {
    issues.push(`Page returned HTTP ${res.status} (should be 200)`);
    return { name, demoUrl, issues };
  }

  try {
    html = await res.text();
  } catch (err) {
    issues.push(`Could not read page content (${err.message})`);
    return { name, demoUrl, issues };
  }

  const lowerHtml = html.toLowerCase();

  // Check 1: is the placeholder fake-alert bug back?
  if (PLACEHOLDER_SIGNS.some((s) => lowerHtml.includes(s))) {
    issues.push('Upgrade button is a fake placeholder (shows an alert() instead of linking anywhere)');
  }

  // Check 2: does the real checkout link actually appear in the page?
  if (!lowerHtml.includes(expectedLink.toLowerCase())) {
    issues.push(`Expected checkout link (${expectedLink}) not found anywhere in the page — button may be pointing somewhere wrong`);
  }

  return { name, demoUrl, issues };
}

async function handlerImpl() {
  try {
    const results = await Promise.all(WATCHED_DEMOS.map(checkDemo));
    const broken = results.filter((r) => r.issues.length > 0);

    if (broken.length === 0) {
      return { statusCode: 200, body: `All ${WATCHED_DEMOS.length} demos checked OK.` };
    }

    const bodyLines = broken.map(
      (r) => `❌ ${r.name}\n   ${r.demoUrl}\n   ${r.issues.join('\n   ')}`
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: 'trippdigital1@gmail.com',
      subject: `⚠️ ${broken.length} of your Etsy demo${broken.length > 1 ? 's' : ''} may be broken`,
      text:
        `Daily demo health check found a problem with ${broken.length} of your ${WATCHED_DEMOS.length} live Etsy tool demos:\n\n` +
        bodyLines.join('\n\n') +
        `\n\nThis usually means someone can't buy from that demo right now. Tell Claude "check the demos" to have it verify and fix.`,
    });

    return { statusCode: 200, body: `Sent alert for ${broken.length} broken demo(s).` };
  } catch (err) {
    console.error('demo-health-check failed:', err.message);
    return { statusCode: 500, body: err.message };
  }
}

exports.handler = schedule('@daily', handlerImpl);
