<?php
// api/live_traffic.php - Live Traffic Widget (Supabase/PostgreSQL version)
// FUNGSI SAMA PERSIS dengan versi MySQL
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require '../config.php';

try {
    $stmt = $pdo->query('
        SELECT 
            c.id, 
            c.country, 
            t.name as "trackerName", 
            l.network, 
            c."createdAt" 
        FROM click c
        JOIN link l ON c."linkId" = l.id
        LEFT JOIN tracker t ON CAST(l."trackerId" AS INTEGER) = t.id
        ORDER BY c."createdAt" DESC
        LIMIT 10
    ');
    
    $clicks = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $result = array_map(function($click) {
        return [
            'id' => $click['id'],
            'country' => $click['country'],
            'trackerId' => $click['trackerName'],
            'network' => $click['network'] ?? 'Unknown'
        ];
    }, $clicks);

    echo json_encode(["type" => "update", "data" => $result]);

} catch (PDOException $e) {
    echo json_encode(["type" => "update", "data" => []]);
}
?>
