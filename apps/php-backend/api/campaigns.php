<?php
// api/campaigns.php
// Handles /api/campaigns

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// Parse ID
$id = isset($_GET['id']) ? $_GET['id'] : null;
if (!$id && preg_match('/\/api\/campaigns\/(\d+)/', $_SERVER['REQUEST_URI'], $matches)) {
    $id = $matches[1];
}

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM Campaign ORDER BY createdAt DESC");
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($method === 'POST') {
    // network, urlTemplate, postbackEndpoint, offerName
    $stmt = $pdo->prepare("INSERT INTO Campaign (network, urlTemplate, postbackEndpoint, offerName, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())");
    $stmt->execute([
        $input['network'], 
        $input['urlTemplate'], 
        $input['postbackEndpoint'], 
        $input['offerName']
    ]);
    echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
    exit;
}

if ($method === 'DELETE' && $id) {
    $stmt = $pdo->prepare("DELETE FROM Campaign WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["success" => true]);
    exit;
}
?>
