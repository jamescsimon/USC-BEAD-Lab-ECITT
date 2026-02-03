@echo off
REM Google Sheets Configuration Setup for Windows
REM This script helps configure the ECITT PWA Google Sheets branch on Windows
REM Run as Administrator for system-wide environment variables

setlocal enabledelayedexpansion

echo.
echo ============================================================
echo ECITT PWA - Google Sheets Logging Configuration Setup
echo ============================================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo WARNING: This script should be run as Administrator for system-wide settings.
    echo You can still configure environment variables, but they may be user-specific.
    echo.
)

REM Step 1: Get Spreadsheet ID
echo Step 1: Enter your Google Sheets Spreadsheet ID
echo (Found in the URL: https://docs.google.com/spreadsheets/d/YOUR_ID/edit)
echo.
set /p SPREADSHEET_ID="Enter Spreadsheet ID: "

if "%SPREADSHEET_ID%"=="" (
    echo ERROR: Spreadsheet ID cannot be empty.
    pause
    exit /b 1
)

echo Spreadsheet ID: %SPREADSHEET_ID%
echo.

REM Step 2: Get Credentials File Path
echo Step 2: Enter the path to your Google Credentials JSON file
echo (Example: C:\Users\YourName\Downloads\ecitt-pwa-credentials.json)
echo.
set /p CREDS_PATH="Enter full path to credentials file: "

if "%CREDS_PATH%"=="" (
    echo ERROR: Credentials path cannot be empty.
    pause
    exit /b 1
)

REM Check if file exists
if not exist "%CREDS_PATH%" (
    echo ERROR: Credentials file not found at: %CREDS_PATH%
    pause
    exit /b 1
)

echo Credentials file: %CREDS_PATH%
echo.

REM Step 3: Ask for environment scope
echo Step 3: Choose environment variable scope
echo 1. System-wide (requires Administrator) - Recommended
echo 2. User-specific (no Administrator needed)
echo.
set /p ENV_SCOPE="Enter choice (1 or 2): "

if "%ENV_SCOPE%"=="1" (
    set ENV_FLAG=System
) else if "%ENV_SCOPE%"=="2" (
    set ENV_FLAG=User
) else (
    echo ERROR: Invalid choice.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo Configuration Summary
echo ============================================================
echo.
echo USE_GOOGLE_SHEETS              = 1
echo GOOGLE_SHEETS_SPREADSHEET_ID    = %SPREADSHEET_ID%
echo GOOGLE_SHEETS_CREDENTIALS_FILE  = %CREDS_PATH%
echo Scope                           = %ENV_FLAG%
echo.

REM Step 4: Confirmation
set /p CONFIRM="Continue with these settings? (Y/n): "

if /i "%CONFIRM%"=="n" (
    echo Setup cancelled.
    pause
    exit /b 0
)

REM Step 5: Set environment variables
echo.
echo Setting environment variables...

if "%ENV_FLAG%"=="System" (
    setx USE_GOOGLE_SHEETS "1" /M
    setx GOOGLE_SHEETS_SPREADSHEET_ID "%SPREADSHEET_ID%" /M
    setx GOOGLE_SHEETS_CREDENTIALS_FILE "%CREDS_PATH%" /M
    echo SUCCESS: System-wide environment variables set.
) else (
    setx USE_GOOGLE_SHEETS "1"
    setx GOOGLE_SHEETS_SPREADSHEET_ID "%SPREADSHEET_ID%"
    setx GOOGLE_SHEETS_CREDENTIALS_FILE "%CREDS_PATH%"
    echo SUCCESS: User-specific environment variables set.
)

echo.
echo ============================================================
echo Next Steps
echo ============================================================
echo.
echo 1. Close and reopen your command prompt/PowerShell
echo 2. Start the server: start-server.bat
echo 3. Open http://localhost:8000 in your browser
echo 4. Run a test trial
echo 5. Check your Google Sheet for data
echo.
echo For detailed setup instructions, see GOOGLE_SHEETS_SETUP.md
echo.
pause
