<?php
// routes/system_routes.php
// Handles /_meetups/r.php and /_video/landing

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// 1. Intermediate Tracker Page (/_meetups/r.php)
if ($path === '/_meetups/r.php') {
    $dest = $_GET['dest'] ?? '';
    if (!$dest) {
        echo "Missing destination";
        exit;
    }
    
    // NOTE: Click data is already recorded in cuanfbpr_gencok.click by the main tracking system
    // No need to duplicate here - postback.php will lookup from that table
    
    // Decode target
    $finalDest = base64_decode($dest);
    
    // Render HTML (Loading Spinner)
    header("Content-Type: text/html");
    ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirecting...</title>
    <style>
        body { display: flex; justify-content: center; align-items: center; height: 100vh; background: #fff; font-family: sans-serif; flex-direction: column; }
        .loader { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        p { color: #666; font-size: 14px; }
    </style>
    <script>
        setTimeout(function() {
            window.location.href = <?= json_encode($finalDest) ?>;
        }, 100);
    </script>
</head>
<body>
    <div class="loader"></div>
    <p>Secure Redirect...</p>
</body>
</html>
    <?php
    exit;
}

// 2. Video Landing Page (/_video/landing)
if ($path === '/_video/landing') {
    $dest = $_GET['dest'] ?? '';
    if (!$dest) {
        echo "Missing destination";
        exit;
    }
    
    $finalDest = base64_decode($dest);
    
    // Random video
    $videoNum = (mt_rand(0, 100) < 50) ? 1 : 2;
    $videoPath = "/videos/video{$videoNum}.mp4";
    
    // Render Video Player
    header("Content-Type: text/html");
    ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loading...</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #000; cursor: pointer; }
        .video-container { position: relative; width: 100%; max-width: 800px; display: flex; justify-content: center; align-items: center; }
        video { width: 100%; height: auto; max-height: 100vh; object-fit: contain; }
        .overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 10; cursor: pointer; }
        .timer { position: fixed; top: 20px; right: 20px; background: rgba(0,0,0,0.7); color: #fff; padding: 10px 20px; border-radius: 8px; font-family: sans-serif; font-size: 14px; z-index: 20; display: none; }
    </style>
</head>
<body>
    <div class="timer" id="timer">Redirecting in 3...</div>
    <div class="overlay" onclick="redirect()"></div>
    <div class="video-container">
        <video autoplay muted loop playsinline>
            <source src="<?= $videoPath ?>" type="video/mp4">
        </video>
    </div>
    <script>
        let countdown = 3;
        const timerEl = document.getElementById('timer');
        const targetUrl = <?= json_encode($finalDest) ?>;
        
        const interval = setInterval(() => {
            countdown--;
            if (countdown <= 0) {
                clearInterval(interval);
                redirect();
            } else {
                timerEl.textContent = 'Redirecting in ' + countdown + '...';
            }
        }, 1000);
        
        function redirect() {
            clearInterval(interval);
            window.location.href = targetUrl;
        }
    </script>
</body>
</html>
    <?php
    exit;
}
?>
