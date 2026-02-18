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
function get_client_ip() {
    $ipaddress = '';
    if (isset($_SERVER['HTTP_CLIENT_IP'])) $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
    else if(isset($_SERVER['HTTP_X_FORWARDED_FOR'])) $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
    else if(isset($_SERVER['HTTP_X_FORWARDED'])) $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
    else if(isset($_SERVER['HTTP_FORWARDED_FOR'])) $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
    else if(isset($_SERVER['HTTP_FORWARDED'])) $ipaddress = $_SERVER['HTTP_FORWARDED'];
    else if(isset($_SERVER['REMOTE_ADDR'])) $ipaddress = $_SERVER['REMOTE_ADDR'];
    else $ipaddress = 'UNKNOWN';
    return $ipaddress;
}

$clientIp = get_client_ip();
if ($clientIp === '::1' || $clientIp === '127.0.0.1') {
    // Mock for localhost
    $mockIps = ['1.1.1.1', '103.1.1.1', '8.8.8.8'];
    $clientIp = $mockIps[array_rand($mockIps)];
}

// GeoIP Lookup (Basic or fallback)
// In cPanel, if 'geoip' extension is not enabled, we default to 'XX'
// For this script, we'll try to use a free API if critical, OR just 'XX' for now to keep it dependency-free.
// Ideally, integrate with MaxMind DB or IP-API if user wants accurracy.
// For now, simple logic:
$country = 'XX'; 
// Example simple API call (optional, disabled for speed)
// $json = file_get_contents("http://ip-api.com/json/$clientIp?fields=countryCode");
// if ($json) { $data = json_decode($json, true); $country = $data['countryCode']; }

// 3. Country Blocking (ID -> SAFE PAGE)
if ($country === 'ID') {
    header("Location: https://www.youtube.com/watch?v=rQ9YQJ3JpWw");
    exit;
}

// 4. Record Click
$year = date('Y');
$network = strtoupper($link['network'] ?? 'UNKNOWN');
$uaShort = stripos($userAgent, 'mobile') !== false ? 'MOB' : 'WEB';

// 5. Encode Data ("Cooking")
$rawString = "$year,$country,$clientIp,$uaShort,$network";
$encodedData = base64_encode($rawString);
$finalClickId = $encodedData . $link['slug'];

try {
    $stmt = $pdo->prepare("INSERT INTO Click (linkId, ip, country, userAgent, createdAt) VALUES (?, ?, ?, ?, NOW())");
    $stmt->execute([$link['id'], $clientIp, $country, substr($userAgent, 0, 500)]);

    $stmt = $pdo->prepare("UPDATE Link SET clickCount = clickCount + 1 WHERE id = ?");
    $stmt->execute([$link['id']]);
} catch (Exception $e) {
    // Ignore logging errors
}

// 6. Construct Final URL
$finalUrl = $link['targetUrl'];
if (strpos($finalUrl, '{click_id}') !== false) {
    $finalUrl = str_replace('{click_id}', $finalClickId, $finalUrl);
} else {
    $separator = (strpos($finalUrl, '?') !== false) ? '&' : '?';
    $finalUrl .= $separator . "click_id=" . $finalClickId;
}

// 7. Intermediate Redirect
$immediateDest = $finalUrl;
if ($link['useLandingPage']) {
    // Encode final offer for video page
    $encodedFinal = base64_encode($finalUrl);
    $immediateDest = "/_video/landing?dest=" . $encodedFinal;
}

$encodedDest = base64_encode($immediateDest);
$redirectUrl = "/_meetups/r.php?click_id={$link['trackerId']}&country_code=" . strtolower($country) . "&user_agent=web&ip_address=$clientIp&user_lp=" . strtolower($network) . "&dest=$encodedDest";

header("Referrer-Policy: no-referrer");
header("Location: $redirectUrl");
exit;
?>
