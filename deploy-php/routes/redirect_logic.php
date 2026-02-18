<?php
// routes/redirect_logic.php
// Called from index.php when a valid Link slug is found ($link contains the row)

// 1. Crawler Detection
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
$crawlerPatterns = ['facebookexternalhit', 'Facebot', 'Twitterbot', 'LinkedInBot', 'WhatsApp', 'TelegramBot', 'Pinterest', 'Googlebot', 'bingbot'];

$isCrawler = false;
foreach ($crawlerPatterns as $pattern) {
    if (stripos($userAgent, $pattern) !== false) {
        $isCrawler = true;
        break;
    }
}

if ($isCrawler && !empty($link['ogImage'])) {
    // Render Open Graph HTML
    ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($link['ogTitle'] ?? 'Check this out!') ?></title>
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://<?= $_SERVER['HTTP_HOST'] ?>/<?= $link['slug'] ?>" />
    <meta property="og:title" content="<?= htmlspecialchars($link['ogTitle'] ?? 'Check this out!') ?>" />
    <meta property="og:description" content="<?= htmlspecialchars($link['ogDescription'] ?? 'Click to see more!') ?>" />
    <meta property="og:image" content="<?= htmlspecialchars($link['ogImage']) ?>" />
</head>
<body>Redirecting...</body>
</html>
    <?php
    exit;
}

// 2. Get IP and Country
// 2. Get IP and Country
function get_client_ip() {
    if (isset($_SERVER["HTTP_CF_CONNECTING_IP"])) {
        return $_SERVER["HTTP_CF_CONNECTING_IP"];
    }
    if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip_list = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($ip_list[0]);
    }
    return $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';
}

$clientIp = get_client_ip();
if ($clientIp === '::1' || $clientIp === '127.0.0.1') {
    $mockIps = ['1.1.1.1', '103.1.1.1', '8.8.8.8'];
    $clientIp = $mockIps[array_rand($mockIps)];
}

// GeoIP Lookup (Cloudflare Priority -> IP-API Fallback)
$country = 'XX';
if (isset($_SERVER["HTTP_CF_IPCOUNTRY"])) {
    $country = strtoupper($_SERVER["HTTP_CF_IPCOUNTRY"]);
} else {
    // Fallback to IP-API (Free Tier - Use with caution on high traffic)
    // Timeout set to 2s to not block redirection too long
    $ctx = stream_context_create(['http' => ['timeout' => 2]]);
    $json = @file_get_contents("http://ip-api.com/json/$clientIp?fields=countryCode", false, $ctx);
    if ($json) {
        $data = json_decode($json, true);
        if (isset($data['countryCode'])) {
            $country = strtoupper($data['countryCode']);
        }
    }
}
// 3. Country Blocking (ID -> SAFE PAGE)
if ($country === 'ID') {
    header("Location: https://www.youtube.com");
    exit;
}

// 4. Record Click
$year = date('Y');
$network = strtoupper($link['network'] ?? 'UNKNOWN');
$uaShort = stripos($userAgent, 'mobile') !== false ? 'MOB' : 'WEB';

// Generate Random External ID (50 Chars) - for exclusive look
$externalId = bin2hex(random_bytes(25));

try {
    $stmt = $pdo->prepare("INSERT INTO click (linkId, ip, country, userAgent, external_id, createdAt) VALUES (?, ?, ?, ?, ?, NOW())");
    $stmt->execute([$link['id'], $clientIp, $country, substr($userAgent, 0, 500), $externalId]);
    $dbClickId = $pdo->lastInsertId();

    $stmt = $pdo->prepare("UPDATE link SET clickCount = clickCount + 1 WHERE id = ?");
    $stmt->execute([$link['id']]);
} catch (Exception $e) {
    // Fallback if DB insert fails
    $dbClickId = 0;
    // If insert failed, externalId is useless, but we'll fallback to slug later
}

// 5a. Fetch Tracker Name (Moved up for use in Final URL)
try {
    $stmt = $pdo->prepare("SELECT name FROM tracker WHERE id = ?");
    $stmt->execute([$link['trackerId']]);
    $trackerName = $stmt->fetchColumn();
    $trackerParam = $trackerName ? urlencode($trackerName) : $link['trackerId'];
} catch (Exception $e) {
    $trackerName = 'unknown';
    $trackerParam = $link['trackerId'];
}

// 6. Construct Final URL
// User Request: Use the Link SLUG as the click_id passed to the network.
// REVISION: Use Unique Database ID ($dbClickId) to ensure we can look up the correct IP later.
// REVISION 2: Use Random External ID for privacy + uniqueness (Requested by User)
$finalClickIdentifier = $dbClickId > 0 ? $externalId : $link['slug']; 

$finalUrl = $link['targetUrl'];

// --- GEO REDIRECT LOGIC ---
if (strpos($finalUrl, 'GEO_REDIRECT::') === 0) {
    try {
        $jsonStr = substr($finalUrl, 14); // Remove 'GEO_REDIRECT::'
        $geoRules = json_decode($jsonStr, true);
        
        if (json_last_error() === JSON_ERROR_NONE) {
            $tier1Countries = $geoRules['tier1Countries'] ?? [];
            
            if (in_array($country, $tier1Countries)) {
                $finalUrl = $geoRules['tier1Url'];
            } else {
                $finalUrl = $geoRules['tier2Url'];
            }
        }
    } catch (Exception $e) {
        // Fallback or log error
    }
}
// --------------------------

// Replace {click_id}
if (strpos($finalUrl, '{click_id}') !== false) {
    $finalUrl = str_replace('{click_id}', $finalClickIdentifier, $finalUrl);
} else {
    $separator = (strpos($finalUrl, '?') !== false) ? '&' : '?';
    $finalUrl .= $separator . "click_id=" . $finalClickIdentifier;
}

// Replace {sub_id} with Tracker Name (e.g. DANCOK)
if (strpos($finalUrl, '{sub_id}') !== false) {
    $tName = $trackerName ?? 'unknown';
    $finalUrl = str_replace('{sub_id}', urlencode($tName), $finalUrl);
}

// 7. Intermediate Redirect
$immediateDest = $finalUrl;
if ($link['useLandingPage']) {
    // Encode final offer for video page
    $encodedFinal = base64_encode($finalUrl);
    $immediateDest = "/_video/landing?dest=" . $encodedFinal;
}

$encodedDest = base64_encode($immediateDest);
$redirectUrl = "/_meetups/r.php?click_id=$trackerParam&country_code=" . strtolower($country) . "&user_agent=web&ip_address=$clientIp&user_lp=" . strtolower($network) . "&dest=$encodedDest";

header("Referrer-Policy: no-referrer");
header("Location: $redirectUrl");
exit;
?>
