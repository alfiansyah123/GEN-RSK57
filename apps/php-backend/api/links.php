<?php
// api/links.php
// Handles /api/links

// Basic Auth Check
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';
// ... (Ideally verify token here or in index.php middleware) ...

$method = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];
$input = json_decode(file_get_contents('php://input'), true);

// 1. CREATE Link (POST /api/links)
// No URL check needed if we assume index.php routed here correctly
if ($method === 'POST') {
    try {
        $slug = $input['slug'];
        $targetUrl = $input['targetUrl'];
        $domain = $input['domain'];
        $trackerId = $input['trackerId'];
        $network = $input['network'] ?? null;
        $useLandingPage = !empty($input['useLandingPage']) ? 1 : 0;
        $ogImage = $input['ogImage'] ?? null;
        $ogTitle = $input['ogTitle'] ?? null;
        $ogDescription = $input['ogDescription'] ?? null;
        $branchKey = $input['branchKey'] ?? null;

        // Insert into DB
        $stmt = $pdo->prepare("INSERT INTO Link (slug, targetUrl, domain, trackerId, network, useLandingPage, ogImage, ogTitle, ogDescription, clickCount, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NOW())");
        $stmt->execute([$slug, $targetUrl, $domain, $trackerId, $network, $useLandingPage, $ogImage, $ogTitle, $ogDescription]);
        
        $linkId = $pdo->lastInsertId();
        
        // Fetch created link
        $stmt = $pdo->prepare("SELECT * FROM Link WHERE id = ?");
        $stmt->execute([$linkId]);
        $link = $stmt->fetch();
        
        // --- Branch.io Integration ---
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

            // CURL Request
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
        // Return all or error?
        // Node implementation was likely specific. Assuming filter by trackerId is common.
        // Let's implement basics.
        // If getting a specific link by slug?? No, usually list.
        http_response_code(400);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM Link WHERE trackerId = ? ORDER BY createdAt DESC");
    $stmt->execute([$trackerId]);
    $links = $stmt->fetchAll();
    
    echo json_encode($links);
    exit;
}
?>
