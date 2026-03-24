@echo off
cd /d "%~dp0..\1-14\codebases\ECITT_Web_App\public"
echo Starting ECITT iPad App on http://localhost:8000/unifiedtasks/
echo.
echo Press Ctrl+C to stop the server
echo.
set GOOGLE_SHEETS_DISABLE_SSL_VERIFY=1
start "" "http://localhost:8000/unifiedtasks/"
php -S 0.0.0.0:8000
pause
