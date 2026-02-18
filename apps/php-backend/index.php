<?php
// index.php - Main Router (API, Redirects, SPA Fallback)

// Load Config
require_once 'config.php';

// Get current request URI
$requestUri = $_SERVER['REQUEST_URI'];
$basePath = '/'; // Adjust if deployed in subfolder
$path = parse_url($requestUri, PHP_URL_PATH);

// Helper to check if string starts with
function startsWith($string, $startString) {
    return (substr($string, 0, strlen($startString)) === $startString);
}

// 1. Handle API Requests
if (startsWith($path, '/api/')) {
    // Basic routing for API
    // Example: /api/auth/login -> api/auth.php with action=login?
    // For now, let's just include specific files based on path
    
    // Generic Routing for API modules
    if (startsWith($path, '/api/auth')) { require 'api/auth.php'; exit; }
    if (startsWith($path, '/api/links')) { require 'api/links.php'; exit; }
    if (startsWith($path, '/api/trackers')) { require 'api/trackers.php'; exit; }
    if (startsWith($path, '/api/campaigns')) { require 'api/campaigns.php'; exit; }
    if (startsWith($path, '/api/reports')) { require 'api/stats.php'; exit; }
    if (startsWith($path, '/api/addon-domains')) { require 'api/addon_domains.php'; exit; }
    if (startsWith($path, '/api/upload')) { require 'api/upload.php'; exit; }

    
    // Default 404 for API
    http_response_code(404);
    echo json_encode(["error" => "API Endpoint not found"]);
    exit;
}

// 2. Handle System Routes (Video Landing, etc)
if (startsWith($path, '/_video') || startsWith($path, '/_meetups')) {
    require 'routes/system_routes.php'; // We will create this
    exit;
}

// 3. Handle Short Link Redirection (/:slug)
// If path is root '/' it's not a slug.
if ($path !== '/' && !preg_match('/\.(html|css|js|png|jpg|jpeg|gif|ico|svg)$/', $path)) {
    // Remove leading slash
    $slug = ltrim($path, '/');
    
    // Check if slug exists in DB
    try {
        $stmt = $pdo->prepare("SELECT * FROM Link WHERE slug = ?");
        $stmt->execute([$slug]);
        $link = $stmt->fetch();
        
        if ($link) {
            // Found! Delegate to redirect logic
            require 'routes/redirect_logic.php'; // We will create this
            exit;
        }
    } catch (PDOException $e) {
        // Log error, continue to SPA
    }
}

// 4. SPA Fallback (Serve React App)
// If file exists (css, js), serve it (handled by .htaccess usually, but good fallback)
$localFile = __DIR__ . $path;
if (file_exists($localFile) && !is_dir($localFile)) {
    // Serve static file
    $mime = mime_content_type($localFile);
    header("Content-Type: $mime");
    readfile($localFile);
    exit;
}

// Otherwise, serve index.html
$indexFile = __DIR__ . '/index.html';
if (file_exists($indexFile)) {
    header("Content-Type: text/html");
    readfile($indexFile);
} else {
    echo "Backend Running. Frontend not found (Upload 'dist' folder contents here).";
}
?>
