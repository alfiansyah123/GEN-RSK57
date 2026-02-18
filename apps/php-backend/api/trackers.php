<?php
// api/trackers.php
// Handles /api/trackers

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);
$id = isset($_GET['id']) ? $_GET['id'] : null; // Parsing params logic might need adjustment if using /api/trackers/:id

// Helper to parse ID from path if not in GET
// Request URI: /api/trackers/123
if (!$id && preg_match('/\/api\/trackers\/(\d+)/', $_SERVER['REQUEST_URI'], $matches)) {
    $id = $matches[1];
}

// 1. GET Trackers
if ($method === 'GET') {
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM Tracker WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode($stmt->fetch());
    } else {
        $stmt = $pdo->query("SELECT * FROM Tracker ORDER BY createdAt DESC");
        echo json_encode($stmt->fetchAll());
    }
    exit;
}

// 2. CREATE Tracker
if ($method === 'POST') {
    $name = $input['name'];
    $slug = $input['slug'];
    $team = $input['team'];
    $targetUrl = $input['targetUrl'];
    $password = $input['password'] ?? null;
    $domainId = $input['domainId'] ?? null;

    try {
        $stmt = $pdo->prepare("INSERT INTO Tracker (name, slug, team, targetUrl, password, domainId, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())");
        $stmt->execute([$name, $slug, $team, $targetUrl, $password, $domainId]);
        echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

// 3. UPDATE Tracker
if ($method === 'PUT' && $id) {
    $name = $input['name'];
    $slug = $input['slug'];
    $targetUrl = $input['targetUrl'];
    
    try {
        $stmt = $pdo->prepare("UPDATE Tracker SET name = ?, slug = ?, targetUrl = ? WHERE id = ?");
        $stmt->execute([$name, $slug, $targetUrl, $id]);
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

// 4. DELETE Tracker
if ($method === 'DELETE' && $id) {
    try {
        $stmt = $pdo->prepare("DELETE FROM Tracker WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}
?>
