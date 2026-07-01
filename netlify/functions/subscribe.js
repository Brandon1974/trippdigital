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

    const clean = email.toLowerCase().trim();
    const timestamp = new Date().toISOString();

    // Store in Netlify Blobs — wrapped so a storage failure never surfaces as a user error
    let alreadySubscribed = false;
    try {
      const store = getStore('subscribers');
      let list = [];
      const raw = await store.get('list');
      if (raw) list = JSON.parse(raw);

      if (list.some(s => s.email === clean)) {
        alreadySubscribed = true;
      } else {
        list.push({ email: clean, source: source || 'newsletter', date: timestamp });
        await store.set('list', JSON.stringify(list));
      }
    } catch (blobsErr) {
      console.error('Blobs storage unavailable — email captured via notification only:', blobsErr.message);
    }

    if (alreadySubscribed) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: "You're already on the list!" }),
      };
    }

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
        console.error('Notification email failed:', mailErr.message);
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
