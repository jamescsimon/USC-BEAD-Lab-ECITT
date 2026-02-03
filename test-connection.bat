@echo off
echo ========================================
echo ECITT Network Connection Diagnostic Tool
echo ========================================
echo.

echo Step 1: Finding your IP address...
echo.
ipconfig | findstr /i "IPv4"
echo.

echo Step 2: Checking if server is listening on port 8000...
echo.
netstat -an | findstr ":8000"
echo.

echo Step 3: Testing localhost connection...
echo.
curl -I http://localhost:8000 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Server is responding on localhost
) else (
    echo [FAIL] Server is NOT responding on localhost
    echo Make sure start-server.bat is running!
)
echo.

echo Step 4: Checking Windows Firewall rules for port 8000...
echo.
netsh advfirewall firewall show rule name=all | findstr /i "8000"
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Found firewall rules for port 8000
) else (
    echo [WARNING] No firewall rules found for port 8000
    echo Windows Firewall may be blocking connections!
)
echo.

echo ========================================
echo Next Steps:
echo ========================================
echo 1. Note your IPv4 address from Step 1
echo 2. If Step 2 shows "LISTENING" on 0.0.0.0:8000, server is configured correctly
echo 3. If Step 3 fails, the server is not running - start start-server.bat
echo 4. If Step 4 shows no rules, you need to allow port 8000 through firewall
echo.
echo To allow port 8000 through Windows Firewall, run as Administrator:
echo netsh advfirewall firewall add rule name="ECITT Server Port 8000" dir=in action=allow protocol=TCP localport=8000
echo.
pause
