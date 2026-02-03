# Google Sheets Logging Setup Guide

This branch of the ECITT PWA uses Google Sheets API to log all app interactions instead of a MySQL database. This makes the app easier to deploy and reduces server dependencies.

## Key Features

- **No MySQL Required**: All trial responses and events log directly to Google Sheets
- **UTC Timestamps**: All events are recorded with UTC timestamps in ISO 8601 format (e.g., `2024-02-03T15:30:45Z`)
- **Real-Time Logging**: Data is immediately available in your Google Sheet
- **Service Account Auth**: Uses Google service account for secure, headless authentication

## Prerequisites

1. **Google Cloud Project**: Create a new project or use an existing one
2. **Google Sheets API**: Enable the Google Sheets API
3. **Service Account**: Create a service account with credentials
4. **Google Sheet**: Create a Google Sheet to store the app data

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "NEW PROJECT"
4. Enter a project name (e.g., "ECITT-PWA")
5. Click "CREATE"
6. Wait for the project to be created and select it

## Step 2: Enable Google Sheets API

1. In the Google Cloud Console, navigate to "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click on it and select "ENABLE"
4. Go back to "APIs & Services" > "Credentials"

## Step 3: Create Service Account

1. Click "Create Credentials" > "Service Account"
2. Fill in the service account details:
   - Service account name: `ecitt-pwa` (or similar)
   - Service account ID: Will auto-populate
   - Click "CREATE AND CONTINUE"
3. Grant roles:
   - Click "Continue" without adding roles (we'll configure access to specific sheet)
4. Click "DONE"

## Step 4: Create and Download Private Key

1. In the Service Accounts list, click on the service account you just created
2. Go to the "KEYS" tab
3. Click "Add Key" > "Create new key"
4. Select "JSON" format
5. Click "CREATE"
6. The JSON file will automatically download - **save this file securely**

## Step 5: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new blank spreadsheet
3. Name it "ECITT Data" (or your preferred name)
4. Create two sheets (rename the default sheets or add new ones):
   - **Responses**: For trial response data
   - **Events**: For app events

### Responses Sheet Headers

In the "Responses" sheet, add these column headers in row 1:

```
Timestamp | User | ProjectNo | TestSetNo | TestName | PartNo | PrevRespTime | TrialStartTime | TrialType | TrialPhase | TrialNo | TrialVariant | Accuracy | TouchTime | ReactionTime | TrialTime | ButtonPressed | AnimationShowed | DotPressed | MoveEvents | Latitude | Longitude | TrialQueueLength
```

### Events Sheet Headers

In the "Events" sheet, add these column headers in row 1:

```
Timestamp | EventType | EventData | UserName | ClientIP | Source
```

## Step 6: Share Sheet with Service Account

1. Copy the service account email from your downloaded JSON file (looks like: `ecitt-pwa@your-project.iam.gserviceaccount.com`)
2. In your Google Sheet, click "Share" (top right)
3. Paste the service account email
4. Grant "Editor" access
5. Click "Share"

## Step 7: Get Spreadsheet ID

1. Open your Google Sheet
2. The URL will look like: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
3. Copy the `SPREADSHEET_ID` part

## Step 8: Configure Environment Variables

### Option A: Using Environment Variables (Recommended)

Set these environment variables on your server:

```bash
# Linux/Mac (add to ~/.bashrc or ~/.bash_profile)
export USE_GOOGLE_SHEETS=1
export GOOGLE_SHEETS_SPREADSHEET_ID="your-spreadsheet-id-here"
export GOOGLE_SHEETS_CREDENTIALS_FILE="/path/to/credentials.json"
```

```powershell
# Windows PowerShell
[Environment]::SetEnvironmentVariable("USE_GOOGLE_SHEETS", "1", "User")
[Environment]::SetEnvironmentVariable("GOOGLE_SHEETS_SPREADSHEET_ID", "your-spreadsheet-id-here", "User")
[Environment]::SetEnvironmentVariable("GOOGLE_SHEETS_CREDENTIALS_FILE", "C:\path\to\credentials.json", "User")
```

### Option B: Windows Batch File

Create `set-env.bat`:

```batch
@echo off
setx USE_GOOGLE_SHEETS 1
setx GOOGLE_SHEETS_SPREADSHEET_ID "your-spreadsheet-id-here"
setx GOOGLE_SHEETS_CREDENTIALS_FILE "C:\path\to\credentials.json"
echo Environment variables set. Please restart the terminal.
```

Run as Administrator:
```
right-click set-env.bat > Run as Administrator
```

### Option C: Direct Configuration in Code

Edit `public/boot.php` and replace the environment variable definitions:

```php
define("USE_GOOGLE_SHEETS", 1);
define("GOOGLE_SHEETS_SPREADSHEET_ID", "your-spreadsheet-id-here");
define("GOOGLE_SHEETS_CREDENTIALS_FILE", "C:\\path\\to\\credentials.json");
```

## Step 9: Place Credentials File

1. Move or copy your downloaded JSON credentials file to:
   - Recommended: `private/creds/google-credentials.json`
   - Or anywhere accessible to PHP with the path set in the environment variable

2. Make sure the file is not publicly accessible (it's in the `private/` folder, so it should be secure)

## Step 10: Start the Server

1. Navigate to the project directory
2. Run the startup script:
   ```bash
   # Windows
   start-server.bat
   
   # Mac/Linux
   ./start-server.sh
   ```

3. The app will now log all interactions to Google Sheets instead of MySQL

## Verification

1. Open the ECITT PWA in your browser
2. Run a test trial
3. Check your Google Sheet - you should see data appearing in real-time in the "Responses" sheet
4. All timestamps will be in UTC format (e.g., `2024-02-03T15:30:45Z`)

## Data Format

### Responses Sheet
Each row contains one trial response with these columns:
- **Timestamp**: ISO 8601 UTC timestamp
- **User**: Participant/user identifier
- **ProjectNo, TestSetNo, TestName, PartNo**: Study identifiers
- **TrialStartTime**: When the trial began
- **TrialType, TrialPhase**: Type of trial and phase
- **Accuracy, ReactionTime, etc.**: Trial performance metrics
- **Latitude, Longitude**: Geographic coordinates (if available)

### Events Sheet
Each row contains one app event with:
- **Timestamp**: ISO 8601 UTC timestamp
- **EventType**: Type of event (e.g., "gameStart", "trialEnd")
- **EventData**: Additional event details
- **UserName**: User identifier
- **ClientIP**: IP address of the device
- **Source**: Always "ECITT_PWA"

## Troubleshooting

### "Credentials file not found"
- Check that the path in `GOOGLE_SHEETS_CREDENTIALS_FILE` is correct
- Verify the JSON file exists at that location
- Use absolute paths (e.g., `C:\Users\...\credentials.json` on Windows)

### "Invalid credentials format"
- Download a new credentials JSON file from Google Cloud Console
- Ensure it's a valid JSON file (not corrupted)
- Check that it contains `private_key` and `client_email` fields

### "Permission denied" when accessing sheet
- Verify the sheet has been shared with the service account email
- Check that the service account has "Editor" access
- Verify the spreadsheet ID is correct

### Data not appearing in Google Sheet
- Check browser console for errors (F12 > Console tab)
- Check server logs (in `private/logs/` directory)
- Verify the Responses sheet has correct column headers
- Ensure the Google Sheets API is enabled in Google Cloud Console

### Timestamps showing local time instead of UTC
- This is expected in some spreadsheet displays
- The raw data is always stored in UTC (ISO 8601 format)
- For analysis, parse the ISO timestamp string

## API Endpoints

### Google Sheets Logging Endpoint
- **URL**: `/gsheetsacc/`
- **Parameters**:
  - `type`: Operation type (`respInsert` for responses, `eventLog` for events)
  - `data`: CSV or pipe-delimited data to log

### Example Requests
```
# Log a trial response
/gsheetsacc/?type=respInsert&data=user123,proj1,testset1,...

# Log an event
/gsheetsacc/?type=eventLog&data=gameStart|test_data|user123

# Test endpoint
/gsheetsacc/?type=test
```

## Security Notes

- The Google credentials JSON file contains a private key - **keep it secure**
- Never commit the credentials file to version control
- Add `private/creds/` to `.gitignore`
- Use environment variables rather than hardcoding credentials
- Restrict access to the `private/` directory on your web server

## Switching Back to MySQL

If you need to revert to MySQL backend:
1. Set `USE_GOOGLE_SHEETS=0` in environment variables (or edit boot.php)
2. The app will automatically use the original MySQL/dbacc endpoints
3. No other changes needed

## Further Reading

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Cloud Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [ECITT PWA README](README.md)
