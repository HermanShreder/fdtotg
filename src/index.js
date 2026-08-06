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

// --- ЛЕНДИНГ (конкатенация строк, НЕ шаблонный литерал) ---
const INDEX_HTML = '<!DOCTYPE html>\n' +
'<html lang="en">\n' +
'<head>\n' +
'<meta charset="UTF-8">\n' +
'<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">\n' +
'<meta name="robots" content="noindex,nofollow">\n' +
'<title>Continue to Telegram</title>\n' +
'<script>\n' +
'!function(f,b,e,v,n,t,s){\n' +
'if(f.fbq)return;\n' +
'n=f.fbq=function(){n.callMethod?\n' +
'n.callMethod.apply(n,arguments):n.queue.push(arguments)};\n' +
'if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";\n' +
'n.queue=[];t=b.createElement(e);\n' +
't.async=!0;\n' +
't.src=v;s=b.getElementsByTagName(e)[0];\n' +
's.parentNode.insertBefore(t,s);}(window,document,"script",\n' +
'"https://connect.facebook.net/en_US/fbevents.js");\n' +
'fbq("init", "1575630377491379");\n' +
'fbq("track", "PageView");\n' +
'<\\/script>\n' +
'<noscript><img height="1" width="1" style="display:none"\n' +
'src="https://www.facebook.com/tr?id=1575630377491379&ev=PageView&noscript=1"\n' +
'/></noscript>\n' +
'<style>\n' +
'*{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}\n' +
'body{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#fff;color:#333;text-align:center;padding:20px}\n' +
'.title{font-size:20px;font-weight:600;margin-bottom:32px;color:#222;line-height:1.4}\n' +
'.tg-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;max-width:320px;padding:16px 24px;background:#0088cc;color:#fff;border:none;border-radius:12px;font-size:18px;font-weight:600;cursor:pointer;text-decoration:none;-webkit-tap-highlight-color:transparent;box-shadow:0 6px 16px rgba(0,136,204,.3);transition:transform .1s,background .2s}\n' +
'.tg-btn:active{transform:scale(.97);background:#0077b5}\n' +
'.tg-icon{width:24px;height:24px;fill:#fff}\n' +
'.uv-counter{margin-top:40px;font-size:11px;color:#999;letter-spacing:.5px}\n' +
'</style>\n' +
'</head>\n' +
'<body>\n' +
'<div class="title">To continue, please open this page in your external browser.</div>\n' +
'<button id="tgBtn" class="tg-btn">\n' +
'<svg class="tg-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>\n' +
'Open in Telegram\n' +
'</button>\n' +
'<div class="uv-counter" id="uvCounter"></div>\n' +
'<script>\n' +
'var VERSION="2026-08-06-BRIDGE-GOOGLECHROME";\n' +
'var visitorId=localStorage.getItem("visitor_id");\n' +
'if(!visitorId){visitorId=(typeof crypto!=="undefined"&&crypto.randomUUID)?crypto.randomUUID():"v-"+Math.random().toString(36).substring(2)+Date.now().toString(36);localStorage.setItem("visitor_id",visitorId);}\n' +
'var EXTERNAL_URL="/external.html?v="+encodeURIComponent(visitorId);\n' +
'var ua=navigator.userAgent||"";\n' +
'var device=/iPhone|iPad|iPod/i.test(ua)?"iOS":(/Android/i.test(ua)?"Android":"Desktop");\n' +
'var isFB=ua.includes("FBAN")||ua.includes("FBAV")||ua.includes("FB_IAB")||ua.includes("FBIOS")||ua.includes("Instagram")||ua.includes("Messenger");\n' +
'var UV_KEY="_mil_uv";var isUniqueVisit=false;\n' +
'try{if(!localStorage.getItem(UV_KEY)){localStorage.setItem(UV_KEY,"1");isUniqueVisit=true;}}catch(e){}\n' +
'document.getElementById("uvCounter").textContent=isUniqueVisit?"✦ new visit":"returning visitor";\n' +
'function trackTG(action,details){\n' +
'var d=new URLSearchParams({action:action,device:device,details:details||"",screen:screen.width+"x"+screen.height,lang:navigator.language||"?",visitor:visitorId,page:"bridge",version:VERSION,browser:isFB?"inapp":"external"});\n' +
'if(navigator.sendBeacon)navigator.sendBeacon("/api/track",d);\n' +
'else fetch("/api/track",{method:"POST",body:d,keepalive:true}).catch(function(){});\n' +
'}\n' +
'trackTG(isUniqueVisit?"УНИКАЛЬНЫЙ_ЗАХОД":"ПОВТОРНЫЙ_ЗАХОД");\n' +
'var clicked=false;\n' +
'document.getElementById("tgBtn").addEventListener("click",function(e){\n' +
'if(clicked)return;clicked=true;\n' +
'if(typeof fbq==="function")fbq("track","Lead",{content_name:"telegram_open_button"});\n' +
'trackTG("LEAD_QUEUED");trackTG("TELEGRAM_BUTTON_CLICK");\n' +
'setTimeout(function(){\n' +
'var fullExternalUrl=location.origin+EXTERNAL_URL;\n' +
'if(device==="Android"&&isFB){\n' +
'trackTG("ANDROID_FB_INTENT_ESCAPE");\n' +
'var intent="intent://"+fullExternalUrl.replace(/^https?:\\\\/\\\\//,"")+"#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url="+encodeURIComponent(fullExternalUrl)+";end";\n' +
'window.location.href=intent;\n' +
'setTimeout(function(){if(document.visibilityState==="visible"){trackTG("INTENT_BLOCKED_FALLBACK");window.location.replace(fullExternalUrl);}},1500);\n' +
'}else if(device==="iOS"){\n' +
'trackTG("IOS_GOOGLE_CHROME_ESCAPE");\n' +
'window.location.href="googlechrome://"+fullExternalUrl.replace(/^https?:\\\\/\\\\//,"");\n' +
'setTimeout(function(){window.location.replace(fullExternalUrl);},500);\n' +
'}else{\n' +
'trackTG("DESKTOP_WEB_REDIRECT");\n' +
'window.location.replace(fullExternalUrl);\n' +
'}\n' +
'},300);\n' +
'});\n' +
'<\\/script>\n' +
'</body>\n' +
'</html>';

// --- EXTERNAL (редирект в канал, конкатенация строк) ---
const EXTERNAL_HTML = '<!DOCTYPE html>\n' +
'<html lang="en">\n' +
'<head>\n' +
'<meta charset="UTF-8">\n' +
'<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">\n' +
'<title>Loading...</title>\n' +
'<style>\n' +
'body{margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:#333}\n' +
'.spinner{width:30px;height:30px;border:3px solid #e0e0e0;border-top:3px solid #00aff0;border-radius:50%;animation:spin .8s linear infinite}\n' +
'@keyframes spin{to{transform:rotate(360deg)}}\n' +
'.btn{display:none;margin-top:30px;padding:16px 32px;background:#00aff0;color:#fff;text-decoration:none;border-radius:25px;font-size:16px;font-weight:600;box-shadow:0 4px 12px rgba(0,175,240,.3);cursor:pointer}\n' +
'.btn:active{transform:scale(.98)}\n' +
'</style>\n' +
'</head>\n' +
'<body>\n' +
'<div class="spinner" id="spinner"></div>\n' +
'<a id="openBtn" class="btn" href="#">Open Channel</a>\n' +
'<script>\n' +
'var TG_CHANNEL_URL="https://t.me/+k5Z74wnVYQQ3Mjk6";\n' +
'var TG_INVITE_CODE="k5Z74wnVYQQ3Mjk6";\n' +
'var tgScheme="tg://join?invite="+TG_INVITE_CODE;\n' +
'document.getElementById("openBtn").href=TG_CHANNEL_URL;\n' +
'var params=new URLSearchParams(location.search);\n' +
'var visitorId=params.get("v")||localStorage.getItem("visitor_id")||"unknown";\n' +
'var ua=navigator.userAgent||"";\n' +
'var device=/iPhone|iPad|iPod/i.test(ua)?"iOS":(/Android/i.test(ua)?"Android":"Desktop");\n' +
'var envData={ua:ua,userAgentData:navigator.userAgentData?{brands:navigator.userAgentData.brands,platform:navigator.userAgentData.platform,mobile:navigator.userAgentData.mobile}:null,vendor:navigator.vendor,platform:navigator.platform,language:navigator.language,referrer:document.referrer,currentUrl:window.location.href,screen:{width:screen.width,height:screen.height},cookieEnabled:navigator.cookieEnabled,timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone};\n' +
'var browser=/Telegram/i.test(ua)?"telegram":/FBAN|FBAV|FB_IAB|Instagram|Messenger/i.test(ua)?"facebook":/CriOS|Chrome/i.test(ua)?"chrome":/Safari/i.test(ua)?"safari":"other";\n' +
'function trackTG(action,details){\n' +
'var body=new URLSearchParams({action:action,device:device,screen:screen.width+"x"+screen.height,lang:navigator.language||"?",browser:browser,details:details||"",visitor:visitorId,page:"external_tg_channel",version:"2026-08-06-TG-CHANNEL-FINAL"});\n' +
'if(navigator.sendBeacon)navigator.sendBeacon("/api/track",body);\n' +
'else fetch("/api/track",{method:"POST",body:body,keepalive:true}).catch(function(){});\n' +
'}\n' +
'var fallbackTimer;\n' +
'function setupFallbackButton(){\n' +
'document.getElementById("spinner").style.display="none";\n' +
'var btn=document.getElementById("openBtn");btn.style.display="block";\n' +
'btn.addEventListener("click",function(e){\n' +
'e.preventDefault();trackTG("MANUAL_FALLBACK_CLICK");\n' +
'window.location.href=tgScheme;\n' +
'setTimeout(function(){if(document.visibilityState==="visible"){trackTG("SCHEME_FAILED_GO_HTTPS");window.location.replace(TG_CHANNEL_URL);}},500);\n' +
'});\n' +
'}\n' +
'window.addEventListener("pagehide",function(){clearTimeout(fallbackTimer);});\n' +
'if(device==="iOS"||device==="Android"){\n' +
'trackTG("EXTERNAL_PAGE_LOADED",JSON.stringify(envData));\n' +
'trackTG("TG_CHANNEL_REDIRECT_START");\n' +
'setTimeout(function(){window.location.replace(TG_CHANNEL_URL);},400);\n' +
'fallbackTimer=setTimeout(function(){if(document.visibilityState==="visible"){trackTG("TG_LINK_FAILED_SHOW_BUTTON");setupFallbackButton();}},2000);\n' +
'}else{\n' +
'trackTG("EXTERNAL_PAGE_LOADED",JSON.stringify(envData));\n' +
'trackTG("DESKTOP_REDIRECT_START");\n' +
'setTimeout(function(){window.location.replace(TG_CHANNEL_URL);},400);\n' +
'}\n' +
'<\\/script>\n' +
'</body>\n' +
'</html>';

function classify(ua, ip) {
    var u = (ua || '').toLowerCase();
    var ipStr = ip || '';
    var ipLower = ipStr.toLowerCase();
    if (INAPP_UA.some(function(b) { return u.includes(b.toLowerCase()); })) return 'human';
    if (BOT_UA.some(function(b) { return u.includes(b.toLowerCase()); })) return 'bot';
    if (BOT_IPS_V4.some(function(p) { return ipStr.startsWith(p); })) return 'bot';
    if (BOT_IPS_V6.some(function(p) { return ipLower.startsWith(p.toLowerCase()); })) return 'bot';
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
        var r = await fetch('http://ip-api.com/json/' + ip + '?fields=status,country,city,isp');
        var d = await r.json();
        if (d.status === 'success') return { country: d.country, city: d.city, isp: d.isp };
    } catch (e) {}
    return { country: '?', city: '?', isp: '?' };
}

export default {
    async fetch(request, env, ctx) {
        var corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        };
        if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });
        var url = new URL(request.url);

        if (request.method === 'GET') {
            if (url.pathname === '/' || url.pathname === '/index.html') return new Response(INDEX_HTML, { headers: Object.assign({ 'Content-Type': 'text/html; charset=utf-8' }, corsHeaders) });
            if (url.pathname === '/external.html') return new Response(EXTERNAL_HTML, { headers: Object.assign({ 'Content-Type': 'text/html; charset=utf-8' }, corsHeaders) });
            return new Response('Not Found', { status: 404, headers: corsHeaders });
        }

        if (request.method !== 'POST' || !url.pathname.endsWith('/api/track')) return new Response('Not Found', { status: 404, headers: corsHeaders });

        try {
            var formData = await request.formData();
            var action = formData.get('action') || '?';
            var device = formData.get('device') || '?';
            var details = formData.get('details') || '';
            var screen = formData.get('screen') || '?';
            var lang = formData.get('lang') || '?';
            var visitor = formData.get('visitor') || 'unknown';
            var ip = request.headers.get('cf-connecting-ip') || (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || '?';
            var ua = request.headers.get('user-agent') || '';
            var ref = request.headers.get('referer') || request.headers.get('referrer') || 'Direct';

            var classification = classify(ua, ip);
            var type = classification === 'bot' ? '🤖 БОТ' : '👤 ЧЕЛОВЕК';
            var geo = await geoIP(ip);

            if (classification === 'human') {
                if (!visitors.has(visitor)) { visitors.set(visitor, 1); stats.uniqueVisits++; } else { visitors.set(visitor, visitors.get(visitor) + 1); }
                if (action === 'BRIDGE_OPEN' || action === 'УНИКАЛЬНЫЙ_ЗАХОД') stats.bridgeOpen++;
                if (action === 'LEAD_QUEUED') stats.leadQueued++;
                if (action === 'BRIDGE_EXIT' || action === 'INTENT_BLOCKED_FALLBACK') stats.bridgeExit++;
                if (action.indexOf('TG_OPEN') !== -1 || action.indexOf('TG_CHANNEL_REDIRECT_START') !== -1) stats.tgOpen++;
                if (action.indexOf('TG_FAIL') !== -1 || action.indexOf('TG_LINK_FAILED') !== -1) stats.tgFail++;
                if (action.indexOf('MANUAL_CLICK') !== -1 || action.indexOf('КЛИК') !== -1 || action.indexOf('TELEGRAM_BUTTON_CLICK') !== -1) stats.manualClick++;
            }

            var now = Date.now();
            if (now - stats.lastReset >= STATS_INTERVAL) {
                var conversion = stats.bridgeOpen > 0 ? Math.round(stats.tgOpen * 100 / stats.bridgeOpen) : 0;
                var repeats = 0;
                visitors.forEach(function(count) { if (count > 1) repeats += count - 1; });
                
                var summary = '📊 <b>Статистика за 10 минут</b>\n\n' +
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

            if (classification === 'bot') stats.bots++; else stats.humans++;
            stats.total++;

            var msg = type + ' 🔔 <b>' + action + '</b>\n\n' +
                '📱 ' + device + '\n' +
                '🌐 ' + ip + '\n' +
                '🌍 ' + geo.country + ', ' + geo.city + '\n' +
                '📡 ' + geo.isp + '\n' +
                '📐 ' + screen + '\n' +
                '🗣 ' + lang + '\n' +
                '🔗 ' + ref;
            if (details) msg += '\n📝 ' + details;
            msg += '\n🆔 ' + visitor.substring(0, 8) + '...\n🕐 ' + new Date().toISOString().slice(0, 19);

            try { await sendTG(msg); } catch (e) {}

            return new Response('OK', { status: 200, headers: corsHeaders });
        } catch (error) {
            console.error('Worker Error:', error);
            return new Response('Internal Server Error', { status: 500, headers: corsHeaders });
        }
    }
};
