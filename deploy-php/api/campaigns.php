<?php
// api/campaigns.php - CRUD Campaigns (Supabase/PostgreSQL version)
// FUNGSI SAMA PERSIS dengan versi MySQL

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// Parse ID
$id = isset($_GET['id']) ? $_GET['id'] : null;
if (!$id && preg_match('/\/api\/campaigns\/(\d+)/', $_SERVER['REQUEST_URI'], $matches)) {
    $id = $matches[1];
}

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM campaign ORDER BY "createdAt" DESC');
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($method === 'POST') {
    $stmt = $pdo->prepare('INSERT INTO campaign (network, "urlTemplate", "postbackEndpoint", "offerName", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id');
    $stmt->execute([
        $input['network'], 
        $input['urlTemplate'], 
        $input['postbackEndpoint'], 
        $input['offerName']
    ]);
    $row = $stmt->fetch();
    echo json_encode(["success" => true, "id" => $row['id']]);
    exit;
}

if ($method === 'DELETE' && $id) {
    $stmt = $pdo->prepare("DELETE FROM campaign WHERE id = $1");
    $stmt->execute([$id]);
    echo json_encode(["success" => true]);
    exit;
}
?>
