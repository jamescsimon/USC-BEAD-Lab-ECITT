@echo off
cd /d "%~dp0public"
echo Starting ECITT Web App on http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.
set GOOGLE_SHEETS_DISABLE_SSL_VERIFY=1
php -S 0.0.0.0:8000
pause
