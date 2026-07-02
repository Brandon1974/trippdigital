const https = require('https');
const crypto = require('crypto');

function netlifyRequest(method, path, token, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: 'api.netlify.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', (c) => raw += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(raw));
        } else {
          reject(new Error(`Netlify API ${res.statusCode}: ${raw.slice(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function netlifyUploadFile(token, deployId, filePath, content) {
  return new Promise((resolve, reject) => {
    const buf = Buffer.from(content, 'utf8');
    const options = {
      hostname: 'api.netlify.com',
      path: `/api/v1/deploys/${deployId}/files${filePath}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/octet-stream',
        'Content-Length': buf.length
      }
    };

    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', (c) => raw += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(raw || '{}'));
        } else {
          reject(new Error(`File upload ${res.statusCode}: ${raw.slice(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.write(buf);
    req.end();
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const token = process.env.NETLIFY_AUTH_TOKEN;
  if (!token) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'NETLIFY_AUTH_TOKEN is not configured.' })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { html } = body;
  if (!html) {
    return { statusCode: 400, body: JSON.stringify({ error: 'html is required.' }) };
  }

  try {
    // 1. Create a new Netlify site
    const siteName = `tripp-sf-${Date.now()}`;
    const site = await netlifyRequest('POST', '/api/v1/sites', token, { name: siteName });

    // 2. Compute SHA1 of the HTML (Netlify uses SHA1 for file digests)
    const sha1 = crypto.createHash('sha1').update(html, 'utf8').digest('hex');

    // 3. Create a deploy with the file digest
    const deploy = await netlifyRequest(
      'POST',
      `/api/v1/sites/${site.id}/deploys`,
      token,
      { files: { '/index.html': sha1 } }
    );

    // 4. Upload the HTML file
    await netlifyUploadFile(token, deploy.id, '/index.html', html);

    const liveUrl = `https://${site.subdomain}.netlify.app`;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: liveUrl,
        siteId: site.id,
        deployId: deploy.id,
        subdomain: site.subdomain
      })
    };

  } catch (err) {
    console.error('Deploy error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message || 'Deploy failed' })
    };
  }
};
