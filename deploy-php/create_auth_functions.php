<?php
// Create Authentication RPC Functions

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
    echo "Connected!\n";
} catch (Exception $e) {
    echo "FAILED: " . $e->getMessage() . "\n";
    exit(1);
}

// SQL Statements for Auth Functions
$stmts = [
    ["Enable pgcrypto", "CREATE EXTENSION IF NOT EXISTS pgcrypto"],
    
    ["Function: verify_admin_password", "
    CREATE OR REPLACE FUNCTION verify_admin_password(p_password TEXT) 
    RETURNS TABLE(id INTEGER, username VARCHAR) AS $$
    DECLARE
        v_user admin%ROWTYPE;
    BEGIN
        SELECT * INTO v_user FROM admin WHERE username = 'admin';
        
        IF v_user.id IS NOT NULL AND v_user.password = crypt(p_password, v_user.password) THEN
            RETURN QUERY SELECT v_user.id, v_user.username;
        ELSE
            RETURN;
        END IF;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    "],
    
    ["Function: change_admin_password", "
    CREATE OR REPLACE FUNCTION change_admin_password(p_old TEXT, p_new TEXT) 
    RETURNS BOOLEAN AS $$
    DECLARE
        v_user admin%ROWTYPE;
    BEGIN
        SELECT * INTO v_user FROM admin WHERE username = 'admin';
        
        IF v_user.id IS NOT NULL AND v_user.password = crypt(p_old, v_user.password) THEN
            UPDATE admin 
            SET password = crypt(p_new, gen_salt('bf')), \"updatedAt\" = NOW()
            WHERE username = 'admin';
            RETURN TRUE;
        ELSE
            RETURN FALSE;
        END IF;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    "],
    
    ["Function: verify_tracker_password", "
    CREATE OR REPLACE FUNCTION verify_tracker_password(p_slug TEXT, p_password TEXT) 
    RETURNS BOOLEAN AS $$
    DECLARE
        v_tracker tracker%ROWTYPE;
    BEGIN
        SELECT * INTO v_tracker FROM tracker WHERE slug = p_slug;
        
        -- Simple text comparison as tracker passwords are plain text in old system
        IF v_tracker.id IS NOT NULL AND v_tracker.password = p_password THEN
            RETURN TRUE;
        ELSE
            RETURN FALSE;
        END IF;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    "]
];

foreach ($stmts as list($name, $sql)) {
    try {
        $pdo->exec($sql);
        echo "  OK: $name\n";
    } catch (PDOException $e) {
        echo "  FAIL: $name => " . $e->getMessage() . "\n";
    }
}

echo "\nDone!\n";
?>
