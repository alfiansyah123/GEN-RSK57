<?php
require_once 'config.php';
$stmt = $pdo->query("SELECT id, network, \"urlTemplate\", \"offerName\" FROM campaign ORDER BY id DESC LIMIT 5");
$campaigns = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "CAMPAIGNS:\n";
print_r($campaigns);

$stmt2 = $pdo->query("SELECT id, slug, network, \"targetUrl\" FROM link ORDER BY id DESC LIMIT 5");
$links = $stmt2->fetchAll(PDO::FETCH_ASSOC);
echo "\nLINKS:\n";
print_r($links);
