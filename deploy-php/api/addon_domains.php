<?php
// api/addon_domains.php - Domain Management (Supabase/PostgreSQL version)
// FUNGSI SAMA PERSIS dengan versi MySQL

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);
$id = isset($_GET['id']) ? $_GET['id'] : null;

if (!$id && preg_match('/\/api\/addon-domains\/(\d+)/', $_SERVER['REQUEST_URI'], $matches)) {
    $id = $matches[1];
}

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT *, id as "dbId", name as title FROM domain ORDER BY "addedAt" DESC');
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($method === 'POST') {
    $name = $input['domain'] ?? $input['name'];
    
    try {
        $stmt = $pdo->prepare('INSERT INTO domain (name, status, ssl, "addedAt") VALUES ($1, $2, $3, NOW()) RETURNING id');
        $stmt->execute([$name, 'Active', 'Active']);
        $row = $stmt->fetch();
        echo json_encode(["success" => true, "id" => $row['id']]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

if ($method === 'DELETE' && $id) {
    try {
        $stmt = $pdo->prepare("DELETE FROM domain WHERE id = $1");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}
?>
