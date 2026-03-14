<?php
require_once 'config.php';
$stmt = $pdo->query("SELECT id, network, \"urlTemplate\", \"offerName\" FROM campaign ORDER BY id DESC LIMIT 5");
$campaigns = $stmt->fetchAll(PDO::FETCH_ASSOC);
$output = "CAMPAIGNS:\n" . print_r($campaigns, true);

$stmt2 = $pdo->query("SELECT id, slug, network, \"targetUrl\" FROM link ORDER BY id DESC LIMIT 5");
$links = $stmt2->fetchAll(PDO::FETCH_ASSOC);
$output .= "\nLINKS:\n" . print_r($links, true);

file_put_contents('db_dump_utf8.txt', $output);
