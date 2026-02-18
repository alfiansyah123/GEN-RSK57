<?php
// api/trackers.php - CRUD Trackers (Supabase/PostgreSQL version)
// FUNGSI SAMA PERSIS dengan versi MySQL

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);
$id = isset($_GET['id']) ? $_GET['id'] : null;

if (!$id && preg_match('/\/api\/trackers\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    $id = $matches[1];
}

// 0. SPECIAL ROUTES

// Verify Password
if (strpos($_SERVER['REQUEST_URI'], '/api/trackers/verify-password') !== false && $method === 'POST') {
    $slug = $input['slug'] ?? '';
    $password = $input['password'] ?? '';

    $stmt = $pdo->prepare("SELECT password FROM tracker WHERE slug = $1");
    $stmt->execute([$slug]);
    $tracker = $stmt->fetch();

    if (!$tracker) {
        http_response_code(404);
        echo json_encode(["error" => "Tracker not found"]);
        exit;
    }

    if ((string)$tracker['password'] === (string)$password) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Incorrect password"]);
    }
    exit;
}

// Get by Slug
if (preg_match('/\/api\/trackers\/slug\/(.+)/', $_SERVER['REQUEST_URI'], $matches) && $method === 'GET') {
    $slug = $matches[1];
    $stmt = $pdo->prepare("SELECT id, name, team, password FROM tracker WHERE slug = $1");
    $stmt->execute([$slug]);
    $tracker = $stmt->fetch();

    if ($tracker) {
        echo json_encode([
            "id" => $tracker['id'],
            "name" => $tracker['name'],
            "team" => $tracker['team'],
            "hasPassword" => !empty($tracker['password'])
        ]);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Tracker not found"]);
    }
    exit;
}

// 1. GET Trackers
if ($method === 'GET') {
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM tracker WHERE id = $1");
        $stmt->execute([$id]);
        echo json_encode($stmt->fetch());
    } else {
        $stmt = $pdo->query('SELECT * FROM tracker ORDER BY "createdAt" DESC');
        echo json_encode($stmt->fetchAll());
    }
    exit;
}

// 2. CREATE Tracker
if ($method === 'POST') {
    $name = $input['name'] ?? '';
    $slug = $input['slug'] ?? '';
    $team = $input['team'] ?? 'ADMIN';
    $password = $input['password'] ?? null;

    if (empty($name) || empty($slug)) {
        http_response_code(400);
        echo json_encode(["error" => "Name and slug are required"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare('INSERT INTO tracker (name, slug, team, password, "targetUrl", "createdAt") VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id');
        $stmt->execute([$name, $slug, $team, $password, '']);
        $row = $stmt->fetch();
        echo json_encode(["success" => true, "id" => $row['id']]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

// 3. UPDATE tracker
if ($method === 'PUT' && $id) {
    $name = $input['name'];
    $slug = $input['slug'];
    $targetUrl = $input['targetUrl'];
    
    try {
        $stmt = $pdo->prepare('UPDATE tracker SET name = $1, slug = $2, "targetUrl" = $3 WHERE id = $4');
        $stmt->execute([$name, $slug, $targetUrl, $id]);
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}

// 4. DELETE Tracker (Cascade)
if ($method === 'DELETE' && $id) {
    try {
        $pdo->beginTransaction();

        // 1. Get Link IDs for this tracker
        $stmt = $pdo->prepare('SELECT id FROM link WHERE "trackerId" = $1');
        $stmt->execute([(string)$id]);
        $linkIds = $stmt->fetchAll(PDO::FETCH_COLUMN);

        if (!empty($linkIds)) {
            // Delete clicks (CASCADE should handle this, but explicit is safer)
            $placeholders = [];
            $params = [];
            foreach ($linkIds as $i => $linkId) {
                $placeholders[] = '$' . ($i + 1);
                $params[] = $linkId;
            }
            $inQuery = implode(',', $placeholders);
            $deleteClicks = $pdo->prepare("DELETE FROM click WHERE \"linkId\" IN ($inQuery)");
            $deleteClicks->execute($params);
        }

        // 2. Delete Links
        $deleteLinks = $pdo->prepare('DELETE FROM link WHERE "trackerId" = $1');
        $deleteLinks->execute([(string)$id]);

        // 3. Delete Tracker
        $deleteTracker = $pdo->prepare("DELETE FROM tracker WHERE id = $1");
        $deleteTracker->execute([$id]);

        $pdo->commit();
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete tracker: " . $e->getMessage()]);
    }
    exit;
}
?>
