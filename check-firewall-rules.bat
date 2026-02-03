@echo off
echo ========================================
echo Detailed Firewall Rule Check
echo ========================================
echo.

echo Checking ALL firewall rules for port 8000...
echo.
netsh advfirewall firewall show rule name=all | findstr /i /c:"8000" /c:"ECITT"
echo.

echo Checking specifically for INBOUND rules...
echo.
netsh advfirewall firewall show rule name="ECITT Server Port 8000" dir=in 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [FOUND] Inbound rule exists
) else (
    echo [MISSING] Inbound rule does NOT exist!
    echo This is the problem - you need an INBOUND rule.
)
echo.

echo Checking for OUTBOUND rules (these won't help)...
echo.
netsh advfirewall firewall show rule name="ECITT Server Port 8000" dir=out 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [WARNING] Found OUTBOUND rule - this won't help!
    echo You need an INBOUND rule, not OUTBOUND.
) else (
    echo [OK] No outbound rule found
)
echo.

echo ========================================
echo Testing if port is accessible from network...
echo ========================================
echo.
echo Your IP address is:
ipconfig | findstr /i "IPv4"
echo.
echo Try accessing from another device using: http://YOUR_IP:8000
echo.
echo If this still doesn't work, possible causes:
echo 1. Antivirus firewall blocking (check your antivirus settings)
echo 2. Router/AP isolation enabled (check router settings)
echo 3. Corporate network restrictions (contact IT)
echo 4. Windows Defender Firewall with Advanced Security blocking
echo.
pause
