# ECITT PWA - Google Sheets Logging Branch

## Quick Start

### 1. Switch to the branch
```bash
git checkout google-sheets-logging
```

### 2. Run setup wizard
**Windows:**
```bash
setup-google-sheets.bat
```

**Mac/Linux:**
```bash
bash setup-google-sheets.sh
```

### 3. Start server
```bash
# Windows
start-server.bat

# Mac/Linux
./start-server.sh
```

### 4. Open and test
- Open `http://localhost:8000` in browser
- Run a trial
- Check Google Sheet for data

## What's Different?

✅ **No MySQL** - Uses Google Sheets API instead  
✅ **UTC Timestamps** - All data in ISO 8601 format  
✅ **Real-Time Logging** - Data appears in sheet immediately  
✅ **Easy Setup** - Interactive setup scripts included  

## Documentation

- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Start here for overview
- **[GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)** - Detailed setup guide
- **[GOOGLE_SHEETS_BRANCH_README.md](GOOGLE_SHEETS_BRANCH_README.md)** - Branch details
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical specs

## Key Commands

```bash
# Test endpoint
curl "http://localhost:8000/gsheetsacc/?type=test"

# Switch back to MySQL
export USE_GOOGLE_SHEETS=0

# Enable Google Sheets
export USE_GOOGLE_SHEETS=1
```

## Files Changed

- `private/libs/php/sheetsLib.php` - NEW
- `public/gsheetsacc/index.php` - NEW  
- `public/js/comm.js` - MODIFIED
- `public/boot.php` - MODIFIED
- `.gitignore` - NEW

## Environment Variables

```bash
USE_GOOGLE_SHEETS=1
GOOGLE_SHEETS_SPREADSHEET_ID=your-id
GOOGLE_SHEETS_CREDENTIALS_FILE=/path/to/creds.json
```

## Support

See [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md#troubleshooting) for troubleshooting.

---

**Status: ✅ Ready to Deploy**
