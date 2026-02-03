#!/bin/bash

# Google Sheets Configuration Setup for Mac/Linux
# This script helps configure the ECITT PWA Google Sheets branch

echo ""
echo "============================================================"
echo "ECITT PWA - Google Sheets Logging Configuration Setup"
echo "============================================================"
echo ""

# Step 1: Get Spreadsheet ID
echo "Step 1: Enter your Google Sheets Spreadsheet ID"
echo "(Found in the URL: https://docs.google.com/spreadsheets/d/YOUR_ID/edit)"
echo ""
read -p "Enter Spreadsheet ID: " SPREADSHEET_ID

if [ -z "$SPREADSHEET_ID" ]; then
    echo "ERROR: Spreadsheet ID cannot be empty."
    exit 1
fi

echo "Spreadsheet ID: $SPREADSHEET_ID"
echo ""

# Step 2: Get Credentials File Path
echo "Step 2: Enter the path to your Google Credentials JSON file"
echo "(Example: ~/Downloads/ecitt-pwa-credentials.json or /path/to/credentials.json)"
echo ""
read -p "Enter full path to credentials file: " CREDS_PATH

# Expand ~ to home directory
CREDS_PATH="${CREDS_PATH/#\~/$HOME}"

if [ -z "$CREDS_PATH" ]; then
    echo "ERROR: Credentials path cannot be empty."
    exit 1
fi

# Check if file exists
if [ ! -f "$CREDS_PATH" ]; then
    echo "ERROR: Credentials file not found at: $CREDS_PATH"
    exit 1
fi

echo "Credentials file: $CREDS_PATH"
echo ""

# Step 3: Ask for shell profile
echo "Step 3: Select your shell configuration file"
if [ -n "$ZSH_VERSION" ]; then
    DEFAULT_PROFILE="$HOME/.zshrc"
    echo "Detected: Zsh"
elif [ -n "$BASH_VERSION" ]; then
    DEFAULT_PROFILE="$HOME/.bashrc"
    echo "Detected: Bash"
else
    DEFAULT_PROFILE="$HOME/.bash_profile"
    echo "Detected: Unknown (defaulting to .bash_profile)"
fi

echo "Default: $DEFAULT_PROFILE"
echo ""
read -p "Use default? (Y/n): " USE_DEFAULT

if [ -z "$USE_DEFAULT" ] || [[ "$USE_DEFAULT" =~ ^[Yy]$ ]]; then
    PROFILE_FILE="$DEFAULT_PROFILE"
else
    read -p "Enter full path to shell profile file: " PROFILE_FILE
    PROFILE_FILE="${PROFILE_FILE/#\~/$HOME}"
    
    if [ ! -f "$PROFILE_FILE" ]; then
        echo "ERROR: Profile file not found: $PROFILE_FILE"
        exit 1
    fi
fi

echo "Shell profile: $PROFILE_FILE"
echo ""

# Step 4: Confirmation
echo "============================================================"
echo "Configuration Summary"
echo "============================================================"
echo ""
echo "USE_GOOGLE_SHEETS              = 1"
echo "GOOGLE_SHEETS_SPREADSHEET_ID    = $SPREADSHEET_ID"
echo "GOOGLE_SHEETS_CREDENTIALS_FILE  = $CREDS_PATH"
echo "Shell profile                   = $PROFILE_FILE"
echo ""

read -p "Continue with these settings? (Y/n): " CONFIRM

if [[ "$CONFIRM" =~ ^[Nn]$ ]]; then
    echo "Setup cancelled."
    exit 0
fi

# Step 5: Add environment variables to shell profile
echo ""
echo "Setting environment variables..."
echo ""

# Create backup
if [ -f "$PROFILE_FILE" ]; then
    cp "$PROFILE_FILE" "${PROFILE_FILE}.backup"
    echo "Backup created: ${PROFILE_FILE}.backup"
fi

# Add environment variables
{
    echo ""
    echo "# ECITT PWA - Google Sheets Configuration"
    echo "export USE_GOOGLE_SHEETS=1"
    echo "export GOOGLE_SHEETS_SPREADSHEET_ID=\"$SPREADSHEET_ID\""
    echo "export GOOGLE_SHEETS_CREDENTIALS_FILE=\"$CREDS_PATH\""
} >> "$PROFILE_FILE"

echo "Environment variables added to: $PROFILE_FILE"
echo ""

# Step 6: Source the profile
echo "============================================================"
echo "Final Setup"
echo "============================================================"
echo ""
echo "Applying changes to current session..."

source "$PROFILE_FILE"

# Verify
if [ -z "$GOOGLE_SHEETS_SPREADSHEET_ID" ]; then
    echo ""
    echo "NOTE: Run 'source $PROFILE_FILE' or close and reopen your terminal"
    echo "      for the environment variables to take effect."
else
    echo "SUCCESS: Environment variables are active."
fi

echo ""
echo "============================================================"
echo "Next Steps"
echo "============================================================"
echo ""
echo "1. Close and reopen your terminal (if changes didn't apply)"
echo "2. Start the server: ./start-server.sh"
echo "3. Open http://localhost:8000 in your browser"
echo "4. Run a test trial"
echo "5. Check your Google Sheet for data"
echo ""
echo "For detailed setup instructions, see GOOGLE_SHEETS_SETUP.md"
echo ""
