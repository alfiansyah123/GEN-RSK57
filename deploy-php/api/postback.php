<?php
// api/postback.php - Conversion Tracking (Supabase/PostgreSQL version)
// FUNGSI SAMA PERSIS dengan versi MySQL
// Receives S2S postbacks from CPA Networks
// Usage: /api/postback.php?clickid={clickid}&payout={payout}&smartlink={subid}&network=NetworkName&country={geo}

require_once __DIR__ . '/../config.php';

// --- DEBUGGING START ---
$debugFile = __DIR__ . '/postback_debug.log';
$entry = "=== " . date('Y-m-d H:i:s') . " ===\n";
$entry .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "\n";
$entry .= "Raw URI: " . ($_SERVER['REQUEST_URI'] ?? '') . "\n";
$entry .= "GET Params: " . print_r($_GET, true) . "\n";
file_put_contents($debugFile, $entry, FILE_APPEND);
// --- DEBUGGING END ---

// Helper to find first non-empty param
function getFirstNonEmpty($params, $keys) {
    foreach ($keys as $key) {
        if (!empty($params[$key])) {
            return $params[$key];
        }
    }
    return null;
}

// Accept network/source
$networkParam = getFirstNonEmpty($_GET, ['network', 'source', 'affiliate', 'aff']);
$networkNameValue = $networkParam ? strtolower($networkParam) : '';

// Accept clickid
$clickIdKeys = ['clickid', 'click_id', 'cid', 'track'];
if (strpos($networkNameValue, 'trafee') !== false) {
    $clickIdKeys[] = 'external_id';
}
$clickIdParam = getFirstNonEmpty($_GET, $clickIdKeys);

$payout = $_GET['payout'] ?? $_GET['sum'] ?? 0.00;
if (!is_numeric($payout) || empty($payout)) {
    $payout = 0.00;
}
$currency = $_GET['currency'] ?? 'USD';
$status = $_GET['status'] ?? 'approved';
$txid = $_GET['txid'] ?? null;

// Accept SMARTLINK/TRACKER NAME (sub_id)
$smartlinkParam = getFirstNonEmpty($_GET, ['smartlink', 'subid', 'sub_id', 'tracker', 'campaign', 's1', 's2', 's3', 's4', 'subsource', 'sub_source']);

// Accept country
$countryParam = getFirstNonEmpty($_GET, ['country', 'geo', 'country_code', 'cc']);

// Accept IP
$ipParam = getFirstNonEmpty($_GET, ['ip', 'user_ip', 'uip']);

// Accept User Agent
$uaParam = getFirstNonEmpty($_GET, ['ua', 'user_agent', 'useragent']);

// Accept traffic type
$trafficParam = getFirstNonEmpty($_GET, ['traffic', 'traffic_type', 'device']);

if (!$clickIdParam && !$smartlinkParam) {
    http_response_code(400);
    die("Error: Missing clickid or smartlink");
}

try {
    // 1. Resolve Details
    $network = $networkParam ? $networkParam : 'Unknown';
    $trackerName = $smartlinkParam ? $smartlinkParam : 'Unknown';
    
    // Country Logic
    $country = ($countryParam && $countryParam !== 'XX') ? strtoupper($countryParam) : null;
    if ($country === 'UK') { $country = 'GB'; }
    if ($country === 'UKRAINE' || $country === 'UKR') { $country = 'UA'; }
    
    // IP Geolocation Fallback
    if (empty($country) && $ipParam) {
        $geoResponse = @file_get_contents("http://ip-api.com/json/{$ipParam}?fields=countryCode");
        if ($geoResponse) {
            $geoData = json_decode($geoResponse, true);
            if (!empty($geoData['countryCode'])) {
                $country = strtoupper($geoData['countryCode']);
            }
        }
    }
    
    if (empty($country)) {
        $country = 'XX';
    }
    
    $countryName = ($country !== 'XX') ? $country : 'Unknown';

    // IP Logic
    if ($ipParam) {
        $ip = $ipParam;
    } else {
        $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] 
            ?? $_SERVER['HTTP_X_FORWARDED_FOR'] 
            ?? $_SERVER['HTTP_X_REAL_IP'] 
            ?? $_SERVER['REMOTE_ADDR'] 
            ?? '0.0.0.0';
        if (strpos($ip, ',') !== false) {
             $ip = trim(explode(',', $ip)[0]);
        }
    }
    
    // User Agent
    $userAgent = $uaParam ?? $_SERVER['HTTP_USER_AGENT'] ?? '';
    
    // Traffic Type
    if ($trafficParam) {
        $trafficType = strtoupper($trafficParam);
    } else {
        $trafficType = 'WAP';
        $ua = strtolower($userAgent);
        if (strpos($ua, 'bot') !== false || strpos($ua, 'spider') !== false || strpos($ua, 'crawler') !== false) {
            $trafficType = 'BOT';
        } elseif (strpos($ua, 'mobile') !== false || strpos($ua, 'android') !== false || strpos($ua, 'iphone') !== false) {
            $trafficType = 'WAP';
        }
    }

    // --- CLICK DATA LOOKUP ---
    // Di Supabase: semua tabel dalam 1 database, jadi tidak perlu cross-db prefix lagi
    $clickLookupId = $clickIdParam;
    $clickRecord = null;
    
    if (empty($ipParam) || $country === 'XX') {
        try {
            // METHOD 1: Direct lookup by external_id
            if ($clickLookupId) {
                $stmt = $pdo->prepare('SELECT ip, country, "userAgent" FROM click WHERE external_id = $1 ORDER BY "createdAt" DESC LIMIT 1');
                $stmt->execute([$clickLookupId]);
                $clickRecord = $stmt->fetch(PDO::FETCH_ASSOC);
            }
            // METHOD 2: By tracker name + network
            if (!$clickRecord && $trackerName && $trackerName !== 'Unknown') {
                $stmt = $pdo->prepare('
                    SELECT c.ip, c.country, c."userAgent" 
                    FROM click c
                    INNER JOIN link l ON c."linkId" = l.id
                    INNER JOIN tracker t ON CAST(l."trackerId" AS INTEGER) = t.id
                    WHERE t.name = $1 
                    AND l.network = $2
                    ORDER BY c."createdAt" DESC 
                    LIMIT 1
                ');
                $stmt->execute([$trackerName, $network]);
                $clickRecord = $stmt->fetch(PDO::FETCH_ASSOC);
            }
            
            // METHOD 3: By tracker name only
            if (!$clickRecord && $trackerName && $trackerName !== 'Unknown') {
                $stmt = $pdo->prepare('
                    SELECT c.ip, c.country, c."userAgent" 
                    FROM click c
                    INNER JOIN link l ON c."linkId" = l.id
                    INNER JOIN tracker t ON CAST(l."trackerId" AS INTEGER) = t.id
                    WHERE t.name = $1
                    ORDER BY c."createdAt" DESC 
                    LIMIT 1
                ');
                $stmt->execute([$trackerName]);
                $clickRecord = $stmt->fetch(PDO::FETCH_ASSOC);
            }
            
            // Apply found click data
            if ($clickRecord) {
                if (empty($ipParam) && !empty($clickRecord['ip'])) {
                    $ip = $clickRecord['ip'];
                }
                if ($country === 'XX' && !empty($clickRecord['country']) && $clickRecord['country'] !== 'XX') {
                    $country = strtoupper($clickRecord['country']);
                    $countryName = $country;
                }
            }
        } catch (Exception $e) {
            // Silent error
        }
    }

    // 2. Insert into 'conversions' table
    $subId = $trackerName !== 'Unknown' ? $trackerName : $clickIdParam;

    $dbClickId = $clickIdParam;
    if (empty($dbClickId)) {
        $dbClickId = (!empty($subId) && $subId !== 'Unknown') ? $subId : ('gen-' . uniqid());
    }

    // PostgreSQL: menggunakan $N placeholders dan CAST untuk enum
    $stmt = $pdo->prepare("INSERT INTO conversions (click_id, sub_id, network, country, country_name, traffic_type, earning, ip_address, user_agent) 
                           VALUES ($1, $2, $3, $4, $5, $6::traffic_type_enum, $7, $8, $9)");
    
    $finalCountry = ($country === 'UK' ? 'GB' : ($country === 'UKRAINE' ? 'UA' : $country));
    
    $stmt->execute([
        $dbClickId,
        $subId,
        $network,
        $finalCountry,
        $country !== 'XX' ? $country : 'Unknown',
        $trafficType,
        $payout,
        $ip,
        $userAgent
    ]);

    // 3. Update 'daily_reports' - PostgreSQL: ON CONFLICT instead of ON DUPLICATE KEY
    $today = date('Y-m-d', strtotime('+7 hours'));
    $stmt = $pdo->prepare("INSERT INTO daily_reports (date, smartlink, network, leads, payout) 
                           VALUES ($1, $2, $3, 1, $4) 
                           ON CONFLICT (date, smartlink, network) 
                           DO UPDATE SET leads = daily_reports.leads + 1, payout = daily_reports.payout + $5");
    $stmt->execute([$today, $subId, $network, $payout, $payout]);

    // 4. UPDATE link table (sekarang dalam 1 database, tidak perlu cross-db prefix)
    try {
        // Update by Tracker Name + Network
        $stmt = $pdo->prepare('UPDATE link SET "leadCount" = "leadCount" + 1, "totalPayout" = "totalPayout" + $1
                               FROM tracker t 
                               WHERE CAST(link."trackerId" AS INTEGER) = t.id 
                               AND t.name = $2 AND link.network = $3');
        $stmt->execute([$payout, $subId, $network]);
        
        // Fallback: Update by Slug + Network
        if ($stmt->rowCount() == 0) {
             $stmt = $pdo->prepare('UPDATE link 
                                   SET "leadCount" = "leadCount" + 1, 
                                       "totalPayout" = "totalPayout" + $1
                                   WHERE slug = $2 AND network = $3');
             $stmt->execute([$payout, $subId, $network]);
        }
    } catch (Exception $e) {
        // Silent error
    }

    http_response_code(200);
    echo "OK: Conversion recorded. SubID: $subId, Link table updated.";

} catch (PDOException $e) {
    http_response_code(500);
    echo "Error: " . $e->getMessage();
}
?>
