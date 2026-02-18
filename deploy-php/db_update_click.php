<?php
// deploy-php/db_update_click.php
require_once 'config.php';

try {
    echo "Creating 'click' table if not exists...\n";
    
    $sql = "CREATE TABLE IF NOT EXISTS click (
        id INT AUTO_INCREMENT PRIMARY KEY,
        linkId INT NOT NULL,
        ip VARCHAR(45),
        country VARCHAR(10),
        userAgent TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX (linkId),
        INDEX (ip),
        INDEX (createdAt)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    
    $pdo->exec($sql);
    echo "Success: Table 'click' created/verified.\n";
    
} catch (PDOException $e) {
    die("Error: " . $e->getMessage() . "\n");
}
?>
