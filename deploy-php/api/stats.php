<?php
// api/stats.php - Reports & Stats (Supabase/PostgreSQL version)
// FUNGSI SAMA PERSIS dengan versi MySQL
// Handles /api/reports

require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'GET') {
    http_response_code(405);
    exit;
}

$mode = $_GET['mode'] ?? 'stats';
$startDate = $_GET['startDate'] ?? date('Y-m-d', strtotime('-30 days'));
$endDate = $_GET['endDate'] ?? date('Y-m-d', strtotime('+1 day'));

try {
    if ($mode === 'conversions') {
        // Detailed Conversion Logs
        // PostgreSQL: DATE_SUB → col - INTERVAL '7 hours'
        $sql = "SELECT 
                    id,
                    earning,
                    click_id as \"clickId\",
                    created_at,
                    ip_address as \"ipAddress\",
                    country,
                    user_agent as \"userAgent\",
                    network,
                    traffic_type as traffic,
                    sub_id as smartlink
                FROM conversions 
                WHERE DATE(created_at - INTERVAL '7 hours') >= $1 
                  AND DATE(created_at - INTERVAL '7 hours') <= $2
                ORDER BY created_at DESC LIMIT 500";
                
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$startDate, $endDate]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($rows as &$row) {
             if (empty($row['traffic'])) {
                 $ua = strtolower($row['userAgent'] ?? '');
                 if (strpos($ua, 'bot') !== false) $row['traffic'] = 'BOT';
                 elseif (strpos($ua, 'mobile') !== false) $row['traffic'] = 'WAP';
                 else $row['traffic'] = 'WEB';
             }

            if (!empty($row['country']) && $row['country'] !== 'XX') {
                $row['flag'] = 'https://flagcdn.com/w40/' . strtolower($row['country']) . '.png';
            } else {
                $row['flag'] = 'https://flagcdn.com/w40/un.png';
            }
        }
        
        echo json_encode(['data' => $rows]);
        return;
        
    } else {
        // COMPLEX AGGREGATION FOR ACCURATE REPORTS
        // Di Supabase: semua tabel dalam 1 database, tidak perlu cross-db prefix
        
        // 1. Get Accurate Leads & Revenue from Conversions table
        $sqlConv = "SELECT sub_id as \"trackerName\", network, 
                           COUNT(*) as \"distinctLeads\", 
                           SUM(earning) as \"distinctRevenue\"
                    FROM conversions 
                    WHERE DATE(created_at) >= $1 
                      AND DATE(created_at) <= $2
                    GROUP BY sub_id, network";
                    
        $stmt = $pdo->prepare($sqlConv);
        $stmt->execute([$startDate, $endDate]);
        $convRows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Index conversion data
        $convMap = [];
        foreach ($convRows as $row) {
            $key = strtolower($row['trackerName']) . '|' . strtolower($row['network']);
            $convMap[$key] = [
                'leads' => (int)$row['distinctLeads'],
                'revenue' => (float)$row['distinctRevenue']
            ];
        }

        // 2. Get Clicks from click table (ACCURATE DAILY CLICKS)
        $sqlLink = 'SELECT t.name as "trackerName", l.network, 
                           COUNT(c.id) as "totalClicks"
                    FROM click c
                    JOIN link l ON c."linkId" = l.id
                    JOIN tracker t ON CAST(l."trackerId" AS INTEGER) = t.id
                    WHERE DATE(c."createdAt") >= $1 
                      AND DATE(c."createdAt") <= $2
                    GROUP BY t.name, l.network';
                    
        $stmt = $pdo->prepare($sqlLink);
        $stmt->execute([$startDate, $endDate]);
        $linkRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // 3. Merge Data (LOGIC SAMA PERSIS)
        $finalData = [];
        $processedKeys = [];

        foreach ($linkRows as $row) {
             $tName = $row['trackerName'] ?? 'Unknown';
             $net = $row['network'] ?? 'Unknown';
             $key = strtolower($tName) . '|' . strtolower($net);
             
             $stats = $convMap[$key] ?? ['leads' => 0, 'revenue' => 0];
             
             if ($row['totalClicks'] == 0 && $stats['leads'] == 0) continue;

             $finalData[$key] = [
                 'trackerName' => $tName,
                 'network' => $net,
                 'clicks' => (int)$row['totalClicks'],
                 'leads' => $stats['leads'],
                 'revenue' => $stats['revenue']
             ];
             $processedKeys[$key] = true;
        }

        // Second pass: Orphan Conversions
        foreach ($convMap as $key => $stats) {
            if (!isset($processedKeys[$key])) {
                list($tName, $net) = explode('|', $key);
                $finalData[$key] = [
                    'trackerName' => ucfirst($tName),
                    'network' => ucfirst($net),
                    'clicks' => 0,
                    'leads' => $stats['leads'],
                    'revenue' => $stats['revenue']
                ];
            }
        }

        // Format for Frontend (SAME OUTPUT)
        $data = [];
        $counter = 1;
        foreach ($finalData as $row) {
            $clicks = $row['clicks'];
            $leads = $row['leads'];
            $revenue = $row['revenue'];
            
            if ($clicks === 0 && $leads === 0) continue;

            $cr = $clicks > 0 ? ($leads / $clicks) * 100 : 0;
            
            $data[] = [
                'id' => $counter++,
                'smartlink' => $row['trackerName'],
                'network' => $row['network'],
                'clicks' => $clicks,
                'leads' => $leads,
                'cr' => $cr,
                'payouts' => $revenue
            ];
        }
        
        echo json_encode(['data' => $data]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
