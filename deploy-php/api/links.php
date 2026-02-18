<?php
// api/links.php - Link Management (Supabase/PostgreSQL version)
// FUNGSI SAMA PERSIS dengan versi MySQL

// Basic Auth Check
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

$method = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];
$input = json_decode(file_get_contents('php://input'), true);

// 1. CREATE Link (POST /api/links)
if ($method === 'POST') {
    try {
        $slug = $input['slug'];
        $targetUrl = $input['targetUrl'];
        $domain = $input['domain'];
        $trackerId = $input['trackerId'];

        // Resolve Tracker ID if slug is passed
        if (!is_numeric($trackerId)) {
            $stmt = $pdo->prepare("SELECT id FROM tracker WHERE slug = $1");
            $stmt->execute([$trackerId]);
            $tracker = $stmt->fetch();
            if ($tracker) {
                $trackerId = $tracker['id'];
            } else {
                throw new Exception("Tracker not found for slug: " . $input['trackerId']);
            }
        }

        $network = $input['network'] ?? null;
        $useLandingPage = !empty($input['useLandingPage']);
        $ogImage = $input['ogImage'] ?? null;
        $ogTitle = $input['ogTitle'] ?? null;
        $ogDescription = $input['ogDescription'] ?? null;
        $branchKey = $input['branchKey'] ?? null;
        $isGeoRedirect = !empty($input['isGeoRedirect']);
        $geoRules = $input['geoRules'] ?? [];

        if ($isGeoRedirect && !empty($geoRules)) {
            $targetUrl = 'GEO_REDIRECT::' . json_encode($geoRules);
        }

        // Insert into DB (PostgreSQL: RETURNING id instead of lastInsertId)
        $stmt = $pdo->prepare('INSERT INTO link (slug, "targetUrl", domain, "trackerId", network, "useLandingPage", "ogImage", "ogTitle", "ogDescription", "clickCount", "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0, NOW()) RETURNING id');
        $stmt->execute([$slug, $targetUrl, $domain, (string)$trackerId, $network, $useLandingPage ? 'true' : 'false', $ogImage, $ogTitle, $ogDescription]);
        
        $insertResult = $stmt->fetch();
        $linkId = $insertResult['id'];
        
        // Fetch created link
        $stmt = $pdo->prepare("SELECT * FROM link WHERE id = $1");
        $stmt->execute([$linkId]);
        $link = $stmt->fetch();
        
        // --- Branch.io Integration (SAMA PERSIS) ---
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        $host = $domain ? $domain : $_SERVER['HTTP_HOST'];
        $localShortUrl = "$protocol$host/$slug";
        $finalGeneratedUrl = $localShortUrl;

        if ($branchKey) {
            $branchApiUrl = 'https://api2.branch.io/v1/url';
            $branchPayload = [
                'branch_key' => $branchKey,
                'data' => [
                    '$canonical_url' => $localShortUrl,
                    '$og_title' => $ogTitle ?? 'Check this out!',
                    '$og_description' => $ogDescription ?? 'Click to see more!',
                    '$og_image_url' => $ogImage ?? '',
                    '$desktop_url' => $localShortUrl,
                    '$android_url' => $localShortUrl,
                    '$ios_url' => $localShortUrl,
                    '~feature' => 'marketing',
                    '~channel' => $network ?? 'direct',
                    '~campaign' => $trackerId
                ]
            ];

            $ch = curl_init($branchApiUrl);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($branchPayload));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode >= 200 && $httpCode < 300) {
                $branchData = json_decode($response, true);
                if (isset($branchData['url'])) {
                    $finalGeneratedUrl = $branchData['url'];
                }
            }
        }
        // -----------------------------

        echo json_encode(["success" => true, "link" => $link, "generatedUrl" => $finalGeneratedUrl]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to create link: " . $e->getMessage()]);
    }
    exit;
}

// 2. LIST Links (GET /api/links?trackerId=...)
if ($method === 'GET') {
    $trackerId = $_GET['trackerId'] ?? '';
    if (!$trackerId) {
        http_response_code(400);
        exit;
    }

    $stmt = $pdo->prepare('SELECT * FROM link WHERE "trackerId" = $1 ORDER BY "createdAt" DESC');
    $stmt->execute([$trackerId]);
    $links = $stmt->fetchAll();
    
    echo json_encode($links);
    exit;
}
?>
