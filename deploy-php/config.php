<?php
// config.php - Supabase (PostgreSQL) Database Configuration & Common Headers

// Allow Cross-Origin Requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ============================================
// SUPABASE DATABASE CREDENTIALS
// Dapatkan dari: Supabase Dashboard → Settings → Database
// ============================================
$host = 'aws-1-ap-south-1.pooler.supabase.com';
$port = '5432';
$db_name = 'postgres';
$username = 'postgres.vtlwptockofzbllnsyrg';
$password = 'Melpost@1234';

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$db_name;options='--search_path=public'";
    $pdo = new PDO($dsn, $username, $password);
    
    // Set error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed: " . $e->getMessage()]);
    exit();
}
?>
