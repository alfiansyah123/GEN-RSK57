<?php
// test_db.php
header("Content-Type: text/plain");

// Manually define variables to match config.php exactly (copy-paste to be sure)
// We avoid 'require' to prevent JSON headers from interfering with text output
$host = 'localhost';
$db_name = 'gen_cok'; 
$username = 'root';
$password = '';

echo "Testing connection...\n";
echo "Host: $host\n";
echo "Database: $db_name\n";
echo "User: $username\n";
echo "Pass: (empty)\n\n";

try {
    $dsn = "mysql:host=$host;dbname=$db_name;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✅ SUCCESS! Database connected.";
} catch(PDOException $e) {
    echo "❌ FAILED.\n";
    echo "Error: " . $e->getMessage();
}
?>
