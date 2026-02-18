<?php
// fix_db.php - Fix Database Tables (Create Admin if missing)
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h2>🛠️ Database Fixer Tool</h2>";

require 'config.php';

try {
    // 1. Create 'admin' table (LOWERCASE) if not exists
    $pdo->exec("CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");
    echo "✅ Table 'admin' check/create: OK.<br>";

    // 2. Insert Default Admin if not exists
    // Default: admin / admin
    $pass = password_hash('admin', PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM admin WHERE username = 'admin'");
    $stmt->execute();
    if ($stmt->fetchColumn() == 0) {
        $stmt = $pdo->prepare("INSERT INTO admin (username, password, createdAt, updatedAt) VALUES ('admin', ?, NOW(), NOW())");
        $stmt->execute([$pass]);
        echo "✅ User 'admin' created (Pass: admin).<br>";
    } else {
        echo "ℹ️ User 'admin' already exists.<br>";
    }

    echo "<h3>🎉 Fix Complete!</h3>";
    echo "Silakan coba Login kembali di: <a href='/login'>/login</a>";

} catch (PDOException $e) {
    echo "<h3 style='color:red'>❌ Error:</h3>" . $e->getMessage();
}
?>
