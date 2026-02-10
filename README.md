# ECITT Web App - Google Sheets Edition

**ECITT (Early Childhood Inhibitory Touchscreen Task)** - A Progressive Web App for measuring response inhibition in infants and toddlers.

This repository contains a complete, self-contained ECITT web application configured as a Progressive Web App (PWA) that can be installed on iPads without requiring the App Store.

**⚠️ Important: This branch uses Google Sheets API instead of MySQL for all data storage.**

---

## Quick Start

### Prerequisites

Before running the ECITT app, you need:

1. **PHP 8.0 or newer** - [Download PHP](https://www.php.net/downloads.php)
2. **Google Cloud Project** with Sheets API enabled
3. **Google Sheets** spreadsheet configured for data storage
4. **Service Account credentials** (JSON file)

### Installation Steps

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd USC-BEAD-Lab-ECITT
   ```

2. **Set up Google Sheets** - Follow the complete guide in [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)

3. **Configure credentials** - Place your service account JSON file in the project root as `usc-bead-ecitt-755207cdd9c1.json`

4. **Set environment variables:**
   - Set `GOOGLE_SHEETS_SPREADSHEET_ID` to your spreadsheet ID (found in the URL)
   - Or edit sheetsLib.php to set the values directly

5. **Start the server:**
   - **Windows:** Double-click `run.bat`
   - **Mac/Linux:** Run `php -S 0.0.0.0:8000` from the `public/` directory

6. **Access the app:**
   - From computer: `http://localhost:8000`
   - From iPad: `http://YOUR_IP_ADDRESS:8000` (see [iPad Installation](#ipad-installation))

---

## Google Sheets Setup

**See [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) for complete setup instructions.**

### Required Sheets in Your Spreadsheet

Your Google Sheets spreadsheet must contain these sheets with the following headers:

1. **Responses** - Trial response data
   - Headers: Timestamp, User, ProjectNo, TestSetNo, TestName, PartNo, PrevRespTime, TrialStartTime, TrialType, TrialPhase, TrialNo, TrialVariant, Accuracy, TouchTime, ReactionTime, TrialTime, ButtonPressed, AnimationShowed, DotPressed, MoveEvents, Latitude, Longitude, TrialQueueLength

2. **Events** - Application events
   - Headers: Timestamp, EventType, EventData, UserName, ClientIP, Source

3. **Users** - User authentication
   - Headers: username, password, userType, globalPerm
   - Add at least one user: `admin`, `admin`, `dev`, `adm`

4. **Projects** - Research projects
   - Headers: no, name, userName (owner)

5. **TestSets** - Test set configurations
   - Headers: no, projectNo, name

6. **Participants** - Participant information
   - Headers: userName, no, projectNo, ref, birthYear, birthMonth, birthDay, gender

7. **Tests** (optional)
   - Headers: testName, testDescription, created, modified

8. **SyncPoints** (optional)
   - Headers: userName, projectNo, testSetNo, partNo, timestamp

---

## Configuration

### Google Sheets Credentials

The app needs:
- **Service Account JSON file**: Place in project root
- **Spreadsheet ID**: Set via environment variable or in `sheetsLib.php`

### Environment Variables

Set these environment variables (or edit `sheetsLib.php` directly):

```bash
# Windows PowerShell
$env:GOOGLE_SHEETS_SPREADSHEET_ID="your-spreadsheet-id-here"

# Mac/Linux
export GOOGLE_SHEETS_SPREADSHEET_ID="your-spreadsheet-id-here"
```

The spreadsheet ID is found in your Google Sheets URL:
```
https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID_HERE/edit
```

### Timezone

All timestamps are stored in UTC format. The timezone is set in `lib.php`.

---

## Running the Server

### Windows

1. Double-click `run.bat` in the project directory
2. The server will start on `http://localhost:8000`
3. Note your computer's IP address (run `ipconfig` in Command Prompt to find it)

### Mac/Linux

1. Open Terminal
2. Navigate to the `public/` directory: `cd public`
3. Run: `php -S 0.0.0.0:8000`
4. Note your computer's IP address (run `ifconfig | grep 'inet '` or `ip addr show`)

### Finding Your IP Address

- **Windows:** Open Command Prompt, type `ipconfig`, look for "IPv4 Address"
- **Mac/Linux:** Open Terminal, type `ifconfig | grep 'inet '` or `ip addr show`

---

## iPad Installation (PWA)

### Step 1: Access from iPad

1. Ensure iPad is on the **same WiFi network** as the server computer
2. Open **Safari** on iPad
3. Navigate to: `http://YOUR_IP_ADDRESS:8000`
   - Example: `http://192.168.1.100:8000`
4. Login with:
   - Username: `admin`
   - Password: `admin`

### Step 2: Install to Home Screen

1. In Safari, tap the **Share button** (square with arrow pointing up)
2. Scroll down and tap **"Add to Home Screen"**
3. Customize the name (default: "ECITT")
4. Tap **"Add"**
5. The app icon will appear on your home screen

### Step 3: Launch the PWA

1. Tap the ECITT icon on the home screen
2. The app will open in **full-screen mode** (no Safari browser UI)
3. All features work normally

---

## Project Structure

```
USC-BEAD-Lab-ECITT/
├── public/                 # Public web files
│   ├── index.php          # Main entry point
│   ├── manifest.json      # PWA manifest
│   ├── sw.js             # Service worker (offline support)
│   ├── graphics/         # Images and icons
│   ├── js/               # JavaScript files
│   ├── css/              # Stylesheets
│   └── ...
├── private/               # Server-side files (not publicly accessible)
│   ├── libs/
│   │   ├── php/          # PHP libraries (including sheetsLib.php)
│   │   ├── xsl/          # XSL templates (HTML generation)
│   │   └── xml/          # XML data files
│   └── ...
├── run.bat               # Windows startup script
├── setup-google-sheets.bat # Google Sheets setup (one-time)
├── GOOGLE_SHEETS_SETUP.md # Setup instructions
├── README.md             # This file
└── ...
```

---

## PWA Features

This app is configured as a Progressive Web App with:

- ✅ **Web App Manifest** - Enables "Add to Home Screen"
- ✅ **Service Worker** - Caches static assets for offline support
- ✅ **iOS Meta Tags** - Optimized for iPad installation
- ✅ **Full-Screen Mode** - Opens without browser UI when installed
- ✅ **App Icons** - Multiple sizes for different contexts

### PWA Files

- `public/manifest.json` - App metadata and configuration
- `public/sw.js` - Service worker for caching
- `private/libs/xsl/common.xsl` - Updated with PWA meta tags

---

## Troubleshooting

### Server won't start

- **Check PHP installation:** Run `php -v` in terminal/command prompt
- **Check port 8000:** Make sure nothing else is using port 8000
- **Windows Firewall:** May need to allow PHP through firewall

### Can't access from iPad

- **Check network:** Ensure iPad and server are on same WiFi
- **Check IP address:** Verify server IP is correct
- **Check server binding:** Server must be on `0.0.0.0:8000` (not `localhost:8000`)
- **Firewall:** May need to allow port 8000 through firewall

### "Add to Home Screen" doesn't appear

- **Check HTTPS:** iOS requires HTTPS for full PWA features (except localhost)
- **Check manifest:** Verify `manifest.json` is accessible at `/manifest.json`
- **Check Safari:** Must use Safari (not Chrome) on iOS
- **Already installed:** If app is already installed, option won't show

### Google Sheets API errors

- **Check credentials:** Verify your service account JSON file is in the project root
- **Check spreadsheet ID:** Ensure `GOOGLE_SHEETS_SPREADSHEET_ID` is set correctly
- **Check sheet sharing:** Verify the service account email has Editor access to the spreadsheet
- **Check API enabled:** Verify Google Sheets API is enabled in your Google Cloud project

### Icons don't appear

- **Check files:** Verify icon files exist in `public/graphics/icons/`
- **Check paths:** Icon paths in `manifest.json` should start with `/`
- **Check sizes:** Icons should be exact sizes (180x180, 192x192, 512x512)

---

## Development Notes

### Service Worker

The service worker (`sw.js`) caches static assets but **does not cache PHP requests** or database queries. This ensures:
- Static files (CSS, JS, images) work offline
- Dynamic content always comes from server
- Data integrity is maintained

### Updating the App

When updating the app:
1. Update version in `manifest.json` (if needed)
2. Update cache version in `sw.js`: `const CACHE_NAME = 'ecitt-pwa-v2';`
3. Users may need to uninstall and reinstall the PWA to get updates

### HTTPS for Production

For production use, set up HTTPS:
- Use a reverse proxy (nginx, Apache) with SSL certificate
- Or use a service like Cloudflare
- iOS requires HTTPS for full PWA features

---

## License

This work is licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).

---

## References

- **ECITT Setup Guide:** See `1-21/all-ECITT-EEG-steps-thus-far.md` for complete setup instructions
- **PWA Implementation Plan:** See `1-25/PWA-Implementation-Plan.md` for detailed PWA setup
- **Original ECITT Paper:** [Holmboe et al. 2021](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0260695)

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the setup guide: `1-21/all-ECITT-EEG-steps-thus-far.md`
3. Check PWA implementation plan: `1-25/PWA-Implementation-Plan.md`

---

**Version:** 1.0  
**Last Updated:** PWA-enabled version

