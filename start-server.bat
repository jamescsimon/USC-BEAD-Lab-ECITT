@echo off
echo Starting ECITT Web App Server...
echo.

REM Check for PHP in common locations
set PHP_PATH=
if exist "C:\xampp\php\php.exe" (
    set PHP_PATH=C:\xampp\php\php.exe
    echo Found PHP at: C:\xampp\php\php.exe
) else if exist "C:\wamp64\bin\php" (
    REM Try to find any PHP version in WAMP
    for /d %%d in ("C:\wamp64\bin\php\php*") do (
        if exist "%%d\php.exe" (
            set PHP_PATH=%%d\php.exe
            echo Found PHP at: %%d\php.exe
            goto :found_php
        )
    )
) else if exist "C:\php\php.exe" (
    set PHP_PATH=C:\php\php.exe
    echo Found PHP at: C:\php\php.exe
) else if exist "D:\coding\PHP\php.exe" (
    set PHP_PATH=D:\coding\PHP\php.exe
    echo Found PHP at: D:\coding\PHP\php.exe
) else (
    REM Try to find PHP in PATH
    where php >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        set PHP_PATH=php
        echo Found PHP in system PATH
    ) else (
        echo ERROR: PHP not found!
        echo.
        echo Please install PHP or XAMPP:
        echo - XAMPP: https://www.apachefriends.org/
        echo - PHP: https://windows.php.net/download/
        echo.
        echo If you have XAMPP installed, update this batch file to point to:
        echo C:\xampp\php\php.exe
        echo.
        pause
        exit /b 1
    )
)
:found_php

echo.
echo Make sure you have:
echo 1. MySQL server running
echo 2. Database configured in private/libs/php/dbLib.php
echo.
cd /d "%~dp0public"
echo.
echo Starting PHP development server...
echo.
if not defined GOOGLE_SHEETS_CA_BUNDLE if not defined GOOGLE_SHEETS_DISABLE_SSL_VERIFY (
    echo NOTE: No CA bundle configured for Google Sheets.
    echo Setting GOOGLE_SHEETS_DISABLE_SSL_VERIFY=1 for local development.
    echo To fix properly, set GOOGLE_SHEETS_CA_BUNDLE to a valid cacert.pem path.
    set GOOGLE_SHEETS_DISABLE_SSL_VERIFY=1
)
if not defined GOOGLE_SHEETS_SPREADSHEET_ID (
    set GOOGLE_SHEETS_SPREADSHEET_ID=1uvRcSG0t_9RZyo_o2OY9cZxLj8wnVwU7zPkLjuqA_WI
)
echo IMPORTANT: For iPad access, use your computer's IP address instead of localhost
echo Example: http://192.168.1.100:8000
echo.
echo To find your IP address:
echo Windows: Open Command Prompt and type: ipconfig
echo Look for "IPv4 Address" under your network adapter
echo.
echo Starting server on 0.0.0.0:8000 (accessible from network)
echo Press Ctrl+C to stop the server
echo.
echo Testing server accessibility...
echo On iPad, use: http://YOUR_IP:8000 (NOT localhost or 0.0.0.0)
echo.
REM Try without router first - PHP built-in server handles routing automatically
REM If routing issues occur, uncomment the router.php line below
"%PHP_PATH%" -S 0.0.0.0:8000
REM "%PHP_PATH%" -S 0.0.0.0:8000 router.php
pause

