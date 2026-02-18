<?php
// api/stats.php
// Handles /api/reports

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'GET') {
    http_response_code(405);
    exit;
}

// Basic aggregation
// GET /api/reports?groupBy=country&startDate=...&endDate=...

$groupBy = $_GET['groupBy'] ?? 'day'; // day, country, browser
$startDate = $_GET['startDate'] ?? date('Y-m-d', strtotime('-30 days'));
$endDate = $_GET['endDate'] ?? date('Y-m-d', strtotime('+1 day'));

/*
  Node.js logic (simplified):
  - Total Clicks
  - Total Conversions (if any)
  - Group by variable
*/

try {
    $whereClause = "WHERE createdAt >= ? AND createdAt <= ?";
    $params = [$startDate, $endDate];

    // 1. Total Clicks in Range
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM Click $whereClause");
    $stmt->execute($params);
    $totalClicks = $stmt->fetchColumn();

    // 2. Grouped Data
    $groupByField = '';
    $sqlGroup = '';
    
    switch ($groupBy) {
        case 'country':
            $groupByField = 'country';
            $sqlGroup = 'country';
            break;
        case 'browser':
            // userAgent is long, maybe simple substring or stored field?
            // For now, let's group by country as default demo
            $groupByField = 'country';
            $sqlGroup = 'country';
            break;
        case 'day':
        default:
            $groupByField = "DATE_FORMAT(createdAt, '%Y-%m-%d')";
            $sqlGroup = "DATE_FORMAT(createdAt, '%Y-%m-%d')";
            break;
    }

    $sql = "SELECT $groupByField as label, COUNT(*) as count FROM Click $whereClause GROUP BY $sqlGroup ORDER BY count DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $data = $stmt->fetchAll();

    echo json_encode([
        "totalClicks" => $totalClicks,
        "breakdown" => $data
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
