<?php
// Run schema on Supabase - step by step

$host = 'aws-1-ap-south-1.pooler.supabase.com';
$port = '5432';
$db_name = 'postgres';
$username = 'postgres.vtlwptockofzbllnsyrg';
$password = 'Melpost@1234';

echo "Connecting to Supabase...\n";

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$db_name";
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected!\n\n";
} catch (Exception $e) {
    echo "FAILED: " . $e->getMessage() . "\n";
    exit(1);
}

// Run each SQL statement individually
$stmts = [
    ["ENUM Type", "DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'traffic_type_enum') THEN CREATE TYPE traffic_type_enum AS ENUM ('WAP', 'WEB', 'APP', 'BOT'); END IF; END $$"],
    
    ["Table: admin", 'CREATE TABLE IF NOT EXISTS admin (
        id SERIAL PRIMARY KEY,
        username VARCHAR(191) NOT NULL UNIQUE,
        password VARCHAR(191) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW()
    )'],
    
    ["Table: campaign", 'CREATE TABLE IF NOT EXISTS campaign (
        id SERIAL PRIMARY KEY,
        network VARCHAR(191) NOT NULL,
        "urlTemplate" TEXT NOT NULL,
        "postbackEndpoint" TEXT NOT NULL,
        "offerName" VARCHAR(191) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW()
    )'],
    
    ["Table: domain", 'CREATE TABLE IF NOT EXISTS domain (
        id SERIAL PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        subdomain VARCHAR(191),
        status VARCHAR(191) NOT NULL DEFAULT \'Pending\',
        ssl VARCHAR(191) NOT NULL DEFAULT \'Pending\',
        "addedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW()
    )'],
    
    ["Table: tracker", 'CREATE TABLE IF NOT EXISTS tracker (
        id SERIAL PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        slug VARCHAR(191) NOT NULL UNIQUE,
        team VARCHAR(191) NOT NULL,
        password VARCHAR(191),
        "targetUrl" VARCHAR(191) NOT NULL DEFAULT \'\',
        "domainId" INT REFERENCES domain(id) ON DELETE SET NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW()
    )'],
    
    ["Table: link", 'CREATE TABLE IF NOT EXISTS link (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(191) NOT NULL UNIQUE,
        "targetUrl" TEXT NOT NULL,
        domain VARCHAR(191) NOT NULL,
        "trackerId" VARCHAR(191) NOT NULL,
        network VARCHAR(191),
        "useLandingPage" BOOLEAN NOT NULL DEFAULT FALSE,
        "ogImage" TEXT,
        "ogTitle" VARCHAR(191),
        "ogDescription" TEXT,
        "clickCount" INT NOT NULL DEFAULT 0,
        "leadCount" INT DEFAULT 0,
        "totalPayout" DECIMAL(10,2) DEFAULT 0.00,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW()
    )'],
    
    ["Table: click", 'CREATE TABLE IF NOT EXISTS click (
        id SERIAL PRIMARY KEY,
        "linkId" INT NOT NULL REFERENCES link(id) ON DELETE CASCADE,
        ip VARCHAR(191) NOT NULL,
        country VARCHAR(191) NOT NULL,
        "userAgent" TEXT NOT NULL,
        external_id VARCHAR(255),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW()
    )'],
    
    ["Table: conversions", 'CREATE TABLE IF NOT EXISTS conversions (
        id SERIAL PRIMARY KEY,
        click_id VARCHAR(100) NOT NULL,
        sub_id VARCHAR(100) DEFAULT \'Unknown\',
        network VARCHAR(50) DEFAULT \'IMONETIZEIT\',
        country CHAR(2) DEFAULT \'US\',
        country_name VARCHAR(100) DEFAULT \'United States\',
        traffic_type traffic_type_enum DEFAULT \'WAP\',
        earning DECIMAL(10,4) DEFAULT 0.0000,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )'],
    
    ["Table: daily_reports", 'CREATE TABLE IF NOT EXISTS daily_reports (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        smartlink VARCHAR(100) NOT NULL,
        network VARCHAR(50) NOT NULL,
        leads INT DEFAULT 0,
        payout DECIMAL(10,4) DEFAULT 0.0000,
        UNIQUE(date, smartlink, network)
    )'],
    
    ["Index: click.linkId", 'CREATE INDEX IF NOT EXISTS idx_click_linkId ON click("linkId")'],
    ["Index: click.createdAt", 'CREATE INDEX IF NOT EXISTS idx_click_createdAt ON click("createdAt")'],
    ["Index: tracker.domainId", 'CREATE INDEX IF NOT EXISTS idx_tracker_domainId ON tracker("domainId")'],
    ["Index: conversions.created_at", 'CREATE INDEX IF NOT EXISTS idx_conversions_created_at ON conversions(created_at)'],
    ["Index: conversions.sub_id", 'CREATE INDEX IF NOT EXISTS idx_conversions_sub_id ON conversions(sub_id)'],
];

foreach ($stmts as list($name, $sql)) {
    try {
        $pdo->exec($sql);
        echo "  OK: $name\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'already exists') !== false) {
            echo "  SKIP: $name (already exists)\n";
        } else {
            echo "  FAIL: $name => " . $e->getMessage() . "\n";
        }
    }
}

echo "\n=== TABLES IN DATABASE ===\n";
$tables = $pdo->query("SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename")->fetchAll(PDO::FETCH_COLUMN);
foreach ($tables as $t) {
    echo "  - $t\n";
}
echo "\nDone!\n";
?>
