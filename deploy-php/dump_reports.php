<?php
require_once 'config.php';
$stmt = $pdo->query("SELECT * FROM daily_reports ORDER BY date DESC LIMIT 20");
$reports = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "DAILY REPORTS:\n";
print_r($reports);
