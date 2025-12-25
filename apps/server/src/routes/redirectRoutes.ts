import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import geoip from 'geoip-lite';
import requestIp from 'request-ip';
import { broadcastClick } from '../websocket';

const router = Router();
const prisma = new PrismaClient();

// Social media crawler user agents
const crawlerPatterns = [
    'facebookexternalhit',
    'Facebot',
    'Twitterbot',
    'LinkedInBot',
    'WhatsApp',
    'TelegramBot',
    'Slackbot',
    'Discordbot',
    'Pinterest',
    'Googlebot',
    'bingbot',
    'Applebot'
];

// Check if request is from a social media crawler
const isCrawler = (userAgent: string): boolean => {
    return crawlerPatterns.some(pattern =>
        userAgent.toLowerCase().includes(pattern.toLowerCase())
    );
};

// GET /_meetups/r.php - Intermediate Tracker Page (Visual only)
router.get('/_meetups/r.php', (req, res) => {
    try {
        const { dest } = req.query;
        if (!dest) return res.send('Missing destination');

        // Decode the real target URL
        const finalDest = Buffer.from(dest as string, 'base64').toString('ascii');

        // Render a fake loading page (HTML) so the user SEES the URL in the browser
        const html = `
            <!DOCTYPE html>
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
                        window.location.href = "${finalDest}";
                    }, 100); // 0.1 seconds delay (User Request)
                </script>
            </head>
            <body>
                <div class="loader"></div>
                <p>Secure Redirect...</p>
            </body>
            </html>
        `;

        res.send(html);
    } catch (error) {
        console.error('Final Hop Error:', error);
        res.status(500).send('Error');
    }
});

// GET /:slug - Handle Redirect
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const userAgent = req.get('User-Agent') || 'Unknown';

        // 1. Find the link
        const link = await prisma.link.findUnique({
            where: { slug }
        });

        if (!link) {
            return res.status(404).send('Link not found');
        }

        // 2. Check if this is a social media crawler
        if (isCrawler(userAgent) && link.ogImage) {
            // Serve Open Graph HTML for crawlers
            const ogHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${link.ogTitle || 'Check this out!'}</title>
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://${link.domain}/${link.slug}" />
    <meta property="og:title" content="${link.ogTitle || 'Check this out!'}" />
    <meta property="og:description" content="${link.ogDescription || 'Click to see more!'}" />
    <meta property="og:image" content="${link.ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${link.ogTitle || 'Check this out!'}" />
    <meta name="twitter:description" content="${link.ogDescription || 'Click to see more!'}" />
    <meta name="twitter:image" content="${link.ogImage}" />
</head>
<body>
    <p>Redirecting...</p>
</body>
</html>`;
            return res.send(ogHtml);
        }

        // 2. Get User Info
        let clientIp = requestIp.getClientIp(req) || '127.0.0.1';

        // MOCK FOR LOCALHOST TESTING:
        // If localhost, use a random public IP to simulate different countries
        if (clientIp === '::1' || clientIp === '127.0.0.1') {
            const mockIps = [
                '1.1.1.1',     // AU/US (Cloudflare)
                '103.1.1.1',   // ID (Indonesia)
                '203.0.113.1', // Reserved/US
                '8.8.8.8',     // US (Google)
                '185.76.9.5'   // DE (Germany example)
            ];
            clientIp = mockIps[Math.floor(Math.random() * mockIps.length)];
        }

        const geo = geoip.lookup(clientIp);
        const country = geo ? geo.country : 'XX'; // XX for unknown
        console.log(`[DEBUG] IP: ${clientIp}, Country: ${country}`);

        // --- GEO BLOCKING / SAFE PAGE ---
        // If Country is ID (Indonesia), Redirect to Safe Page (YouTube)
        if (country === 'ID') {
            return res.redirect('https://www.youtube.com/watch?v=rQ9YQJ3JpWw');
        }
        // --------------------------------

        const year = new Date().getFullYear();
        const network = link.network ? link.network.toUpperCase() : 'UNKNOWN';
        const uaShort = userAgent.toLowerCase().includes('mobile') ? 'MOB' : 'WEB'; // Simple platform detection

        // 3. Encode Data (The "Cooking" Process)
        const rawString = `${year},${country},${clientIp},${uaShort},${network}`;
        const encodedData = Buffer.from(rawString).toString('base64');
        const finalClickId = `${encodedData}${slug}`;

        // 4. Record Click for Reporting (Granular data for clone-ngix)
        prisma.click.create({
            data: {
                linkId: link.id,
                ip: clientIp,
                country: country,
                userAgent: userAgent.substring(0, 500) // Limit UA length
            }
        }).catch(err => console.error('Error logging click:', err));

        // Also increment counter for quick access
        prisma.link.update({
            where: { id: link.id },
            data: { clickCount: { increment: 1 } }
        }).catch(err => console.error('Error updating click count:', err));

        // 5. Broadcast to Live Traffic WebSocket
        broadcastClick({
            trackerId: link.trackerId,
            country: country,
            ip: clientIp.substring(0, 10) + '***', // Mask IP for privacy
            platform: uaShort,
            network: network,
            timestamp: new Date().toISOString()
        });

        // 5. Construct Final Redirect URL
        let finalUrl = link.targetUrl;

        if (finalUrl.includes('{click_id}')) {
            finalUrl = finalUrl.replace('{click_id}', finalClickId);
        } else {
            const separator = finalUrl.includes('?') ? '&' : '?';
            finalUrl += `${separator}click_id=${finalClickId}`;
        }

        // --- INTERMEDIATE REDIRECT FOR NON-ID ---
        // Construct the visual URL params user requested
        const encodedDest = Buffer.from(finalUrl).toString('base64');
        const visualUrl = `/_meetups/r.php?click_id=${link.trackerId}&country_code=${country.toLowerCase()}&user_agent=web&ip_address=${clientIp}&user_lp=${network.toLowerCase()}&dest=${encodedDest}`;

        // Anti-Spam / Stealth Header: Hide Referrer
        res.set('Referrer-Policy', 'no-referrer');
        res.redirect(visualUrl);
        // ---------------------------------------

    } catch (error) {
        console.error('Redirect error:', error);
        res.status(500).send('Redirect Error');
    }
});

export default router;
