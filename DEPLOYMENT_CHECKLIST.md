# Google Sheets Branch - Deployment Checklist

## ✅ Completed Implementation

The `google-sheets-logging` branch is complete and ready for use. Here's what has been implemented:

### Core Components ✅
- [x] Google Sheets API wrapper library (`sheetsLib.php`)
- [x] Service account OAuth 2.0 authentication with JWT
- [x] Google Sheets logging endpoint (`/gsheetsacc/`)
- [x] JavaScript routing to new endpoint
- [x] UTC timestamp logging (ISO 8601 format)
- [x] Configuration system with environment variables
- [x] Git ignore file for credentials

### Documentation ✅
- [x] Comprehensive setup guide (`GOOGLE_SHEETS_SETUP.md`)
- [x] Branch overview (`GOOGLE_SHEETS_BRANCH_README.md`)
- [x] Implementation summary (`IMPLEMENTATION_SUMMARY.md`)
- [x] Windows setup automation script
- [x] Mac/Linux setup automation script

### Git Setup ✅
- [x] New branch created: `google-sheets-logging`
- [x] All changes committed with descriptive messages
- [x] Ready to push to remote repository

---

## 🚀 Next Steps to Deploy

### 1. Access the Branch
```bash
git clone <repository-url>
cd USC-BEAD-Lab-ECITT
git checkout google-sheets-logging
```

### 2. Set Up Google Cloud (One-time setup)
Follow the detailed instructions in [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md):

**Quick version:**
1. Create Google Cloud project
2. Enable Google Sheets API
3. Create service account and download credentials
4. Create Google Sheet with "Responses" and "Events" sheets
5. Share sheet with service account email
6. Get your spreadsheet ID

### 3. Configure Environment Variables

**Windows:**
```bash
setup-google-sheets.bat
```

**Mac/Linux:**
```bash
bash setup-google-sheets.sh
```

Or manually set:
```
USE_GOOGLE_SHEETS=1
GOOGLE_SHEETS_SPREADSHEET_ID=your-id-here
GOOGLE_SHEETS_CREDENTIALS_FILE=/path/to/credentials.json
```

### 4. Start Server
```bash
# Windows
start-server.bat

# Mac/Linux
./start-server.sh
```

### 5. Test the App
- Open `http://localhost:8000` (or your IP on iPad)
- Run a trial
- Check your Google Sheet - data should appear immediately

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `private/libs/php/sheetsLib.php` | Google Sheets API integration |
| `public/gsheetsacc/index.php` | Logging endpoint |
| `public/js/comm.js` | Modified to route data to Google Sheets |
| `public/boot.php` | Configuration flag |
| `GOOGLE_SHEETS_SETUP.md` | Detailed setup guide |
| `GOOGLE_SHEETS_BRANCH_README.md` | Branch overview |
| `setup-google-sheets.bat` | Windows setup wizard |
| `setup-google-sheets.sh` | Mac/Linux setup wizard |

---

## ✨ Key Features

✅ **No MySQL Dependency** - Google Sheets handles all logging  
✅ **Real-Time Data** - Results appear in sheet immediately  
✅ **UTC Timestamps** - All data in ISO 8601 UTC format  
✅ **Automatic Auth** - Service account handles everything  
✅ **Easy Setup** - Interactive setup scripts included  
✅ **Secure Credentials** - JSON file protected in private folder  
✅ **Easy Backup** - Data directly in shareable Google Sheet  

---

## 🔧 Configuration

### Environment Variables

```bash
# Enable Google Sheets logging (1 = enabled, 0 = disabled)
USE_GOOGLE_SHEETS=1

# Your Google Sheet ID (from the URL)
GOOGLE_SHEETS_SPREADSHEET_ID=1a2b3c4d5e6f7g8h9i0j

# Path to Google credentials JSON file
GOOGLE_SHEETS_CREDENTIALS_FILE=/path/to/google-credentials.json
```

### Switching Backends

Switch between Google Sheets and MySQL:
```bash
# Use Google Sheets
export USE_GOOGLE_SHEETS=1

# Use MySQL
export USE_GOOGLE_SHEETS=0
```

---

## 📊 Data Structure

### Responses Sheet Columns
1. Timestamp (UTC)
2. User
3. ProjectNo
4. TestSetNo
5. TestName
6. PartNo
7. PrevRespTime
8. TrialStartTime
9. TrialType
10. TrialPhase
11. TrialNo
12. TrialVariant
13. Accuracy
14. TouchTime
15. ReactionTime
16. TrialTime
17. ButtonPressed
18. AnimationShowed
19. DotPressed
20. MoveEvents
21. Latitude
22. Longitude
23. TrialQueueLength

### Events Sheet Columns
1. Timestamp (UTC)
2. EventType
3. EventData
4. UserName
5. ClientIP
6. Source

---

## 🧪 Testing

### Test Endpoint Connectivity
```bash
curl "http://localhost:8000/gsheetsacc/?type=test"
```

**Expected response:**
```xml
<?xml version="1.0"?>
<status code="ok" msg="Google Sheets endpoint is operational"></status>
```

### Manual Test
1. Start the server
2. Open the app in browser
3. Run any trial
4. Check Google Sheet for new row in "Responses" tab

---

## 🚨 Troubleshooting

### Credentials file not found
- Check the path in `GOOGLE_SHEETS_CREDENTIALS_FILE`
- Use absolute paths (e.g., `C:\Users\...` on Windows)
- Ensure JSON file exists

### Permission denied when accessing sheet
- Verify sheet is shared with service account email
- Service account needs "Editor" access
- Wait a few minutes for permissions to propagate

### Data not appearing in Google Sheet
- Check browser console for errors (F12 > Console)
- Verify sheet has correct column headers
- Ensure Google Sheets API is enabled
- Check server logs in `private/logs/`

### Timestamps in wrong timezone
- Raw data is always UTC (ISO 8601 format)
- Google Sheets may display local time
- Use ISO timestamp string for accurate timezone handling

---

## 📞 Support Resources

1. **[GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)** - Detailed step-by-step setup
2. **[GOOGLE_SHEETS_BRANCH_README.md](GOOGLE_SHEETS_BRANCH_README.md)** - Branch overview
3. **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical details
4. **[README.md](README.md)** - Original ECITT documentation
5. Server logs: `private/logs/`

---

## 🔒 Security Checklist

- [ ] Download credentials from Google Cloud Console
- [ ] Place credentials in `private/creds/` folder
- [ ] Add `private/creds/` to `.gitignore` (already done)
- [ ] Never commit credentials to git
- [ ] Use environment variables for sensitive paths
- [ ] Share Google Sheet only with service account
- [ ] Restrict web server access to `private/` folder

---

## 📝 Notes

- The original MySQL code remains intact
- Both backends can coexist in the same codebase
- All app functionality is identical to the original
- Data logging is the only difference between branches
- Switch between backends with environment variable

---

## 🎯 Summary

You now have a complete Google Sheets logging version of the ECITT PWA that:
- Requires no MySQL installation
- Logs all interactions directly to Google Sheets
- Records UTC timestamps automatically
- Can be deployed easily with setup scripts
- Maintains full compatibility with the original app

**Status: ✅ Ready to Deploy**

For detailed setup instructions, start with [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)
