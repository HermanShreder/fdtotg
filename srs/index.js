const PIXEL_ID = "2127136807835684";
const TELEGRAM_URL = "https://t.me/workfortou";

const HTML = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

  <title>Mila Noir | Telegram</title>

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        Helvetica,
        Arial,
        sans-serif;
    }

    body {
      background: #f4f4f5;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      color: #000;
    }

    .tg-card {
      background: #fff;
      max-width: 400px;
      width: 90%;
      border-radius: 12px;
      padding: 40px 24px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0,0,0,.08);
    }

    .tg-avatar {
      width: 80px;
      height: 80px;
      background: #3390ec;
      border-radius: 50%;
      margin: 0 auto 20px;

      display: flex;
      align-items: center;
      justify-content: center;
    }

    .tg-title {
      font-size: 22px;
      font-weight: 600;
      margin-bottom: 10px;
      color: #000;
    }

    .tg-desc {
      font-size: 15px;
      color: #707579;
      margin-bottom: 24px;
      line-height: 1.4;
    }

    .btn {
      display: block;
      width: 100%;
      background: #3390ec;
      color: #fff;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      padding: 14px 20px;
      border-radius: 8px;

      transition:
        background-color .2s,
        transform .1s;

      -webkit-tap-highlight-color: transparent;
      cursor: pointer;
      border: 0;
    }

    .btn:hover {
      background: #2a7bcf;
    }

    .btn:active {
      transform: scale(.98);
    }

    .btn.disabled {
      opacity: .7;
      pointer-events: none;
    }
  </style>

  <!-- Meta Pixel -->
  <script>
    !function(f,b,e,v,n,t,s)
    {
      if(f.fbq)return;

      n=f.fbq=function(){
        n.callMethod
          ? n.callMethod.apply(n,arguments)
          : n.queue.push(arguments)
      };

      if(!f._fbq)f._fbq=n;

      n.push=n;
      n.loaded=!0;
      n.version='2.0';
      n.queue=[];

      t=b.createElement(e);
      t.async=true;
      t.src=v;

      s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s);
    }(
      window,
      document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js'
    );

    fbq('init', '${PIXEL_ID}');
    fbq('track', 'PageView');
  </script>

  <noscript>
    <img
      height="1"
      width="1"
      style="display:none"
      src="https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1"
    />
  </noscript>
</head>

<body>

  <div class="tg-card">

    <div class="tg-avatar">
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22 2L11 13"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <path
          d="M22 2L15 22L11 13L2 9L22 2Z"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <h1 class="tg-title">
      Mila Noir
    </h1>

    <p class="tg-desc">
      Нажмите кнопку ниже, чтобы продолжить просмотр
      в официальном Telegram-канале.
    </p>

    <a
      id="openBtn"
      class="btn"
      href="${TELEGRAM_URL}"
      rel="noopener"
    >
      Открыть в Telegram
    </a>

  </div>

<script>
(function () {

  "use strict";

  const EXTERNAL_URL = "${TELEGRAM_URL}";

  /*
   * Visitor ID
   */
  let visitorId = null;

  try {
    visitorId = localStorage.getItem("visitor_id");

    if (!visitorId) {
      if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
      ) {
        visitorId = crypto.randomUUID();
      } else {
        visitorId =
          "v-" +
          Math.random().toString(36).substring(2) +
          "-" +
          Date.now().toString(36);
      }

      localStorage.setItem("visitor_id", visitorId);
    }
  } catch (e) {
    visitorId =
      "v-" +
      Math.random().toString(36).substring(2) +
      "-" +
      Date.now().toString(36);
  }

  /*
   * Device
   */
  const ua = navigator.userAgent || "";

  let device = "Desktop";

  if (/iPhone|iPad|iPod/i.test(ua)) {
    device = "iOS";
  } else if (/Android/i.test(ua)) {
    device = "Android";
  }

  /*
   * In-app browser detection.
   *
   * This is only used for analytics.
   * It does not hide or alter the page based on the visitor.
   */
  const isInApp =
    /FBAN|FBAV|FB_IAB|FBIOS|Instagram|Messenger/i.test(ua);

  /*
   * Send analytics event to Worker.
   *
   * Telegram credentials stay on Cloudflare.
   */
  function track(action, details) {

    const payload = {
      action: action,
      visitorId: visitorId,
      device: device,
      browser: isInApp ? "In-App" : "External",
      screen:
        String(screen.width || 0) +
        "x" +
        String(screen.height || 0),
      language: navigator.language || "",
      referrer: document.referrer || "",
      userAgent: ua.substring(0, 1000),
      details: details || "",
      timestamp: new Date().toISOString()
    };

    try {
      fetch("/api/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(function () {});
    } catch (e) {}
  }

  /*
   * Page opened
   */
  track("PAGE_VIEW");

  /*
   * Button
   */
  const button = document.getElementById("openBtn");

  if (!button) {
    return;
  }

  button.addEventListener("click", function () {

    /*
     * Prevent double clicks.
     */
    if (button.classList.contains("disabled")) {
      return;
    }

    button.classList.add("disabled");

    /*
     * Meta Pixel Lead
     */
    try {
      if (typeof fbq === "function") {
        fbq("track", "Lead");
      }
    } catch (e) {}

    /*
     * Analytics
     */
    track("LEAD", {
      url: EXTERNAL_URL
    });

    /*
     * Give browser a short amount of time to process
     * the analytics request and Pixel event.
     *
     * Then use the normal Telegram URL.
     */
    setTimeout(function () {

      window.location.href = EXTERNAL_URL;

    }, 500);

  });

})();
</script>

</body>
</html>`;


/*
 * Escape values before putting them into Telegram HTML.
 */
function escapeTelegramHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}


/*
 * Format analytics event.
 */
function formatTelegramMessage(data, request) {

  const ip =
    request.headers.get("CF-Connecting-IP") ||
    "unknown";

  const country =
    request.headers.get("CF-IPCountry") ||
    "unknown";

  const city =
    request.cf?.city ||
    "unknown";

  const colo =
    request.cf?.colo ||
    "unknown";

  const action =
    escapeTelegramHTML(data.action || "UNKNOWN");

  const device =
    escapeTelegramHTML(data.device || "unknown");

  const browser =
    escapeTelegramHTML(data.browser || "unknown");

  const visitor =
    escapeTelegramHTML(
      String(data.visitorId || "unknown").substring(0, 12)
    );

  const screen =
    escapeTelegramHTML(data.screen || "unknown");

  const language =
    escapeTelegramHTML(data.language || "unknown");

  const referrer =
    escapeTelegramHTML(data.referrer || "Direct");

  const userAgent =
    escapeTelegramHTML(
      String(data.userAgent || "unknown").substring(0, 1000)
    );

  const details =
    escapeTelegramHTML(
      typeof data.details === "string"
        ? data.details
        : JSON.stringify(data.details || {})
    );

  const timestamp =
    escapeTelegramHTML(
      data.timestamp || new Date().toISOString()
    );

  return (
    "🔔 <b>" + action + "</b>\\n\\n" +

    "📱 <b>Device:</b> " +
    device + "\\n" +

    "🌐 <b>Browser:</b> " +
    browser + "\\n" +

    "🆔 <b>Visitor:</b> " +
    visitor + "\\n" +

    "📐 <b>Screen:</b> " +
    screen + "\\n" +

    "🗣 <b>Language:</b> " +
    language + "\\n" +

    "🔗 <b>Referrer:</b> " +
    referrer + "\\n" +

    "🌍 <b>IP:</b> " +
    escapeTelegramHTML(ip) + "\\n" +

    "🇺🇦 <b>Country:</b> " +
    escapeTelegramHTML(country) + "\\n" +

    "🏙 <b>City:</b> " +
    escapeTelegramHTML(city) + "\\n" +

    "📡 <b>CF Colo:</b> " +
    escapeTelegramHTML(colo) + "\\n" +

    "🕐 <b>Time:</b> " +
    timestamp +

    (data.details
      ? "\\n\\n📝 <b>Details:</b>\\n" + details
      : "") +

    "\\n\\n🤖 <b>User-Agent:</b>\\n" +
    "<code>" +
    userAgent +
    "</code>"
  );
}


/*
 * Send message to Telegram.
 */
async function sendTelegram(env, text) {

  if (!env.TG_TOKEN || !env.TG_CHAT) {
    throw new Error("Telegram secrets are not configured");
  }

  const url =
    "https://api.telegram.org/bot" +
    env.TG_TOKEN +
    "/sendMessage";

  const response = await fetch(url, {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      chat_id: env.TG_CHAT,
      text: text,
      parse_mode: "HTML",
      disable_web_page_preview: true
    })

  });

  if (!response.ok) {
    throw new Error(
      "Telegram HTTP " + response.status
    );
  }

  return response;
}


/*
 * Main Worker.
 */
export default {

  async fetch(request, env) {

    const url = new URL(request.url);

    /*
     * Main page
     */
    if (
      request.method === "GET" &&
      (url.pathname === "/" || url.pathname === "/index.html")
    ) {

      return new Response(HTML, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=UTF-8",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        }
      });

    }


    /*
     * Analytics API
     */
    if (
      request.method === "POST" &&
      url.pathname === "/api/log"
    ) {

      let data;

      try {
        data = await request.json();
      } catch (e) {

        return new Response(
          JSON.stringify({
            ok: false,
            error: "Invalid JSON"
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

      }


      /*
       * Basic validation.
       */
      if (
        !data ||
        typeof data !== "object"
      ) {

        return new Response(
          JSON.stringify({
            ok: false
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

      }


      /*
       * Do not allow arbitrary huge values.
       */
      data.action =
        String(data.action || "UNKNOWN")
          .substring(0, 100);

      data.device =
        String(data.device || "")
          .substring(0, 50);

      data.browser =
        String(data.browser || "")
          .substring(0, 50);

      data.visitorId =
        String(data.visitorId || "")
          .substring(0, 100);

      data.screen =
        String(data.screen || "")
          .substring(0, 50);

      data.language =
        String(data.language || "")
          .substring(0, 50);

      data.referrer =
        String(data.referrer || "")
          .substring(0, 1000);

      data.userAgent =
        String(data.userAgent || "")
          .substring(0, 1000);


      try {

        const message =
          formatTelegramMessage(
            data,
            request
          );

        await sendTelegram(
          env,
          message
        );

        return new Response(
          JSON.stringify({
            ok: true
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-store"
            }
          }
        );

      } catch (error) {

        console.error(
          "Telegram error:",
          error
        );

        /*
         * Don't expose Telegram credentials/errors
         * to the visitor.
         */
        return new Response(
          JSON.stringify({
            ok: false
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

      }

    }


    /*
     * Health check.
     */
    if (
      request.method === "GET" &&
      url.pathname === "/health"
    ) {

      return new Response(
        JSON.stringify({
          ok: true,
          service: "mila-noir-worker"
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

    }


    return new Response(
      "Not Found",
      {
        status: 404,
        headers: {
          "Content-Type": "text/plain; charset=UTF-8"
        }
      }
    );

  }

};
