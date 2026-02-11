# ECITT Web App - CSV Edition

**ECITT (Early Childhood Inhibitory Touchscreen Task)** - A Progressive Web App for measuring response inhibition in infants and toddlers.

This repository contains a complete, self-contained ECITT web application configured as a Progressive Web App (PWA) that can be installed on iPads without requiring the App Store.

**ℹ️ This branch uses CSV file storage for trial data and a MySQL database for metadata (projects, participants, tests).**

---

## Quick Start

### Prerequisites

Before running the ECITT app, you need:

1. **PHP 7.4 or newer** - [Download PHP](https://www.php.net/downloads.php)
2. **MySQL 5.7 or newer** - [Download MySQL](https://www.mysql.com/downloads/)
3. **CSV data directory** - Writable directory for storing trial data
4. **MySQL database** - Configured with ECITT schema

### Installation Steps

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd USC-BEAD-Lab-ECITT
   ```

2. **Set up MySQL database** - Create database and import schema:
   ```bash
   mysql -u root -p < database-schema.sql
   ```
   Or use phpMyAdmin to create tables manually.

3. **Configure database connection** - Edit `private/libs/php/dbLib.php`:
   ```php
   $dbHost = "localhost";
   $dbUser = "ecitt_user";
   $dbPassword = "your_password";
   $dbName = "ecitt_db";
   ```

4. **Set up CSV data directory:**
   ```bash
   mkdir -p /var/ecitt_data/sessions
   mkdir -p /var/ecitt_data/backups
   mkdir -p /var/ecitt_data/events
   chmod 777 /var/ecitt_data/sessions
   ```
   Or on Windows: Create `C:\ecitt_data\sessions\`, `C:\ecitt_data\backups\`, `C:\ecitt_data\events\`

5. **Set environment variables:**
   - `CSV_DATA_DIR` - Path to CSV data directory (e.g., `/var/ecitt_data` or `C:\ecitt_data`)
   - `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DB` - Database credentials

6. **Start the server:**
   - **Windows:** Double-click `run.bat`
   - **Mac/Linux:** Run `php -S 0.0.0.0:8000` from the `public/` directory

7. **Access the app:**
   - From computer: `http://localhost:8000`
   - From iPad: `http://YOUR_IP_ADDRESS:8000` (see [iPad Installation](#ipad-installation))

---

## Database & CSV Storage Setup

### Database Schema

The MySQL database contains metadata tables:

- **ecitt_user** - User authentication and permissions
- **ecitt_project** - Research projects
- **ecitt_testSet** - Test set configurations
- **ecitt_part** - Participant information
- **ecitt_test** - Test definitions
- **ecitt_resp** - Trial response data (indexed for fast queries)
- **ecitt_perm** - User permissions

See `database-schema.sql` for complete schema.

### CSV Data Storage

Trial response data is stored in CSV files for easy analysis:

**Directory Structure:**
```
/var/ecitt_data/
├── sessions/
│   └── 2024-02/
│       ├── 1_1_1/
│       │   └── ECITT_Study_2024-02-11_142325000.csv
│       └── 1_1_2/
│           └── ECITT_Study_2024-02-11_150015000.csv
├── events/
│   └── events_2024-02-11.csv
└── backups/
    └── daily_backup_2024-02-11.tar.gz
```

**CSV Headers:**
```
Timestamp, User, ProjectNo, TestSetNo, TestName, PartNo, TrialStartTime, 
TrialType, TrialPhase, TrialNo, TrialVariant, Accuracy, TouchTime, 
ReactionTime, TrialTime, ButtonPressed, AnimationShowed, DotPressed, MovementCount
```

### Environment Variables

Set these for CSV and database configuration:

```bash
# CSV Storage
CSV_DATA_DIR=/var/ecitt_data
CSV_BACKUP_DIR=/var/ecitt_data/backups
CSV_MAX_ROWS_PER_FILE=1000

# Database
MYSQL_HOST=localhost
MYSQL_USER=ecitt_user
MYSQL_PASSWORD=secure_password
MYSQL_DB=ecitt_db

# Application
NODE_ENV=development
```

**Default paths (if env vars not set):**
- CSV: `../csv_data/` (relative to document root)
- Database: `localhost`, user: `root`

---

## Configuration

### Database Connection

Edit `private/libs/php/dbLib.php` to set database credentials:

```php
$dbHost = "localhost";      // MySQL host
$dbUser = "ecitt_user";     // MySQL username
$dbPassword = "password";   // MySQL password
$dbName = "ecitt_db";       // Database name
```

Or use environment variables:

```bash
export MYSQL_HOST=localhost
export MYSQL_USER=ecitt_user
export MYSQL_PASSWORD=password
export MYSQL_DB=ecitt_db
```

### CSV Data Directory

Set the `CSV_DATA_DIR` environment variable or the code will use `../csv_data/` by default:

```bash
# Linux/Mac
export CSV_DATA_DIR=/var/ecitt_data

# Windows PowerShell
$env:CSV_DATA_DIR="C:\ecitt_data"
```

The directory must be writable by the PHP process and have the following structure:
```
├── sessions/     # Trial response CSV files
├── events/       # Application event logs
└── backups/      # Automated daily backups
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
│   ├── sw.js              # Service worker (offline support)
│   ├── csvdata/           # CSV data endpoint
│   │   └── index.php      # CSV logging and metadata operations
│   ├── dbacc/             # Database access endpoint (legacy)
│   ├── gsheetsacc/        # Google Sheets endpoint (deprecated)
│   ├── graphics/          # Images and icons
│   ├── js/                # JavaScript files
│   │   ├── resp.js        # iPad responder
│   │   ├── cntr.js        # Controller dashboard
│   │   ├── comm.js        # Network communication
│   │   └── ...
│   ├── css/               # Stylesheets
│   └── ...
├── private/               # Server-side files (not publicly accessible)
│   ├── libs/
│   │   ├── php/
│   │   │   ├── dbLib.php       # Database operations
│   │   │   ├── lib.php         # Common utilities
│   │   │   └── ...
│   │   ├── xsl/           # XSL templates (HTML generation)
│   │   └── xml/           # XML data files
│   ├── logs/              # Application logs
│   └── ...
├── run.bat                # Windows startup script
├── README.md              # This file
├── database-schema.sql    # MySQL database schema
└── ...
```

### Key Endpoints

- **`/csvdata/`** - CSV data logging and metadata operations (NEW)
  - Handles trial response logging to CSV files
  - Provides metadata operations (projects, participants, tests)
  
- **`/dbacc/`** - Database access (legacy fallback)
  - Used for compatibility and backwards compatibility
  
- **`/gsheetsacc/`** - Google Sheets endpoint (DEPRECATED)
  - No longer used; kept for reference

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

### Database connection errors

- **Check MySQL is running:** Start MySQL service
- **Check credentials:** Verify username, password, and database name in `dbLib.php`
- **Check user permissions:** MySQL user must have SELECT, INSERT, UPDATE, DELETE permissions
- **Reset connection:** Stop server and restart; MySQL may timeout

### CSV files not being created

- **Check directory exists:** Ensure `CSV_DATA_DIR` directory exists and is writable
- **Check permissions:** PHP process must have write permissions: `chmod 777 /var/ecitt_data/sessions`
- **Check environment variable:** Verify `CSV_DATA_DIR` is set or defaults to `../csv_data/`
- **Check logs:** Look in `private/logs/` for error messages

### "Permission denied" on CSV directory

- **Linux/Mac:** Fix permissions:
  ```bash
  sudo chown www-data:www-data /var/ecitt_data
  sudo chmod 755 /var/ecitt_data
  sudo chmod 777 /var/ecitt_data/sessions
  ```
- **Windows:** Ensure PHP process user has write permissions to directory

### Data not appearing in CSV

- **Check upload:** Verify trial data is being uploaded from iPad responder
- **Check logs:** Check `private/logs/csvdata.log` for errors
- **Check file system:** Manually verify CSV files exist at `CSV_DATA_DIR/sessions/YYYY-MM/...`
- **Check format:** Ensure CSV files have proper headers and formatting

### "Add to Home Screen" doesn't appear

- **Check HTTPS:** iOS requires HTTPS for full PWA features (except localhost)
- **Check manifest:** Verify `manifest.json` is accessible at `/manifest.json`
- **Check Safari:** Must use Safari (not Chrome) on iOS
- **Already installed:** If app is already installed, option won't show

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

**Version:** 2.0 (CSV-only edition)  
**Last Updated:** February 2026  
**Previous Version:** Google Sheets edition (deprecated - see `gsheetsacc/` branch)

