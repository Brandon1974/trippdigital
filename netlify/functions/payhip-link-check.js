const { schedule } = require('@netlify/functions');
const nodemailer = require('nodemailer');

// Pages to scan for payhip.com links. Add more if new pages get Payhip buttons.
const PAGES_TO_SCAN = [
  'https://trippdigital.com/',
  'https://trippdigital.com/budget-expense-tracker.html',
  'https://trippdigital.com/client-tracking-dashboard.html',
];

const LINK_PATTERN = /https:\/\/payhip\.com\/b\/[A-Za-z0-9]+/g;

async function extractLinksFromPage(pageUrl) {
  try {
    const res = await fetch(pageUrl);
    if (!res.ok) return { pageUrl, links: [], pageError: `Page itself returned HTTP ${res.status}` };
    const html = await res.text();
    const found = [...new Set(html.match(LINK_PATTERN) || [])];
    return { pageUrl, links: found };
  } catch (err) {
    return { pageUrl, links: [], pageError: err.message };
  }
}

async function checkLink(url) {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) return { url, ok: false, status: res.status };
    return { url, ok: true, status: res.status };
  } catch (err) {
    return { url, ok: false, status: null, error: err.message };
  }
}

async function handlerImpl() {
  try {
    const pageResults = await Promise.all(PAGES_TO_SCAN.map(extractLinksFromPage));

    const pageErrors = pageResults.filter((p) => p.pageError);
    const allLinks = [...new Set(pageResults.flatMap((p) => p.links))];

    const linkChecks = await Promise.all(allLinks.map(checkLink));
    const brokenLinks = linkChecks.filter((l) => !l.ok);

    if (brokenLinks.length === 0 && pageErrors.length === 0) {
      return { statusCode: 200, body: `Checked ${allLinks.length} Payhip links across ${PAGES_TO_SCAN.length} pages. All OK.` };
    }

    const lines = [];
    if (pageErrors.length) {
      lines.push('Pages that failed to load:');
      pageErrors.forEach((p) => lines.push(`- ${p.pageUrl}: ${p.pageError}`));
      lines.push('');
    }
    if (brokenLinks.length) {
      lines.push('Broken Payhip links found:');
      brokenLinks.forEach((l) =>
        lines.push(`- ${l.url} — ${l.status ? `HTTP ${l.status}` : l.error}`)
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'trippdigital1@gmail.com',
      subject: `⚠️ ${brokenLinks.length || 'Some'} Payhip link(s) may be broken on trippdigital.com`,
      text:
        `Daily Payhip link check found a problem:\n\n` +
        lines.join('\n') +
        `\n\nThis usually means a product was deleted/unpublished on Payhip and the site still links to the old URL. Tell Claude "check the Payhip links" to fix it.`,
    });

    return { statusCode: 200, body: `Sent alert: ${brokenLinks.length} broken link(s), ${pageErrors.length} page error(s).` };
  } catch (err) {
    console.error('payhip-link-check failed:', err.message);
    return { statusCode: 500, body: err.message };
  }
}

// Runs once a day at 9am UTC (roughly 5am ET)
exports.handler = schedule('0 9 * * *', handlerImpl);
