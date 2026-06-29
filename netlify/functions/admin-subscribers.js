const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  const secret = process.env.ADMIN_PASSWORD || 'admin123';
  const provided = event.queryStringParameters?.secret || event.headers['x-admin-secret'];
  if (provided !== secret) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    const store = getStore('subscribers');
    const raw = await store.get('list');
    const list = raw ? JSON.parse(raw) : [];
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ count: list.length, subscribers: list }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
