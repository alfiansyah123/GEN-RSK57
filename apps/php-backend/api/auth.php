<?php
// api/auth.php

// Helper for Native JWT (No Composer dependencies)
function base64UrlEncode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function generateJWT($payload, $secret) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $base64UrlHeader = base64UrlEncode($header);
    $base64UrlPayload = base64UrlEncode(json_encode($payload));
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
    $base64UrlSignature = base64UrlEncode($signature);
    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

function verifyJWT($token, $secret) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;
    $header = $parts[0];
    $payload = $parts[1];
    $signatureProvided = $parts[2];
    $signature = hash_hmac('sha256', $header . "." . $payload, $secret, true);
    $base64UrlSignature = base64UrlEncode($signature);
    if (!hash_equals($base64UrlSignature, $signatureProvided)) return false;
    return json_decode(base64_decode($payload), true);
}

// Get JWT Secret (Ideally from env, but config.php works)
$jwt_secret = getenv('JWT_SECRET') ? getenv('JWT_SECRET') : 'rahasia_super_aman_php_native';

// Parse Input
$input = json_decode(file_get_contents('php://input'), true);
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];

// ROUTING
// /api/auth/setup
if (strpos($requestUri, '/setup') !== false && $method === 'POST') {
    // Check if admin exists
    $stmt = $pdo->query("SELECT COUNT(*) FROM Admin");
    if ($stmt->fetchColumn() > 0) {
        http_response_code(403);
        echo json_encode(["error" => "Admin already exists"]);
        exit;
    }

    $password = $input['password'] ?? '';
    if (!$password) {
        http_response_code(400);
        echo json_encode(["error" => "Password required"]);
        exit;
    }

    $hashed = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("INSERT INTO Admin (username, password, createdAt, updatedAt) VALUES ('admin', ?, NOW(), NOW())");
    $stmt->execute([$hashed]);

    echo json_encode(["message" => "Admin created successfully", "username" => "admin"]);
    exit;
}

// /api/auth/login
if (strpos($requestUri, '/login') !== false && $method === 'POST') {
    $password = $input['password'] ?? '';
    
    $stmt = $pdo->prepare("SELECT * FROM Admin WHERE username = 'admin'");
    $stmt->execute();
    $admin = $stmt->fetch();

    if (!$admin || !password_verify($password, $admin['password'])) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid credentials"]);
        exit;
    }

    // Generate Token
    $payload = [
        "id" => $admin['id'],
        "username" => $admin['username'],
        "exp" => time() + (24 * 60 * 60) // 24 hours
    ];
    $token = generateJWT($payload, $jwt_secret);

    echo json_encode(["token" => $token, "user" => ["username" => "admin"]]);
    exit;
}

// /api/auth/verify
if (strpos($requestUri, '/verify') !== false && $method === 'GET') {
    // Check Header
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
        if (verifyJWT($token, $jwt_secret)) {
            echo json_encode(["valid" => true]);
            exit;
        }
    }
    http_response_code(401);
    echo json_encode(["valid" => false]);
    exit;
}

// /api/auth/change-password
if (strpos($requestUri, '/change-password') !== false && $method === 'POST') {
     // Verify Token First
     $headers = getallheaders();
     $authHeader = $headers['Authorization'] ?? '';
     $valid = false;
     if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
         if (verifyJWT($matches[1], $jwt_secret)) $valid = true;
     }
     
     if (!$valid) {
         http_response_code(401);
         echo json_encode(["error" => "Unauthorized"]);
         exit;
     }

     $oldPassword = $input['oldPassword'] ?? '';
     $newPassword = $input['newPassword'] ?? '';

     if (!$oldPassword || !$newPassword) {
         http_response_code(400);
         echo json_encode(["error" => "Both passwords required"]);
         exit;
     }

     $stmt = $pdo->prepare("SELECT * FROM Admin WHERE username = 'admin'");
     $stmt->execute();
     $admin = $stmt->fetch();

     if (!password_verify($oldPassword, $admin['password'])) {
         http_response_code(401);
         echo json_encode(["error" => "Invalid old password"]);
         exit;
     }

     $newHashed = password_hash($newPassword, PASSWORD_BCRYPT);
     $stmt = $pdo->prepare("UPDATE Admin SET password = ?, updatedAt = NOW() WHERE username = 'admin'");
     $stmt->execute([$newHashed]);

     echo json_encode(["message" => "Password updated successfully"]);
     exit;
}

?>
