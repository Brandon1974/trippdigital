exports.handler = async () => {
  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
  const hasNetlifyToken = !!process.env.NETLIFY_AUTH_TOKEN;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      configured: hasAnthropicKey && hasNetlifyToken,
      anthropic: hasAnthropicKey,
      netlify: hasNetlifyToken
    })
  };
};
