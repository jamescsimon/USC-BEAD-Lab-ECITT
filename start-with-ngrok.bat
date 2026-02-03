@echo off
echo ========================================
echo ECITT Server with ngrok Tunnel
echo ========================================
echo.
echo This bypasses all network/firewall issues
echo Perfect for iPhone/iPad access!
echo.

REM Check if ngrok exists in this folder
if not exist "%~dp0ngrok.exe" (
    echo ERROR: ngrok.exe not found in project folder!
    echo.
    echo Run download-ngrok.bat first to download ngrok.
    pause
    exit /b 1
)

REM Check if ngrok token is configured
"%~dp0ngrok.exe" config check >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: ngrok authentication token not configured!
    echo.
    echo You need to configure your ngrok token first.
    echo.
    echo Run setup-ngrok-token.bat to configure your token.
    echo.
    echo Or manually run:
    echo   "%~dp0ngrok.exe" config add-authtoken YOUR_TOKEN
    echo.
    pause
    exit /b 1
)

echo Starting ECITT server...
echo.
start "ECITT Server" cmd /k "%~dp0start-server.bat"

echo Waiting for server to start...
timeout /t 3 /nobreak >nul

echo.
echo Starting ngrok tunnel...
echo.
echo ========================================
echo IMPORTANT: Use the ngrok URL on iPhone!
echo ========================================
echo.
echo The ngrok URL will appear below (e.g., https://abc123.ngrok.io)
echo Copy that URL and use it on iPhone/iPad instead of the IP address
echo.
echo Press Ctrl+C to stop ngrok (server will keep running)
echo.

"%~dp0ngrok.exe" http 8000

pause
