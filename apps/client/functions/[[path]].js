
// apps/client/functions/[[path]].js
// Cloudflare Pages Function to handle Short Link Redirects & System Routes

// Reusing constants and helper functions from previous Worker implementation

const CRAWLER_PATTERNS = [
    'facebookexternalhit', 'Facebot', 'Twitterbot', 'LinkedInBot',
    'WhatsApp', 'TelegramBot', 'Pinterest', 'Googlebot', 'bingbot'
];

export async function onRequest(context) {
    const { request, env, next } = context;
    const url = new URL(request.url);
    const path = url.pathname;

    // --- 1. Skip Static Files & RPC ---
    // If it looks like a file extension, let Pages handle it (static asset)
    if (/\.(html|css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$/.test(path)) {
        return next();
    }

    // --- 2. System Routes (Handled explicitly) ---
    if (path === '/_meetups/r.php') {
        return handleIntermediateRedirect(url);
    }
    if (path === '/_video/landing') {
        return handleVideoLanding(url);
    }

    // --- 3. Frontend Routes (Skip) ---
    // List of known frontend paths to skip DB lookup
    const frontendRoutes = [
        '/',
        '/login',
        '/dashboard',
        '/campaigns',
        '/trackers',
        '/reports',
        '/live-traffic',
        '/addon-domains',
        '/geo-redirect',
        '/settings'
    ];
    // Check if path starts with any frontend route
    if (frontendRoutes.some(r => path === r || path.startsWith(r + '/'))) {
        return next();
    }

    // --- 4. Short Link Logic (Attempt Lookup) ---
    const slug = path.replace(/^\//, ''); // Remove leading slash

    // Sanity check: if slug is empty or looks like valid tracker ID path, be careful.
    // The React app uses /:trackerId for login. This is a collision territory.
    // Strategy: Try to find link in DB. If found -> Redirect.
    // If NOT found -> context.next() (Let React app handle it, maybe it's a tracker ID).

    try {
        // Lookup link
        const link = await supabaseQuery(env, 'link', `slug=eq.${slug}`, 'GET');

        // If no link found, PASS to frontend (it might be a Tracker ID page like /DANCOK)
        if (!link || link.length === 0) {
            return next();
        }

        const linkData = link[0];

        // --- Redirect Logic ---

        // Crawler Detection
        const userAgent = request.headers.get('user-agent') || 'Unknown';
        const isCrawler = CRAWLER_PATTERNS.some(p => userAgent.toLowerCase().includes(p.toLowerCase()));

        if (isCrawler && linkData.ogImage) {
            return renderOGMeta(linkData, request);
        }

        // IP & Country
        const clientIp = request.headers.get('cf-connecting-ip') || '0.0.0.0';
        const country = (request.cf && request.cf.country) ? request.cf.country.toUpperCase() : 'XX';
        const referrer = request.headers.get('referer') || '';

        // Country Blocking
        if (country === 'ID') {
            return Response.redirect('https://www.youtube.com', 302);
        }

        // Record Click
        const network = (linkData.network || 'UNKNOWN').toUpperCase();
        const externalId = generateExternalId();
        let dbClickId = 0;

        try {
            const detectedOS = detectOS(userAgent);
            const detectedBrowser = detectBrowser(userAgent);
            const clickResult = await supabaseInsert(env, 'click', {
                linkId: linkData.id,
                ip: clientIp,
                country: country,
                userAgent: userAgent.substring(0, 500),
                external_id: externalId,
                referrer: referrer.substring(0, 500),
                os: detectedOS,
                browser: detectedBrowser,
            });
            if (clickResult && clickResult.length > 0) {
                dbClickId = clickResult[0].id;
            }
            // Update count
            await supabaseRpc(env, 'rpc/increment_click_count', { link_id: linkData.id });

            // ---- Dual-write to 'clicks' table (for Realtime Dashboard project) ----
            try {
                await supabaseInsert(env, 'clicks', {
                    slug: slug,
                    country: country,
                    ip_address: clientIp,
                    click_id: externalId,
                    os: detectedOS,
                    browser: detectedBrowser,
                    referer: referrer.substring(0, 500),
                    user_agent: userAgent.substring(0, 500),
                });
            } catch (e2) {
                // Don't block main flow if Realtime table insert fails
                console.error('Realtime clicks insert error:', e2);
            }
        } catch (e) {
            console.error('Click recording error:', e);
        }

        // Fetch Tracker Name
        let trackerParam = linkData.trackerId;
        try {
            const tracker = await supabaseQuery(env, 'tracker', `id=eq.${linkData.trackerId}`, 'GET');
            if (tracker && tracker.length > 0) {
                trackerParam = encodeURIComponent(tracker[0].name);
            }
        } catch (e) { /* ignore */ }

        // Construct URL
        const finalClickIdentifier = dbClickId > 0 ? externalId : slug;
        let finalUrl = linkData.targetUrl;

        // Geo Redirect
        if (finalUrl.startsWith('GEO_REDIRECT::')) {
            try {
                const jsonStr = finalUrl.substring(14);
                const geoRules = JSON.parse(jsonStr);
                if (geoRules.tier1Countries && geoRules.tier1Countries.includes(country)) {
                    finalUrl = geoRules.tier1Url;
                } else {
                    finalUrl = geoRules.tier2Url;
                }
            } catch (e) { /* ignore */ }
        }

        // Replacements
        if (finalUrl.includes('{click_id}')) {
            finalUrl = finalUrl.replace(/{click_id}/g, finalClickIdentifier);
        } else {
            const separator = finalUrl.includes('?') ? '&' : '?';
            finalUrl += `${separator}click_id=${finalClickIdentifier}`;
        }

        if (finalUrl.includes('{sub_id}')) {
            finalUrl = finalUrl.replace(/{sub_id}/g, trackerParam);
        }

        // Intermediate Redirect
        let immediateDest = finalUrl;
        if (linkData.useLandingPage) {
            immediateDest = `/_video/landing?dest=${btoa(finalUrl)}`;
        }

        const encodedDest = btoa(immediateDest);
        const redirectUrl = `/_meetups/r.php?click_id=${trackerParam}&country_code=${country.toLowerCase()}&user_agent=web&ip_address=${clientIp}&user_lp=${network.toLowerCase()}&dest=${encodedDest}`;

        return new Response(null, {
            status: 302,
            headers: {
                'Location': redirectUrl,
                'Referrer-Policy': 'no-referrer',
            },
        });

    } catch (error) {
        // If any API error, log it and fall back to next() to be safe?
        // Or return 500? Better to fall through so user sees something (maybe 404 page) than a blank error.
        console.error('Pages Function Error:', error);
        return next();
    }
}

// ============================================
// HELPERS (Same as Worker)
// ============================================

function handleIntermediateRedirect(url) {
    const dest = url.searchParams.get('dest') || '';
    if (!dest) return new Response('Missing destination', { status: 400 });

    let finalDest;
    try { finalDest = atob(dest); } catch { return new Response('Invalid dest', { status: 400 }); }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Redirecting...</title>
<style>
body{display:flex;justify-content:center;align-items:center;height:100vh;background:#fff;font-family:sans-serif;flex-direction:column}
.loader{border:4px solid #f3f3f3;border-top:4px solid #3498db;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;margin-bottom:20px}
@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
p{color:#666;font-size:14px}
</style>
<script>setTimeout(function(){window.location.href=${JSON.stringify(finalDest)}},100);</script>
</head><body><div class="loader"></div><p>Secure Redirect...</p></body></html>`;
    return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}

function handleVideoLanding(url) {
    const dest = url.searchParams.get('dest') || '';
    if (!dest) return new Response('Missing destination', { status: 400 });
    let finalDest;
    try { finalDest = atob(dest); } catch { return new Response('Invalid dest', { status: 400 }); }

    const videoNum = Math.random() < 0.5 ? 1 : 2;
    const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Loading...</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{display:flex;justify-content:center;align-items:center;min-height:100vh;background:#000;cursor:pointer}
.video-container{position:relative;width:100%;max-width:800px;display:flex;justify-content:center;align-items:center}
video{width:100%;height:auto;max-height:100vh;object-fit:contain}
.overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:10;cursor:pointer}.timer{position:fixed;top:20px;right:20px;background:rgba(0,0,0,0.7);color:#fff;padding:10px 20px;border-radius:8px;font-family:sans-serif;font-size:14px;z-index:20;display:none}
</style></head><body><div class="timer" id="timer">Redirecting in 3...</div><div class="overlay" onclick="redirect()"></div>
<div class="video-container"><video autoplay muted loop playsinline><source src="/videos/video${videoNum}.mp4" type="video/mp4"></video></div>
<script>let countdown=3;const timerEl=document.getElementById('timer');const targetUrl=${JSON.stringify(finalDest)};
const interval=setInterval(()=>{countdown--;if(countdown<=0){clearInterval(interval);redirect()}else{timerEl.textContent='Redirecting in '+countdown+'...'}},1000);
function redirect(){clearInterval(interval);window.location.href=targetUrl}</script></body></html>`;
    return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}

function renderOGMeta(linkData, request) {
    const host = new URL(request.url).host;
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
  <title>${escapeHtml(linkData.ogTitle || 'Check this out!')}</title>
  <meta property="og:type" content="website"/>
  <meta property="og:url" content="https://${host}/${linkData.slug}"/>
  <meta property="og:title" content="${escapeHtml(linkData.ogTitle || 'Check this out!')}"/>
  <meta property="og:description" content="${escapeHtml(linkData.ogDescription || 'Click to see more!')}"/>
  <meta property="og:image" content="${escapeHtml(linkData.ogImage || '')}"/>
  </head><body>Redirecting...</body></html>`;
    return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}

async function supabaseQuery(env, table, query, method) {
    return await (await fetch(`${env.SUPABASE_URL}/rest/v1/${table}?${query}`, {
        method, headers: { 'apikey': env.SUPABASE_ANON_KEY, 'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}` }
    })).json();
}
async function supabaseInsert(env, table, data) {
    return await (await fetch(`${env.SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST', body: JSON.stringify(data),
        headers: { 'apikey': env.SUPABASE_ANON_KEY, 'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' }
    })).json();
}
async function supabaseRpc(env, rpc, data) {
    return await (await fetch(`${env.SUPABASE_URL}/rest/v1/${rpc}`, {
        method: 'POST', body: JSON.stringify(data),
        headers: { 'apikey': env.SUPABASE_ANON_KEY, 'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' }
    })).json();
}
function generateExternalId() { const b = new Uint8Array(25); crypto.getRandomValues(b); return Array.from(b).map(x => x.toString(16).padStart(2, '0')).join(''); }
function escapeHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function detectOS(ua) {
    if (!ua) return 'Unknown';
    const u = ua.toLowerCase();
    if (u.includes('iphone') || u.includes('ipad') || u.includes('ipod')) return 'iOS';
    if (u.includes('android')) return 'Android';
    if (u.includes('windows')) return 'Windows';
    if (u.includes('macintosh') || u.includes('mac os')) return 'macOS';
    if (u.includes('linux')) return 'Linux';
    if (u.includes('cros')) return 'ChromeOS';
    return 'Unknown';
}

function detectBrowser(ua) {
    if (!ua) return 'Unknown';
    const u = ua.toLowerCase();
    if (u.includes('instagram')) return 'Instagram';
    if (u.includes('fban') || u.includes('fbav') || u.includes('fb_iab')) return 'Facebook';
    if (u.includes('tiktok')) return 'TikTok';
    if (u.includes('twitter')) return 'Twitter';
    if (u.includes('snapchat')) return 'Snapchat';
    if (u.includes('whatsapp')) return 'WhatsApp';
    if (u.includes('telegram')) return 'Telegram';
    if (u.includes('line/')) return 'LINE';
    if (u.includes('edg/') || u.includes('edge/')) return 'Edge';
    if (u.includes('opr/') || u.includes('opera')) return 'Opera';
    if (u.includes('brave')) return 'Brave';
    if (u.includes('firefox') || u.includes('fxios')) return 'Firefox';
    if (u.includes('samsungbrowser')) return 'Samsung Browser';
    if (u.includes('ucbrowser') || u.includes('ucweb')) return 'UC Browser';
    if ((u.includes('chrome') || u.includes('crios')) && !u.includes('edg')) return 'Chrome';
    if (u.includes('safari') && !u.includes('chrome') && !u.includes('crios')) return 'Safari';
    return 'Other';
}
