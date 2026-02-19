// Cloudflare Worker — Redirect Server
// Replaces deploy-php/index.php + redirect_logic.php + system_routes.php
// Fungsi SAMA PERSIS, hanya ditulis ulang dari PHP ke JavaScript

const CRAWLER_PATTERNS = [
    'facebookexternalhit', 'Facebot', 'Twitterbot', 'LinkedInBot',
    'WhatsApp', 'TelegramBot', 'Pinterest', 'Googlebot', 'bingbot'
];

// ============================================
// MAIN HANDLER
// ============================================
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;

        // --- System Routes ---
        if (path === '/_meetups/r.php') {
            return handleIntermediateRedirect(url);
        }
        if (path === '/_video/landing') {
            return handleVideoLanding(url);
        }

        // --- Skip static files and root ---
        if (path === '/' || /\.(html|css|js|png|jpg|jpeg|gif|ico|svg)$/.test(path)) {
            return new Response('Not Found', { status: 404 });
        }

        // --- Short Link Redirect ---
        const slug = path.replace(/^\//, '');
        return handleRedirect(request, env, slug);
    }
};

// ============================================
// SHORT LINK REDIRECT (redirect_logic.php)
// ============================================
async function handleRedirect(request, env, slug) {
    // 1. Lookup slug in Supabase
    const link = await supabaseQuery(env, 'link', `slug=eq.${slug}`, 'GET');
    if (!link || link.length === 0) {
        return new Response('Link not found', { status: 404 });
    }
    const linkData = link[0];

    // 2. Crawler Detection → OG Meta
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const isCrawler = CRAWLER_PATTERNS.some(p => userAgent.toLowerCase().includes(p.toLowerCase()));

    if (isCrawler && linkData.ogImage) {
        return renderOGMeta(linkData, request);
    }

    // 3. Get IP and Country (Cloudflare built-in)
    const clientIp = request.headers.get('cf-connecting-ip') || '0.0.0.0';
    const country = (request.cf && request.cf.country) ? request.cf.country.toUpperCase() : 'XX';

    // 4. Country Blocking (ID → YouTube)
    if (country === 'ID') {
        return Response.redirect('https://www.youtube.com', 302);
    }

    // 5. Record Click
    const url = new URL(request.url);
    const subId = url.searchParams.get('s3') ||
        url.searchParams.get('sub_id') ||
        url.searchParams.get('subid') ||
        url.searchParams.get('cid') ||
        url.searchParams.get('external_id');

    const network = (linkData.network || 'UNKNOWN').toUpperCase();
    const externalId = subId || generateExternalId();
    let dbClickId = 0;

    try {
        const detectedOS = detectOS(userAgent);
        const detectedBrowser = detectBrowser(userAgent);

        const clickData = {
            link_id: linkData.id,
            slug: slug,
            ip_address: clientIp,
            country: country,
            user_agent: userAgent.substring(0, 500),
            click_id: externalId,
            os: detectedOS,
            browser: detectedBrowser,
            referer: request.headers.get('referer') || '',
        };

        // Record ONLY to LOCAL clicks table
        const clickResult = await supabaseInsert(env, 'clicks', clickData);

        if (clickResult && clickResult.length > 0) {
            dbClickId = clickResult[0].id;
        }

        // Update click count
        await supabaseRpc(env, 'rpc/increment_click_count', { link_id: linkData.id });
    } catch (e) {
        // Continue even if click recording fails
        console.error('Click recording error:', e);
    }

    // 5a. Fetch Tracker Name
    let trackerParam = linkData.trackerId;
    try {
        const tracker = await supabaseQuery(env, 'tracker', `id=eq.${linkData.trackerId}`, 'GET');
        if (tracker && tracker.length > 0) {
            trackerParam = encodeURIComponent(tracker[0].name);
        }
    } catch (e) {
        // Fallback
    }

    // 6. Construct Final URL
    const finalClickIdentifier = dbClickId > 0 ? externalId : slug;
    let finalUrl = linkData.targetUrl;

    // --- GEO REDIRECT LOGIC ---
    if (finalUrl.startsWith('GEO_REDIRECT::')) {
        try {
            const jsonStr = finalUrl.substring(14);
            const geoRules = JSON.parse(jsonStr);
            const tier1Countries = geoRules.tier1Countries || [];

            if (tier1Countries.includes(country)) {
                finalUrl = geoRules.tier1Url;
            } else {
                finalUrl = geoRules.tier2Url;
            }
        } catch (e) {
            // Fallback
        }
    }

    // Replace {click_id}
    if (finalUrl.includes('{click_id}')) {
        finalUrl = finalUrl.replace(/{click_id}/g, finalClickIdentifier);
    } else {
        const separator = finalUrl.includes('?') ? '&' : '?';
        finalUrl += `${separator}click_id=${finalClickIdentifier}`;
    }

    // Replace {sub_id} with Tracker Name
    if (finalUrl.includes('{sub_id}')) {
        finalUrl = finalUrl.replace(/{sub_id}/g, trackerParam);
    }

    // 7. Intermediate Redirect
    let immediateDest = finalUrl;
    if (linkData.useLandingPage) {
        const encodedFinal = btoa(finalUrl);
        immediateDest = `/_video/landing?dest=${encodedFinal}`;
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
}

// ============================================
// INTERMEDIATE REDIRECT (/_meetups/r.php)
// ============================================
function handleIntermediateRedirect(url) {
    const dest = url.searchParams.get('dest') || '';
    if (!dest) {
        return new Response('Missing destination', { status: 400 });
    }

    let finalDest;
    try {
        finalDest = atob(dest);
    } catch {
        return new Response('Invalid destination', { status: 400 });
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redirecting...</title>
  <style>
    body { display: flex; justify-content: center; align-items: center; height: 100vh; background: #fff; font-family: sans-serif; flex-direction: column; }
    .loader { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    p { color: #666; font-size: 14px; }
  </style>
  <script>
    setTimeout(function() {
      window.location.href = ${JSON.stringify(finalDest)};
    }, 100);
  </script>
</head>
<body>
  <div class="loader"></div>
  <p>Secure Redirect...</p>
</body>
</html>`;

    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=UTF-8' },
    });
}

// ============================================
// VIDEO LANDING PAGE (/_video/landing)
// ============================================
function handleVideoLanding(url) {
    const dest = url.searchParams.get('dest') || '';
    if (!dest) {
        return new Response('Missing destination', { status: 400 });
    }

    let finalDest;
    try {
        finalDest = atob(dest);
    } catch {
        return new Response('Invalid destination', { status: 400 });
    }

    const videoNum = Math.random() < 0.5 ? 1 : 2;
    const videoPath = `/videos/video${videoNum}.mp4`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loading...</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #000; cursor: pointer; }
    .video-container { position: relative; width: 100%; max-width: 800px; display: flex; justify-content: center; align-items: center; }
    video { width: 100%; height: auto; max-height: 100vh; object-fit: contain; }
    .overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 10; cursor: pointer; }
    .timer { position: fixed; top: 20px; right: 20px; background: rgba(0,0,0,0.7); color: #fff; padding: 10px 20px; border-radius: 8px; font-family: sans-serif; font-size: 14px; z-index: 20; display: none; }
  </style>
</head>
<body>
  <div class="timer" id="timer">Redirecting in 3...</div>
  <div class="overlay" onclick="redirect()"></div>
  <div class="video-container">
    <video autoplay muted loop playsinline>
      <source src="${videoPath}" type="video/mp4">
    </video>
  </div>
  <script>
    let countdown = 3;
    const timerEl = document.getElementById('timer');
    const targetUrl = ${JSON.stringify(finalDest)};

    const interval = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(interval);
        redirect();
      } else {
        timerEl.textContent = 'Redirecting in ' + countdown + '...';
      }
    }, 1000);

    function redirect() {
      clearInterval(interval);
      window.location.href = targetUrl;
    }
  </script>
</body>
</html>`;

    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=UTF-8' },
    });
}

// ============================================
// OG META RENDERER (for crawlers)
// ============================================
function renderOGMeta(linkData, request) {
    const host = new URL(request.url).host;
    const ogTitle = linkData.ogTitle || 'Check this out!';
    const ogDescription = linkData.ogDescription || 'Click to see more!';
    const ogImage = linkData.ogImage || '';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(ogTitle)}</title>
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://${host}/${linkData.slug}" />
  <meta property="og:title" content="${escapeHtml(ogTitle)}" />
  <meta property="og:description" content="${escapeHtml(ogDescription)}" />
  <meta property="og:image" content="${escapeHtml(ogImage)}" />
</head>
<body>Redirecting...</body>
</html>`;

    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=UTF-8' },
    });
}

// ============================================
// SUPABASE HELPERS
// ============================================
// Fallback Credentials
const FALLBACK_URL = 'https://vtlwptockofzbllnsyrg.supabase.co';
const FALLBACK_KEY = 'sb_publishable_0MWvjujUhXVBNq7P-30baA_Jqr1SYsm';

async function supabaseQuery(env, table, query, method = 'GET') {
    const url = (env.SUPABASE_URL || FALLBACK_URL) + `/rest/v1/${table}?${query}`;
    const key = env.SUPABASE_ANON_KEY || FALLBACK_KEY;
    const res = await fetch(url, {
        method,
        headers: { 'apikey': key, 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    });
    return res.json();
}

async function supabaseInsert(env, table, data) {
    const url = (env.SUPABASE_URL || FALLBACK_URL) + `/rest/v1/${table}`;
    const key = env.SUPABASE_ANON_KEY || FALLBACK_KEY;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
        },
        body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) console.error(`Worker Insert Error [${res.status}]:`, result);
    return result;
}

async function supabaseRpc(env, rpcPath, params) {
    const url = (env.SUPABASE_URL || FALLBACK_URL) + `/rest/v1/${rpcPath}`;
    const key = env.SUPABASE_ANON_KEY || FALLBACK_KEY;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'apikey': key, 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });
    return res.json();
}

// ============================================
// UTILITIES
// ============================================
function generateExternalId() {
    const bytes = new Uint8Array(25);
    crypto.getRandomValues(bytes);
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

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
