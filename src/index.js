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

// --- ЛЕНДИНГ (Присланный HTML с кнопкой Telegram) ---
const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<meta name="robots" content="noindex,nofollow">
<title>Continue to Telegram</title>
<script>
!function(f,b,e,v,n,t,s){
if(f.fbq)return;
n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);
t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s);
}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1575630377491379');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=1575630377491379&ev=PageView&noscript=1"
/></noscript>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #ffffff; color: #333; text-align: center; padding: 20px; }
.title { font-size: 20px; font-weight: 600; margin-bottom: 32px; color: #222; line-height: 1.4; }
.tg-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; max-width: 320px; padding: 16px 24px; background: #0088cc; color: #fff; border: none; border-radius: 12px; font-size: 18px; font-weight: 600; cursor: pointer; text-decoration: none; -webkit-tap-highlight-color: transparent; box-shadow: 0 6px 16px rgba(0, 136, 204, 0.3); transition: transform 0.1s, background 0.2s; }
.tg-btn:active { transform: scale(0.97); background: #0077b5; }
.tg-icon { width: 24px; height: 24px; fill: #fff; }
.uv-counter { margin-top: 40px; font-size: 11px; color: #999; letter-spacing: 0.5px; }
</style>
</head>
<body>
<div class="title">To continue, please open this page in your external browser.</div>
<button id="tgBtn" class="tg-btn">
    <svg class="tg-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
    Open in Telegram
</button>
<div class="uv-counter" id="uvCounter"></div>
<script>
var EXTERNAL_PAGE_URL = '/external.html';
var visitorId = localStorage.getItem('visitor_id');
if (!visitorId) {
    visitorId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'v-' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('visitor_id', visitorId);
}
var ua = navigator.userAgent || '';
var isIOS = /iPhone|iPad|iPod/i.test(ua);
var isAndroid = /Android/i.test(ua);
var device = isIOS ? 'iOS' : (isAndroid ? 'Android' : 'Desktop');
var isFB = false;
var browserType = 'external';
if (/FBAN|FBAV|FB_IAB|FBIOS|Instagram|Messenger|wv/i.test(ua)) { isFB = true; browserType = 'facebook_inapp'; }
if (navigator.userAgentData && navigator.userAgentData.brands) {
    if (navigator.userAgentData.brands.some(function(b){ return b.brand === "Android WebView"; })) { isFB = true; browserType = 'android_webview'; }
}
var UV_KEY = '_mil_uv';
var isUniqueVisit = false;
try { if (!localStorage.getItem(UV_KEY)) { localStorage.setItem(UV_KEY, '1'); isUniqueVisit = true; } } catch (e) {}
document.getElementById('uvCounter').textContent = isUniqueVisit ? '✦ new visit' : 'returning visitor';

function trackTG(action, details) {
    var envData = { ua: ua, isFB: isFB, browser: browserType, screen: screen.width + 'x' + screen.height };
    var finalDetails = JSON.stringify(Object.assign({}, envData, details || {}));
    var d = new URLSearchParams({ action: action, device: device, details: finalDetails, screen: envData.screen, lang: navigator.language || '?', visitor: visitorId, unique: isUniqueVisit ? '1' : '0', page: 'single_landing_escape', version: '2026-08-06-FIXED-INTENT' });
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
            var cleanUrl = targetUrl.replace(/^https?:\\/\\//, "");
            var intent = "intent://" + cleanUrl + "#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=" + encodeURIComponent(targetUrl) + ";end";
            window.location.href = intent;
            setTimeout(function() { if (document.visibilityState === 'visible') { trackTG('INTENT_FAILED_FALLBACK_WEB'); window.location.replace(targetUrl); } }, 2000);
        } else {
            trackTG('ANDROID_EXTERNAL_REDIRECT');
            window.location.replace(targetUrl);
        }
    } else if (device === 'iOS') {
        trackTG('IOS_ESCAPE_ATTEMPT');
        window.location.replace(targetUrl);
        setTimeout(function() { if (document.visibilityState === 'visible') { trackTG('IOS_ESCAPE_FAILED_RETRY'); window.location.replace(targetUrl); } }, 1500);
    } else {
        trackTG('DESKTOP_WEB_REDIRECT');
        window.location.replace(targetUrl);
    }
}

var clicked = false;
document.getElementById('tgBtn').addEventListener('click', function(e) {
    if (clicked) return;
    clicked = true;
    if (typeof fbq === 'function') { fbq('track', 'Lead', { content_name: 'telegram_open_button' }); }
    trackTG('TELEGRAM_BUTTON_CLICK');
    setTimeout(function() { executeRedirect(); }, 300);
});
</script>
</body>
</html>`;

// --- EXTERNAL (редирект в канал) ---
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
const TG_CHANNEL_URL = 'https://t.me/+k5Z74wnVYQQ3Mjk6';
const TG_INVITE_CODE = 'k5Z74wnVYQQ3Mjk6';
const tgScheme = 'tg://join?invite=' + TG_INVITE_CODE;
document.getElementById('openBtn').href = TG_CHANNEL_URL;
const params = new URLSearchParams(location.search);
const visitorId = params.get('v') || localStorage.getItem('visitor_id') || 'unknown';
const ua = navigator.userAgent || '';
const device = /iPhone|iPad|iPod/i.test(ua) ? 'iOS' : (/Android/i.test(ua) ? 'Android' : 'Desktop');
const envData = { ua: ua, userAgentData: navigator.userAgentData ? { brands: navigator.userAgentData.brands, platform: navigator.userAgentData.platform, mobile: navigator.userAgentData.mobile } : null, vendor: navigator.vendor, platform: navigator.platform, language: navigator.language, referrer: document.referrer, currentUrl: window.location.href, screen: { width: screen.width, height: screen.height }, cookieEnabled: navigator.cookieEnabled, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
const browser = /Telegram/i.test(ua) ? "telegram" : /FBAN|FBAV|FB_IAB|Instagram|Messenger/i.test(ua) ? "facebook" : /CriOS|Chrome/i.test(ua) ? "chrome" : /Safari/i.test(ua) ? "safari" : "other";
function trackTG(action, details) {
    const body = new URLSearchParams({ action: action, device: device, screen: screen.width + 'x' + screen.height, lang: navigator.language || '?', browser: browser, details: details || '', visitor: visitorId, page: 'external_tg_channel', version: '2026-08-06-TG-CHANNEL-FINAL' });
    if (navigator.sendBeacon) navigator.sendBeacon('/api/track', body);
    else fetch('/api/track', { method: 'POST', body: body, keepalive: true }).catch(()=>{});
}
let fallbackTimer;
function setupFallbackButton() {
    document.getElementById('spinner').style.display = 'none';
    const btn = document.getElementById('openBtn');
    btn.style.display = 'block';
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        trackTG('MANUAL_FALLBACK_CLICK');
        window.location.href = tgScheme;
        setTimeout(function() { if (document.visibilityState === 'visible') { trackTG('SCHEME_FAILED_GO_HTTPS'); window.location.replace(TG_CHANNEL_URL); } }, 500);
    });
}
window.addEventListener('pagehide', function() { clearTimeout(fallbackTimer); });
if (device === 'iOS' || device === 'Android') {
    trackTG('EXTERNAL_PAGE_LOADED', JSON.stringify(envData));
    trackTG('TG_CHANNEL_REDIRECT_START');
    setTimeout(function() { window.location.replace(TG_CHANNEL_URL); }, 400);
    fallbackTimer = setTimeout(function() { if (document.visibilityState === 'visible') { trackTG('TG_LINK_FAILED_SHOW_BUTTON'); setupFallbackButton(); } }, 2000);
} else {
    trackTG('EXTERNAL_PAGE_LOADED', JSON.stringify(envData));
    trackTG('DESKTOP_REDIRECT_START');
    setTimeout(function() { window.location.replace(TG_CHANNEL_URL); }, 400);
}
</script>
</body>
</html>`;

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

async function geoIP(ip) {
    if (!ip || ip === '127.0.0.1') return { country: '?', city: '?', isp: '?' };
    try {
        const r = await fetch('http://ip-api.com/json/' + ip + '?fields=status,country,city,isp');
        const d = await r.json();
        if (d.status === 'success') return { country: d.country, city: d.city, isp: d.isp };
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
            const formData = await request.formData();
            const action = formData.get('action') || '?';
            const device = formData.get('device') || '?';
            const details = formData.get('details') || '';
            const screen = formData.get('screen') || '?';
            const lang = formData.get('lang') || '?';
            const visitor = formData.get('visitor') || 'unknown';

            const ip = request.headers.get('cf-connecting-ip')
                    || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
                    || '?';
            const ua = request.headers.get('user-agent') || '';
            const ref = request.headers.get('referer') || request.headers.get('referrer') || 'Direct';

            const classification = classify(ua, ip);
            const type = classification === 'bot' ? '🤖 БОТ' : '👤 ЧЕЛОВЕК';
            const geo = await geoIP(ip);

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

                try { await sendTG(summary); } catch (e) {}

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
            if (details) msg += '\n📝 ' + details;
            msg += '\n🆔 ' + visitor.substring(0, 8) + '...';
            msg += '\n🕐 ' + new Date().toISOString().slice(0, 19);

            try { await sendTG(msg); } catch (e) {}

            return new Response(null, { status: 204, headers: corsHeaders });

        } catch (error) {
            console.error('Worker Error:', error);
            return new Response('Internal Server Error', { status: 500, headers: corsHeaders });
        }
    }
};
