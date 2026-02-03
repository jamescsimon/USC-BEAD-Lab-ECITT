@echo off
echo ========================================
echo Setup ngrok Auth Token
echo ========================================
echo.

REM Check if ngrok exists in this folder
if not exist "%~dp0ngrok.exe" (
    echo ERROR: ngrok.exe not found in project folder!
    echo.
    echo Run download-ngrok.bat first to download ngrok.
    pause
    exit /b 1
)

echo ngrok.exe found!
echo.
set /p TOKEN="Enter your ngrok auth token: "

if "%TOKEN%"=="" (
    echo ERROR: No token entered!
    pause
    exit /b 1
)

echo.
echo Configuring ngrok with your token...
echo.

"%~dp0ngrok.exe" config add-authtoken %TOKEN%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo SUCCESS! ngrok is now configured.
    echo.
    echo You can now run: start-with-ngrok.bat
) else (
    echo.
    echo ERROR: Failed to configure ngrok token.
    echo.
    echo This might be a permissions issue. Try:
    echo 1. Right-click this file and "Run as administrator"
    echo 2. Or run this command manually in Command Prompt as Administrator:
    echo    cd /d "%~dp0"
    echo    ngrok.exe config add-authtoken %TOKEN%
    echo.
    echo Make sure you copied the token correctly.
)

echo.
pause
