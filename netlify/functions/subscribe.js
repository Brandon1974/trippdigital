const { getStore } = require('@netlify/blobs');

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

    list.push({ email: clean, source: source || 'newsletter', date: new Date().toISOString() });
    await store.set('list', JSON.stringify(list));

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
