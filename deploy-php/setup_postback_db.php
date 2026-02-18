<?php
require_once 'config.php';

try {
    // $pdo is already available from config.php
    // $pdo = getDB(); // Removed

    // Create Conversion Table
    $sql = "CREATE TABLE IF NOT EXISTS Conversion (
        id INT AUTO_INCREMENT PRIMARY KEY,
        clickId INT NOT NULL,
        payout DECIMAL(10, 2) DEFAULT 0.00,
        currency VARCHAR(3) DEFAULT 'USD',
        status VARCHAR(50) DEFAULT 'approved',
        txid VARCHAR(255) NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (clickId) REFERENCES Click(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    $pdo->exec($sql);
    echo "Table 'Conversion' created successfully.<br>";

    // Add stats columns to Link table if they don't exist
    $columns = $pdo->query("SHOW COLUMNS FROM link")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('leadCount', $columns)) {
        $pdo->exec("ALTER TABLE link ADD COLUMN leadCount INT DEFAULT 0");
        echo "Added 'leadCount' to Link table.<br>";
    }
    if (!in_array('totalPayout', $columns)) {
        $pdo->exec("ALTER TABLE link ADD COLUMN totalPayout DECIMAL(10, 2) DEFAULT 0.00");
        echo "Added 'totalPayout' to Link table.<br>";
    }

} catch (PDOException $e) {
    die("DB Error: " . $e->getMessage());
}
?>
