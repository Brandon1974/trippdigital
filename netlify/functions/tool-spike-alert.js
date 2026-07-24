const { schedule } = require('@netlify/functions');
const { getStore } = require('@netlify/blobs');
const nodemailer = require('nodemailer');

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

// Hosted tools to watch. Page paths must match what track-visit.js logs (window.location.pathname).
const WATCHED_TOOLS = {
  '/pickleball-tracker.html': 'Pickleball Score Tracker',
  '/budget-expense-tracker.html': 'Budget & Expense Tracker',
  '/garden-planner.html': 'Garden Planner',
  '/habit-goal-tracker.html': 'Habit & Goal Tracker',
  '/meal-prep-grocery-planner.html': 'Meal Prep & Grocery Planner',
  '/social-media-dashboard.html': 'Social Media Dashboard',
  '/client-tracking-dashboard.html': 'Client Tracking Dashboard',
  '/kdp-sales-dashboard.html': 'KDP Sales Dashboard',
  '/content-calendar.html': 'Content Calendar',
  '/invoice-generator.html': 'Invoice Generator',
  '/lead-crm-tracker.html': 'Lead & CRM Tracker',
  '/gig-driver-calculator.html': 'Gig Driver Profit Calculator',
  '/daycare-tracker.html': 'Daycare Enrollment & Billing Tracker',
  '/daycare-tracker/': 'Daycare Enrollment & Billing Tracker',
};

const MIN_VISITS_TO_FLAG = 6; // ignore noise on low-traffic days
const SPIKE_MULTIPLIER = 3; // today vs 7-day trailing average

async function handlerImpl() {
  try {
    const store = blobsStore('site-analytics');
    const now = new Date();

    // pull today + prior 7 days
    const days = [];
    for (let i = 0; i < 8; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayKey = d.toISOString().slice(0, 10);
      const log = (await store.get(`day:${dayKey}`, { type: 'json' })) || [];
      days.push({ date: dayKey, visits: log });
    }

    const today = days[0];
    const priorDays = days.slice(1);
    const alerts = [];

    for (const [path, label] of Object.entries(WATCHED_TOOLS)) {
      const todayCount = today.visits.filter((v) => v.page === path).length;
      if (todayCount < MIN_VISITS_TO_FLAG) continue;

      const priorCounts = priorDays.map(
        (d) => d.visits.filter((v) => v.page === path).length
      );
      const priorAvg =
        priorCounts.reduce((a, b) => a + b, 0) / (priorCounts.length || 1);

      if (priorAvg > 0 && todayCount >= priorAvg * SPIKE_MULTIPLIER) {
        alerts.push(
          `- ${label}: ${todayCount} visits today vs ~${priorAvg.toFixed(1)}/day average`
        );
      } else if (priorAvg === 0 && todayCount >= MIN_VISITS_TO_FLAG) {
        alerts.push(
          `- ${label}: ${todayCount} visits today, 0 average over the prior week (new traffic source?)`
        );
      }
    }

    if (alerts.length === 0) {
      return { statusCode: 200, body: 'No spikes detected.' };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: 'trippdigital1@gmail.com',
      subject: 'Unusual traffic spike on a Tripp Digital tool',
      text:
        `One or more of your hosted tools saw traffic well above normal today (${today.date}):\n\n` +
        alerts.join('\n') +
        `\n\nThis can mean a Pinterest pin took off, or it can mean a link got shared/reposted somewhere you didn't post it. ` +
        `Check trippdigital.com/stats.html for details. If you find out it's unauthorized sharing, just tell Claude "kill [tool name]" and that tool will be shut off remotely.`,
    });

    return { statusCode: 200, body: `Sent alert for ${alerts.length} tool(s).` };
  } catch (err) {
    console.error('tool-spike-alert failed:', err.message);
    return { statusCode: 500, body: err.message };
  }
}

exports.handler = schedule('@daily', handlerImpl);
