(function () {
  var slug = document.currentScript.getAttribute("data-app");
  if (!slug) return;

  fetch("/data/app-status.json?_=" + Date.now())
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (data[slug] === false) {
        document.documentElement.innerHTML =
          '<div style="display:flex;align-items:center;justify-content:center;' +
          'height:100vh;background:#0D0D0D;color:#fff;font-family:system-ui,sans-serif;' +
          'text-align:center;padding:24px;">' +
          '<div>' +
          '<h1 style="font-size:24px;margin-bottom:12px;">This tool is no longer available</h1>' +
          '<p style="color:#ccc;margin-bottom:20px;">Please contact us at trippdigital.com for more information.</p>' +
          '<a href="https://trippdigital.com" style="background:#FF6B00;color:#fff;padding:10px 20px;' +
          'border-radius:6px;text-decoration:none;font-weight:bold;">Go to trippdigital.com</a>' +
          "</div></div>";
      }
    })
    .catch(function () {
      // If the status check fails (offline, etc.), fail open — don't lock out real users.
    });
})();
