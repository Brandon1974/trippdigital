const { getStore } = require('@netlify/blobs');
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { email, source } = JSON.parse(event.body || '{}');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Valid email address required' }),
      };
    }

    const store = getStore('subscribers');

    let list = [];
    try {
      const raw = await store.get('list');
      if (raw) list = JSON.parse(raw);
    } catch (_) {}

    const clean = email.toLowerCase().trim();
    if (list.some(s => s.email === clean)) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: "You're already on the list!" }),
      };
    }

    const timestamp = new Date().toISOString();
    list.push({ email: clean, source: source || 'newsletter', date: timestamp });
    await store.set('list', JSON.stringify(list));

    // Notify owner — non-blocking so a mail failure never breaks the user response
    if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        });
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: 'trippdigital1@gmail.com',
          subject: 'New Lead — Tripp Digital',
          text: `New email captured: ${clean}\nTime: ${timestamp}\nSource: trippdigital.com`,
        });
      } catch (mailErr) {
        console.error('Notification email failed:', mailErr);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: "You're in! Welcome to the Tripp Digital community." }),
    };
  } catch (error) {
    console.error('Subscribe error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Something went wrong. Please try again.' }),
    };
  }
};
