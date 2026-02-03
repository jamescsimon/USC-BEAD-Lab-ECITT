@echo off
echo ========================================
echo ECITT Firewall Fix Script
echo ========================================
echo.
echo This script will add the correct firewall rule for port 8000
echo.
echo NOTE: This must be run as Administrator!
echo.
pause

echo.
echo Removing any existing ECITT firewall rules...
netsh advfirewall firewall delete rule name="ECITT Server Port 8000" >nul 2>&1

echo.
echo Adding new firewall rule for INBOUND connections on port 8000...
netsh advfirewall firewall add rule name="ECITT Server Port 8000" dir=in action=allow protocol=TCP localport=8000

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Firewall rule added successfully!
    echo.
    echo The server should now be accessible from other devices.
    echo.
    echo Your IP address is: 
    ipconfig | findstr /i "IPv4"
    echo.
    echo Test on iPad/iPhone using: http://YOUR_IP:8000
) else (
    echo.
    echo [ERROR] Failed to add firewall rule.
    echo.
    echo Make sure you're running this as Administrator:
    echo Right-click this file → Run as administrator
)

echo.
pause
