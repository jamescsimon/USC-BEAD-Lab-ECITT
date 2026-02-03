# ECITT Web App - PWA Edition

**ECITT (Early Childhood Inhibitory Touchscreen Task)** - A Progressive Web App for measuring response inhibition in infants and toddlers.

This repository contains a complete, self-contained ECITT web application configured as a Progressive Web App (PWA) that can be installed on iPads without requiring the App Store.

---

## Quick Start

### Prerequisites

Before running the ECITT app, you need:

1. **PHP 8.0 or newer** - [Download PHP](https://www.php.net/downloads.php)
2. **MySQL 8.0 or newer** - [Download MySQL](https://dev.mysql.com/downloads/)
3. **MySQL Workbench** (optional, for database management)

### Installation Steps

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd USC-BEAD-Lab-ECITT
   ```

2. **Set up MySQL database** (see [Database Setup](#database-setup) below)

3. **Configure database connection** (see [Configuration](#configuration) below)

4. **Start the server:**
   - **Windows:** Double-click `start-server.bat`
   - **Mac/Linux:** Run `./start-server.sh` (or `bash start-server.sh`)

5. **Access the app:**
   - From computer: `http://localhost:8000`
   - From iPad: `http://YOUR_IP_ADDRESS:8000` (see [iPad Installation](#ipad-installation))

---

## Database Setup

### Step 1: Create MySQL Database

1. Open **MySQL Workbench** (or use command line)
2. Create a new schema named `ecitt_db`
3. Set collation to `utf8mb4_unicode_ci`

### Step 2: Import Database Schema

1. In MySQL Workbench, go to **File → Open SQL Script**
2. Navigate to: `database/schema_workbench.sql`
3. **Important:** Select `ecitt_db` in the database dropdown (top toolbar)
4. Click **Execute** (lightning bolt icon)

### Step 3: Create Database User

1. In MySQL Workbench, go to **Server → Users and Privileges**
2. Click **Add Account**
3. Create user:
   - Login Name: `ecitt_user`
   - Authentication Type: `Standard`
   - Password: (choose a secure password and write it down)
4. Click **Schema Privileges** tab
5. Click **Add Entry...**
6. Select `ecitt_db` schema
7. Grant privileges: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE`, `ALTER`, `INDEX`
8. Click **Apply**

### Step 4: Create Admin User and Test Specs

Run these SQL scripts in MySQL Workbench (make sure `ecitt_db` is selected):

1. **Create admin user:** Open and execute `database/create_admin_user.sql` (if exists)
2. **Create test specs:** Open and execute `database/create_test_specs.sql` (if exists)

Or manually create admin user:
```sql
INSERT INTO ecitt_user (name, password, userType) VALUES ('admin', 'admin', 'dev');
```

---

## Configuration

### Database Connection

Edit `private/libs/php/dbLib.php` (around line 51):

```php
$db=new mysqli("localhost", "ecitt_user", "your_password", "ecitt_db");
```

Replace `your_password` with the password you created in Step 3 above.

### Timezone

Ensure timezone is set to UTC in `private/libs/php/dbLib.php` (around line 34):

```php
$tzName = getParam("tzName", "UTC");
date_default_timezone_set("UTC");
```

---

## Running the Server

### Windows

1. Double-click `start-server.bat`
2. The server will start on `http://0.0.0.0:8000`
3. Note your computer's IP address (shown in the window or find it with `ipconfig`)

### Mac/Linux

1. Open Terminal
2. Navigate to the repository directory
3. Run: `./start-server.sh` (or `bash start-server.sh`)
4. If you get a permission error, run: `chmod +x start-server.sh` first
5. Note your computer's IP address (shown in the window or find it with `ifconfig`)

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
│   │   ├── php/          # PHP libraries
│   │   ├── xsl/          # XSL templates (HTML generation)
│   │   └── xml/          # XML data files
│   └── ...
├── database/              # Database schema files
│   ├── schema_workbench.sql
│   └── schema.sql
├── start-server.bat      # Windows startup script
├── start-server.sh       # Mac/Linux startup script
└── README.md             # This file
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

### Database connection errors

- **Check MySQL:** Ensure MySQL server is running
- **Check credentials:** Verify username/password in `dbLib.php`
- **Check database:** Ensure `ecitt_db` database exists
- **Check user permissions:** Verify `ecitt_user` has correct privileges

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

