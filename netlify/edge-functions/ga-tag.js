// Injects the Google Analytics (gtag.js) tag for trippdigital.com into every
// HTML response. Measurement ID: G-WSN9YS0YEJ (property "Tripp Digital",
// owned by trippdigital1@gmail.com). Non-HTML responses pass through untouched.
const GA_ID = "G-WSN9YS0YEJ";
const SNIPPET = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_ID}');
</script>`;

export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }
  const html = await response.text();
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  if (html.includes(GA_ID)) {
    return new Response(html, { status: response.status, headers });
  }
  let out;
  const headClose = html.search(/<\/head\s*>/i);
  if (headClose >= 0) {
    out = html.slice(0, headClose) + SNIPPET + "\n" + html.slice(headClose);
  } else {
    const bodyClose = html.search(/<\/body\s*>/i);
    if (bodyClose >= 0) {
      out = html.slice(0, bodyClose) + SNIPPET + "\n" + html.slice(bodyClose);
    } else {
      out = SNIPPET + "\n" + html;
    }
  }
  return new Response(out, { status: response.status, headers });
};
