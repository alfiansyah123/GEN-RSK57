<?php
require_once 'config.php';
$stmt = $pdo->query("SELECT * FROM campaign");
$campaigns = $stmt->fetchAll(PDO::FETCH_ASSOC);

$stmt2 = $pdo->query("SELECT id, slug, network, \"targetUrl\" FROM link ORDER BY id DESC LIMIT 10");
$links = $stmt2->fetchAll(PDO::FETCH_ASSOC);

file_put_contents('db_dump_utf8.txt', "CAMPAIGNS:\n" . print_r($campaigns, true) . "\nLINKS:\n" . print_r($links, true));
