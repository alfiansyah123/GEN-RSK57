@echo off
echo === Building React App ===
cd /d "C:\Users\LENOVO\CCP-GENv2-fix\apps\client"
call npm run build

echo === Syncing to deploy-php ===
rmdir /s /q "C:\Users\LENOVO\CCP-GENv2-fix\deploy-php\assets" 2>nul
xcopy /s /y /i "C:\Users\LENOVO\CCP-GENv2-fix\apps\client\dist\assets" "C:\Users\LENOVO\CCP-GENv2-fix\deploy-php\assets"
copy /y "C:\Users\LENOVO\CCP-GENv2-fix\apps\client\dist\index.html" "C:\Users\LENOVO\CCP-GENv2-fix\deploy-php\index.html"

echo === Done! ===
echo Upload folder deploy-php ke hosting.
pause
