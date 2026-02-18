<?php
// api/addon_domains.php
// Handles /api/addon-domains

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);
$id = isset($_GET['id']) ? $_GET['id'] : null;

if (!$id && preg_match('/\/api\/addon-domains\/(\d+)/', $_SERVER['REQUEST_URI'], $matches)) {
    $id = $matches[1];
}

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM Domain ORDER BY addedAt DESC");
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($method === 'POST') {
    $name = $input['name']; // Domain name
    // subdomain logic? Using 'name' for full domain usually.
    
    try {
        $stmt = $pdo->prepare("INSERT INTO Domain (name, status, ssl, addedAt) VALUES (?, 'Active', 'Active', NOW())");
        $stmt->execute([$name]);
        echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

if ($method === 'DELETE' && $id) {
    $stmt = $pdo->prepare("DELETE FROM Domain WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["success" => true]);
    exit;
}
?>
