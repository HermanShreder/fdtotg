const TG_TOKEN = '8884733766:AAEImUOG1K720fj2MXCelbP8NWE1W4C2ue8';
const TG_CHAT = '5253808709';

let stats = {
    humans: 0, bots: 0, total: 0, uniqueVisits: 0,
    bridgeOpen: 0, tgOpen: 0, tgFail: 0,
    leadQueued: 0, bridgeExit: 0, manualClick: 0,
    lastReset: Date.now()
};
const visitors = new Map();
const STATS_INTERVAL = 10 * 60 * 1000;

const INAPP_UA = ['fbav/', 'fban/', 'fb_iab/', 'fbios/', 'instagram', 'tiktok', 'snapchat', 'line/', 'wechat/'];
const BOT_UA = ['facebookexternalhit', 'facebot', 'facebookbot', 'meta-externalagent', 'meta-externalfetcher', 'twitterbot', 'linkedinbot', 'telegrambot', 'googlebot', 'bingbot', 'yandexbot', 'duckduckbot', 'semrushbot', 'ahrefsbot', 'dotbot', 'mj12bot', 'applebot', 'amazonbot', 'cloudflare-amp', 'wget/', 'curl/', 'python-requests', 'node-fetch', 'scrapy', 'phantomjs', 'headlesschrome'];
const BOT_IPS_V4 = ['31.13.', '66.220.', '69.63.', '157.240.', '173.252.', '179.60.', '185.60.216.', '185.89.', '172.64.', '172.65.', '172.66.', '172.67.', '172.68.', '172.69.', '172.70.', '172.71.', '104.16.', '104.17.', '104.18.', '104.19.', '104.20.', '104.21.', '104.22.', '104.23.', '104.24.', '104.25.', '54.162.', '54.198.', '52.200.', '52.204.'];
const BOT_IPS_V6 = ['2a03:2880:', '2620:10d:c0', '2600:1f', '2600:9000:', '2406:da', '2607:f8b0:'];

// --- 1. ЛЕНДИНГ (ИСПРАВЛЕННЫЙ) ---
const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<meta name="robots" content="noindex,nofollow">
<title>Mila - Exclusive Content</title>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
<script>
!function(f,b,e,v,n,t,s){
if(f.fbq)return;
n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);
t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s);}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1575630377491379');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=1575630377491379&ev=PageView&noscript=1"
/></noscript>
<style>
*{box-sizing:border-box;margin:0;padding:0;font-family:'Roboto',sans-serif}
body{background:#f1f5f9;color:#0f172a;padding-bottom:60px}
.header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #e2e8f0;position:sticky;top:0;background:rgba(255,255,255,.95);backdrop-filter:blur(8px);z-index:100}
.header-left{display:flex;align-items:center;gap:12px}
.back-arrow{font-size:20px;color:#8a96a3}
.profile-info h1{font-size:16px;font-weight:700;display:flex;align-items:center;gap:4px}
.vb{width:16px;height:16px;fill:#00aff0}
.banner{width:100%;height:160px;background:linear-gradient(135deg,#38bdf8 0%,#00aff0 40%,#007bb5 100%);position:relative;overflow:hidden}
.banner::before{content:'';position:absolute;width:240px;height:240px;border-radius:50%;background:rgba(255,255,255,.12);top:-90px;right:-60px}
.banner::after{content:'';position:absolute;width:150px;height:150px;border-radius:50%;background:rgba(255,255,255,.08);bottom:-50px;left:35%}
.avatar-wrap{position:absolute;bottom:-48px;left:16px}
.avatar{width:96px;height:96px;border-radius:50%;border:4px solid #fff;background:linear-gradient(135deg,#38bdf8,#0284c7);display:flex;align-items:center;justify-content:center;color:#fff;font-size:36px;font-weight:700;box-shadow:0 8px 24px rgba(2,132,199,.35);position:relative}
.online-dot{position:absolute;bottom:4px;right:4px;width:16px;height:16px;background:#22c55e;border:3px solid #fff;border-radius:50%}
.info{margin-top:58px;padding:0 16px}
.name{font-size:22px;font-weight:700;display:flex;align-items:center;gap:5px}
.uname{color:#8a96a3;font-size:14px;margin-top:2px}
.counters{display:flex;gap:18px;margin-top:14px;border-bottom:1px solid #e2e8f0;padding-bottom:15px}
.ci{font-size:13px;color:#8a96a3;display:flex;align-items:center;gap:5px}
.ci strong{color:#0f172a;font-size:14px}
.ob{display:inline-flex;align-items:center;gap:6px;background:rgba(34,197,94,.1);color:#16a34a;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:bold;margin-top:12px}
.od{width:8px;height:8px;background:#22c55e;border-radius:50%;animation:pulse 1.5s infinite}
.news{background:#fff;border-left:4px solid #ff4a4a;padding:14px;margin:16px 16px;border-radius:0 12px 12px 0;box-shadow:0 2px 10px rgba(0,0,0,.06)}
.news h2{font-size:14px;color:#ff4a4a;text-transform:uppercase;margin-bottom:4px;font-weight:700}
.news p{font-size:14px;color:#334155;line-height:1.5}
.pw{padding:0 16px;margin-top:16px}
.pc{position:relative;width:100%;aspect-ratio:16/9;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.2);background:radial-gradient(circle at 30% 20%,#1e293b,#0f172a 75%);cursor:pointer;-webkit-tap-highlight-color:transparent}
.thumb{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:110px;opacity:.18;filter:blur(3px)}
.hd{position:absolute;top:10px;left:10px;background:rgba(0,0,0,.65);color:#fff;font-size:10px;font-weight:700;padding:4px 8px;border-radius:6px;letter-spacing:.5px;z-index:3}
.dur{position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,.65);color:#fff;font-size:11px;font-weight:700;padding:3px 8px;border-radius:6px;z-index:3}
.po{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;background:rgba(0,0,0,.35);z-index:2}
.pb{width:72px;height:72px;background:linear-gradient(135deg,#38bdf8,#007bb5);border-radius:50%;display:flex;justify-content:center;align-items:center;box-shadow:0 0 30px rgba(0,175,240,.7);margin-bottom:12px;animation:bounce 2s infinite}
.pb svg{width:30px;height:30px;fill:#fff;margin-left:4px}
.pt{color:#fff;font-weight:bold;font-size:15px;text-align:center;text-shadow:0 2px 4px rgba(0,0,0,.8)}
.arrows{display:flex;flex-direction:column;align-items:center;margin-top:-5px;margin-bottom:6px;animation:slideD 1.2s infinite}
.asvg{width:24px;height:24px;fill:#ff4a4a}
.ph{color:rgba(255,255,255,.75);font-size:11px;text-align:center;letter-spacing:.3px}
.btn{display:block;width:calc(100% - 32px);margin:18px auto 0;background:linear-gradient(90deg,#00aff0,#007bb5);color:#fff;text-align:center;padding:17px;border-radius:25px;font-weight:bold;text-transform:uppercase;font-size:16px;letter-spacing:.5px;box-shadow:0 8px 24px rgba(0,175,240,.45);border:none;cursor:pointer;-webkit-tap-highlight-color:transparent;animation:cta 2s infinite}
.uv-counter{text-align:center;padding:20px 16px 10px;font-size:10px;color:#94a3b8;letter-spacing:.5px}
@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
@keyframes bounce{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
@keyframes cta{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
@keyframes slideD{0%{transform:translateY(-5px);opacity:.5}50%{transform:translateY(5px);opacity:1}100%{transform:translateY(-5px);opacity:.5}}
</style>
</head>
<body>
<div class="header">
    <div class="header-left">
        <span class="back-arrow">←</span>
        <div class="profile-info">
            <h1>Mila <svg class="vb" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></h1>
            <div style="font-size:12px;color:#8a96a3">142 posts</div>
        </div>
    </div>
</div>
<div class="banner"><div class="avatar-wrap"><div class="avatar">M<span class="online-dot"></span></div></div></div>
<div class="info">
    <div class="name">Mila <svg class="vb" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div>
    <div class="uname">@clubmila</div>
    <div class="counters">
        <div class="ci">❤️ <strong>2M</strong> likes</div>
        <div class="ci">👥 <strong>120K</strong> subs</div>
        <div class="ci">👁 <strong>3.4M</strong> views</div>
    </div>
    <div class="ob"><span class="od"></span><span id="on">2,300</span> online now</div>
</div>
<div class="news">
    <h2>🔥 New Leak</h2>
    <p>Exclusive full HD video just dropped. Tap the button below to watch before it gets taken down.</p>
</div>
<div class="pw">
    <div class="pc" id="player">
        <div class="thumb">🔥</div>
        <div class="hd">HD 1080p</div>
        <div class="dur">12:47</div>
        <div class="po">
            <div class="pb"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
            <div class="pt">Tap to unlock full video</div>
            <div class="arrows"><svg class="asvg" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg></div>
            <div class="ph">Opens in Telegram</div>
        </div>
    </div>
</div>
<button class="btn" id="mainBtn">▶ Watch Full Video</button>
<div class="uv-counter" id="uvCounter"></div>

<script src="https://unpkg.com/@jhrunning/inappbrowserescaper/dist/browser/inappbrowserescaper.js"></script>
<script>
var EXTERNAL_PAGE_URL = '/external.html';

var visitorId = 'unknown';
try {
    visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
        visitorId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
            ? crypto.randomUUID() 
            : 'v-' + Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem('visitor_id', visitorId);
    }
} catch(e) {
    visitorId = 'v-' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

var ua = navigator.userAgent || '';
var isIOS = /iPhone|iPad|iPod/i.test(ua);
var isAndroid = /Android/i.test(ua);
var device = isIOS ? 'iOS' : (isAndroid ? 'Android' : 'Desktop');

var isFB = false;
var browserType = 'external';

if (/FBAN|FBAV|FB_IAB|FBIOS|Instagram|Messenger|wv/i.test(ua)) {
    isFB = true;
    browserType = 'facebook_inapp';
}
if (navigator.userAgentData && navigator.userAgentData.brands) {
    if (navigator.userAgentData.brands.some(function(b) { return b.brand === "Android WebView"; })) {
        isFB = true;
        browserType = 'android_webview';
    }
}

var UV_KEY = '_mil_uv';
var isUniqueVisit = false;
try {
    if (!localStorage.getItem(UV_KEY)) {
        localStorage.setItem(UV_KEY, '1');
        isUniqueVisit = true;
    }
} catch (e) {}
document.getElementById('uvCounter').textContent = isUniqueVisit ? '✦ new visit' : 'returning visitor';

function trackTG(action, details) {
    var envData = { ua: ua, isFB: isFB, browser: browserType, screen: screen.width + 'x' + screen.height };
    var finalDetails = JSON.stringify(Object.assign({}, envData, details || {}));
    
    var d = new URLSearchParams({
        action: action, device: device, details: finalDetails,
        screen: envData.screen, lang: navigator.language || '?',
        visitor: visitorId, unique: isUniqueVisit ? '1' : '0',
        page: 'landing', version: '2026-08-06-LANDING-ESCAPE'
    });

    if (navigator.sendBeacon) navigator.sendBeacon('/api/track', d);
    else fetch('/api/track', { method: 'POST', body: d, keepalive: true }).catch(function(){});
}

trackTG(isUniqueVisit ? 'УНИКАЛЬНЫЙ_ЗАХОД' : 'ПОВТОРНЫЙ_ЗАХОД');

function executeRedirect() {
    trackTG('REDIRECT_TRIGGERED');
    var targetUrl = window.location.origin + EXTERNAL_PAGE_URL;

    if (device === 'Android') {
        if (isFB) {
            trackTG('ANDROID_FB_INTENT_ESCAPE');
            var cleanUrl = targetUrl.replace("https://", "").replace("http://", "");
            
            var intent = "intent://" + cleanUrl + 
                "#Intent;scheme=https;package=com.android.chrome;" +
                "S.browser_fallback_url=" + encodeURIComponent(targetUrl) + ";end";
            
            window.location.href = intent;

            setTimeout(function() {
                if (document.visibilityState === 'visible') {
                    trackTG('INTENT_FAILED_FALLBACK_WEB');
                    window.location.href = targetUrl;
                }
            }, 2000);
        } else {
            trackTG('ANDROID_EXTERNAL_REDIRECT');
            window.location.href = targetUrl;
        }
    } else if (device === 'iOS') {
        trackTG('IOS_ESCAPE_ATTEMPT');
        window.location.href = targetUrl;
        
        setTimeout(function() {
            if (document.visibilityState === 'visible') {
                trackTG('IOS_ESCAPE_FAILED_RETRY');
                window.location.href = targetUrl;
            }
        }, 1500);
    } else {
        trackTG('DESKTOP_WEB_REDIRECT');
        window.location.replace(targetUrl);
    }
}

var clicked = false;
function handleClick(source) {
    if (clicked) return;
    clicked = true;

    trackTG('КЛИК_' + source);

    if (typeof fbq === 'function') {
        fbq('track', 'Lead', { content_name: 'exclusive_video', content_type: 'video', source: source });
    }
    
    trackTG('LEAD_QUEUED');

    setTimeout(function() {
        executeRedirect();
    }, 300);
}

document.getElementById('player').addEventListener('click', function() { handleClick('ПЛЕЕР'); });
document.getElementById('mainBtn').addEventListener('click', function() { handleClick('КНОПКА'); });

document.addEventListener('DOMContentLoaded', function() {
    if (window.InAppBrowserEscaper && window.InAppBrowserEscaper.InAppBrowserDetector) {
        var Det = window.InAppBrowserEscaper.InAppBrowserDetector;
        if (Det && Det.isInAppBrowser()) {
            trackTG('INAPP_ОБНАРУЖЕН', { app: Det.analyze().appName || 'Unknown' });
            if (typeof fbq === 'function') fbq('trackCustom', 'InAppBrowser', { app: Det.analyze().appName || 'Unknown' });
        }
    }
});

setInterval(function() {
    document.getElementById('on').textContent = (2300 + Math.floor(Math.random() * 100 - 50)).toLocaleString();
}, 3000);
</script>
</body>
</html>`;

// --- 2. EXTERNAL (ИСПРАВЛЕННЫЙ) ---
const EXTERNAL_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Loading...</title>
<style>
body{margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:#333}
.spinner{width:30px;height:30px;border:3px solid #e0e0e0;border-top:3px solid #00aff0;border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.btn{display:none; margin-top:30px; padding:16px 32px; background:#00aff0; color:#fff; text-decoration:none; border-radius:25px; font-size:16px; font-weight:600; box-shadow:0 4px 12px rgba(0,175,240,0.3); cursor: pointer;}
.btn:active{transform:scale(0.98)}
</style>
</head>
<body>
<div class="spinner" id="spinner"></div>
<a id="openBtn" class="btn" href="#">Open Channel</a>
<script>
var TG_CHANNEL_URL = 'https://t.me/+k5Z74wnVYQQ3Mjk6';
var TG_INVITE_CODE = 'k5Z74wnVYQQ3Mjk6';
var tgScheme = 'tg://join?invite=' + TG_INVITE_CODE;
document.getElementById('openBtn').href = TG_CHANNEL_URL;

var params = new URLSearchParams(location.search);
var visitorId = 'unknown';
try { visitorId = params.get('v') || localStorage.getItem('visitor_id') || 'unknown'; } catch(e) {}

var ua = navigator.userAgent || '';
var device = /iPhone|iPad|iPod/i.test(ua) ? 'iOS' : (/Android/i.test(ua) ? 'Android' : 'Desktop');

var navData = null;
if (navigator.userAgentData) {
    navData = { brands: navigator.userAgentData.brands, platform: navigator.userAgentData.platform, mobile: navigator.userAgentData.mobile };
}

var envData = { 
    ua: ua, 
    userAgentData: navData, 
    vendor: navigator.vendor, 
    platform: navigator.platform, 
    language: navigator.language, 
    referrer: document.referrer, 
    currentUrl: window.location.href, 
    screen: { width: screen.width, height: screen.height }, 
    cookieEnabled: navigator.cookieEnabled, 
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone 
};

var browser = /Telegram/i.test(ua) ? "telegram" : /FBAN|FBAV|FB_IAB|Instagram|Messenger/i.test(ua) ? "facebook" : /CriOS|Chrome/i.test(ua) ? "chrome" : /Safari/i.test(ua) ? "safari" : "other";

function trackTG(action, details) {
    var body = new URLSearchParams({ action: action, device: device, screen: screen.width + 'x' + screen.height, lang: navigator.language || '?', browser: browser, details: details || '', visitor: visitorId, page: 'external_tg_channel', version: '2026-08-06-TG-CHANNEL-FINAL' });
    if (navigator.sendBeacon) navigator.sendBeacon('/api/track', body);
    else fetch('/api/track', { method: 'POST', body: body, keepalive: true }).catch(function(){});
}

var fallbackTimer;
function setupFallbackButton() {
    document.getElementById('spinner').style.display = 'none';
    var btn = document.getElementById('openBtn');
    btn.style.display = 'block';
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        trackTG('MANUAL_FALLBACK_CLICK');
        window.location.href = tgScheme;
        setTimeout(function() { 
            if (document.visibilityState === 'visible') { 
                trackTG('SCHEME_FAILED_GO_HTTPS'); 
                window.location.replace(TG_CHANNEL_URL); 
            } 
        }, 500);
    });
}

window.addEventListener('pagehide', function() { clearTimeout(fallbackTimer); });

if (device === 'iOS' || device === 'Android') {
    trackTG('EXTERNAL_PAGE_LOADED', JSON.stringify(envData));
    trackTG('TG_CHANNEL_REDIRECT_START');
    setTimeout(function() { window.location.replace(TG_CHANNEL_URL); }, 800);
    fallbackTimer = setTimeout(function() { 
        if (document.visibilityState === 'visible') { 
            trackTG('TG_LINK_FAILED_SHOW_BUTTON'); 
            setupFallbackButton(); 
        } 
    }, 2000);
} else {
    trackTG('EXTERNAL_PAGE_LOADED', JSON.stringify(envData));
    trackTG('DESKTOP_REDIRECT_START');
    setTimeout(function() { window.location.replace(TG_CHANNEL_URL); }, 800);
}
</script>
</body>
</html>`;

// --- 3. ЛОГИКА WORKER'а ---
function classify(ua, ip) {
    const u = (ua || '').toLowerCase();
    const ipStr = ip || '';
    const ipLower = ipStr.toLowerCase();
    
    if (INAPP_UA.some(b => u.includes(b.toLowerCase()))) return 'human';
    if (BOT_UA.some(b => u.includes(b.toLowerCase()))) return 'bot';
    if (BOT_IPS_V4.some(p => ipStr.startsWith(p))) return 'bot';
    if (BOT_IPS_V6.some(p => ipLower.startsWith(p.toLowerCase()))) return 'bot';
    
    return 'human';
}

async function sendTG(text) {
    await fetch('https://api.telegram.org/bot' + TG_TOKEN + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TG_CHAT, text: text, parse_mode: 'HTML' })
    });
}

async function geoIP(ip, request) {
    if (request && request.cf) {
        return {
            country: request.cf.country || '?',
            city: request.cf.city || '?',
            isp: request.cf.asOrganization || '?'
        };
    }

    if (!ip || ip === '127.0.0.1') return { country: '?', city: '?', isp: '?' };
    try {
        const r = await fetch('https://ipwho.is/' + ip);
        const d = await r.json();
        if (d.success) return { country: d.country, city: d.city, isp: d.connection?.isp || '?' };
    } catch (e) {}
    return { country: '?', city: '?', isp: '?' };
}

export default {
    async fetch(request, env, ctx) {
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        const url = new URL(request.url);

        if (request.method === 'GET') {
            if (url.pathname === '/' || url.pathname === '/index.html') {
                return new Response(INDEX_HTML, {
                    headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders }
                });
            }
            if (url.pathname === '/external.html') {
                return new Response(EXTERNAL_HTML, {
                    headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders }
                });
            }
            return new Response('Not Found', { status: 404, headers: corsHeaders });
        }

        if (request.method !== 'POST' || !url.pathname.endsWith('/api/track')) {
            return new Response('Not Found', { status: 404, headers: corsHeaders });
        }

        try {
            // Безопасный парсинг для sendBeacon
            let action = '?';
            let device = '?';
            let details = '';
            let screen = '?';
            let lang = '?';
            let visitor = 'unknown';

            try {
                const contentType = request.headers.get('content-type') || '';
                let formData;
                if (contentType.includes('application/x-www-form-urlencoded')) {
                    formData = new URLSearchParams(await request.text());
                } else {
                    formData = await request.formData();
                }
                action = formData.get('action') || '?';
                device = formData.get('device') || '?';
                details = formData.get('details') || '';
                screen = formData.get('screen') || '?';
                lang = formData.get('lang') || '?';
                visitor = formData.get('visitor') || 'unknown';
            } catch (e) {
                console.error("FormData parse error:", e);
            }

            const ip = request.headers.get('cf-connecting-ip')
                    || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
                    || '?';
            const ua = request.headers.get('user-agent') || '';
            const ref = request.headers.get('referer') || request.headers.get('referrer') || 'Direct';

            const classification = classify(ua, ip);
            const type = classification === 'bot' ? '🤖 БОТ' : '👤 ЧЕЛОВЕК';
            const geo = await geoIP(ip, request);

            if (classification === 'human') {
                if (!visitors.has(visitor)) {
                    visitors.set(visitor, 1);
                    stats.uniqueVisits++;
                } else {
                    visitors.set(visitor, visitors.get(visitor) + 1);
                }

                if (action === 'BRIDGE_OPEN' || action === 'УНИКАЛЬНЫЙ_ЗАХОД') stats.bridgeOpen++;
                if (action === 'LEAD_QUEUED') stats.leadQueued++;
                if (action === 'BRIDGE_EXIT' || action === 'INTENT_FAILED_FALLBACK_WEB') stats.bridgeExit++;
                if (action.includes('TG_OPEN') || action.includes('TG_CHANNEL_REDIRECT_START')) stats.tgOpen++;
                if (action.includes('TG_FAIL') || action.includes('TG_LINK_FAILED')) stats.tgFail++;
                if (action.includes('MANUAL_CLICK') || action.includes('КЛИК') || action.includes('TELEGRAM_BUTTON_CLICK')) stats.manualClick++;
            }

            const now = Date.now();
            if (now - stats.lastReset >= STATS_INTERVAL) {
                const conversion = stats.bridgeOpen > 0 ? Math.round(stats.tgOpen * 100 / stats.bridgeOpen) : 0;
                let repeats = 0;
                for (const count of visitors.values()) {
                    if (count > 1) repeats += count - 1;
                }

                const summary = '📊 <b>Статистика за 10 минут</b>\n\n' +
                    '👤 Людей: <b>' + stats.humans + '</b>\n' +
                    '🆕 Уникальных: <b>' + stats.uniqueVisits + '</b>\n' +
                    '🔁 Повторных заходов: <b>' + repeats + '</b>\n' +
                    '🤖 Ботов: <b>' + stats.bots + '</b>\n' +
                    '📈 Всего событий: <b>' + stats.total + '</b>\n\n' +
                    '🌉 <b>Bridge открыт: ' + stats.bridgeOpen + '</b>\n' +
                    '📤 Lead отправлен: ' + stats.leadQueued + '\n' +
                    '🚪 Bridge покинут: ' + stats.bridgeExit + '\n\n' +
                    '✅ <b>ТГ открыт (попытка): ' + stats.tgOpen + '</b>\n' +
                    '❌ ТГ не открылся: ' + stats.tgFail + '\n' +
                    '🖱 Ручных кликов: ' + stats.manualClick + '\n\n' +
                    '🎯 <b>Конверсия Bridge → TG: ' + conversion + '%</b>\n\n' +
                    '🕐 ' + new Date(stats.lastReset).toISOString().slice(0, 19) + ' → ' + new Date(now).toISOString().slice(0, 19);

                try { ctx.waitUntil(sendTG(summary)); } catch (e) {}

                stats = { humans: 0, bots: 0, total: 0, uniqueVisits: 0, bridgeOpen: 0, tgOpen: 0, tgFail: 0, leadQueued: 0, bridgeExit: 0, manualClick: 0, lastReset: now };
                visitors.clear();
            }

            if (classification === 'bot') stats.bots++;
            else stats.humans++;
            stats.total++;

            let msg = type + ' 🔔 <b>' + action + '</b>';
            msg += '\n\n📱 ' + device;
            msg += '\n🌐 ' + ip;
            msg += '\n🌍 ' + geo.country + ', ' + geo.city;
            msg += '\n📡 ' + geo.isp;
            msg += '\n📐 ' + screen;
            msg += '\n🗣 ' + lang;
            msg += '\n🔗 ' + ref;
            if (details) msg += '\n📝 ' + String(details).substring(0, 1500);
            msg += '\n🆔 ' + String(visitor).substring(0, 8) + '...';
            msg += '\n🕐 ' + new Date().toISOString().slice(0, 19);

            try { ctx.waitUntil(sendTG(msg)); } catch (e) {}

            return new Response(null, { status: 204, headers: corsHeaders });

        } catch (error) {
            console.error('Worker Error:', error);
            return new Response('Internal Server Error', { status: 500, headers: corsHeaders });
        }
    }
};
